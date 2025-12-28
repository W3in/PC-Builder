const Order = require('../models/Order');
const User = require('../models/User');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .sort({ createdAt: -1 });
        res.json(orders);
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
            totalPrice,
            isPaid
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'Không có sản phẩm' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid: isPaid || false,
            paidAt: isPaid ? Date.now() : null
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
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

        // 1. Thống kê Doanh thu theo tháng
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

        // 2. Thống kê Tỷ lệ thanh toán
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
        // Lấy số lượng User và Product thật (nếu có model)
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

module.exports = { addOrderItems, getOrderStats, getMyOrders, getOrders, getOrderById };