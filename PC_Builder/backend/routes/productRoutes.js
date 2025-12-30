const express = require('express');
const router = express.Router();
const { getProducts, getProductById, deleteProduct, createProduct, updateProduct, getRecommendations } = require('../controllers/productController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

router.get('/recommendations', optionalProtect, getRecommendations);

router.get('/recommendations/:id', getRecommendations);

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;