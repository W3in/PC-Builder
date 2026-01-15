const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');

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

const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            couponCode,
            isPaid,
            paymentResult
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'Không có sản phẩm nào' });
        } else {

            for (const item of orderItems) {
                const productId = item._id || item.product;

                const productExist = await Product.findById(productId);

                if (!productExist) {
                    return res.status(404).json({ message: `Sản phẩm không tồn tại: ${item.name}` });
                }

                if (productExist.countInStock < item.qty) {
                    return res.status(400).json({
                        message: `Sản phẩm ${item.name} chỉ còn ${productExist.countInStock} cái, không đủ để đặt ${item.qty} cái.`
                    });
                }
            }

            const dbOrderItems = orderItems.map((item) => ({
                ...item,
                product: item._id || item.product,
                _id: undefined
            }));

            let finalItemsPrice = Number(itemsPrice);
            let finalDiscountAmount = 0;
            let appliedCouponId = null;

            if (couponCode) {
                const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

                if (coupon &&
                    coupon.isActive &&
                    new Date() <= coupon.expirationDate &&
                    coupon.usedCount < coupon.usageLimit &&
                    finalItemsPrice >= coupon.minOrderValue
                ) {
                    if (coupon.discountType === 'percent') {
                        finalDiscountAmount = (finalItemsPrice * coupon.discountValue) / 100;
                        if (coupon.maxDiscountAmount > 0 && finalDiscountAmount > coupon.maxDiscountAmount) {
                            finalDiscountAmount = coupon.maxDiscountAmount;
                        }
                    } else if (coupon.discountType === 'fixed') {
                        finalDiscountAmount = coupon.discountValue;
                    }

                    coupon.usedCount += 1;
                    await coupon.save();

                    appliedCouponId = coupon._id;
                }
            }

            const shippingPrice = req.body.shippingPrice || 0;
            const calculatedTotalPrice = finalItemsPrice + Number(shippingPrice) - finalDiscountAmount;

            const order = new Order({
                user: req.user._id,
                orderItems: dbOrderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice: finalItemsPrice,
                discountAmount: finalDiscountAmount,
                coupon: appliedCouponId,
                totalPrice: calculatedTotalPrice,
                isPaid: isPaid || false,
                paidAt: isPaid ? Date.now() : null,
                paymentResult: paymentResult
            });

            const createdOrder = await order.save();

            await Promise.all(orderItems.map(async (item) => {
                const productId = item._id || item.product;

                await Product.findByIdAndUpdate(productId, {
                    $inc: { countInStock: -item.qty }
                });
            }));

            res.status(201).json(createdOrder);
        }
    } catch (error) {
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