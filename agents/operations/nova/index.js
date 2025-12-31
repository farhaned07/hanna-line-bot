/**
 * NOVA — The Prep Master
 * 
 * ═══════════════════════════════════════════════════════════════
 * PERSONALITY: Efficient, thorough, always-ready
 * TAGLINE: "Your briefing is ready, nurse"
 * ═══════════════════════════════════════════════════════════════
 * 
 * MISSION:
 * Prepare nurses for patient interventions with comprehensive briefings
 * 
 * TASKS:
 * 1. Generate patient history summaries
 * 2. Draft call scripts with talking points
 * 3. Suggest intervention strategies
 * 4. Highlight red flags
 * 
 * BEHAVIOR:
 * - Triggered when high-priority nurse task created
 * - Queries patient data (history, vitals, adherence)
 * - Uses LLM to generate personalized briefing
 * - Saves briefing for nurse review
 * 
 * AUTONOMY: 80%
 * - Generates briefings automatically
 * - Nurse reviews before calling patient
 * 
 * SAFETY:
 * - Read-only database access
 * - Suggestions only, nurse decides action
 */

const db = require('../../core/db-readonly');
const llm = require('../../core/llm');
const logger = require('../../core/logger').createAgentLogger('nova');
const config = require('../../config');

class Nova {
    constructor() {
        this.name = 'Nova';
        // Nova runs on-demand when tasks are created, not on schedule
        this.schedule = null;
    }

    async run() {
        // This would be triggered by task creation webhook
        logger.info('⚡ Nova requires task-based triggering, not cron');
    }

    async generateBriefing(taskId) {
        logger.info(`Generating briefing for task ${taskId}...`);

        try {
            // Get task and patient data
            const task = await this.getTask(taskId);
            const patientData = await this.getPatientData(task.patient_id);

            // Generate briefing with LLM
            const briefing = await this.createBriefing(task, patientData);

            logger.success('Briefing generated');
            return briefing;
        } catch (error) {
            logger.error('Failed to generate briefing', { error: error.message });
            throw error;
        }
    }

    async getTask(taskId) {
        const result = await db.query(
            'SELECT * FROM nurse_tasks WHERE id = $1',
            [taskId]
        );
        return result.rows[0];
    }

    async getPatientData(patientId) {
        const [patient, checkIns, vitals] = await Promise.all([
            db.query('SELECT * FROM chronic_patients WHERE id = $1', [patientId]),
            db.query(
                'SELECT * FROM check_ins WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 7',
                [patientId]
            ),
            db.query(
                'SELECT * FROM vitals_log WHERE patient_id = $1 ORDER BY logged_at DESC LIMIT 5',
                [patientId]
            ),
        ]);

        return {
            patient: patient.rows[0],
            recentCheckIns: checkIns.rows,
            recentVitals: vitals.rows,
        };
    }

    async createBriefing(task, patientData) {
        const prompt = `You are a clinical assistant preparing a nurse briefing.

Patient: ${patientData.patient.name || 'Unknown'}
Condition: ${patientData.patient.condition}
Age: ${patientData.patient.age}

Task: ${task.task_type}
Priority: ${task.priority}
Reason: ${task.reason}

Recent check-ins: ${patientData.recentCheckIns.length}
Recent symptoms: ${patientData.recentCheckIns.map(c => c.symptoms).filter(Boolean).join(', ')}

Generate a concise nurse briefing (under 200 words) with:
1. Patient summary
2. Key talking points
3. Suggested intervention
4. Red flags to watch for`;

        const briefing = await llm.generate(prompt, {
            systemPrompt: 'You are a clinical support AI for nurses.',
            maxTokens: 300,
        });

        return briefing;
    }
}

module.exports = new Nova();
