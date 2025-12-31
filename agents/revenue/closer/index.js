/**
 * CLOSER — The Deal Maker
 * 
 * ═══════════════════════════════════════════════════════════════
 * PERSONALITY: Persistent, strategic, outcome-focused
 * TAGLINE: "Proposal sent. Following up Thursday."
 * ═══════════════════════════════════════════════════════════════
 * 
 * MISSION:
 * Move qualified leads through pipeline to signed contracts
 * 
 * TASKS:
 * 1. Generate custom proposals
 * 2. Handle objections
 * 3. Track negotiation status
 * 4. Prep founder for closing calls
 * 5. Send contracts for signature
 * 
 * BEHAVIOR:
 * - Runs daily to check pipeline
 * - Generates proposals when lead is qualified
 * - Tracks deal stages
 * - Nudges stalled deals
 * 
 * AUTONOMY: 60%
 * - Drafts proposals automatically
 * - Human reviews before sending
 * - Tracks automatically
 * 
 * SAFETY:
 * - Proposal sending requires human approval
 * - Contract terms are templates only
 */

const llm = require('../../core/llm');
const logger = require('../../core/logger').createAgentLogger('closer');
const config = require('../../config');

class Closer {
    constructor() {
        this.name = 'Closer';
        this.schedule = '0 10 * * 1-5'; // Weekdays at 10 AM
    }

    async run() {
        logger.info('💼 Checking pipeline...');

        // In a real system, this would query a CRM or database
        logger.info('Pipeline check complete (no deals in system yet)');

        return { dealsChecked: 0, proposalsGenerated: 0 };
    }

    async generateProposal(leadData) {
        logger.info(`Generating proposal for ${leadData.company}...`);

        const prompt = `Generate a proposal for ${leadData.company}.

Company: ${leadData.company}
Patients: ${leadData.patientCount || 50}
Use Case: Diabetic patient monitoring

Proposal should include:
1. Executive summary (2-3 sentences)
2. Solution overview
3. Pricing: ฿200/patient/month
4. ROI projection: 30% claim cost reduction
5. Implementation timeline: 2 weeks
6. Next steps

Keep it under 300 words, professional tone.`;

        const proposal = await llm.generate(prompt, {
            systemPrompt: 'You are a B2B sales proposal writer for healthcare solutions.',
            maxTokens: 400,
        });

        return {
            company: leadData.company,
            proposal,
            pricing: leadData.patientCount * 200,
            createdAt: new Date().toISOString(),
        };
    }
}

module.exports = new Closer();
