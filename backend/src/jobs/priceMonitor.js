const cron = require('node-cron');
const { supabase } = require('../config/database');
const whatsappService = require('../services/whatsapp.service');

// Simulated market prices (In a real app, fetch from an API)
const getCurrentPrice = (commodity) => {
    const prices = {
        'Wheat': 2100,
        'Rice': 3200,
        'Cotton': 6500,
        'Corn': 1800,
        'Sugarcane': 350,
        'Potato': 1200,
        'Tomato': 2500,
    };
    // Simulate small fluctuation
    const basePrice = prices[commodity] || 2000;
    const fluctuation = (Math.random() - 0.5) * 100;
    return basePrice + fluctuation;
};

const checkAlerts = async () => {
    console.log('Running Price Monitor Job...');

    try {
        // Fetch active alerts
        const { data: alerts, error } = await supabase
            .from('price_alerts')
            .select('*')
            .eq('is_active', true);

        if (error) throw error;

        for (const alert of alerts) {
            const currentPrice = getCurrentPrice(alert.commodity);
            let triggered = false;

            if (alert.alert_type === 'above' && currentPrice >= alert.target_price) {
                triggered = true;
            } else if (alert.alert_type === 'below' && currentPrice <= alert.target_price) {
                triggered = true;
            }

            if (triggered) {
                console.log(`Alert triggered for ${alert.commodity}: Price ${currentPrice.toFixed(2)} is ${alert.alert_type} ${alert.target_price}`);

                // Send WhatsApp Notification
                if (alert.phone_number) {
                    const message = `📢 *Price Alert: ${alert.commodity}*\n\nCurrent price in ${alert.market || 'Market'} is ₹${currentPrice.toFixed(2)}, which is ${alert.alert_type} your target of ₹${alert.target_price}.\n\nCheck the app for details!`;
                    await whatsappService.sendWhatsAppMessage(alert.phone_number, message);
                }

                // Deactivate alert or update triggered_at to prevent spam
                // For this demo, we'll mark it as inactive
                await supabase
                    .from('price_alerts')
                    .update({ is_active: false, triggered: true, triggered_at: new Date() })
                    .eq('id', alert.id);
            }
        }
    } catch (err) {
        // If table doesn't exist, log warning but don't crash
        if (err.code === 'PGRST205') {
            console.warn('Warning: Price alerts table not found. Skipping price monitor job.');
        } else {
            console.error('Error in Price Monitor Job:', err.message);
        }
    }
};

// Run every 30 minutes
const startMonitor = () => {
    // Cron syntax: */30 * * * * (Every 30 minutes)
    cron.schedule('*/30 * * * *', () => {
        checkAlerts();
    });
    console.log('Price Monitor Job started. (Runs every 30 minutes)');
};

module.exports = { startMonitor };
