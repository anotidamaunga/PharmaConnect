const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/middleware');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        let profile;
        if (req.user.role === 'pharmacist') {
            const { rows } = await db.query(
                'SELECT * FROM pharmacists WHERE id = $1',
                [req.user.id]
            );
            profile = rows[0];
        } else if (req.user.role === 'pharmacy') {
            const { rows } = await db.query(
                'SELECT * FROM pharmacies WHERE id = $1',
                [req.user.id]
            );
            profile = rows[0];
        }

        res.json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        // Implementation for updating profile
        res.json({ message: 'Profile update not implemented yet' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update contact info
router.put('/contact', authenticate, async (req, res) => {
    try {
        const { phone, email } = req.body;

        await db.query(
            'UPDATE users SET email = COALESCE($1, email) WHERE id = $2',
            [email, req.user.id]
        );

        if (req.user.role === 'pharmacist') {
            await db.query(
                'UPDATE pharmacists SET phone = COALESCE($1, phone) WHERE id = $2',
                [phone, req.user.id]
            );
        } else if (req.user.role === 'pharmacy') {
            await db.query(
                'UPDATE pharmacies SET phone = COALESCE($1, phone) WHERE id = $2',
                [phone, req.user.id]
            );
        }

        res.json({ message: 'Contact info updated successfully' });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ error: 'Failed to update contact info' });
    }
});

// Update address (for pharmacies)
router.put('/address', authenticate, async (req, res) => {
    try {
        const { address } = req.body;

        if (req.user.role !== 'pharmacy') {
            return res.status(403).json({ error: 'Only pharmacies can update address' });
        }

        await db.query(
            'UPDATE pharmacies SET address = $1 WHERE id = $2',
            [address, req.user.id]
        );

        res.json({ message: 'Address updated successfully' });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ error: 'Failed to update address' });
    }
});

// Get dashboard stats
router.get('/stats', authenticate, async (req, res) => {
    try {
        // Mock stats for now
        res.json({
            activeJobs: 0,
            totalApplications: 0,
            completedJobs: 0,
            averageRating: 0
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

module.exports = router;