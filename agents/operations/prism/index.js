/**
 * PRISM — The Analyst
 * 
 * ═══════════════════════════════════════════════════════════════
 * PERSONALITY: Observant, data-obsessed, pattern-finder
 * TAGLINE: "I see patterns you don't"
 * ═══════════════════════════════════════════════════════════════
 * 
 * MISSION:
 * Track metrics, generate insights, identify trends
 * 
 * TASKS:
 * 1. Daily metrics digest (patient count, check-ins, tasks)
 * 2. Churn risk alerts
 * 3. Growth opportunity detection
 * 4. Performance tracking
 * 
 * BEHAVIOR:
 * - Runs daily at 7 AM (before Friday's briefing)
 * - Queries database for metrics
 * - Generates formatted reports
 * - Identifies anomalies
 * 
 * AUTONOMY: 90%
 * - Reports auto-generated
 * - Humans act on insights
 * 
 * SAFETY:
 * - Read-only database access
 */

const db = require('../../core/db-readonly');
const logger = require('../../core/logger').createAgentLogger('prism');
const config = require('../../config');

class Prism {
    constructor() {
        this.name = 'Prism';
        this.schedule = '0 7 * * *'; // Daily at 7 AM
    }

    async run() {
        logger.info('📊 Generating daily metrics...');

        const metrics = await this.getMetrics();
        const digest = this.formatDigest(metrics);

        logger.info('Metrics generated', metrics);

        return digest;
    }

    async getMetrics() {
        try {
            const [patients, tasks, checkIns, resolved] = await Promise.all([
                db.query(`SELECT COUNT(*) as count FROM chronic_patients WHERE enrollment_status = 'active'`),
                db.query(`SELECT priority, COUNT(*) as count FROM nurse_tasks WHERE status = 'pending' GROUP BY priority`),
                db.query(`SELECT COUNT(*) as count FROM check_ins WHERE created_at >= CURRENT_DATE`),
                db.query(`SELECT COUNT(*) as count FROM nurse_tasks WHERE status = 'resolved' AND resolved_at >= CURRENT_DATE`),
            ]);

            return {
                activePatients: parseInt(patients.rows[0].count),
                pendingTasks: tasks.rows.reduce((acc, row) => {
                    acc[row.priority] = parseInt(row.count);
                    return acc;
                }, {}),
                checkInsToday: parseInt(checkIns.rows[0].count),
                resolvedToday: parseInt(resolved.rows[0].count),
            };
        } catch (error) {
            logger.error('Failed to get metrics', { error: error.message });
            throw error;
        }
    }

    formatDigest(metrics) {
        const critical = metrics.pendingTasks.critical || 0;
        const high = metrics.pendingTasks.high || 0;

        return `📊 Daily Metrics Digest

Active Patients: ${metrics.activePatients}
Check-ins Today: ${metrics.checkInsToday}
Resolved Today: ${metrics.resolvedToday}

Pending Tasks:
${critical > 0 ? `  🔴 Critical: ${critical}` : ''}
${high > 0 ? `  🟡 High: ${high}` : ''}

${critical > 5 ? '⚠️ High critical task load' : '✅ Task load normal'}
`.trim();
    }
}

module.exports = new Prism();
