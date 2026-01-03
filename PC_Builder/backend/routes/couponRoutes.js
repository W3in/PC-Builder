const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getAvailableCoupons,
    validateCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    getCouponById
} = require('../controllers/couponController');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/available', getAvailableCoupons);
router.post('/validate', validateCoupon);

router.route('/')
    .get(protect, admin, getAllCoupons)
    .post(protect, admin, createCoupon);

router.route('/:id')
    .get(protect, admin, getCouponById)
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deleteCoupon);

module.exports = router;