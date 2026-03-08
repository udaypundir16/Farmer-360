const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

// Manually trigger market price fetch (admin only)
router.post('/market-prices/fetch', verifyToken, isAdmin, adminController.triggerManualFetch);

// Get stored prices statistics
router.get('/market-prices/stats', verifyToken, isAdmin, adminController.getPriceStats);

// Get all stored prices
router.get('/market-prices', verifyToken, isAdmin, adminController.getStoredPrices);

// Admin: Get all crop trades
router.get('/crop-trades', verifyToken, isAdmin, adminController.getAllCropTrades);

// Admin: Get all shipments
router.get('/shipments', verifyToken, isAdmin, adminController.getAllShipmentsAdmin);

// Admin: Get all forum posts
router.get('/forum-posts', verifyToken, isAdmin, adminController.getAllForumPosts);

// Admin: Delete crop trades
router.delete('/crop-trades/:id', verifyToken, isAdmin, adminController.deleteCropTrade);

// Admin: Delete shipments
router.delete('/shipments/:id', verifyToken, isAdmin, adminController.deleteShipment);

// Admin: Delete forum posts
router.delete('/forum-posts/:id', verifyToken, isAdmin, adminController.deleteForumPost);

module.exports = router;
