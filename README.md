# Hanna: Care Intelligence

> **Unified Product Specification**: See [docs/PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md) for complete architecture, user journeys, and deployment guides.

**Hanna Scribe** — Voice-first clinical documentation that turns patient conversations into structured SOAP notes in seconds.

[![Status](https://img.shields.io/badge/Status-Production-green)]()
[![Platform](https://img.shields.io/badge/Platform-PWA-blue)]()
[![AI](https://img.shields.io/badge/AI-Llama_3.3_70B-purple)]()

> **Live at**: [hanna.care/scribe/app](https://hanna.care/scribe/app)

---

## 🎯 **Product Strategy**

We build **two products** with a clear upgrade path:

| Product | Target | Price | Purpose |
|---------|--------|-------|---------|
| **Scribe** | Individual doctors, clinics | ฿0-9,990/mo | Voice-first documentation |
| **Care Intelligence** | Hospitals, large clinics | ฿50,000+/mo | Chronic disease monitoring |

**Upgrade Path**: Scribe → Care Plan → Care Intelligence

---

## 📚 **Documentation**

| Document | Purpose |
|----------|---------|
| **[PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md)** | **Unified product specification (START HERE)** |
| [SCRIBE_GUIDE.md](./docs/SCRIBE_GUIDE.md) | Scribe user manual |
| [SCRIBE_LAUNCH_CHECKLIST.md](./docs/SCRIBE_LAUNCH_CHECKLIST.md) | Launch checklist |
| [PHASE1_DISCOVERY_REPORT.md](./docs/PHASE1_DISCOVERY_REPORT.md) | Codebase analysis |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture |

---

## The Problem: Clinical Documentation Burnout

Healthcare providers spend **2+ hours daily** on documentation. Every patient encounter requires manual note-taking, pulling time away from what matters most — patient care.

**Result**: Physician burnout, reduced patient throughput, and inconsistent documentation quality.

## The Solution: Voice-First AI Scribe

Hanna Scribe listens to your patient conversations and automatically generates structured clinical notes:

1.  **Record**: Tap once to record your patient encounter (natural conversation)
2.  **Transcribe**: OpenAI Whisper converts speech to text with medical terminology accuracy
3.  **Generate**: Llama 3.3 70B creates structured SOAP notes in seconds
4.  **Review**: Edit with AI commands ("make it more concise", "add differential diagnosis")
5.  **Export**: One-click PDF export or copy to EMR

> **"From 10 minutes per note to 30 seconds. That's 4 hours back per day."**

---

## Product Suite

### 🎯 Hanna Scribe (NEW — Launching 2026)
**Voice-first clinical documentation assistant**

- **SOAP Note Generation**: Structured notes from voice recordings
- **AI Editing**: Natural language commands to refine notes
- **Multi-language**: Thai and English support
- **PDF Export**: Professional formatted clinical notes
- **Handover Summaries**: Automatic shift handover generation
- **Pricing**:
  - **Free**: 10 notes/month
  - **Pro**: ฿990/month (unlimited)
  - **Clinic**: ฿9,990/month (up to 5 providers)

### 📱 Care Intelligence (Production)
**LINE-based chronic disease monitoring for Thai hospitals**

- **Daily Check-ins**: Automated vitals, medication, symptom tracking
- **OneBrain™ Risk Engine**: Real-time deterioration detection (0-10 risk score)
- **Nurse Dashboard**: Exception-based triage queue
- **Voice AI**: Thai voice assistant via LINE
- **Target**: Mid-tier Thai NCD clinics under capitation (SSS/UCS)
- **Pricing**: ฿50,000-60,000/month per clinic

---

## Core Capabilities: Hanna Scribe

### 1. Voice Recording & Transcription
- **In-browser recording**: No app download required (PWA)
- **OpenAI Whisper-1**: 98% accuracy with medical terminology
- **Real-time feedback**: Visual orb animation during recording
- **Pause/Resume**: Flexible recording controls

### 2. AI Note Generation
- **Llama 3.3 70B**: State-of-the-art clinical reasoning
- **SOAP Format**: Structured Subjective, Objective, Assessment, Plan
- **Template Support**: SOAP, Progress Notes, Free-form
- **Multi-language**: Generates notes in Thai or English

### 3. AI-Powered Editing
- **Section Regeneration**: Regenerate individual SOAP sections
- **Hanna Commands**: Natural language editing
  - *"Make this more concise"*
  - *"Add differential diagnosis"*
  - *"Include medication dosages"*
- **Rich Text Editor**: TipTap-based WYSIWYG editing

### 4. Export & Integration
- **PDF Export**: Professional formatted notes with clinic branding
- **Copy to Clipboard**: One-click copy for EMR paste
- **Handover Reports**: Auto-generated shift summaries
- **EMR Integration**: Copy-paste workflow (HL7/FHIR coming soon)

---

## Technology Stack

### Backend (Node.js + Express)
```
├── Express.js        # REST API server
├── PostgreSQL        # Supabase (patient data, notes, users)
├── Groq SDK          # Llama 3.3 70B for note generation
├── OpenAI SDK        # Whisper-1 for transcription
├── Stripe            # Subscription billing (Pro/Clinic plans)
├── PDFKit            # PDF export generation
└── JWT               # Authentication
```

### Frontend (React PWA)
```
├── React 19          # UI framework
├── TypeScript        # Type safety
├── Vite              # Build tool
├── Tailwind CSS v4   # Styling
├── Framer Motion     # Animations
├── TipTap            # Rich text editor
├── React Router      # Navigation
└── Vite PWA          # Progressive Web App
```

### AI Pipeline
```
Audio (WebM)
  ↓
OpenAI Whisper-1 → Transcript
  ↓
Groq Llama 3.3 70B → JSON SOAP Note
  ↓
Post-processing → Structured Content
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SCRIBE PWA (hanna.care)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Home       │  │   Record     │  │   Note Editor   │   │
│  │   (Sessions) │  │   (Orb UI)   │  │   (TipTap + AI) │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API (Railway)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/scribe/*                                        │   │
│  │  - Auth (JWT + PIN)                                   │   │
│  │  - Sessions (CRUD)                                    │   │
│  │  - Transcription (Whisper)                            │   │
│  │  - Note Generation (Groq)                             │   │
│  │  - AI Editing (Regenerate, Commands)                  │   │
│  │  - Export (PDF, Text)                                 │   │
│  │  - Billing (Stripe)                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│  Supabase        │  │  Groq (Llama)    │  │  OpenAI      │
│  PostgreSQL      │  │  AI Inference    │  │  Whisper     │
└──────────────────┘  └──────────────────┘  └──────────────┘
```

---

## Database Schema (Scribe)

```sql
-- Clinicians (Scribe users)
CREATE TABLE clinicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    pin_hash VARCHAR(64) NOT NULL,
    role VARCHAR(50) DEFAULT 'doctor',
    hospital_name VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'free', -- free, pro, clinic
    stripe_customer_id VARCHAR(255),
    notes_count_this_month INTEGER DEFAULT 0,
    billing_cycle_reset TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Recording Sessions
CREATE TABLE scribe_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinician_id UUID REFERENCES clinicians(id),
    patient_name VARCHAR(255),
    patient_hn VARCHAR(100),
    template_type VARCHAR(50) DEFAULT 'soap',
    transcript TEXT,
    status VARCHAR(50) DEFAULT 'recording',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Generated Notes
CREATE TABLE scribe_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scribe_sessions(id),
    clinician_id UUID REFERENCES clinicians(id),
    content JSONB NOT NULL, -- { subjective, objective, assessment, plan }
    content_text TEXT,
    template_type VARCHAR(50),
    is_final BOOLEAN DEFAULT FALSE,
    finalized_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Note Templates
CREATE TABLE scribe_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinician_id UUID REFERENCES clinicians(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'soap',
    content JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (Supabase or local)
- Groq API Key ([groq.com](https://console.groq.com))
- OpenAI API Key ([platform.openai.com](https://platform.openai.com))
- Stripe Account (for billing)

### 1. Clone & Install
```bash
git clone https://github.com/farhaned07/hanna-line-bot.git
cd hanna-line-bot

# Install backend dependencies
npm install

# Install Scribe frontend dependencies
cd scribe
npm install
cd ..
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Required for Scribe:
#   - DATABASE_URL
#   - GROQ_API_KEY
#   - OPENAI_API_KEY (for Whisper)
#   - STRIPE_SECRET_KEY
#   - JWT_SECRET
```

### 3. Database Setup
```bash
# Run migrations
psql $DATABASE_URL < schema.sql
psql $DATABASE_URL < migrations/012_scribe_tables.sql
psql $DATABASE_URL < migrations/013_scribe_billing.sql
```

### 4. Run Locally
```bash
# Terminal 1: Backend API (port 3000)
npm start

# Terminal 2: Scribe PWA (port 5174)
cd scribe
npm run dev
```

**Access**:
- Scribe PWA: http://localhost:5174
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/scribe

---

## Deployment

### Backend (Railway)
```bash
# Connect to Railway
railway login
railway link

# Deploy
railway up
```

**Required Railway Variables**:
- `DATABASE_URL`
- `GROQ_API_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `JWT_SECRET`

### Scribe Frontend (Vercel)
```bash
cd scribe
vercel link
vercel --prod
```

**Required Vercel Variables**:
- `VITE_API_URL` (Railway backend URL)

### Stripe Webhook Setup
```bash
# Local testing
stripe listen --forward-to localhost:3000/api/scribe/billing/webhook

# Production
stripe webhook add https://your-railway-url.railway.app/api/scribe/billing/webhook
```

---

## API Reference (Scribe)

### Authentication
```http
POST /api/scribe/auth/register
Content-Type: application/json

{
  "email": "dr.somchai@hospital.go.th",
  "pin": "123456",
  "displayName": "Dr. Somchai"
}

Response:
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Recording Session
```http
POST /api/scribe/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_name": "John Doe",
  "patient_hn": "HN12345",
  "template_type": "soap"
}
```

### Transcription
```http
POST /api/scribe/transcribe
Authorization: Bearer {token}
Content-Type: multipart/form-data

audio: recording.webm
```

### Generate Note
```http
POST /api/scribe/sessions/:sessionId/generate-note
Authorization: Bearer {token}
Content-Type: application/json

{
  "templateType": "soap"
}
```

### AI Section Regeneration
```http
POST /api/scribe/notes/:noteId/regenerate-section
Authorization: Bearer {token}
Content-Type: application/json

{
  "section": "assessment",
  "instruction": "Add differential diagnosis"
}
```

### Hanna Commands
```http
POST /api/scribe/notes/:noteId/hanna-command
Authorization: Bearer {token}
Content-Type: application/json

{
  "command": "Make this more concise",
  "currentContent": { ... }
}
```

### Export PDF
```http
GET /api/scribe/export/:noteId?format=pdf
Authorization: Bearer {token}

Response: application/pdf (download)
```

### Billing Status
```http
GET /api/scribe/billing/status
Authorization: Bearer {token}

Response:
{
  "plan": "free",
  "notes_count_this_month": 7,
  "billing_cycle_reset": "2026-04-01T00:00:00Z"
}
```

### Create Checkout Session
```http
POST /api/scribe/billing/create-checkout-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "success_url": "https://hanna.care/scribe/app",
  "cancel_url": "https://hanna.care/scribe/app",
  "planType": "pro"
}

Response:
{
  "url": "https://checkout.stripe.com/..."
}
```

---

## Pricing & Business Model

### Scribe Revenue Streams
| Plan | Price | Target | Features |
|------|-------|--------|----------|
| **Free** | ฿0 | Students, Trial | 10 notes/month |
| **Pro** | ฿990/mo | Individual providers | Unlimited notes, PDF export, AI editing |
| **Clinic** | ฿9,990/mo | Small clinics (2-5 providers) | Everything in Pro + shared templates |

### Care Intelligence Revenue
| Plan | Price | Target | Features |
|------|-------|--------|----------|
| **Pilot** | ฿60,000/mo | 3-month trial | Up to 500 patients |
| **Annual** | ฿50,000/mo | Hospital contract | Up to 500 patients |
| **Overage** | ฿100/patient/mo | Beyond 500 | Per-patient pricing |

---

## Metrics & KPIs

### Scribe Success Metrics
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Time saved per note** | 4-8 minutes | Core value proposition |
| **Notes per provider/day** | 20-30 | Adoption & engagement |
| **Free → Pro conversion** | 5-8% | Product-market fit |
| **MRR growth** | 15-20%/month | Business traction |
| **Churn rate** | <5%/month | Retention quality |

### Care Intelligence Metrics
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Patient check-in rate** | >60% | Engagement quality |
| **Intervention latency** | <24 hours | Early detection |
| **Complications flagged** | Track all | Value delivered |
| **Cost avoided** | Calculate ฿ | CFO ROI proof |

---

## Documentation

### Product Documentation
- **[Scribe User Guide](./docs/SCRIBE_GUIDE.md)** — How to use Hanna Scribe
- **[Product Canon](./docs/PRODUCT_CANON.md)** — Product positioning & strategy
- **[Regulatory Posture](./docs/REGULATORY_POSTURE.md)** — Legal & safety framework

### Technical Documentation
- **[Architecture](./ARCHITECTURE.md)** — System design & components
- **[API Reference](#api-reference-scribe)** — REST API documentation
- **[Deployment Runbook](./docs/DEPLOYMENT_RUNBOOK.md)** — Production deployment guide

### Business Documentation
- **[Sales Playbook](./docs/sales/)** — Sales collateral & scripts
- **[Messaging Guide](./docs/MESSAGING_GUIDE.md)** — Language & positioning rules
- **[Internal Ops](./docs/INTERNAL_OPS_PLAYBOOK.md)** — Operations manual

---

## Roadmap

### Q1 2026 (Scribe Launch)
- ✅ Core recording & transcription
- ✅ SOAP note generation
- ✅ AI editing (regenerate + commands)
- ✅ PDF export
- ✅ Stripe billing integration
- 🚧 EMR integration (HL7/FHIR)
- 🚧 Team collaboration (Clinic plan)

### Q2 2026
- Multi-language expansion (Lao, Burmese, Vietnamese)
- Custom template builder
- EMR integrations (Epic, Cerner, local Thai EMRs)
- Voice biometrics for auto-patient identification
- Clinical decision support (drug interactions, alerts)

### Q3 2026
- Care Intelligence 2.0 (enhanced risk scoring)
- Integrated platform (Scribe + Care Intelligence dashboard)
- Multi-tenant SaaS architecture
- API marketplace for third-party integrations

---

## Team & Contact

**Built in Bangkok** 🇹🇭 for Thai healthcare providers.

- **Website**: [hanna.care](https://hanna.care)
- **Scribe App**: [hanna.care/scribe/app](https://hanna.care/scribe/app)
- **Email**: hello@hanna.care
- **LINE**: [@hannacare](https://line.me/R/ti/p/@hannacare)

---

## Legal & Compliance

- **PDPA Compliant**: Thai Personal Data Protection Act
- **HIPAA-Aligned Architecture**: Encryption, audit logs, access controls
- **Not a Medical Device**: Hanna is documentation infrastructure, not a diagnostic tool
- **Human-in-the-Loop**: All notes require clinician review before finalization

See [REGULATORY_POSTURE.md](./docs/REGULATORY_POSTURE.md) for detailed legal framework.

---

## License

© 2026 Hanna Care Intelligence. All rights reserved.

Proprietary software — not for redistribution without explicit permission.

---

**"From documentation burden to delightful care. Built for providers, by providers."**
