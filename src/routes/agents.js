/**
 * Agent Control Routes
 * 
 * API endpoints for managing and interacting with AI agents
 */

const express = require('express');
const router = express.Router();
const path = require('path');

// LLM for Friday's intelligence
const Groq = require('groq-sdk');
const groq = new Groq();

// Conversation history for Friday
const fridayConversations = {};

// Import agent modules
const getAgentStatus = () => {
    const configPath = path.join(__dirname, '../../agents/config.js');
    delete require.cache[require.resolve(configPath)];
    const config = require(configPath);

    return {
        dryRun: config.isDryRun(),
        enabledAgents: config.getEnabledAgents(),
        agents: config.agents,
    };
};

// Get all agent status
router.get('/status', async (req, res) => {
    try {
        const status = getAgentStatus();

        const agentInfo = {
            argus: { name: 'Argus', role: 'System Monitor', icon: '👁️', schedule: 'Every 1 min' },
            prism: { name: 'Prism', role: 'Analytics', icon: '🔍', schedule: 'Daily 7 AM' },
            nova: { name: 'Nova', role: 'Nurse Prep', icon: '💫', schedule: 'On-demand' },
            falcon: { name: 'Falcon', role: 'Sales Outreach', icon: '🦅', schedule: 'Weekdays 8 AM' },
            closer: { name: 'Closer', role: 'Deal Acceleration', icon: '🤝', schedule: 'Weekdays 10 AM' },
            titan: { name: 'Titan', role: 'Revenue Chief', icon: '🏆', schedule: 'Weekdays 9 AM' },
            friday: { name: 'Friday', role: 'Your EA', icon: '✨', schedule: '7 AM & 9 PM' },
        };

        const agents = Object.keys(agentInfo).map(key => ({
            id: key,
            ...agentInfo[key],
            enabled: status.agents[key]?.enabled || false,
            config: status.agents[key] || {},
        }));

        res.json({
            dryRun: status.dryRun,
            enabledCount: status.enabledAgents.length,
            totalCount: agents.length,
            agents,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get agent metrics (Revenue, Output, Health)
router.get('/metrics', async (req, res) => {
    try {
        const titanPath = path.join(__dirname, '../../agents/revenue/titan/index.js');
        delete require.cache[require.resolve(titanPath)];
        const titan = require(titanPath);

        const metrics = await titan.getRevenueMetrics();

        // Add system health check
        const argusPath = path.join(__dirname, '../../agents/operations/argus/index.js');
        // Don't delete cache for Argus to keep history if needed, but for now we reload
        delete require.cache[require.resolve(argusPath)];
        const argus = require(argusPath);
        const health = await argus.getStatus();

        res.json({
            revenue: metrics,
            system: health,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chat with Friday - NOW WITH REAL AI
router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Initialize conversation history if needed
        if (!fridayConversations[sessionId]) {
            fridayConversations[sessionId] = [];
        }

        // Get current system context
        const status = getAgentStatus();
        const systemContext = `
You are FRIDAY, an intelligent executive assistant for the founder of Hanna AI, a healthcare AI startup.

YOUR PERSONALITY:
- Sharp, proactive, anticipatory, slightly witty
- Professional but warm
- You genuinely care about helping the founder succeed
- You're confident but not arrogant
- You occasionally show personality with light humor

CURRENT SYSTEM STATUS:
- ${status.enabledAgents.length} of 7 agents are active
- Dry Run Mode: ${status.dryRun ? 'ENABLED (safe mode)' : 'DISABLED (live mode)'}
- Enabled agents: ${status.enabledAgents.join(', ')}

YOUR TEAM (AI Agents you coordinate):
1. ARGUS - System Monitor (watches for issues 24/7)
2. PRISM - Analytics (daily metrics and insights)
3. NOVA - Nurse Prep (prepares briefings for nurses)
4. FALCON - Sales Hunter (personalized outreach)
5. CLOSER - Deal Maker (proposals and negotiations)
6. TITAN - Revenue Chief (tracks pipeline and quota)
7. YOU (FRIDAY) - Executive Assistant (coordinates everything)

BUSINESS CONTEXT:
- Current MRR: ฿30,000
- Target MRR: ฿100,000
- Pipeline Value: ฿250,000
- Active Patients: ~50
- Deals in Progress: 3

CAPABILITIES:
- Answer questions about the business, agents, or metrics
- Provide strategic advice and suggestions
- Help prioritize tasks and decisions
- Coordinate other agents when asked
- Give morning briefings and evening wraps
- Be conversational and helpful

IMPORTANT:
- Be concise but thorough
- Use data when available
- Be proactive with suggestions
- If asked to do something, explain what you'll do
- Keep responses under 200 words unless detail is needed
`.trim();

        // Build messages array
        const messages = [
            { role: 'system', content: systemContext },
            ...fridayConversations[sessionId].slice(-10), // Last 10 messages for context
            { role: 'user', content: message }
        ];

        // Call Groq LLM
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = completion.choices[0]?.message?.content || "I'm having trouble responding right now.";

        // Store conversation
        fridayConversations[sessionId].push({ role: 'user', content: message });
        fridayConversations[sessionId].push({ role: 'assistant', content: reply });

        // Limit history
        if (fridayConversations[sessionId].length > 20) {
            fridayConversations[sessionId] = fridayConversations[sessionId].slice(-20);
        }

        res.json({
            message: reply,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Friday chat error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Trigger agent manually
router.post('/trigger/:agentId', async (req, res) => {
    try {
        const { agentId } = req.params;

        // Define possible agent locations
        const folders = ['operations', 'revenue', 'executive'];
        let agent = null;
        let agentPath = null;

        for (const folder of folders) {
            try {
                agentPath = path.join(__dirname, `../../agents/${folder}/${agentId}/index.js`);
                delete require.cache[require.resolve(agentPath)];
                agent = require(agentPath);
                break; // Found it
            } catch (err) {
                // Not in this folder, try next
                continue;
            }
        }

        if (!agent) {
            return res.status(404).json({ error: `Agent ${agentId} not found` });
        }

        const result = await agent.run();

        res.json({
            success: true,
            agent: agentId,
            result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Trigger Nova specifically for a task
router.post('/trigger/nova/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const novaPath = path.join(__dirname, '../../agents/operations/nova/index.js');
        delete require.cache[require.resolve(novaPath)];
        const nova = require(novaPath);

        const result = await nova.generateBriefing(taskId);

        res.json({
            success: true,
            agent: 'nova',
            task: taskId,
            briefing: result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get agent logs (mock for now)
router.get('/logs', async (req, res) => {
    try {
        const logs = [
            { time: new Date().toISOString(), agent: 'argus', level: 'info', message: '✅ All systems green' },
            { time: new Date(Date.now() - 60000).toISOString(), agent: 'titan', level: 'info', message: '📊 Pipeline: ฿250K' },
            { time: new Date(Date.now() - 120000).toISOString(), agent: 'falcon', level: 'info', message: '📧 3 emails queued' },
        ];

        res.json({ logs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
