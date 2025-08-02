const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/middleware');

const router = express.Router();

// Get user documents
router.get('/', authenticate, async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT * FROM documents 
            WHERE user_id = $1 
            ORDER BY uploaded_at DESC
        `, [req.user.id]);

        res.json(rows);
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ error: 'Failed to get documents' });
    }
});

// Upload document (placeholder)
router.post('/upload', authenticate, async (req, res) => {
    try {
        res.json({ message: 'Document upload not implemented yet' });
    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
});

module.exports = router;