const db = require('../services/db');
require('dotenv').config();

const checkSchema = async () => {
    try {
        console.log('🔍 Checking database schema...');

        // Check for chat_history table
        const res = await db.query("SELECT to_regclass('chat_history') as table_exists");
        const exists = res.rows[0]?.table_exists;

        if (exists) {
            console.log('✅ table "chat_history" found.');
        } else {
            console.log('❌ table "chat_history" MISSING.');
        }

        // Check columns in check_ins
        const cols = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'check_ins'
        `);
        const columns = cols.rows.map(r => r.column_name);
        const required = ['mood', 'glucose_level', 'check_in_time', 'patient_id'];

        const missing = required.filter(c => !columns.includes(c));

        if (missing.length === 0) {
            console.log('✅ All "check_ins" columns found.');
        } else {
            console.log(`❌ Missing columns in "check_ins": ${missing.join(', ')}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
};

checkSchema();
