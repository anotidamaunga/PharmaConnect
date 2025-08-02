const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/middleware');

const router = express.Router();

// Search jobs
router.get('/search', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { rows } = await db.query(`
            SELECT j.*, p.pharmacy_name as pharmacy
            FROM jobs j
                     JOIN pharmacies p ON j.pharmacy_id = p.id
            WHERE j.status = 'active'
            ORDER BY j.created_at DESC
                LIMIT $1 OFFSET $2
        `, [limit, offset]);

        res.json({
            jobs: rows,
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: rows.length === parseInt(limit)
        });
    } catch (error) {
        console.error('Search jobs error:', error);
        res.status(500).json({ error: 'Failed to search jobs' });
    }
});

// Get job details
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT j.*, p.pharmacy_name as pharmacy
            FROM jobs j
                     JOIN pharmacies p ON j.pharmacy_id = p.id
            WHERE j.id = $1
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ error: 'Failed to get job' });
    }
});

// Create job (for pharmacies)
router.post('/', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacy') {
            return res.status(403).json({ error: 'Only pharmacies can create jobs' });
        }

        // Basic job creation - you can expand this
        res.json({ message: 'Job creation not fully implemented yet' });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

// Apply to job
router.post('/:id/apply', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ error: 'Only pharmacists can apply to jobs' });
        }

        const { coverLetter, expectedRate } = req.body;

        await db.query(`
            INSERT INTO job_applications (job_id, pharmacist_id, cover_letter, expected_rate)
            VALUES ($1, $2, $3, $4)
        `, [req.params.id, req.user.id, coverLetter, expectedRate]);

        res.json({ message: 'Application submitted successfully' });
    } catch (error) {
        if (error.code === '23505') { // Duplicate key error
            return res.status(400).json({ error: 'Already applied to this job' });
        }
        console.error('Apply to job error:', error);
        res.status(500).json({ error: 'Failed to apply to job' });
    }
});

// Save job
router.post('/:id/save', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ error: 'Only pharmacists can save jobs' });
        }

        await db.query(`
            INSERT INTO saved_jobs (job_id, pharmacist_id)
            VALUES ($1, $2)
        `, [req.params.id, req.user.id]);

        res.json({ message: 'Job saved successfully' });
    } catch (error) {
        if (error.code === '23505') { // Duplicate key error
            return res.status(400).json({ error: 'Job already saved' });
        }
        console.error('Save job error:', error);
        res.status(500).json({ error: 'Failed to save job' });
    }
});

// Unsave job
router.delete('/:id/save', authenticate, async (req, res) => {
    try {
        await db.query(`
            DELETE FROM saved_jobs 
            WHERE job_id = $1 AND pharmacist_id = $2
        `, [req.params.id, req.user.id]);

        res.json({ message: 'Job unsaved successfully' });
    } catch (error) {
        console.error('Unsave job error:', error);
        res.status(500).json({ error: 'Failed to unsave job' });
    }
});

module.exports = router;