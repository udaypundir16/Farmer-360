const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Default sandbox number

let client;

try {
    if (accountSid && authToken) {
        client = twilio(accountSid, authToken);
    } else {
        console.warn('Twilio credentials not found. WhatsApp notifications will be simulated.');
    }
} catch (error) {
    console.error('Error initializing Twilio client:', error);
}

/**
 * Send a WhatsApp message
 * @param {string} to - Recipient's phone number (e.g., '+919876543210')
 * @param {string} body - Message content
 */
exports.sendWhatsAppMessage = async (to, body) => {
    if (!client) {
        console.log(`[SIMULATION] WhatsApp to ${to}: ${body}`);
        return { sid: 'simulated', status: 'sent' };
    }

    try {
        // Ensure number has whatsapp: prefix
        const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

        const message = await client.messages.create({
            from: fromNumber,
            to: toFormatted,
            body: body,
        });

        console.log(`WhatsApp message sent to ${to}: ${message.sid}`);
        return message;
    } catch (error) {
        console.error(`Error sending WhatsApp message to ${to}:`, error.message);
        throw error;
    }
};
