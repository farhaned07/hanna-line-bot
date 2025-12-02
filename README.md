# Hanna AI Nurse - LINE Bot MVP

**Version**: 2.0 (Hybrid Model)  
**Status**: Production  
**Deployment**: Railway

---

## Overview

Hanna is a **hybrid conversational AI nurse** for chronic disease management in Thailand, combining:
- **LINE Bot** for asynchronous care (reminders, logging, scheduled check-ins)
- **Gemini Live** for real-time voice conversations (consultations, urgent care)

### System Architecture

```
┌─────────────────────────────────────────┐
│         PATIENT TOUCHPOINTS              │
│                                          │
│  LINE Chat ◄──────────► Hanna Web       │
│    Bot          LIFF       (Gemini Live)│
└─────────────────────────────────────────┘
           │                    │
           │ Webhook            │ WebSocket
           ▼                    ▼
┌─────────────────────────────────────────┐
│       Hanna Backend (Railway)            │
│  • Message Router                        │
│  • Gemini Live Service                   │
│  • Cron Scheduler                        │
│  • Database (Supabase)                   │
└─────────────────────────────────────────┘
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Ensure PostgreSQL is running (or use Supabase)
# Create a database (e.g., hanna_db)
psql -d hanna_db -f schema.sql
```

### 3. Environment Variables
```bash
cp .env.example .env
# Edit .env with your credentials:
# - LINE_CHANNEL_SECRET
# - LINE_CHANNEL_ACCESS_TOKEN
# - GEMINI_API_KEY
# - DATABASE_URL
# - SUPABASE_URL
# - SUPABASE_KEY
```

### 4. Run Server
```bash
npm start
```

### 5. Expose to Internet (for LINE Webhook)
```bash
ngrok http 3000
# Copy the HTTPS URL and set it as the Webhook URL in LINE Developers Console
# Example: https://xxxx.ngrok-free.app/webhook
```

---

## Features

### LINE Bot (Asynchronous)
- ✅ **Onboarding**: 5-step flow to collect user info
- ✅ **Payment**: PromptPay QR generation for subscription
- ✅ **Daily Messages**: 
  - 8:00 AM: Morning check-in
  - 7:00 PM: Medication reminder
- ✅ **Health Logging**: Track glucose, medication adherence
- ✅ **Voice Messages**: Upload audio → Gemini processes → TTS response

### Gemini Live (Real-time)
- ✅ **Real-time Voice**: Bidirectional audio streaming
- ✅ **Low Latency**: < 1 second response time
- ✅ **Natural Conversation**: Context preservation, interruption handling
- ✅ **LIFF Interface**: Push-to-talk web app
- ✅ **Thai Voice**: Native Thai speech (Puck voice)

---

## Conversational Quality

| Channel | Latency | Context | Natural Flow | Rating |
|---------|---------|---------|--------------|--------|
| **LINE Bot** | 5-10s | ❌ Limited | ⚠️ Menu-driven | ⭐⭐⭐ |
| **Gemini Live** | < 1s | ✅ Full | ✅ Continuous | ⭐⭐⭐⭐⭐ |

**Recommendation**: Use LINE for scheduled tasks, Gemini Live for conversations.

See [CONVERSATIONAL_ANALYSIS.md](./CONVERSATIONAL_ANALYSIS.md) for detailed evaluation.

---

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture
- **[WIREFRAME.md](./WIREFRAME.md)** - User journey and UI flows
- **[CONVERSATIONAL_ANALYSIS.md](./CONVERSATIONAL_ANALYSIS.md)** - Conversational quality analysis
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Railway deployment guide
- **[docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Database setup
- **[docs/RICH_MENU_GUIDE.md](./docs/RICH_MENU_GUIDE.md)** - LINE rich menu

---

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **WebSocket**: ws library
- **Scheduler**: node-cron
- **Database**: PostgreSQL (Supabase)

### AI Services
- **Gemini 2.0 Flash** - Audio processing, text generation
- **Gemini 2.0 Live API** - Real-time voice streaming
- **Google Cloud TTS** - Thai text-to-speech

### Frontend (LIFF)
- **Framework**: React + Vite
- **UI**: Tailwind CSS, Framer Motion
- **LINE**: @line/liff SDK

---

## Project Structure

```
hanna-line-bot/
├── src/
│   ├── index.js                 # Main server (Express + WebSocket)
│   ├── handlers/
│   │   ├── router.js            # Message routing logic
│   │   ├── onboarding.js        # User registration flow
│   │   ├── payment.js           # PromptPay integration
│   │   └── healthData.js        # Health logging
│   ├── services/
│   │   ├── geminiLive.js        # Gemini Live WebSocket service
│   │   ├── gemini.js            # Gemini audio processing
│   │   ├── tts.js               # Google Cloud TTS
│   │   ├── line.js              # LINE SDK wrapper
│   │   └── db.js                # Database connection
│   └── scheduler/
│       └── index.js             # Cron jobs (daily reminders)
├── hanna-web/                   # LIFF app (Gemini Live interface)
│   ├── src/
│   │   ├── App.jsx              # Main LIFF component
│   │   └── hooks/
│   │       └── useGeminiLive.js # WebSocket hook
├── schema.sql                   # Database schema
├── package.json
└── README.md
```

---

## API Endpoints

### LINE Webhook
```
POST /webhook
```
Receives events from LINE Platform (messages, follows, postbacks)

### Gemini Live WebSocket
```
WS /api/voice/live?userId={userId}
```
Real-time bidirectional audio streaming

### Health Check
```
GET /health
```
Returns `OK` if database is reachable

---

## Environment Variables

```bash
# LINE
LINE_CHANNEL_SECRET=xxx
LINE_CHANNEL_ACCESS_TOKEN=xxx
LIFF_ID=2008593893-Bj5k3djg

# Gemini
GEMINI_API_KEY=xxx

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Supabase (for storage)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx

# Server
PORT=3000
```

---

## Deployment

**Platform**: Railway  
**URL**: `https://hanna-line-bot-production.up.railway.app`

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

---

## Development Roadmap

### ✅ Completed (v2.0)
- LINE bot with onboarding and payment
- Gemini Live real-time voice
- LIFF web interface
- Database schema and migrations
- Scheduled reminders

### 🚧 In Progress
- Conversation context (memory across turns)
- Smart channel routing (auto-suggest Gemini Live)
- Unified conversation logging

### 📋 Planned
- Rich menu (persistent buttons)
- Family notifications (group chat)
- Nurse dashboard (web interface)
- Emotion detection (voice tone)
- Video support (visual consultation)

---

## Contributing

This is an MVP project for chronic disease management in Thailand. Contributions are welcome!

---

## License

ISC

---

## Support

For issues or questions:
1. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system details
2. Review [CONVERSATIONAL_ANALYSIS.md](./CONVERSATIONAL_ANALYSIS.md) for design rationale
3. See [docs/](./docs/) for deployment and setup guides

