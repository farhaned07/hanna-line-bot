/**
 * Read-Only Database Wrapper
 * 
 * Provides safe read-only access to database for agents.
 * Prevents agents from accidentally modifying data.
 */

const { Pool } = require('pg');

class ReadOnlyDatabase {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        // Enforce read-only at connection level
        this.pool.on('connect', (client) => {
            client.query('SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY');
        });
    }

    async query(text, params) {
        // Block any non-SELECT queries for extra safety
        const trimmed = text.trim().toUpperCase();
        if (!trimmed.startsWith('SELECT') && !trimmed.startsWith('WITH')) {
            throw new Error('Read-only database: Only SELECT queries allowed');
        }

        try {
            const result = await this.pool.query(text, params);
            return result;
        } catch (error) {
            console.error('[DB] Query error:', error.message);
            throw error;
        }
    }

    async end() {
        await this.pool.end();
    }
}

module.exports = new ReadOnlyDatabase();
