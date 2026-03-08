const notificationService = require('../services/notification.service');

exports.sendSMS = async (req, res, next) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ message: 'Phone and message are required' });
    }

    const result = await notificationService.sendSMS(phone, message);
    res.json({ message: 'SMS sent successfully', result });
  } catch (error) {
    next(error);
  }
};

exports.sendWhatsApp = async (req, res, next) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ message: 'Phone and message are required' });
    }

    const result = await notificationService.sendWhatsApp(phone, message);
    res.json({ message: 'WhatsApp message sent successfully', result });
  } catch (error) {
    next(error);
  }
};

exports.sendEmail = async (req, res, next) => {
  try {
    const { email, subject, body } = req.body;
    if (!email || !subject || !body) {
      return res.status(400).json({ message: 'Email, subject, and body are required' });
    }

    const result = await notificationService.sendEmail(email, subject, body);
    res.json({ message: 'Email sent successfully', result });
  } catch (error) {
    next(error);
  }
};

exports.sendPriceAlert = async (req, res, next) => {
  try {
    const { userId, phone, message, preference } = req.body;
    
    if (preference === 'sms') {
      await notificationService.sendSMS(phone, message);
    } else if (preference === 'whatsapp') {
      await notificationService.sendWhatsApp(phone, message);
    } else if (preference === 'email') {
      await notificationService.sendEmail(userId, 'Price Alert', message);
    }

    res.json({ message: 'Alert notification sent' });
  } catch (error) {
    next(error);
  }
};

exports.sendSchemeNotification = async (req, res, next) => {
  try {
    const { userId, scheme, message } = req.body;
    
    // Get user preferences
    const userPrefs = await notificationService.getUserPreferences(userId);
    
    if (userPrefs.sms) {
      await notificationService.sendSMS(userPrefs.phone, message);
    }
    if (userPrefs.whatsapp) {
      await notificationService.sendWhatsApp(userPrefs.phone, message);
    }
    if (userPrefs.email) {
      await notificationService.sendEmail(userPrefs.email, `New Scheme: ${scheme}`, message);
    }

    res.json({ message: 'Scheme notification sent' });
  } catch (error) {
    next(error);
  }
};

exports.getNotificationHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const history = await notificationService.getNotificationHistory(userId);
    res.json(history);
  } catch (error) {
    next(error);
  }
};
