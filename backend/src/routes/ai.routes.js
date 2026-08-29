const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { aiDailyRateLimiter, getAiUsageStatus } = require('../middleware/aiRateLimiter.middleware');

// AI Chatbot (20 req/day for users, unlimited for admin)
router.post('/chat', verifyToken, aiDailyRateLimiter, aiController.chat);

// AI Voice Assistant (20 req/day for users, unlimited for admin)
router.post('/voice', verifyToken, aiDailyRateLimiter, aiController.voice);

// AI Usage Status
router.get('/usage', verifyToken, getAiUsageStatus);

module.exports = router;