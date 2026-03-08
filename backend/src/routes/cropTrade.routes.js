const express = require('express');
const router = express.Router();
const cropTradeController = require('../controllers/cropTrade.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Create a new trade (buy/sell)
router.post('/', verifyToken, cropTradeController.createTrade);
// Get all open trades (optionally filter by crop/type)
router.get('/', cropTradeController.getOpenTrades);
// Complete a trade (only creator can complete)
router.put('/:id/complete', verifyToken, cropTradeController.completeTrade);
// Get user's own trades
router.get('/my', verifyToken, cropTradeController.getUserTrades);

module.exports = router;
