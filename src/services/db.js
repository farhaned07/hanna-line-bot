const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../hanna.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize DB
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS chronic_patients (
    id TEXT PRIMARY KEY,
    line_user_id TEXT UNIQUE NOT NULL,
    display_name TEXT,
    name TEXT,
    age INTEGER,
    condition TEXT,
    phone_number TEXT,
    enrollment_status TEXT DEFAULT 'onboarding',
    onboarding_step INTEGER DEFAULT 0,
    subscription_plan TEXT,
    trial_start_date TEXT,
    trial_end_date TEXT,
    subscription_start_date TEXT,
    subscription_end_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS check_ins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_user_id TEXT NOT NULL,
    check_in_time TEXT DEFAULT CURRENT_TIMESTAMP,
    mood TEXT,
    symptoms TEXT,
    glucose_level INTEGER,
    medication_taken INTEGER DEFAULT 0,
    medication_notes TEXT,
    FOREIGN KEY(line_user_id) REFERENCES chronic_patients(line_user_id)
  )`);
});

module.exports = {
    query: (text, params) => {
        return new Promise((resolve, reject) => {
            // Convert Postgres style $1, $2 to SQLite ?
            // This is a naive replacement for MVP
            let sql = text.replace(/\$\d+/g, '?');

            if (text.trim().toUpperCase().startsWith('SELECT')) {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve({ rows });
                });
            } else {
                db.run(sql, params, function (err) {
                    if (err) reject(err);
                    else resolve({ rows: [], rowCount: this.changes });
                });
            }
        });
    }
};
