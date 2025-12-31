/**
 * Agent Scheduler
 * 
 * Manages cron jobs for all agents.
 * Separate from main app scheduler (src/scheduler.js).
 */

const cron = require('node-cron');
const config = require('./config');
const logger = require('./core/logger').createAgentLogger('scheduler');

class AgentScheduler {
    constructor() {
        this.jobs = {};
    }

    start() {
        logger.info('Starting agent scheduler...');

        // Load agents
        const agents = this.loadAgents();

        // Schedule each enabled agent
        Object.entries(agents).forEach(([name, agent]) => {
            if (config.isAgentEnabled(name) && agent.schedule) {
                this.scheduleAgent(name, agent);
            }
        });

        const enabledCount = Object.keys(this.jobs).length;
        logger.success(`Scheduler started with ${enabledCount} active agents`);
    }

    loadAgents() {
        const agents = {};

        // Operations Squad
        if (config.agents.argus.enabled) {
            agents.argus = require('./operations/argus');
        }
        if (config.agents.prism.enabled) {
            agents.prism = require('./operations/prism');
        }
        if (config.agents.nova.enabled) {
            agents.nova = require('./operations/nova');
        }

        // Revenue Squad
        if (config.agents.falcon.enabled) {
            agents.falcon = require('./revenue/falcon');
        }
        if (config.agents.closer.enabled) {
            agents.closer = require('./revenue/closer');
        }
        if (config.agents.titan.enabled) {
            agents.titan = require('./revenue/titan');
        }

        // Executive
        if (config.agents.friday.enabled) {
            agents.friday = require('./executive/friday');
        }

        return agents;
    }

    scheduleAgent(name, agent) {
        const schedule = agent.schedule;

        logger.info(`Scheduling ${name}`, { schedule });

        this.jobs[name] = cron.schedule(schedule, async () => {
            logger.debug(`Running ${name}...`);
            try {
                await agent.run();
            } catch (error) {
                logger.error(`${name} failed`, { error: error.message });
            }
        });
    }

    stop() {
        Object.entries(this.jobs).forEach(([name, job]) => {
            job.stop();
            logger.info(`Stopped ${name}`);
        });
        this.jobs = {};
    }
}

module.exports = new AgentScheduler();
