const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderStats, getMyOrders, getOrders, getOrderById } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);

router.route('/stats').get(protect, admin, getOrderStats);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, admin, getOrderById);

module.exports = router;