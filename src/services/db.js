const { Pool } = require('pg');
const dns = require('dns');
const { promisify } = require('util');

const resolve4 = promisify(dns.resolve4);

let pool;

const getPool = async () => {
    if (pool) return pool;

    let connectionConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };

    try {
        const url = new URL(process.env.DATABASE_URL);
        const hostname = url.hostname;

        // Check if this is a Supabase direct URL (IPv6 often)
        const match = hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/);
        if (match) {
            const projectRef = match[1];
            console.log(`ℹ️ Detected Supabase Direct URL for project: ${projectRef}`);

            // Rewrite to use IPv4 Transaction Pooler (Supavisor)
            // Host: aws-0-ap-southeast-1.pooler.supabase.com (Singapore/Thailand)
            // Port: 6543
            // User: [user].[projectRef]

            const poolerHost = 'aws-0-ap-southeast-1.pooler.supabase.com';
            const originalUser = url.username;

            // Construct new connection string
            const newUrl = new URL(process.env.DATABASE_URL);
            newUrl.hostname = poolerHost;
            newUrl.port = '6543';
            newUrl.username = `${originalUser}.${projectRef}`;

            console.log(`🔄 Auto-switching to IPv4 Pooler: ${poolerHost}:6543`);

            connectionConfig = {
                connectionString: newUrl.toString(),
                ssl: { rejectUnauthorized: false }
            };
        }
    } catch (err) {
        console.error('⚠️ Failed to rewrite connection string:', err);
    }

    pool = new Pool(connectionConfig);

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
