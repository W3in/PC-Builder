const express = require('express');
const router = express.Router();
const { registerUser, authUser, googleLogin, updateUserProfile, updateUserPassword, getFavorites, getFavoriteIds, toggleFavorite, removeFavorite } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleLogin);
router.route('/profile').put(protect, updateUserProfile);
router.put('/profile/password', protect, updateUserPassword);
router.get('/favorites', protect, getFavorites);
router.get('/favorites/ids', protect, getFavoriteIds);
router.post('/favorites', protect, toggleFavorite);
router.delete('/favorites/:id', protect, removeFavorite);

module.exports = router;