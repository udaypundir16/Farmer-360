const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market.controller');

router.get('/latest', marketController.getLatestPrices);
router.get('/history', marketController.getPriceHistory);
router.get('/trends', marketController.getPriceTrends);

module.exports = router;