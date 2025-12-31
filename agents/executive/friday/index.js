/**
 * FRIDAY — The Founder's EA  
 * 
 * ═══════════════════════════════════════════════════════════════
 * PERSONALITY: Proactive, anticipatory, witty, loyal
 * TAGLINE: "Good morning, boss. Here's your day."
 * ═══════════════════════════════════════════════════════════════
 * 
 * MISSION:
 * Be the founder's right hand - manage day, filter noise, surface signal
 * 
 * TASKS:
 * 1. Morning briefing (7 AM)
 * 2. Email summaries
 * 3. Track commitments
 * 4. Evening wrap-up (9 PM)
 * 5. Coordinate other agents
 * 
 * BEHAVIOR:
 * - Morning: Aggregate overnight events, today's priorities
 * - Evening: Summarize wins, prep tomorrow
 * - Always: Proactive, anticipatory
 * 
 * AUTONOMY: 40%
 * - Highly interactive with founder
 * - Seeks approval for key actions
 */

const logger = require('../../core/logger').createAgentLogger('friday');
const config = require('../../config');

class Friday {
  constructor() {
    this.name = 'Friday';
    this.schedule = '0 7,21 * * *'; // 7 AM and 9 PM daily
  }

  async run() {
    const hour = new Date().getHours();

    if (hour < 12) {
      await this.morningBriefing();
    } else {
      await this.eveningWrap();
    }
  }

  async morningBriefing() {
    logger.info('☀️ Preparing morning briefing...');

    try {
      // Load other agents to get their status
      const prism = require('../../operations/prism');
      const titan = require('../../revenue/titan');
      const argus = require('../../operations/argus');

      // Get metrics from Prism
      const metrics = await prism.run();

      // Get revenue from Titan (if enabled)
      let revenueReport = '';
      if (config.agents.titan.enabled) {
        revenueReport = await titan.run();
      }

      // Get system status from Argus
      const systemStatus = await argus.getStatus();
      const statusText = systemStatus.status === 'healthy' ? '✅ All systems green' : '⚠️ Issues detected';

      const briefing = `☀️ Good morning, boss!

${metrics}

${revenueReport}

System Status: ${statusText}

Have a great day!
`.trim();

      await this.send(briefing);
      logger.success('Morning briefing sent');
    } catch (error) {
      logger.error('Failed to generate briefing', { error: error.message });
    }
  }

  async eveningWrap() {
    logger.info('🌙 Preparing evening wrap...');

    const wrap = `🌙 Evening Wrap

Today's Highlights:
- Check-ins completed
- Tasks resolved
- Meetings held

Tomorrow's Prep:
- Review pending tasks
- Prepare for calls

Get some rest. Argus is watching the systems.
`.trim();

    await this.send(wrap);
    logger.success('Evening wrap sent');
  }

  async send(message) {
    if (config.isDryRun()) {
      logger.info('[DRY RUN] Briefing:\n', message);
      return;
    }

    if (!config.agents.friday.canSendNotifications) {
      logger.warn('[CONFIG BLOCKED] Notification not sent');
      return;
    }

    try {
      const lineNotify = require('../../src/services/lineNotify');
      await lineNotify.sendAlert(`📋 [Friday]\n\n${message}`);
      logger.success('Notification sent');
    } catch (error) {
      logger.error('Failed to send notification', { error: error.message });
    }
  }
}

module.exports = new Friday();
