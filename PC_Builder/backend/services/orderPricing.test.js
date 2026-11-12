const test = require('node:test');
const assert = require('node:assert');
const { computeDiscount } = require('./orderPricing');

test('percent discount is rounded to whole VND', () => {
    assert.strictEqual(computeDiscount({ discountType: 'percent', discountValue: 10, maxDiscountAmount: 0, minOrderValue: 0 }, 1000005), 100001);
});

test('percent discount respects the cap', () => {
    assert.strictEqual(computeDiscount({ discountType: 'percent', discountValue: 50, maxDiscountAmount: 100, minOrderValue: 0 }, 1000), 100);
});

test('fixed discount never exceeds the order value', () => {
    assert.strictEqual(computeDiscount({ discountType: 'fixed', discountValue: 5000, minOrderValue: 0 }, 3000), 3000);
});

test('no discount below the minimum order value or without a coupon', () => {
    assert.strictEqual(computeDiscount({ discountType: 'fixed', discountValue: 5000, minOrderValue: 10000 }, 3000), 0);
    assert.strictEqual(computeDiscount(null, 3000), 0);
});
