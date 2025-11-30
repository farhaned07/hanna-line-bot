```
const { Pool } = require('pg');

// PostgreSQL connection pool
// Note: We expect the DATABASE_URL to be the Transaction Pooler URL (Port 6543)
// which supports IPv4, as Railway cannot reach IPv6 addresses.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

// Test connection on startup
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
});

module.exports = {
    query: (text, params) => {
        return pool.query(text, params);
    },
    pool
};
```
