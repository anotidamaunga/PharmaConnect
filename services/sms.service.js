// src/services/sms.service.js
const twilio = require('twilio');
const logger = require('../utils/logger');

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendSMS = async ({ to, body }) => {
    try {
        if (!client) {
            logger.warn('SMS service not configured, skipping SMS send');
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