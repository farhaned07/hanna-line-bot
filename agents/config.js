/**
 * Agent System Configuration
 * 
 * Feature flags to control agent behavior.
 * All agents start DISABLED and in DRY_RUN mode for safety.
 */

require('dotenv').config({ path: '.env.agents' });

const config = {
    // === GLOBAL SETTINGS ===
    DRY_RUN: process.env.AGENTS_DRY_RUN !== 'false', // Default: true (safe)
    LOG_LEVEL: process.env.AGENTS_LOG_LEVEL || 'info',

    // === AGENT ENABLE/DISABLE ===
    agents: {
        // Operations Squad
        argus: {
            enabled: process.env.AGENT_ARGUS_ENABLED === 'true',
            canSendAlerts: process.env.AGENT_ARGUS_CAN_ALERT === 'true',
            checkIntervalMinutes: parseInt(process.env.AGENT_ARGUS_INTERVAL) || 5,
        },

        prism: {
            enabled: process.env.AGENT_PRISM_ENABLED === 'true',
        },

        nova: {
            enabled: process.env.AGENT_NOVA_ENABLED === 'true',
        },

        // Revenue Squad
        falcon: {
            enabled: process.env.AGENT_FALCON_ENABLED === 'true',
            canSendEmails: process.env.AGENT_FALCON_CAN_SEND === 'true',
            maxEmailsPerDay: parseInt(process.env.AGENT_FALCON_MAX_EMAILS) || 10,
        },

        closer: {
            enabled: process.env.AGENT_CLOSER_ENABLED === 'true',
            canSendProposals: process.env.AGENT_CLOSER_CAN_SEND === 'true',
        },

        titan: {
            enabled: process.env.AGENT_TITAN_ENABLED === 'true',
        },

        // Executive
        friday: {
            enabled: process.env.AGENT_FRIDAY_ENABLED === 'true',
            canSendNotifications: process.env.AGENT_FRIDAY_CAN_NOTIFY === 'true',
        },
    },

    // === HELPER METHODS ===
    isDryRun() {
        return this.DRY_RUN;
    },

    getEnabledAgents() {
        return Object.keys(this.agents).filter(name => this.agents[name].enabled);
    },

    getStatus() {
        return {
            dryRun: this.DRY_RUN,
            logLevel: this.LOG_LEVEL,
            enabledAgents: this.getEnabledAgents(),
            totalAgents: Object.keys(this.agents).length,
        };
    },

    isAgentEnabled(agentName) {
        return this.agents[agentName]?.enabled || false;
    },
};

module.exports = config;
