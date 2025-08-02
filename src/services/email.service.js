const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter;

// Only create transporter if SMTP is configured
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({  // <- Fixed: createTransport not createTransporter
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!transporter) {
            logger.info('Email service not configured, skipping email send');
            return { messageId: 'mock-id' };
        }

        const info = await transporter.sendMail({
            from: `"PharmaConnect" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });

        logger.info('Email sent successfully', { messageId: info.messageId, to });
        return info;
    } catch (error) {
        logger.error('Failed to send email', { error: error.message, to });
        throw error;
    }
};

module.exports = { sendEmail };