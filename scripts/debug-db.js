require('dotenv').config();
const { Pool } = require('pg');

const POOLER_REGIONS = [
    'aws-0-ap-southeast-1.pooler.supabase.com',
    'aws-0-ap-northeast-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com',
    'aws-0-eu-central-1.pooler.supabase.com',
    'aws-0-us-west-1.pooler.supabase.com'
];

async function debug() {
    console.log('🔍 Starting Debug Probe v2...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    const url = new URL(process.env.DATABASE_URL);
    const hostname = url.hostname;
    const match = hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/);

    if (!match) {
        console.error('❌ Not a Supabase Direct URL');
        return;
    }

    const projectRef = match[1];
    const originalUser = url.username;
    const originalPass = url.password;
    const dbName = url.pathname.split('/')[1] || 'postgres';

    console.log(`ℹ️ Project Ref: ${projectRef}`);
    console.log(`ℹ️ User: ${originalUser}.${projectRef}`);

    // 1. Try Direct (IPv6)
    console.log(`\n----------------------------------------`);
    console.log(`🔍 Probing DIRECT (IPv6): ${hostname}:5432`);
    try {
        const directPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000
        });
        const client = await directPool.connect();
        console.log(`✅ SUCCESS! Connected Direct.`);
        client.release();
        await directPool.end();
    } catch (e) {
        console.error(`❌ FAILED Direct: ${e.message}`);
    }

    // 2. Try Poolers
    for (const regionHost of POOLER_REGIONS) {
        // Try Port 6543 (Transaction)
        console.log(`\n----------------------------------------`);
        console.log(`🔍 Probing POOLER (Transaction): ${regionHost}:6543`);

        const config6543 = {
            user: `${originalUser}.${projectRef}`,
            password: originalPass,
            host: regionHost,
            port: 6543,
            database: dbName,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000
        };

        const pool6543 = new Pool(config6543);
        try {
            const client = await pool6543.connect();
            console.log(`✅ SUCCESS! Connected to ${regionHost}:6543`);
            client.release();
            await pool6543.end();
            return; // Found it
        } catch (e) {
            console.error(`❌ FAILED: ${e.message}`);
            if (e.code) console.error(`   Code: ${e.code}`);
            await pool6543.end();
        }

        // Try Port 5432 (Session)
        console.log(`🔍 Probing POOLER (Session): ${regionHost}:5432`);
        const config5432 = { ...config6543, port: 5432 };
        const pool5432 = new Pool(config5432);
        try {
            const client = await pool5432.connect();
            console.log(`✅ SUCCESS! Connected to ${regionHost}:5432`);
            client.release();
            await pool5432.end();
            return; // Found it
        } catch (e) {
            console.error(`❌ FAILED: ${e.message}`);
            await pool5432.end();
        }
    }
    console.log(`\n❌ All probes failed.`);
}

debug();
