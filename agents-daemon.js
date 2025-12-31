#!/usr/bin/env node

/**
 * Hanna AI Agent System Daemon
 * 
 * This runs INDEPENDENTLY from the main Hanna app (src/index.js).
 * It starts the agent scheduler which manages all autonomous agents.
 * 
 * Safety: All agents start DISABLED. Enable via .env.agents
 */

require('dotenv').config({ path: '.env.agents' });
const config = require('./agents/config');

console.log('');
console.log('🤖 ============================================');
console.log('🤖   Hanna AI Agent System                   ');
console.log('🤖 ============================================');
console.log('');

// Display config status
const status = config.getStatus();
console.log('📋 Configuration:');
console.log(`   Dry Run Mode: ${status.dryRun ? '✅ ENABLED (Safe)' : '⚠️  DISABLED (Live mode)'}`);
console.log(`   Log Level: ${status.logLevel}`);
console.log(`   Enabled Agents: ${status.enabledAgents.length}/${status.totalAgents}`);

if (status.enabledAgents.length === 0) {
    console.log('');
    console.log('⚠️  No agents are currently enabled.');
    console.log('💡 To enable agents, edit .env.agents');
    console.log('');
    console.log('Example:');
    console.log('  AGENT_ARGUS_ENABLED=true');
    console.log('  AGENT_PRISM_ENABLED=true');
    console.log('');
    console.log('ℹ️  Agent daemon is running but idle...');
    console.log('');

    // Keep process alive even with no agents (for development)
    setInterval(() => {
        // Heartbeat log every 5 minutes
    }, 300000);

    return;
}

console.log('');
console.log('✅ Enabled agents:');
status.enabledAgents.forEach(name => {
    console.log(`   - ${name}`);
});
console.log('');

if (config.isDryRun()) {
    console.log('⚠️  DRY RUN MODE - Agents will simulate actions but not execute them');
    console.log('');
}

// Start scheduler
const scheduler = require('./agents/scheduler');
scheduler.start();

console.log('🎯 Agent System Ready');
console.log('');
console.log('📊 To monitor agents, watch this console output');
console.log('🛑 To stop agents, press Ctrl+C');
console.log('');

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('');
    console.log('🛑 Shutting down agent system...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('');
    console.log('🛑 Shutting down agent system...');
    process.exit(0);
});
