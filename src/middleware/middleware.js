const jwt = require('jsonwebtoken');
const db = require('../db');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user still exists and is active
        const { rows } = await db.query(
            'SELECT id, role, is_active FROM users WHERE id = $1 AND is_active = true',
            [decoded.userId]
        );

        if (rows.length === 0) {
            throw new Error();
        }

        req.user = {
            id: decoded.userId,
            role: rows[0].role,
            email: decoded.email
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };