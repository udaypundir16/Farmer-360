const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All user routes require authentication
router.use(verifyToken);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);

router.get('/notification-preferences', userController.getNotificationPreferences);
router.put('/notification-preferences', userController.updateNotificationPreferences);

router.get('/applications', userController.getUserApplications);
router.get('/alerts', userController.getUserAlerts);

router.post('/delete-account', userController.deleteAccount);

module.exports = router;
