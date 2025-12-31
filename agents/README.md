# Hanna AI Agent System

**Status**: 🚧 Under Development (Phase 0 - Infrastructure Setup)

## Overview

This is a **completely isolated** AI agent system that runs alongside the main Hanna application. It does NOT modify or interfere with existing code.

## Architecture

- **Separate Process**: Agents run via `agents-daemon.js` (independent from `src/index.js`)
- **Feature Flags**: Each agent can be enabled/disabled via `.env.agents`
- **Dry-Run Mode**: Test agents without taking real actions
- **Read-Only Initially**: Agents start with read-only database access

## Folder Structure

```
agents/
├── core/              # Shared utilities (LLM, DB, logging)
├── revenue/           # Sales agents (Falcon, Closer, Titan)
├── operations/        # Ops agents (Argus, Prism, Nova)
├── executive/         # Executive agents (Friday)
├── config.js          # Feature flags & settings
├── scheduler.js       # Agent cron scheduler
└── index.js           # Agent loader
```

## Current Status

✅ Phase 0: Folder structure created
⏳ Phase 1: Core utilities (next)
⏳ Phase 2: First agent (Argus - monitoring)

## Safety Guarantees

- ✅ No modifications to `src/` folder
- ✅ Separate execution process
- ✅ Main app continues to work independently
- ✅ Easy rollback (just delete `agents/` folder)

## Running Agents

```bash
# Main app (unchanged)
npm run dev

# Agents (separate process, not started yet)
node agents-daemon.js
```

---

**Documentation**: See `/Users/mac/.gemini/antigravity/brain/*/safe_implementation_plan.md`
