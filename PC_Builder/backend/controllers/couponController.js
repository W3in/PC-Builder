const { get } = require('mongoose');
const Coupon = require('../models/Coupon');

const createCoupon = async (req, res) => {
    try {
        const newCoupon = new Coupon(req.body);
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(400).json({ message: "Mã code đã tồn tại hoặc lỗi dữ liệu" });
    }
};

const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            res.json(coupon);
        } else {
            res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const getAvailableCoupons = async (req, res) => {
    const today = new Date();
    try {
        const coupons = await Coupon.find({
            isActive: true,
            expirationDate: { $gte: today },
            $expr: { $lt: ["$usedCount", "$usageLimit"] }
        }).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

const validateCoupon = async (req, res) => {
    const { code, orderValue } = req.body;
    try {
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: "Mã giảm giá không tồn tại!" });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ message: "Mã này đang bị khóa!" });
        }
        if (new Date() > coupon.expirationDate) {
            return res.status(400).json({ message: "Mã đã hết hạn!" });
        }
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Mã đã hết lượt sử dụng!" });
        }
        if (orderValue < coupon.minOrderValue) {
            return res.status(400).json({ message: `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString()}đ mới được dùng mã này!` });
        }

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: "Lỗi kiểm tra mã" });
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách coupon" });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            coupon.code = req.body.code?.toUpperCase() || coupon.code;
            coupon.description = req.body.description || coupon.description;
            coupon.discountType = req.body.discountType || coupon.discountType;
            coupon.discountValue = req.body.discountValue !== undefined ? req.body.discountValue : coupon.discountValue;
            coupon.maxDiscountAmount = req.body.maxDiscountAmount !== undefined ? req.body.maxDiscountAmount : coupon.maxDiscountAmount;
            coupon.minOrderValue = req.body.minOrderValue !== undefined ? req.body.minOrderValue : coupon.minOrderValue;
            coupon.expirationDate = req.body.expirationDate || coupon.expirationDate;
            coupon.usageLimit = req.body.usageLimit !== undefined ? req.body.usageLimit : coupon.usageLimit;

            if (req.body.isActive !== undefined) {
                coupon.isActive = req.body.isActive;
            }

            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: "Không tìm thấy mã giảm giá này" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi cập nhật coupon" });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            await coupon.deleteOne(); // Hoặc coupon.remove() tùy version mongoose
            res.json({ message: "Đã xóa mã giảm giá thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa coupon" });
    }
};

module.exports = { createCoupon, getAvailableCoupons, validateCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCouponById };