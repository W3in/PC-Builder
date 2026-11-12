const express = require('express');
const router = express.Router();
const { registerUser, authUser, googleLogin, updateUserProfile, updateUserPassword, getFavorites, getFavoriteIds, toggleFavorite, removeFavorite } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { rateLimit } = require('../middleware/rateLimit');

// Slows down password guessing and mass sign-ups: 10 attempts per 15 minutes per IP.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Quá nhiều lần thử, vui lòng thử lại sau 15 phút.'
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.post('/google', authLimiter, googleLogin);
router.route('/profile').put(protect, updateUserProfile);
router.put('/profile/password', protect, authLimiter, updateUserPassword);
router.get('/favorites', protect, getFavorites);
router.get('/favorites/ids', protect, getFavoriteIds);
router.post('/favorites', protect, toggleFavorite);
router.delete('/favorites/:id', protect, removeFavorite);

module.exports = router;