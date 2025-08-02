const logger = require('../utils/logger');

let client;

// Only initialize Twilio if we have valid credentials
if (process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {

    const twilio = require('twilio');
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio initialized');
} else {
    console.log('⚠️ Twilio not configured - SMS service will be mocked');
}

const sendSMS = async ({ to, body }) => {
    try {
        if (!client) {
            console.log(`📱 Mock SMS sent to ${to}: ${body}`);
            return { sid: 'mock-sid' };
        }

        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to,
        });

        logger.info('SMS sent successfully', { sid: message.sid, to });
        return message;
    } catch (error) {
        logger.error('Failed to send SMS', { error: error.message, to });
        throw error;
    }
};

module.exports = { sendSMS };