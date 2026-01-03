const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    description: { type: String },
    discountType: {
        type: String,
        enum: ['percent', 'fixed'],
        required: true
    },
    discountValue: { type: Number, required: true },

    maxDiscountAmount: { type: Number, default: 0 },

    minOrderValue: { type: Number, default: 0 },

    expirationDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1000 },
    usedCount: { type: Number, default: 0 },

    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);