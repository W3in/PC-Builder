const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');
const { stripe } = require('./paymentController');
const { priceOrder, usableCouponFilter, PricingError } = require('../services/orderPricing');

const getOrders = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Order.countDocuments({});
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        res.json({
            orders,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
    }
};

// Asks Stripe (not the browser) whether this PaymentIntent really paid this exact order.
const verifyStripePayment = async (paymentIntentId, totalPrice, userId) => {
    if (typeof paymentIntentId !== 'string' || !paymentIntentId.startsWith('pi_')) {
        throw new PricingError('Thiếu mã thanh toán Stripe');
    }
    if (await Order.exists({ 'paymentResult.id': paymentIntentId })) {
        throw new PricingError('Giao dịch này đã được dùng cho một đơn hàng khác', 409);
    }

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') throw new PricingError('Thanh toán chưa thành công');
    if (intent.currency !== 'vnd' || intent.amount !== totalPrice) {
        throw new PricingError('Số tiền đã thanh toán không khớp với đơn hàng');
    }
    if (intent.metadata?.userId !== userId.toString()) {
        throw new PricingError('Giao dịch không thuộc về tài khoản này', 403);
    }
    return intent;
};

// Decrements stock only where enough is left, so two buyers can't both take the last item.
const reserveStock = async (items) => {
    const reserved = [];
    for (const item of items) {
        const updated = await Product.findOneAndUpdate(
            { _id: item.product, countInStock: { $gte: item.qty } },
            { $inc: { countInStock: -item.qty } }
        );
        if (!updated) {
            await releaseStock(reserved);
            throw new PricingError(`Sản phẩm ${item.name} vừa hết hàng, vui lòng thử lại.`);
        }
        reserved.push(item);
    }
    return reserved;
};

const releaseStock = (items) => Promise.all(items.map((item) =>
    Product.findByIdAndUpdate(item.product, { $inc: { countInStock: item.qty } })
));

const addOrderItems = async (req, res) => {
    let reserved = [];
    let couponUsed = null;

    try {
        const { orderItems, shippingAddress, paymentMethod, couponCode, paymentResult } = req.body;

        // Client-sent itemsPrice / totalPrice / isPaid are ignored on purpose.
        const { dbOrderItems, itemsPrice, discountAmount, coupon, totalPrice } = await priceOrder(orderItems, couponCode);

        let isPaid = false;
        let verifiedPaymentResult;
        if (paymentMethod === 'Stripe') {
            const intent = await verifyStripePayment(paymentResult?.id, totalPrice, req.user._id);
            isPaid = true;
            verifiedPaymentResult = {
                id: intent.id,
                status: intent.status,
                update_time: new Date(intent.created * 1000).toISOString(),
                email_address: intent.receipt_email || req.user.email,
            };
        } else if (paymentMethod !== 'COD') {
            throw new PricingError('Phương thức thanh toán không hợp lệ');
        }

        reserved = await reserveStock(dbOrderItems);

        if (coupon) {
            couponUsed = await Coupon.findOneAndUpdate(
                { _id: coupon._id, ...usableCouponFilter(coupon.code) },
                { $inc: { usedCount: 1 } }
            );
            if (!couponUsed) throw new PricingError('Mã giảm giá vừa hết lượt hoặc hết hạn');
        }

        const order = new Order({
            user: req.user._id,
            orderItems: dbOrderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            discountAmount,
            coupon: coupon ? coupon._id : null,
            totalPrice,
            isPaid,
            paidAt: isPaid ? Date.now() : null,
            paymentResult: verifiedPaymentResult
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        // Undo partial work so a failed order doesn't eat stock or coupon uses.
        await releaseStock(reserved).catch((e) => console.error('Rollback stock failed:', e));
        if (couponUsed) {
            await Coupon.findByIdAndUpdate(couponUsed._id, { $inc: { usedCount: -1 } })
                .catch((e) => console.error('Rollback coupon failed:', e));
        }

        if (error instanceof PricingError || error.name === 'ValidationError') {
            return res.status(error.status || 400).json({ message: error.message });
        }
        console.error("Lỗi tạo đơn hàng:", error);
        res.status(500).json({ message: "Lỗi Server khi tạo đơn hàng", error: error.message });
    }
};

const getOrderStats = async (req, res) => {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const monthlyStats = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const finalMonthlyStats = Array.from({ length: 12 }, (_, i) => {
            const monthData = monthlyStats.find(item => item._id === i + 1);
            return {
                name: `Tháng ${i + 1}`,
                revenue: monthData ? monthData.revenue : 0
            };
        });

        const paymentStats = await Order.aggregate([
            {
                $group: {
                    _id: "$paymentMethod",
                    value: { $sum: 1 }
                }
            }
        ]);

        const finalPaymentStats = paymentStats.map(item => ({
            name: item._id === 'Stripe' ? 'Online (Visa)' : 'Tiền mặt (COD)',
            value: item.value
        }));

        const totalRevenueAgg = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const totalRevenue = (totalRevenueAgg && totalRevenueAgg.length > 0) ? totalRevenueAgg[0].total : 0;

        const totalOrders = await Order.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });
        const allTimeOrders = await Order.countDocuments();
        const allTimeUsers = await User.countDocuments();

        res.json({
            monthlyStats: finalMonthlyStats,
            paymentStats: finalPaymentStats,
            totalRevenue,
            totalOrders,
            allTimeOrders,
            allTimeUsers: allTimeUsers
        });

    } catch (error) {
        console.error("Lỗi thống kê chi tiết:", error);
        res.json({
            monthlyStats: [],
            paymentStats: [],
            totalRevenue: 0,
            totalOrders: 0,
            allTimeOrders: 0,
            allTimeProducts: 0,
            allTimeUsers: 0
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = { id: req.user._id, status: 'Completed' };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { addOrderItems, getOrderStats, getMyOrders, getOrders, getOrderById, updateOrderToPaid };