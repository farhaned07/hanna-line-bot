/**
 * TITAN — The Revenue Chief
 * 
 * ═══════════════════════════════════════════════════════════════
 * PERSONALITY: Decisive, metrics-driven, quota-focused
 * TAGLINE: "We hit quota. Period."
 * ═══════════════════════════════════════════════════════════════
 * 
 * MISSION:
 * Track revenue metrics and coordinate revenue squad
 * 
 * TASKS:
 * 1. Track pipeline vs quota
 * 2. Identify stuck deals
 * 3. Forecast revenue
 * 4. Coordinate Falcon, Closer, Hunter
 * 5. Daily revenue standup
 * 
 * BEHAVIOR:
 * - Runs daily at 9 AM (revenue standup)
 * - Tracks pipeline metrics
 * - Identifies bottlenecks
 * - Reports to Friday
 * 
 * AUTONOMY: 70%
 * - Tracks automatically
 * - Reports automatically
 * - Escalates blockers
 */

const logger = require('../../core/logger').createAgentLogger('titan');
const config = require('../../config');
const fs = require('fs').promises;
const path = require('path');

class Titan {
    constructor() {
        this.name = 'Titan';
        this.schedule = '0 9 * * 1-5'; // Weekdays at 9 AM
        this.monthlyTarget = 100000; // ฿100K MRR target
    }

    async run() {
        logger.info('📈 Revenue standup...');

        const metrics = await this.getRevenueMetrics();
        const report = this.generateReport(metrics);

        logger.info('Revenue report generated', metrics);

        return report;
    }

    async getRevenueMetrics() {
        try {
            // Read Deals
            let deals = [];
            try {
                const dealsPath = path.join(process.cwd(), 'data', 'deals.json');
                const dealsData = JSON.parse(await fs.readFile(dealsPath, 'utf8'));
                deals = dealsData.deals || [];
            } catch (e) {
                logger.warn('Could not read deals.json');
            }

            // Read Email Events
            let emailEvents = [];
            try {
                const eventsPath = path.join(process.cwd(), 'data', 'email_events.json');
                const eventsData = JSON.parse(await fs.readFile(eventsPath, 'utf8'));
                emailEvents = eventsData.events || [];
            } catch (e) {
                logger.warn('Could not read email_events.json');
            }

            // Compute Metrics
            const currentMRR = deals
                .filter(d => d.stage === 'closed_won')
                .reduce((sum, d) => sum + (d.value || 0), 0);

            const pipelineValue = deals
                .filter(d => ['negotiation', 'proposal', 'qualified'].includes(d.stage))
                .reduce((sum, d) => sum + (d.value || 0), 0);

            const sentCount = emailEvents.filter(e => e.eventType === 'sent').length;
            const replyCount = emailEvents.filter(e => e.eventType === 'replied').length; // requires webhook 'email.replied' or manual

            // Note: Resend doesn't send 'replied' webhooks automatically without inbound parsing.
            // We assume 'replied' events are added manually or via a separate inbound handler for now.

            return {
                currentMRR,
                target: this.monthlyTarget,
                pipelineValue,
                dealsInProgress: deals.filter(d => ['negotiation', 'proposal'].includes(d.stage)).length,
                dealsClosedThisMonth: deals.filter(d =>
                    d.stage === 'closed_won' &&
                    new Date(d.closedAt) > new Date(new Date().setDate(1))
                ).length,
                sentEmails: sentCount,
                replies: replyCount
            };
        } catch (error) {
            logger.error('Failed to get metrics', { error: error.message });
            return {
                currentMRR: 0,
                target: this.monthlyTarget,
                pipelineValue: 0,
                dealsInProgress: 0,
                dealsClosedThisMonth: 0,
                error: true
            };
        }
    }

    generateReport(metrics) {
        const percentOfTarget = (metrics.currentMRR / metrics.target * 100).toFixed(1);
        const gap = metrics.target - metrics.currentMRR;

        return `📈 Revenue Standup

Current MRR: ฿${metrics.currentMRR.toLocaleString()}
Target: ฿${metrics.target.toLocaleString()}
Achievement: ${percentOfTarget}%

Pipeline: ฿${metrics.pipelineValue.toLocaleString()}
In Progress: ${metrics.dealsInProgress} deals
Closed This Month: ${metrics.dealsClosedThisMonth}

${gap > 0 ? `🎯 Gap: ฿${gap.toLocaleString()} to target` : '✅ Target achieved!'}
`.trim();
    }
}

module.exports = new Titan();
