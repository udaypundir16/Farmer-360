const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const rateLimiter = require('../middleware/rateLimiter.middleware');

router.post('/chat', verifyToken, rateLimiter({ windowMs: 60 * 1000, max: 10 }), aiController.chat);
router.post('/voice', verifyToken, rateLimiter({ windowMs: 60 * 1000, max: 15 }), aiController.voice);

module.exports = router;