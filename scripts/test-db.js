require('dotenv').config();
const db = require('../src/services/db');

async function testConnection() {
    console.log('🔌 Testing Database Connection...');
    console.log(`URL: ${process.env.DATABASE_URL ? 'Set ✅' : 'Missing ❌'}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

    try {
        const res = await db.query('SELECT NOW()');
        console.log('✅ Connection Successful!');
        console.log('🕒 Server Time:', res.rows[0].now);

        const tableRes = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('📊 Tables:', tableRes.rows.map(r => r.table_name).join(', '));

    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        if (err.message.includes('SSL')) {
            console.log('💡 Hint: Check if NODE_ENV is set to "production" in Railway variables.');
        }
    } finally {
        process.exit();
    }
}

testConnection();
