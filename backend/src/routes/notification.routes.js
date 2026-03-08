const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public routes for sending notifications (admin only in production)
router.post('/sms', notificationController.sendSMS);
router.post('/whatsapp', notificationController.sendWhatsApp);
router.post('/email', notificationController.sendEmail);

// User routes (require authentication)
router.use(verifyToken);

router.post('/price-alert', notificationController.sendPriceAlert);
router.post('/scheme-notification', notificationController.sendSchemeNotification);
router.get('/history', notificationController.getNotificationHistory);

module.exports = router;
