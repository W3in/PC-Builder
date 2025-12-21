const express = require('express');
const router = express.Router();
const { registerUser, authUser, googleLogin } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleLogin);

module.exports = router;