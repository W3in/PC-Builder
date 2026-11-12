const express = require('express');
const router = express.Router();
const { sendContact } = require('../controllers/contactController');
const { rateLimit } = require('../middleware/rateLimit');

router.post('/', rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'Bạn đã gửi quá nhiều tin nhắn, vui lòng thử lại sau.' }), sendContact);

module.exports = router;