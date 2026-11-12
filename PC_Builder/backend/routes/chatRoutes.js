const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/chatController');
const { rateLimit } = require('../middleware/rateLimit');

// Each message calls Groq + Hugging Face + Pinecone, so cap it per IP to protect the free quotas.
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Bạn gửi quá nhanh, vui lòng thử lại sau ít phút.'
});

router.post('/', chatLimiter, handleChatMessage);

module.exports = router;
