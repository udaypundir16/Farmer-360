const twilio = require('twilio');
const { supabase } = require('../config/database');
const Queue = require('bull');
const cron = require('node-cron');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Initialize Twilio client only if credentials are available
let client = null;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
  } catch (error) {
    console.warn('Twilio client initialization failed:', error.message);
  }
}

// Create a queue for messages (with Redis URL fallback)
const notificationQueue = process.env.REDIS_URL 
  ? new Queue('notifications', process.env.REDIS_URL)
  : new Queue('notifications');

// Process queue
notificationQueue.process(async (job) => {
  const { to, body, type } = job.data;
  
  // Skip if Twilio is not configured
  if (!client) {
    console.log(`[DEV MODE] Would send ${type} to ${to}: ${body}`);
    return { success: true, message: 'Notification logged (Twilio not configured)' };
  }

  try {
    if (type === 'whatsapp') {
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`,
        body
      });
    } else if (type === 'sms') {
      await client.messages.create({
        from: process.env.TWILIO_SMS_NUMBER,
        to,
        body
      });
    }
    console.log(`Notification sent to ${to}`);
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error; // Bull will retry
  }
});

exports.sendNotification = (to, body, type = 'sms') => {
  notificationQueue.add({ to, body, type }, {
    attempts: 3,
    backoff: 5000
  });
};

// Alert checking logic (run periodically)
exports.checkPriceAlerts = async () => {
  // Fetch all active alerts
  const { data: alerts } = await supabase
    .from('price_alerts')
    .select('*, users(phone, full_name)')
    .eq('is_active', true)
    .eq('triggered', false);

  for (const alert of alerts) {
    // Get latest price for commodity and market
    const { data: latestPrice } = await supabase
      .from('market_prices')
      .select('modal_price')
      .eq('commodity', alert.commodity)
      .eq('market', alert.market)
      .order('price_date', { ascending: false })
      .limit(1)
      .single();

    if (!latestPrice) continue;

    const currentPrice = latestPrice.modal_price;
    let conditionMet = false;
    if (alert.alert_type === 'above' && currentPrice >= alert.target_price) conditionMet = true;
    if (alert.alert_type === 'below' && currentPrice <= alert.target_price) conditionMet = true;

    if (conditionMet) {
      // Send notification
      const message = `Price alert: ${alert.commodity} at ${alert.market} is now ₹${currentPrice}. Your target was ₹${alert.target_price}.`;
      exports.sendNotification(alert.users.phone, message, 'sms'); // or whatsapp based on preference

      // Mark as triggered
      await supabase
        .from('price_alerts')
        .update({ triggered: true, triggered_at: new Date() })
        .eq('id', alert.id);
    }
  }
};

// Schedule alert checking every hour
cron.schedule('0 * * * *', exports.checkPriceAlerts);   