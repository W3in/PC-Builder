const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

class PricingError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const usableCouponFilter = (code, now = new Date()) => ({
    code: String(code).toUpperCase(),
    isActive: true,
    expirationDate: { $gte: now },
    $expr: { $lt: ['$usedCount', '$usageLimit'] }
});

const computeDiscount = (coupon, itemsPrice) => {
    if (!coupon || itemsPrice < coupon.minOrderValue) return 0;
    let discount = 0;
    if (coupon.discountType === 'percent') {
        discount = (itemsPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount > 0 && discount > coupon.maxDiscountAmount) {
            discount = coupon.maxDiscountAmount;
        }
    } else if (coupon.discountType === 'fixed') {
        discount = coupon.discountValue;
    }
    return Math.min(Math.round(discount), itemsPrice);
};

// Prices come from the database only; the client just says which products and how many.
const priceOrder = async (orderItems, couponCode) => {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        throw new PricingError('Không có sản phẩm nào');
    }

    const dbOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
        const productId = item._id || item.product;
        const qty = Number(item.qty);
        if (!Number.isInteger(qty) || qty < 1) {
            throw new PricingError(`Số lượng không hợp lệ: ${item.name || productId}`);
        }

        const product = await Product.findById(productId);
        if (!product) throw new PricingError(`Sản phẩm không tồn tại: ${item.name || productId}`, 404);
        if (product.countInStock < qty) {
            throw new PricingError(`Sản phẩm ${product.name} chỉ còn ${product.countInStock} cái, không đủ để đặt ${qty} cái.`);
        }

        itemsPrice += product.price * qty;
        dbOrderItems.push({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty
        });
    }

    const coupon = couponCode ? await Coupon.findOne(usableCouponFilter(couponCode)) : null;
    const discountAmount = computeDiscount(coupon, itemsPrice);

    return {
        dbOrderItems,
        itemsPrice,
        discountAmount,
        coupon: discountAmount > 0 ? coupon : null,
        totalPrice: itemsPrice - discountAmount
    };
};

module.exports = { priceOrder, computeDiscount, usableCouponFilter, PricingError };
