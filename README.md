# Hanna AI Nurse

**Hybrid Intelligence Network for Chronic Disease Management**

[![Railway](https://img.shields.io/badge/Backend-Railway-purple)](https://railway.app)
[![Vercel](https://img.shields.io/badge/Dashboard-Vercel-black)](https://vercel.com)
[![LINE](https://img.shields.io/badge/LINE-Official-00C300)](https://line.me)

---

## Overview

Hanna is a **nurse force multiplier** for chronic disease management in Thailand. It performs:
- **Systematic data collection** via LINE chat and voice
- **Risk assessment** using AI-powered analysis
- **Nurse prioritization** through an exception-based dashboard

**What Hanna is NOT**: A medical triage system or diagnostic tool.

---

## System Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **LINE Bot** | LINE Messaging API | Patient interaction, vitals logging |
| **Voice Interface** | LiveKit + EdgeTTS | Real-time Thai voice conversations |
| **OneBrain** | Groq Llama 3.3 70B | Risk scoring and response generation |
| **Dashboard** | React + Tailwind | Nurse Mission Control |
| **Database** | Supabase PostgreSQL | Patient data and audit logs |

---

## Quick Start

### Prerequisites
- Node.js 18+
- LINE Developer Account
- Supabase Project
- Groq API Key
- LiveKit Cloud Account

### Installation

```bash
# Clone repository
git clone https://github.com/farhaned07/hanna-line-bot.git
cd hanna-line-bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run locally
npm start
```

### Environment Variables

```bash
# LINE
LINE_CHANNEL_SECRET=your_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_access_token
LIFF_ID=your_liff_id

# AI
GROQ_API_KEY=your_groq_key

# Voice
LIVEKIT_URL=wss://your-app.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# Database
DATABASE_URL=postgresql://...

# Dashboard Auth
NURSE_DASHBOARD_TOKEN=your_secure_token
```

---

## Features

### For Patients (LINE)
- 🎙️ **Voice Calls** - Talk to Hanna in Thai
- 📊 **Vitals Logging** - Record blood pressure, glucose
- 💊 **Medication Tracking** - Daily reminders
- 🚨 **Emergency Detection** - Immediate escalation

### For Nurses (Dashboard)
- 📋 **Mission Control** - Real-time patient overview
- 🔴 **Risk Alerts** - Prioritized by severity
- 📞 **One-Click Call** - Connect with patients
- 📈 **Patient History** - Context for decisions

---

## Architecture

```
LINE App  ─────┐
               │    ┌────────────────────┐    ┌──────────────┐
LIFF Voice ────┼───▶│  Railway Backend   │───▶│   Supabase   │
               │    │  (Express + Node)  │    │  PostgreSQL  │
               │    └────────────────────┘    └──────────────┘
               │              │
               │              ▼
               │    ┌────────────────────┐
               └───▶│  Vercel Dashboard  │
                    │  (React + Tailwind)│
                    └────────────────────┘
```

---

## Deployment

### Backend (Railway)
```bash
# Push to GitHub triggers auto-deploy
git push origin main
```

### Dashboard (Vercel)
Separate repository: `hanna-nurse-dashboard`

```bash
# Vercel auto-deploys from GitHub
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/webhook` | POST | LINE webhook receiver |
| `/api/nurse/stats` | GET | Dashboard statistics |
| `/api/nurse/tasks` | GET | Task queue |
| `/api/nurse/patients` | GET | Patient list |
| `/api/voice/token` | GET | LiveKit token |
| `/api/voice/chat` | POST | Voice chat processing |
| `/health` | GET | Health check |

---

## Documentation

- [WIREFRAME.md](./WIREFRAME.md) - UX specification
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture

---

## License

Proprietary - All rights reserved.

---

**Built for healthcare. Designed for nurses. Powered by AI.**
