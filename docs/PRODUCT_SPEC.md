# Hanna — Unified Product Specification

> **Version**: 2.0 (Scribe-First Strategy)  
> **Date**: March 5, 2026  
> **Status**: Production Ready  
> **Single Source of Truth**: This document

---

## 📋 **Table of Contents**

1. [Product Overview](#1-product-overview)
2. [Product Hierarchy](#2-product-hierarchy)
3. [Scribe Specification](#3-scribe-specification)
4. [Care Intelligence Specification](#4-care-intelligence-specification)
5. [Integration Strategy](#5-integration-strategy)
6. [Repository Map](#6-repository-map)
7. [Deployment Guide](#7-deployment-guide)
8. [Roadmap](#8-roadmap)

---

## 1. Product Overview

### **Vision**

Hanna provides **voice-first clinical documentation** that evolves into a **comprehensive care intelligence platform** for healthcare providers.

### **Mission**

> "Doctor speaks. AI writes. Care improves."

### **Products**

We build **two products** with a clear upgrade path:

| Product | Target | Price | Purpose |
|---------|--------|-------|---------|
| **Scribe** | Individual doctors, small clinics | ฿1,990-4,990/mo | Voice-first documentation |
| **Care Intelligence** | Hospitals, large clinics | ฿50,000+/mo | Chronic disease monitoring |

### **Business Model**

```
Scribe (Entry Point)
    ↓ (trust built)
Care Plan (Add-on)
    ↓ (enterprise upgrade)
Care Intelligence (Full Platform)
    ├── LINE Bot Integration
    ├── Nurse Dashboard
    └── Patient Follow-up
```

---

## 2. Product Hierarchy

### **Level 1: Scribe** (Launch Priority)

**What**: Voice-first clinical documentation assistant

**Value Prop**: "From 10 minutes per note to 30 seconds"

**Features**:
- Voice recording → SOAP notes in 60 seconds
- Multilingual (Thai, Bangla, English + 5 more)
- AI-powered editing
- PDF export
- Shift handover summaries

**Pricing**:
- Free: 10 notes/month
- Pro: ฿1,990/month (unlimited)
- Clinic: ฿4,990/month (up to 5 providers)

**Target**: Individual doctors, small clinics (1-50 providers)

---

### **Level 2: Care Plan** (Future Add-on)

**What**: Automated care plan generation from Scribe notes

**Value Prop**: "Turn notes into actionable care plans automatically"

**Features** (Planned):
- Auto-generate care plans from SOAP notes
- Patient education materials
- Follow-up reminders
- Medication adherence tracking

**Pricing**: +฿2,000/month on top of Scribe

**Target**: Existing Scribe users who want more

---

### **Level 3: Care Intelligence** (Enterprise)

**What**: Chronic disease monitoring platform

**Value Prop**: "Prevent complications before they happen"

**Features**:
- **LINE Bot**: Daily patient check-ins via LINE
- **Nurse Dashboard**: Exception-based triage queue
- **OneBrain™ Risk Engine**: Real-time risk scoring (0-10)
- **Patient Follow-up**: Automated follow-up workflows
- **Analytics**: Population health insights

**Pricing**: ฿50,000-60,000/month per clinic (up to 500 patients)

**Target**: Hospitals, large clinics (capitation-based)

---

## 3. Scribe Specification

### **3.1 User Journey**

```
Landing Page (hanna.care)
    ↓ Click "Try Free"
Login/Register
    ↓
Onboarding (3 screens)
    ↓
Home (Session List)
    ↓ Tap FAB (+)
New Session (Patient Name + HN + Template)
    ↓ Start Recording
Recording (Orb + Timer + Haptic)
    ↓ Tap Done
Processing (Upload → Transcribe → Generate)
    ↓ Auto-navigate
Note View (SOAP sections)
    ↓ Tap Edit
Note Editor (AI commands + regenerate)
    ↓ Tap Finalize
Finalized Note (Copy/PDF/Export)
```

### **3.2 Key Features**

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Voice Recording | ✅ Live | P0 | Orb UI + 56px timer |
| Transcription | ✅ Live | P0 | Deepgram API |
| SOAP Generation | ✅ Live | P0 | Groq Llama 3.3 70B |
| Note Editor | ✅ Live | P0 | TipTap rich text |
| AI Commands | ✅ Live | P1 | "Make concise", etc. |
| PDF Export | ✅ Live | P0 | PDFKit |
| Handover Summary | ✅ Live | P2 | Shift summaries |
| Swipe Gestures | ✅ Live | P1 | Delete/Export |
| Haptic Feedback | ✅ Live | P2 | Vibration on actions |
| Keyboard Shortcuts | ✅ Live | P2 | Cmd+N, Cmd+S, etc. |
| Multilingual | ✅ Live | P0 | 8 languages |
| Offline Mode | ❌ Missing | P0 | Cache last 50 notes |
| Search | ❌ Missing | P1 | Filter sessions |
| Templates | ❌ Missing | P1 | Common phrases |

### **3.3 Technology Stack**

**Frontend (Vercel)**:
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- Framer Motion (animations)
- TipTap (rich text editor)
- PWA (offline support - TODO)

**Backend (Railway)**:
- Node.js + Express
- PostgreSQL (Supabase)
- Deepgram (transcription)
- Groq (Llama 3.3 70B for notes)
- Stripe (billing)
- PDFKit (PDF export)

---

## 4. Care Intelligence Specification

### **4.1 Components**

#### **A. LINE Bot**

**Purpose**: Patient communication channel

**Features**:
- Rich Menu (6 buttons)
- Daily check-ins (vitals, meds, symptoms)
- Voice calls via LIFF
- Emergency keyword detection

**Deployment**: Backend API (Railway)

---

#### **B. Nurse Dashboard**

**Purpose**: Exception-based triage for nurses

**Features**:
- Mission Control (critical alerts)
- Monitoring View (full task queue)
- Patient Detail (individual patient view)
- Risk Distribution (cohort health view)

**Deployment**: Vercel (separate repo)

---

#### **C. OneBrain™ Risk Engine**

**Purpose**: Real-time risk scoring

**Formula**:
```
Risk Score (0-10) = 
  Emergency keywords (+3 or immediate CRITICAL)
  + Dangerous vitals (glucose >400 or <70, BP >180) (+3)
  + Missed medications (+2)
  + Worsening trends (+1)
  + Silence >48 hours (+1)
  + Age >70 (1.2x multiplier)
```

**Deployment**: Backend API (Railway)

---

### **4.2 Technology Stack**

Same as Scribe, plus:
- LINE Bot SDK
- LiveKit (voice WebRTC)
- EdgeTTS (Thai text-to-speech)

---

## 5. Integration Strategy

### **Current State (Separate)**

```
Scribe          Care Intelligence
  │                    │
  │                    │
  └───────┬────────────┘
          │
    Shared Backend (Railway)
```

### **Future State (Integrated)**

```
Scribe (Entry Point)
    │
    │ (upgrade path)
    ↓
Care Plan (Add-on)
    │
    │ (enterprise upgrade)
    ↓
Care Intelligence (Full Platform)
    ├── Scribe Data (notes → care plans)
    ├── LINE Bot (patient monitoring)
    └── Nurse Dashboard (triage)
```

### **Integration Points**

1. **Shared Authentication**: Same user accounts for both products
2. **Shared Backend**: Single API on Railway
3. **Data Flow**: Scribe notes → Care Plans → Risk Scoring
4. **Upgrade Path**: In-app upgrade from Scribe → Care Intelligence

---

## 6. Repository Map

### **Active Repositories**

| Repo | Purpose | Platform | URL |
|------|---------|----------|-----|
| **hanna-line-bot** | Backend API | GitHub | github.com/farhaned07/hanna-line-bot |
| **Hanna-Ai-Nurse** | Landing Page | GitHub | github.com/farhaned07/Hanna-Ai-Nurse |
| **hanna-nurse-dashboard** | Nurse Dashboard | GitHub | github.com/farhaned07/hanna-nurse-dashboard |

### **Folder Structure (hanna-line-bot)**

```
hanna-line-bot/ (CURRENT FOLDER)
├── src/                    # Backend API
│   ├── routes/            # API routes (scribe.js, nurse.js)
│   ├── services/          # Business logic (deepgram.js, groq.js)
│   ├── handlers/          # LINE webhook handlers
│   └── config/            # Configuration
│
├── scribe/                # Scribe PWA
│   ├── src/
│   │   ├── pages/        # Login, Home, Record, Processing, NoteView
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom hooks
│   │   └── api/          # API client
│   ├── dist/             # Build output
│   └── package.json
│
├── client/                # Nurse Dashboard (Care Intelligence)
│   ├── src/
│   └── package.json
│
├── public/                # Static files (call.html, index.html)
├── docs/                  # Documentation
├── migrations/            # Database migrations
├── scripts/               # Utility scripts
├── tests/                 # Test files
└── package.json           # Main backend dependencies
```

### **Archived Folders** (Read-Only)

Located in `/Users/mac/hanna-archives/`:
- `hanna-line-bot-1/` — Old backend backup
- `hanna-line-bot-2/` — Old backend backup
- `hanna-nurse-dashboard-1/` — Old dashboard backup
- `hannah-server/` — Very old server code
- `hanna-web/` — LINE voice interface (removed per request)

---

## 7. Deployment Guide

### **Backend API (Railway)**

**URL**: `https://hanna-line-bot-production.up.railway.app`

**Deploy**:
```bash
cd /Users/mac/hanna-line-bot-3
git push origin main
# Railway auto-deploys on push
```

**Environment Variables** (Railway Dashboard):
- `DATABASE_URL`
- `GROQ_API_KEY`
- `DEEPGRAM_API_KEY`
- `STRIPE_SECRET_KEY`
- `JWT_SECRET`

---

### **Scribe PWA (Vercel)**

**URL**: `https://hanna.care/scribe/app`

**Deploy**:
```bash
cd /Users/mac/hanna-line-bot-3/scribe
vercel --prod --yes
```

**Environment Variables** (Vercel Dashboard):
- `VITE_API_URL=https://hanna-line-bot-production.up.railway.app`

---

### **Landing Page (Vercel)**

**URL**: `https://hanna.care`

**Repo**: `Hanna-Ai-Nurse`

**Deploy**:
```bash
cd /Users/mac/Hanna-Ai-Nurse
vercel --prod --yes
```

---

### **Nurse Dashboard (Vercel)**

**URL**: TBD (needs verification)

**Repo**: `hanna-nurse-dashboard`

**Deploy**:
```bash
cd /Users/mac/hanna-line-bot-3/client
vercel --prod --yes
```

**Note**: The main `vercel.json` deploys `/client` folder to Vercel

---

## 8. Roadmap

### **Phase 1: Scribe Launch** (NOW — March 2026)

**Goal**: Launch Scribe with 100 paying users

**Features**:
- ✅ Voice recording + transcription
- ✅ SOAP generation
- ✅ Note editor + AI commands
- ✅ PDF export
- ✅ Stripe billing
- ✅ Multilingual (8 languages)
- ❌ Offline mode (P0 — missing)
- ❌ Search (P1 — missing)
- ❌ Templates (P1 — missing)

**Metrics**:
- 100 paying users
- 1,000 notes/month
- 5% free→pro conversion

---

### **Phase 2: Care Plan** (Q2 2026)

**Goal**: Launch Care Plan add-on

**Features**:
- Auto-generate care plans from notes
- Patient education materials
- Follow-up reminders
- Medication adherence tracking

**Metrics**:
- 20% of Scribe users upgrade
- ฿200,000 MRR from Care Plan

---

### **Phase 3: Care Intelligence 2.0** (Q3 2026)

**Goal**: Integrate Scribe + Care Intelligence

**Features**:
- Scribe notes → Care Plans integration
- Enhanced Nurse Dashboard
- Patient follow-up via LINE
- Population health analytics

**Metrics**:
- 10 hospital contracts
- ฿2M MRR from Care Intelligence

---

### **Phase 4: Scale** (Q4 2026)

**Goal**: Regional expansion

**Features**:
- Multi-language expansion (Lao, Burmese, Vietnamese)
- EMR integration (HL7/FHIR)
- Team collaboration features
- Desktop dashboard (admin only)

**Metrics**:
- 1,000 paying Scribe users
- 50 hospital contracts
- ฿10M MRR total

---

## 📊 **Definition of Done**

A feature is "done" when:
- [ ] Works on mobile (iOS + Android)
- [ ] Works on desktop (responsive)
- [ ] Has error states
- [ ] Has loading states
- [ ] Has empty states
- [ ] Tested on slow internet
- [ ] Keyboard shortcuts work
- [ ] Multilingual (all 8 languages)
- [ ] Accessibility (44px+ touch targets)
- [ ] Documented in this spec

---

## 🔗 **Related Documents**

| Document | Purpose | Location |
|----------|---------|----------|
| **SCRIBE_GUIDE.md** | Scribe user manual | `/docs/SCRIBE_GUIDE.md` |
| **SCRIBE_LAUNCH_CHECKLIST.md** | Scribe launch prep | `/docs/SCRIBE_LAUNCH_CHECKLIST.md` |
| **SCRIBE_E2E_TEST_SCRIPT.md** | Scribe testing | `/docs/SCRIBE_E2E_TEST_SCRIPT.md` |
| **PHASE1_DISCOVERY_REPORT.md** | Codebase analysis | `/docs/PHASE1_DISCOVERY_REPORT.md` |
| **ARCHITECTURE.md** | System design | `/ARCHITECTURE.md` |
| **REGULATORY_POSTURE.md** | Legal framework | `/docs/REGULATORY_POSTURE.md` |

---

**This is the single source of truth for all Hanna product development.**

Any new feature must:
1. Fit within this architecture
2. Follow mobile-first principles
3. Be documented here before coding starts
