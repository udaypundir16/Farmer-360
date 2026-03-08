/**
 * Profit Calculator Routes
 * Routes for profit calculation endpoints
 */

const express = require('express');
const router = express.Router();
const profitCalculatorController = require('../controllers/profit-calculator.controller');

// GET - Get calculator information
router.get('/info', profitCalculatorController.getCalculatorInfo);

// POST - Calculate profit
router.post('/calculate', profitCalculatorController.calculateProfit);

module.exports = router;
