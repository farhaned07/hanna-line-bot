/**
 * Agent Logger
 * 
 * Centralized logging for all agents with consistent formatting.
 * Separate from main app logs for clarity.
 */

const config = require('../config');

const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    // Agent colors
    argus: '\x1b[36m',    // Cyan
    prism: '\x1b[35m',    // Magenta  
    falcon: '\x1b[33m',   // Yellow
    closer: '\x1b[32m',   // Green
    titan: '\x1b[31m',    // Red
    friday: '\x1b[34m',   // Blue
    nova: '\x1b[37m',     // White

    // Log levels
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    success: '\x1b[32m',
};

class Logger {
    constructor() {
        this.logLevel = config.LOG_LEVEL || 'info';
        this.levels = ['debug', 'info', 'warn', 'error'];
    }

    shouldLog(level) {
        const currentLevel = this.levels.indexOf(this.logLevel);
        const messageLevel = this.levels.indexOf(level);
        return messageLevel >= currentLevel;
    }

    formatTimestamp() {
        return new Date().toISOString().replace('T', ' ').slice(0, -5);
    }

    log(level, agent, message, data = null) {
        if (!this.shouldLog(level)) return;

        const timestamp = this.formatTimestamp();
        const color = COLORS[agent] || COLORS.reset;
        const levelColor = COLORS[level] || COLORS.reset;

        let output = `${COLORS.dim}${timestamp}${COLORS.reset} ${color}[${agent.toUpperCase()}]${COLORS.reset} ${levelColor}${message}${COLORS.reset}`;

        if (data) {
            output += ` ${COLORS.dim}${JSON.stringify(data)}${COLORS.reset}`;
        }

        console.log(output);
    }

    // Agent-specific loggers
    createAgentLogger(agentName) {
        return {
            debug: (msg, data) => this.log('debug', agentName, msg, data),
            info: (msg, data) => this.log('info', agentName, msg, data),
            warn: (msg, data) => this.log('warn', agentName, msg, data),
            error: (msg, data) => this.log('error', agentName, msg, data),
            success: (msg, data) => this.log('success', agentName, `✅ ${msg}`, data),
        };
    }
}

module.exports = new Logger();
