const db = require('../services/db');

/**
 * Log a health check-in response
 * @param {string} userId - LINE user ID
 * @param {string} mood - User's mood (good, bad, etc.)
 * @param {string} symptoms - Any symptoms reported
 * @param {number} glucoseLevel - Optional glucose reading
 */
const logCheckIn = async (userId, mood, symptoms = null, glucoseLevel = null) => {
    try {
        await db.query(
            `INSERT INTO check_ins (line_user_id, mood, symptoms, glucose_level, check_in_time)
             VALUES (?, ?, ?, ?, datetime('now'))`,
            [userId, mood, symptoms, glucoseLevel]
        );
        console.log(`✅ Check-in logged for ${userId}`);
        return true;
    } catch (error) {
        console.error('❌ Error logging check-in:', error);
        return false;
    }
};

/**
 * Log medication adherence
 * @param {string} userId - LINE user ID
 * @param {boolean} taken - Whether medication was taken
 * @param {string} notes - Optional notes
 */
const logMedication = async (userId, taken, notes = null) => {
    try {
        // First, get or create today's check-in record
        const today = new Date().toISOString().split('T')[0];

        const existing = await db.query(
            `SELECT id FROM check_ins 
             WHERE line_user_id = ? 
             AND date(check_in_time) = date('now')
             LIMIT 1`,
            [userId]
        );

        if (existing.rows.length > 0) {
            // Update existing check-in
            await db.query(
                `UPDATE check_ins 
                 SET medication_taken = ?, medication_notes = ?
                 WHERE id = ?`,
                [taken ? 1 : 0, notes, existing.rows[0].id]
            );
        } else {
            // Create new check-in just for medication
            await db.query(
                `INSERT INTO check_ins (line_user_id, medication_taken, medication_notes, check_in_time)
                 VALUES (?, ?, ?, datetime('now'))`,
                [userId, taken ? 1 : 0, notes]
            );
        }

        console.log(`✅ Medication logged for ${userId}: ${taken ? 'Taken' : 'Missed'}`);
        return true;
    } catch (error) {
        console.error('❌ Error logging medication:', error);
        return false;
    }
};

/**
 * Get health summary for a user
 * @param {string} userId - LINE user ID
 * @param {number} days - Number of days to look back
 */
const getHealthSummary = async (userId, days = 7) => {
    try {
        const result = await db.query(
            `SELECT 
                COUNT(*) as total_checkins,
                SUM(CASE WHEN medication_taken = 1 THEN 1 ELSE 0 END) as meds_taken,
                SUM(CASE WHEN medication_taken = 0 THEN 1 ELSE 0 END) as meds_missed,
                AVG(glucose_level) as avg_glucose,
                SUM(CASE WHEN mood = 'good' OR mood = 'สบายดี' THEN 1 ELSE 0 END) as good_mood_days,
                SUM(CASE WHEN mood = 'bad' OR mood = 'ไม่สบาย' THEN 1 ELSE 0 END) as bad_mood_days
             FROM check_ins
             WHERE line_user_id = ?
             AND date(check_in_time) >= date('now', '-' || ? || ' days')`,
            [userId, days]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const summary = result.rows[0];

        // Calculate adherence percentage
        const totalMedDays = (summary.meds_taken || 0) + (summary.meds_missed || 0);
        const adherencePercent = totalMedDays > 0
            ? Math.round((summary.meds_taken / totalMedDays) * 100)
            : 0;

        return {
            totalCheckIns: summary.total_checkins || 0,
            medicationsTaken: summary.meds_taken || 0,
            medicationsMissed: summary.meds_missed || 0,
            adherencePercent,
            averageGlucose: summary.avg_glucose ? Math.round(summary.avg_glucose) : null,
            goodMoodDays: summary.good_mood_days || 0,
            badMoodDays: summary.bad_mood_days || 0,
            days
        };
    } catch (error) {
        console.error('❌ Error getting health summary:', error);
        return null;
    }
};

/**
 * Get recent check-ins for a user
 * @param {string} userId - LINE user ID
 * @param {number} limit - Number of records to retrieve
 */
const getRecentCheckIns = async (userId, limit = 7) => {
    try {
        const result = await db.query(
            `SELECT 
                date(check_in_time) as date,
                mood,
                symptoms,
                glucose_level,
                medication_taken,
                medication_notes
             FROM check_ins
             WHERE line_user_id = ?
             ORDER BY check_in_time DESC
             LIMIT ?`,
            [userId, limit]
        );

        return result.rows;
    } catch (error) {
        console.error('❌ Error getting recent check-ins:', error);
        return [];
    }
};

/**
 * Calculate risk score based on recent data
 * @param {string} userId - LINE user ID
 * @returns {string} Risk level: 'low', 'medium', 'high'
 */
const calculateRiskScore = async (userId) => {
    try {
        const summary = await getHealthSummary(userId, 7);

        if (!summary) {
            return 'unknown';
        }

        let riskPoints = 0;

        // Medication adherence (weighted heavily)
        if (summary.adherencePercent < 70) {
            riskPoints += 3;
        } else if (summary.adherencePercent < 85) {
            riskPoints += 1;
        }

        // Missed medications in last week
        if (summary.medicationsMissed >= 3) {
            riskPoints += 2;
        }

        // Bad mood days
        if (summary.badMoodDays >= 3) {
            riskPoints += 1;
        }

        // Glucose levels (if tracked)
        if (summary.averageGlucose) {
            if (summary.averageGlucose > 200) {
                riskPoints += 2;
            } else if (summary.averageGlucose > 160) {
                riskPoints += 1;
            }
        }

        // Determine risk level
        if (riskPoints >= 4) {
            return 'high';
        } else if (riskPoints >= 2) {
            return 'medium';
        } else {
            return 'low';
        }
    } catch (error) {
        console.error('❌ Error calculating risk score:', error);
        return 'unknown';
    }
};

module.exports = {
    logCheckIn,
    logMedication,
    getHealthSummary,
    getRecentCheckIns,
    calculateRiskScore
};
