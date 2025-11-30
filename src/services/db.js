// Force IPv4 to avoid ENETUNREACH errors on Railway/Supabase
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const { Pool } = require('pg');
const { promisify } = require('util');

const resolve4 = promisify(dns.resolve4);

// List of common Supabase Pooler regions to probe
const POOLER_REGIONS = [
    'aws-0-ap-southeast-1.pooler.supabase.com', // Singapore (Most likely)
    'aws-0-ap-northeast-1.pooler.supabase.com', // Tokyo
    'aws-0-us-east-1.pooler.supabase.com',      // US East
    'aws-0-eu-central-1.pooler.supabase.com',   // EU Central
    'aws-0-us-west-1.pooler.supabase.com'       // US West
];

let pool;

// Resolve hostname to IPv4 address
const resolveHostnameToIPv4 = async (hostname) => {
    try {
        // Check if it's already an IP address
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
            return hostname; // Already IPv4
        }
        if (/^[0-9a-fA-F:]+$/.test(hostname)) {
            // It's an IPv6 address, we can't use it directly
            throw new Error('IPv6 address detected, cannot resolve to IPv4');
        }
        // Resolve to IPv4
        const addresses = await resolve4(hostname);
        if (addresses && addresses.length > 0) {
            return addresses[0];
        }
        throw new Error(`No IPv4 address found for ${hostname}`);
    } catch (err) {
        console.warn(`⚠️ Could not resolve ${hostname} to IPv4, using hostname directly:`, err.message);
        return hostname; // Fallback to hostname
    }
};

const testConnection = async (config) => {
    const tempPool = new Pool({ 
        ...config, 
        connectionTimeoutMillis: 3000 // 3s timeout
    });
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

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set. Please configure your database connection string.');
    }

    let connectionConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };

    try {
        const url = new URL(process.env.DATABASE_URL);
        const originalHostname = url.hostname;
        
        // Check if hostname is an IPv6 address (IPv6 can be in brackets [::1] or without)
        const cleanHostname = originalHostname.replace(/^\[|\]$/g, ''); // Remove brackets if present
        const isIPv6 = cleanHostname.includes(':') && /^[0-9a-fA-F:]+$/i.test(cleanHostname);
        
        // Check if this is a Supabase direct URL (check before resolving)
        const match = originalHostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/);
        const projectRef = match ? match[1] : null;
        
        // If IPv6 detected, we need to fail early with clear instructions
        if (isIPv6) {
            console.error(`❌ IPv6 address detected in DATABASE_URL: ${originalHostname}`);
            console.error(`💡 IPv6 addresses cannot be used due to network connectivity issues.`);
            console.error(`📝 SOLUTION: Update your DATABASE_URL environment variable in Railway:`);
            console.error(``);
            console.error(`   1. Go to Railway Dashboard → Your Service → Variables`);
            console.error(`   2. Find DATABASE_URL and update it to one of these formats:`);
            console.error(``);
            console.error(`   Option A - Supabase Pooler (RECOMMENDED):`);
            console.error(`   postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`);
            console.error(``);
            console.error(`   Option B - Supabase Hostname:`);
            console.error(`   postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres`);
            console.error(``);
            console.error(`   Replace PROJECT_REF with your Supabase project reference (found in Supabase dashboard URL)`);
            console.error(`   Get the correct connection string from: Supabase Dashboard → Settings → Database → Connection String`);
            throw new Error(`DATABASE_URL contains IPv6 address (${originalHostname}) which cannot be used. Please update DATABASE_URL in Railway to use Supabase pooler connection (port 6543) or hostname format. Check Supabase Dashboard → Settings → Database for the correct connection string.`);
        }
        
        // If it's a Supabase URL, try pooler
        if (match) {
            const originalUser = url.username;
            const originalPass = url.password;
            const dbName = url.pathname.split('/')[1] || 'postgres';
            
            console.log(`ℹ️ Detected Supabase Direct URL. Starting Pooler Discovery for project: ${projectRef}...`);
            
            // Try each region
            for (const regionHost of POOLER_REGIONS) {
                console.log(`🔍 Probing region: ${regionHost}...`);
                
                // Resolve pooler hostname to IPv4
                const resolvedHost = await resolveHostnameToIPv4(regionHost);
                
                const candidateConfig = {
                    user: `${originalUser}.${projectRef}`,
                    password: originalPass,
                    host: resolvedHost,
                    port: 6543,
                    database: dbName,
                    ssl: { rejectUnauthorized: false }
                };

                if (await testConnection(candidateConfig)) {
                    console.log(`✅ FOUND VALID POOLER: ${regionHost}`);
                    console.log(`🔄 Switching connection to use this pooler.`);
                    connectionConfig = candidateConfig;
                    break;
                }
            }
        } else {
            // Not a Supabase URL - resolve hostname to IPv4 and rebuild connection string
            try {
                const resolvedHost = await resolveHostnameToIPv4(originalHostname);
                if (resolvedHost !== originalHostname) {
                    console.log(`🔄 Resolved ${originalHostname} to IPv4: ${resolvedHost}`);
                    // Rebuild connection string with IPv4 address
                    url.hostname = resolvedHost;
                    connectionConfig.connectionString = url.toString();
                    console.log(`✅ Using IPv4 connection string`);
                }
            } catch (resolveErr) {
                console.warn(`⚠️ Could not resolve hostname to IPv4, using original: ${resolveErr.message}`);
            }
        }
    } catch (err) {
        console.error('⚠️ Connection configuration failed:', err.message);
        // Re-throw the error so it bubbles up and prevents pool creation
        throw err;
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
