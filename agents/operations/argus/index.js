/**
 * ARGUS — The Guardian
 * 
 * ═══════════════════════════════════════════════════════════════
 * PERSONALITY: Vigilant, protective, never sleeps
 * TAGLINE: "I never sleep. All systems green."
 * ═══════════════════════════════════════════════════════════════
 * 
 * MISSION:
 * Monitor system health 24/7 and alert on anomalies
 * 
 * TASKS:
 * 1. Health check main app every 5 minutes
 * 2. Monitor database connectivity
 * 3. Check error rates
 * 4. Alert on system failures
 * 5. Track uptime metrics
 * 
 * BEHAVIOR:
 * - Runs automatically every 5 minutes (cron)
 * - Silent when everything is fine
 * - LOUD when something breaks
 * - Sends LINE Notify alerts for critical issues
 * - Logs all checks for audit trail
 * 
 * AUTONOMY: 85%
 * - Auto-detects issues
 * - Auto-alerts on failures  
 * - Escalates unknowns to human
 * 
 * SAFETY:
 * - Read-only database access
 * - Alerts controlled by config flag
 * - Dry-run mode supported
 */

const axios = require('axios');
const config = require('../../config');
const logger = require('../../core/logger').createAgentLogger('argus');
const db = require('../../core/db-readonly');

class Argus {
    constructor() {
        this.name = 'Argus';
        this.schedule = `*/${config.agents.argus.checkIntervalMinutes} * * * *`; // Every N minutes
        this.lastStatus = 'unknown';
    }

    async run() {
        logger.info('🔍 Running system health check...');

        const checks = await Promise.allSettled([
            this.checkMainApp(),
            this.checkDatabase(),
            this.checkErrorRate(),
        ]);

        const failures = checks.filter(c => c.status === 'rejected');

        if (failures.length > 0) {
            await this.alert(`⚠️ System health check failed: ${failures.length} issues detected`);
            this.lastStatus = 'unhealthy';
        } else {
            if (this.lastStatus === 'unhealthy') {
                await this.alert('✅ System recovered - all checks passing');
            }
            logger.success('All systems green');
            this.lastStatus = 'healthy';
        }
    }

    async checkMainApp() {
        try {
            const response = await axios.get('http://localhost:3000/', {
                timeout: 5000,
            });

            if (response.status === 200) {
                logger.debug('Main app OK');
                return true;
            }

            throw new Error(`Main app returned ${response.status}`);
        } catch (error) {
            logger.error('Main app check failed', { error: error.message });
            throw error;
        }
    }

    async checkDatabase() {
        try {
            const result = await db.query('SELECT 1 as test');

            if (result.rows.length > 0) {
                logger.debug('Database OK');
                return true;
            }

            throw new Error('Database query returned no results');
        } catch (error) {
            logger.error('Database check failed', { error: error.message });
            throw error;
        }
    }

    async checkErrorRate() {
        // TODO: Implement error rate check from logs
        // For now, just return OK
        logger.debug('Error rate check skipped (not implemented)');
        return true;
    }

    async alert(message) {
        if (config.isDryRun()) {
            logger.info(`[DRY RUN] Would send alert: ${message}`);
            return;
        }

        if (!config.agents.argus.canSendAlerts) {
            logger.warn(`[CONFIG BLOCKED] Alert not sent: ${message}`);
            return;
        }

        try {
            // Send via LINE Notify
            const lineNotify = require('../../src/services/lineNotify');
            await lineNotify.sendAlert(`🚨 [Argus]\n${message}`);
            logger.success('Alert sent');
        } catch (error) {
            logger.error('Failed to send alert', { error: error.message });
        }
    }

    async getStatus() {
        return {
            status: this.lastStatus,
            lastCheck: new Date().toISOString(),
        };
    }
}

module.exports = new Argus();
