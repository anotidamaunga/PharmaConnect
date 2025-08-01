const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../db');
const { sendEmail } = require('../services/email.service');
const { sendSMS } = require('../services/sms.service');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('pharmacist', 'pharmacy').required(),
    firstName: Joi.when('role', {
        is: 'pharmacist',
        then: Joi.string().required()
    }),
    lastName: Joi.when('role', {
        is: 'pharmacist',
        then: Joi.string().required()
    }),
    pharmacyName: Joi.when('role', {
        is: 'pharmacy',
        then: Joi.string().required()
    }),
    phone: Joi.string().required()
});

// Sign up
router.post('/signup', async (req, res) => {
    const client = await db.getClient();

    try {
        // Validate input
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        await client.query('BEGIN');

        // Hash password
        const passwordHash = await bcrypt.hash(value.password, 10);

        // Create user based on role
        let userId;
        if (value.role === 'pharmacist') {
            const result = await client.query(
                'SELECT create_pharmacist($1, $2, $3, $4, $5) as user_id',
                [value.email, value.password, value.firstName, value.lastName, value.phone]
            );
            userId = result.rows[0].user_id;
        } else {
            const result = await client.query(
                'SELECT create_pharmacy($1, $2, $3, $4, $5, $6, $7) as user_id',
                [value.email, value.password, value.pharmacyName, value.phone, '', '', 'retail']
            );
            userId = result.rows[0].user_id;
        }

        // Generate OTP
        const { rows } = await client.query(
            'SELECT generate_otp($1, $2, $3) as code',
            [userId, 'email', value.email]
        );

        // Send verification email
        await sendEmail({
            to: value.email,
            subject: 'Verify your PharmaConnect account',
            text: `Your verification code is: ${rows[0].code}`,
            html: `
        <h2>Welcome to PharmaConnect!</h2>
        <p>Your verification code is: <strong>${rows[0].code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
        });

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Registration successful. Please check your email for verification code.',
            userId
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Signup error:', error);

        if (error.message?.includes('already exists')) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        res.status(500).json({ error: 'Registration failed' });
    } finally {
        client.release();
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Authenticate user
        const { rows } = await db.query(
            'SELECT * FROM authenticate_user($1, $2)',
            [email, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        // Get profile data
        let profile;
        if (user.role === 'pharmacist') {
            const profileResult = await db.query(
                'SELECT * FROM pharmacists WHERE id = $1',
                [user.user_id]
            );
            profile = profileResult.rows[0];
        } else if (user.role === 'pharmacy') {
            const profileResult = await db.query(
                'SELECT * FROM pharmacies WHERE id = $1',
                [user.user_id]
            );
            profile = profileResult.rows[0];
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user.user_id, role: user.role, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.user_id,
                email,
                role: user.role,
                isEmailVerified: user.is_email_verified,
                isPhoneVerified: user.is_phone_verified,
                profile
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify OTP
router.post('/verify-otp', authenticate, async (req, res) => {
    try {
        const { code, method } = req.body;

        const { rows } = await db.query(
            'SELECT verify_otp($1, $2, $3) as success',
            [req.user.id, code, method]
        );

        if (rows[0].success) {
            res.json({ message: 'Verification successful' });
        } else {
            res.status(400).json({ error: 'Invalid or expired code' });
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Resend OTP
router.post('/resend-otp', authenticate, async (req, res) => {
    try {
        const { method } = req.body;

        // Get user contact info
        const { rows: userRows } = await db.query(
            'SELECT email, phone FROM users u LEFT JOIN pharmacists ph ON u.id = ph.id LEFT JOIN pharmacies p ON u.id = p.id WHERE u.id = $1',
            [req.user.id]
        );

        const contact = method === 'email' ? userRows[0].email : userRows[0].phone;

        // Generate new OTP
        const { rows } = await db.query(
            'SELECT generate_otp($1, $2, $3) as code',
            [req.user.id, method, contact]
        );

        // Send OTP
        if (method === 'email') {
            await sendEmail({
                to: contact,
                subject: 'Your PharmaConnect verification code',
                text: `Your verification code is: ${rows[0].code}`,
            });
        } else {
            await sendSMS({
                to: contact,
                body: `Your PharmaConnect verification code is: ${rows[0].code}`
            });
        }

        res.json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
});

// Refresh token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Get user info
        const { rows } = await db.query(
            'SELECT id, email, role FROM users WHERE id = $1 AND is_active = true',
            [decoded.userId]
        );

        if (rows.length === 0) {
            throw new Error();
        }

        const user = rows[0];

        // Generate new access token
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ accessToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

module.exports = router;