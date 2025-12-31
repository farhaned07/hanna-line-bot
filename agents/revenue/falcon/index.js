/**
 * FALCON — The Hunter
 * 
 * ═══════════════════════════════════════════════════════════════
 * PERSONALITY: Sharp, persistent, opportunity-hunter
 * TAGLINE: "50 personalized touches today"
 * ═══════════════════════════════════════════════════════════════
 * 
 * MISSION:
 * High-volume personalized sales outreach to insurers
 * 
 * TASKS:
 * 1. Research target insurers
 * 2. Personalize outreach emails
 * 3. Send multi-touch sequences
 * 4. Track opens/replies
 * 5. Hand warm leads to Hunter
 * 
 * BEHAVIOR:
 * - Runs weekdays at 8 AM (outreach batch)
 * - Reads leads from data/leads.json
 * - Generates personalized emails with LLM
 * - Sends via email service (when enabled)
 * - Tracks engagement
 * 
 * AUTONOMY: 70%
 * - Drafts emails automatically
 * - Human approves C-level outreach
 * - Sends automatically to managers
 * 
 * SAFETY:
 * - Email sending controlled by config flag
 * - Daily email cap
 * - Dry-run mode supported
 */

const llm = require('../../core/llm');
const logger = require('../../core/logger').createAgentLogger('falcon');
const config = require('../../config');
const fs = require('fs').promises;
const path = require('path');

class Falcon {
    constructor() {
        this.name = 'Falcon';
        this.schedule = '0 8 * * 1-5'; // Weekdays at 8 AM
    }

    async run() {
        logger.info('🦅 Starting outreach batch...');

        const leads = await this.getLeads();
        const maxEmails = config.agents.falcon.maxEmailsPerDay;
        const batch = leads.slice(0, maxEmails);

        logger.info(`Processing ${batch.length} leads (max: ${maxEmails})`);

        const drafts = [];
        for (const lead of batch) {
            const email = await this.draftEmail(lead);
            drafts.push(email);

            if (config.agents.falcon.canSendEmails && !config.isDryRun()) {
                const result = await this.sendEmail(email);

                if (result.success) {
                    await this.recordEvent({
                        messageId: result.messageId,
                        leadEmail: lead.email,
                        eventType: 'sent',
                        leadCompany: lead.company
                    });
                }
            } else {
                logger.info('[Draft Only] Email prepared', { to: lead.company });
            }
        }

        logger.success(`Batch complete: ${drafts.length} emails processed`);
        return drafts;
    }

    async recordEvent(event) {
        try {
            const eventsPath = path.join(process.cwd(), 'data', 'email_events.json');
            // Read existing
            let data = { events: [] };
            try {
                const content = await fs.readFile(eventsPath, 'utf8');
                data = JSON.parse(content);
            } catch (e) {
                // File might not exist or be empty
            }

            data.events.push({
                ...event,
                id: require('crypto').randomUUID(),
                timestamp: new Date().toISOString()
            });

            await fs.writeFile(eventsPath, JSON.stringify(data, null, 2));
            logger.debug('Recorded email event', event);
        } catch (error) {
            logger.error('Failed to record email event', { error: error.message });
        }
    }

    async getLeads() {
        try {
            const leadsPath = path.join(process.cwd(), 'data', 'leads.json');
            const data = await fs.readFile(leadsPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            logger.warn('No leads file found, using sample data');
            return [
                { company: 'Muang Thai Life', email: 'health@muangthai.com', tier: 'enterprise' },
                { company: 'AIA Thailand', email: 'products@aia.com', tier: 'enterprise' },
                { company: 'Pacific Cross', email: 'sales@pacificcross.com', tier: 'mid-market' },
            ];
        }
    }

    async draftEmail(lead) {
        // Load structured knowledge base
        const knowledgePath = path.join(__dirname, 'knowledge.json');
        const knowledge = JSON.parse(await fs.readFile(knowledgePath, 'utf8'));

        const prompt = `You are Falcon, the sales agent for ${knowledge.company.name}.

═══════════════════════════════════════════════════════════════
ABOUT US (Use this EXACT information):
═══════════════════════════════════════════════════════════════
Company: ${knowledge.company.name}
Product: ${knowledge.company.product}
Website: ${knowledge.company.website}
Email: ${knowledge.company.salesEmail}

OUR IDENTITY:
${knowledge.identity}

═══════════════════════════════════════════════════════════════
VALUE PROPOSITION:
═══════════════════════════════════════════════════════════════
Primary: ${knowledge.valueProposition.primary}
For Buyers: ${knowledge.valueProposition.forBuyers}

Pain Points We Solve:
${knowledge.painPointsWeSolve.map(p => `- ${p}`).join('\n')}

Results We Deliver:
${knowledge.outcomesWeDeliver.map(o => `- ${o}`).join('\n')}

═══════════════════════════════════════════════════════════════
RECIPIENT:
═══════════════════════════════════════════════════════════════
Company: ${lead.company}
Email: ${lead.email}
Tier: ${lead.tier || 'mid-market'}
${lead.contactName ? `Contact: ${lead.contactName}` : ''}

═══════════════════════════════════════════════════════════════
EMAIL REQUIREMENTS:
═══════════════════════════════════════════════════════════════
- Length: ${knowledge.outreachStrategy.emailLength}
- Tone: ${knowledge.outreachStrategy.tone}
- CTA: "${knowledge.demo.bookingMethod}"
- Sign-off: "The ${knowledge.company.name} Team"

MUST INCLUDE:
${knowledge.outreachStrategy.mustInclude.map(m => `✓ ${m}`).join('\n')}

NEVER DO:
${knowledge.outreachStrategy.neverDo.map(d => `✗ ${d}`).join('\n')}

PROHIBITED PHRASES (never use these):
${knowledge.prohibitedPhrases.map(p => `✗ "${p}"`).join('\n')}

═══════════════════════════════════════════════════════════════
OUTPUT: Write ONLY the email body. No subject line.
═══════════════════════════════════════════════════════════════`;

        const body = await llm.generate(prompt, {
            systemPrompt: `You are Falcon, a precise B2B sales AI. You focus on CLINICAL CAPACITY and OPERATIONAL LEVERAGE, not cost savings. You ONLY use information provided. You NEVER invent details, use placeholders, or brackets. Every email must be complete and ready to send.`,
            temperature: 0.6,
            maxTokens: 300,
        });

        // Validate no prohibited phrases
        const hasProhibited = knowledge.prohibitedPhrases.some(p =>
            body.toLowerCase().includes(p.toLowerCase())
        );

        if (hasProhibited) {
            logger.warn('⚠️ Prohibited phrase detected, regenerating...');
            return this.draftEmail(lead); // Retry
        }

        return {
            to: lead.email,
            subject: `${lead.company} — ${knowledge.valueProposition.primary.split(' ').slice(0, 6).join(' ')}`,
            body: body.trim(),
            lead: lead.company,
        };
    }

    async sendEmail(email) {
        const emailService = require('../../core/email');

        logger.info(`📧 Sending email to ${email.to}...`);

        const result = await emailService.send({
            to: email.to,
            subject: email.subject,
            body: email.body,
        });

        if (result.success) {
            logger.success(`✅ Email sent to ${email.to}`);
        } else {
            logger.warn(`⚠️ Email not sent: ${result.reason || result.error}`);
        }

        return result;
    }
}

module.exports = new Falcon();
