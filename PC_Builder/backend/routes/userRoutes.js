const express = require('express');
const router = express.Router();
const { registerUser, authUser, googleLogin, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleLogin);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;