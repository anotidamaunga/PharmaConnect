const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
    logger.info('Database connected successfully');
});

pool.on('error', (err) => {
    logger.error('Unexpected database error:', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => {
        const start = Date.now();
        return pool.query(text, params)
            .then(res => {
                const duration = Date.now() - start;
                logger.debug('Query executed', { text, duration, rows: res.rowCount });
                return res;
            })
            .catch(err => {
                logger.error('Query error', { text, error: err.message });
                throw err;
            });
    },
    getClient: () => pool.connect(),
};
