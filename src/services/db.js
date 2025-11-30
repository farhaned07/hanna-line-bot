```
const { Pool } = require('pg');

// List of common Supabase Pooler regions to probe
const POOLER_REGIONS = [
    'aws-0-ap-southeast-1.pooler.supabase.com', // Singapore (Most likely)
    'aws-0-ap-northeast-1.pooler.supabase.com', // Tokyo
    'aws-0-us-east-1.pooler.supabase.com',      // US East
    'aws-0-eu-central-1.pooler.supabase.com',   // EU Central
    'aws-0-us-west-1.pooler.supabase.com'       // US West
];

let pool;

const testConnection = async (config) => {
    const tempPool = new Pool({ ...config, connectionTimeoutMillis: 3000 }); // 3s timeout
    try {
        const client = await tempPool.connect();
        client.release();
        await tempPool.end();
        return true;
    } catch (e) {
        await tempPool.end();
        return false;
    }
};

const getPool = async () => {
    if (pool) return pool;

    let connectionConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };

    try {
        const url = new URL(process.env.DATABASE_URL);
        const hostname = url.hostname;
        
        // Check if this is a Supabase direct URL
        const match = hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/);
        if (match) {
            const projectRef = match[1];
            console.log(`ℹ️ Detected Supabase Direct URL.Starting Pooler Discovery for project: ${ projectRef }...`);
            
            const originalUser = url.username;
            const originalPass = url.password;
            const dbName = url.pathname.split('/')[1] || 'postgres';

            // Try each region
            for (const regionHost of POOLER_REGIONS) {
                console.log(`🔍 Probing region: ${ regionHost }...`);
                
                const candidateConfig = {
                    user: `${ originalUser }.${ projectRef } `,
                    password: originalPass,
                    host: regionHost,
                    port: 6543,
                    database: dbName,
                    ssl: { rejectUnauthorized: false }
                };

                if (await testConnection(candidateConfig)) {
                    console.log(`✅ FOUND VALID POOLER: ${ regionHost } `);
                    console.log(`🔄 Switching connection to use this pooler.`);
                    connectionConfig = candidateConfig;
                    break;
                }
            }
        }
    } catch (err) {
        console.error('⚠️ Auto-Discovery failed, using original URL:', err);
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
    poolPromise
};
```
