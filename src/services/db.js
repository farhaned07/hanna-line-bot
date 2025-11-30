const { Pool } = require('pg');
const dns = require('dns');
const { promisify } = require('util');

const resolve4 = promisify(dns.resolve4);

let pool;

const getPool = async () => {
    if (pool) return pool;

    let connectionString = process.env.DATABASE_URL;

    try {
        const url = new URL(connectionString);
        const hostname = url.hostname;

        // Force IPv4 resolution
        const addresses = await resolve4(hostname);
        if (addresses && addresses.length > 0) {
            console.log(`✅ Resolved ${hostname} to IPv4: ${addresses[0]}`);
            url.hostname = addresses[0];
            connectionString = url.toString();
        }
    } catch (err) {
        console.error('⚠️ Failed to resolve hostname to IPv4, using original URL:', err);
    }

    pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    pool.on('connect', () => {
        console.log('✅ Connected to PostgreSQL database');
    });

    pool.on('error', (err) => {
        console.error('❌ Unexpected database error:', err);
    });

    return pool;
};

// Initialize pool promise
const poolPromise = getPool();

module.exports = {
    query: async (text, params) => {
        const p = await poolPromise;
        return p.query(text, params);
    },
    poolPromise // Export for testing if needed
};
