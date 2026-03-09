# 🏥 Hanna Care Intelligence Platform

> **Unified Product Hierarchy & Integration Guide**
> **Version**: 3.0
> **Date**: March 9, 2026
> **Status**: ✅ Production Ready

---

## 📊 Product Hierarchy Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HANNA CARE INTELLIGENCE PLATFORM                      │
│                                                                          │
│  "From episodic documentation to continuous intelligence"                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  LEVEL 1: SCRIBE (Entry Point)                                          │
│  ─────────────────────────────                                          │
│  What: Voice-first clinical documentation                               │
│  Who: Individual doctors, small clinics (1-50 providers)                │
│  Price: ฿0 → ฿990 → ฿9,990/mo                                          │
│  Value: "From 10 minutes per note to 30 seconds"                        │
│                                                                          │
│  Features:                                                               │
│  ├─ Voice Recording (Orb UI + Timer)                                    │
│  ├─ Transcription (Deepgram, 8 languages)                               │
│  ├─ SOAP Generation (Llama 3.3 70B)                                     │
│  ├─ AI Editing (Regenerate, Commands)                                   │
│  ├─ PDF Export (Professional formatting)                                │
│  ├─ Handover Summaries (Shift reports)                                  │
│  └─ Follow-up Enrollment ✨ (NEW)                                       │
│                                                                          │
│  Success Metrics:                                                        │
│  ├─ Time saved per note: 4-8 minutes                                    │
│  ├─ Notes per provider/day: 20-30                                       │
│  ├─ Free → Pro conversion: 5-8%                                         │
│  └─ Monthly Active Users: Target 100+                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ User finalizes note
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  LEVEL 2: CARE PLAN (Add-on)                                            │
│  ───────────────────────────                                            │
│  What: Automated care plan generation from Scribe notes                 │
│  Who: Existing Scribe Pro/Clinic users                                  │
│  Price: +฿2,000/mo (on top of Scribe)                                   │
│  Value: "Turn notes into actionable care plans automatically"           │
│                                                                          │
│  Features:                                                               │
│  ├─ Auto-generate from SOAP notes                                       │
│  ├─ Patient education materials (Thai + English)                        │
│  ├─ Medication schedules & reminders                                    │
│  ├─ Follow-up appointment scheduling                                    │
│  ├─ Lifestyle recommendations (diet, exercise)                          │
│  └─ Printable patient handouts                                          │
│                                                                          │
│  Success Metrics:                                                        │
│  ├─ Scribe → Care Plan conversion: 20%                                  │
│  ├─ Patient adherence rate: >70%                                        │
│  └─ Time saved creating plans: 10 minutes/patient                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Patient enrolled from Care Plan
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  LEVEL 3: FOLLOW-UP (Monitoring)                                        │
│  ────────────────────────────                                           │
│  What: 14-day automated patient monitoring via LINE                     │
│  Who: Patients from Scribe/Care Plan enrollments                        │
│  Price: Included in Care Intelligence (Enterprise)                      │
│  Value: "60% patient engagement vs. 20% with apps"                      │
│                                                                          │
│  Features:                                                               │
│  ├─ Day 1: Welcome & assessment                                         │
│  ├─ Day 3: Medication adherence check                                   │
│  ├─ Day 7: Symptom progress evaluation                                  │
│  ├─ Day 14: Final assessment & next steps                               │
│  ├─ Sentiment analysis (positive/negative/neutral)                      │
│  ├─ Nurse escalation (concerning responses)                             │
│  └─ Multi-language (Thai + English)                                     │
│                                                                          │
│  Success Metrics:                                                        │
│  ├─ Response rate: >60%                                                 │
│  ├─ Day 1 response: >80%                                                │
│  ├─ Day 14 completion: >50%                                             │
│  └─ Complications flagged early: Track all                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Aggregated data + outcomes
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  LEVEL 4: CARE INTELLIGENCE (Enterprise Platform)                       │
│  ──────────────────────────────────────                                 │
│  What: Chronic disease monitoring & population health insights          │
│  Who: Hospitals, large clinics (500+ patients)                          │
│  Price: ฿50,000-60,000/mo per clinic                                   │
│  Value: "Prevent complications before they happen"                      │
│                                                                          │
│  Features:                                                               │
│  ├─ OneBrain™ Risk Engine (0-10 scoring)                                │
│  ├─ Nurse Dashboard (Exception-based triage)                            │
│  ├─ LINE Bot (Daily check-ins, voice calls)                             │
│  ├─ Patient Follow-up (Automated 14-day programs)                       │
│  ├─ Analytics (Population health insights)                              │
│  ├─ Outcomes Reporting (Complications prevented, ROI)                   │
│  ├─ EMR Integration (HosxP, iHospital, etc.)                            │
│  └─ Multi-clinic Management (Enterprise)                                │
│                                                                          │
│  Success Metrics:                                                        │
│  ├─ Patient engagement: >60%                                            │
│  ├─ Intervention latency: <24 hours (vs. 30-90 days)                    │
│  ├─ Complications flagged early: Track all                              │
│  └─ Hospital ROI: ฿ saved per ฿ spent                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Integration Flow

### How Products Connect

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER JOURNEY                                 │
└──────────────────────────────────────────────────────────────────────────┘

Small Clinic Doctor                          Large Hospital
─────────────────                            ───────────────
                                             
1. Discovers Scribe                          1. Discovers Care Intelligence
   ↓                                            ↓
2. Signs up Free (10 notes/mo)                2. Signs Pilot (90 days)
   ↓                                            ↓
3. Upgrades to Pro (฿990/mo)                  3. Enrolls 500 patients
   ↓                                            ↓
4. Adds Care Plan (+฿2,000/mo)                4. Uses Follow-up for all patients
   ↓                                            ↓
5. Enrolls patients in Follow-up              5. Gets outcomes dashboard
   ↓                                            ↓
6. Sees value → recommends to hospital        6. Converts to annual (฿50K/mo)
   ↓                                            ↓
7. Hospital adopts Care Intelligence          7. Expands to multiple clinics
```

---

## 📈 Revenue Ladder

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    REVENUE PROGRESSION (Per Customer)                   │
└─────────────────────────────────────────────────────────────────────────┘

Tier 1: Scribe Free
├── Price: ฿0
├── Limit: 10 notes/month
├── Target: Trial, students
└── Conversion Goal: 5-8% → Pro

            │
            │ User hits limit, sees value
            ▼

Tier 2: Scribe Pro
├── Price: ฿990/mo
├── Limit: Unlimited notes
├── Target: Individual doctors
└── Conversion Goal: 20% → Care Plan

            │
            │ User wants patient education
            ▼

Tier 3: Scribe + Care Plan
├── Price: ฿2,990/mo (฿990 + ฿2,000)
├── Features: Care plan generation
├── Target: Busy clinics
└── Conversion Goal: Enterprise upsell

            │
            │ Clinic grows, needs monitoring
            ▼

Tier 4: Care Intelligence
├── Price: ฿50,000-60,000/mo
├── Features: Full platform
├── Target: Hospitals (500+ patients)
└── Goal: Annual contract, multi-clinic

─────────────────────────────────────────────────────────────────────────

Revenue Progression Example:
────────────────────────────

Month 1-3:  Scribe Free         → ฿0/mo
Month 4-6:  Scribe Pro          → ฿990/mo
Month 7-9:  Scribe + Care Plan  → ฿2,990/mo
Month 10+:  Care Intelligence   → ฿50,000+/mo

Total ARR Growth: ฿0 → ฿600,000+/year per customer
```

---

## 🎯 Target Customers by Tier

### Tier 1-2: Scribe (Individual/SMB)

| Segment | Size | Price Sensitivity | Sales Motion |
|---------|------|-------------------|--------------|
| **Residents/Fellows** | 500+ in Thailand | High (Free → Pro) | Self-serve |
| **Private Clinic Doctors** | 2,000+ | Medium (฿990/mo OK) | Self-serve + demo |
| **Small Clinics (1-5 doctors)** | 500+ | Medium (฿9,990/mo OK) | Demo + trial |
| **Medium Clinics (5-50 doctors)** | 100+ | Low (Budget approved) | Sales call |

### Tier 3-4: Care Plan + Care Intelligence (Enterprise)

| Segment | Size | Budget | Sales Motion |
|---------|------|--------|--------------|
| **Mid-tier Hospitals** | 20-30 in Thailand | ฿50K-100K/mo | Pilot → Annual |
| **Large Hospital Chains** | 5-10 (BDMS, BH, etc.) | ฿200K-500K/mo | Enterprise deal |
| **Government Hospitals** | 50+ (SSS/UCS) | ฿50K-200K/mo | Tender process |
| **Regional Expansion** | Laos, Cambodia, Myanmar | Similar pricing | Partner-led |

---

## 🏗️ Technical Architecture by Tier

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SHARED INFRASTRUCTURE                           │
│                                                                          │
│  Backend API (Railway)                                                   │
│  ├─ Authentication (JWT)                                                 │
│  ├─ Database (Supabase PostgreSQL)                                       │
│  ├─ AI Services (Groq Llama 3.3, Deepgram)                               │
│  ├─ LINE Integration                                                     │
│  └─ Stripe Billing                                                       │
│                                                                          │
│  Frontend (Vercel)                                                       │
│  ├─ Scribe PWA (hanna.care/scribe/app)                                   │
│  ├─ Nurse Dashboard (hanna.care/dashboard)                               │
│  └── Landing Page (hanna.care)                                           │
│                                                                          │
│  External Services                                                       │
│  ├─ Supabase (Database)                                                  │
│  ├─ Groq (AI inference)                                                  │
│  ├─ Deepgram (Transcription)                                             │
│  ├─ LINE (Messaging)                                                     │
│  ├─ LiveKit (Voice)                                                      │
│  └─ Stripe (Payments)                                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         TIER-SPECIFIC FEATURES                          │
│                                                                          │
│  Scribe (P0 Priority)                                                    │
│  ├─ /api/scribe/* (Sessions, Notes, Templates)                           │
│  ├─ /api/scribe/billing/* (Free/Pro/Clinic)                              │
│  └─ PWA Components (Record, Process, NoteEditor)                         │
│                                                                          │
│  Care Plan (P1 Priority - TO BUILD)                                      │
│  ├─ /api/careplan/* (Generate, Edit, Export)                             │
│  ├─ Patient education templates                                          │
│  └─ Care plan editor UI                                                  │
│                                                                          │
│  Follow-up (P0 Priority - JUST SHIPPED)                                  │
│  ├─ /api/followup/* (Enroll, Messages, Responses)                        │
│  ├─ Message scheduler (Hourly)                                           │
│  ├─ Sentiment analysis                                                   │
│  └─ FollowupEnrollmentModal (Scribe integration)                         │
│                                                                          │
│  Care Intelligence (P0 Priority)                                         │
│  ├─ /api/nurse/* (Tasks, Dashboard, Stats)                               │
│  ├─ OneBrain™ risk engine                                                │
│  ├─ LINE Bot webhook handlers                                            │
│  └─ Analytics & reporting                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Between Tiers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA INTEGRATION                                │
└─────────────────────────────────────────────────────────────────────────┘

Scribe Session
    │
    │ Doctor finalizes note
    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│  SOAP Note Created                                                      │
│  ├─ Subjective                                                          │
│  ├─ Objective                                                           │
│  ├─ Assessment                                                          │
│  └─ Plan                                                                │
└─────────────────────────────────────────────────────────────────────────┘
    │
    │ Auto-trigger (if Care Plan enabled)
    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│  Care Plan Generated                                                    │
│  ├─ Medications (from Plan section)                                     │
│  ├─ Follow-up schedule (from Assessment)                                │
│  ├─ Patient education (condition-specific)                              │
│  └─ Lifestyle recommendations                                           │
└─────────────────────────────────────────────────────────────────────────┘
    │
    │ Patient consents to monitoring
    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│  Follow-up Enrollment                                                   │
│  ├─ Day 1 message sent (immediate)                                      │
│  ├─ Day 3, 7, 14 scheduled                                              │
│  ├─ Responses tracked                                                   │
│  └─ Escalations created (if concerning)                                 │
└─────────────────────────────────────────────────────────────────────────┘
    │
    │ All data aggregated
    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│  Care Intelligence Dashboard                                            │
│  ├─ Patient risk scores (0-10)                                          │
│  ├─ Nurse task queue (Exception-based)                                  │
│  ├─ Population health insights                                          │
│  └─ Outcomes reporting (ROI for CFO)                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Success Metrics by Tier

### Scribe Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time saved per note** | 4-8 minutes | User surveys + analytics |
| **Notes per provider/day** | 20-30 | Backend analytics |
| **Free → Pro conversion** | 5-8% | Stripe data |
| **Pro → Clinic conversion** | 10-15% | Stripe data |
| **Monthly Active Users** | 100+ | Login analytics |
| **Churn rate** | <5%/month | Subscription data |

### Care Plan Metrics (Projected)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Scribe → Care Plan conversion** | 20% | Enrollment data |
| **Care plans generated/month** | 500+ | Backend analytics |
| **Patient adherence rate** | >70% | Follow-up responses |
| **Time saved creating plans** | 10 minutes/patient | User surveys |

### Follow-up Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Enrollment rate** | >60% | Enrollments / Scribe notes |
| **Response rate** | >60% | Responses / Messages sent |
| **Day 1 response** | >80% | Day 1 responses / Day 1 messages |
| **Day 14 completion** | >50% | Day 14 responses / Day 14 messages |
| **Nurse escalations** | Track all | nurse_tasks table |

### Care Intelligence Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Patient engagement** | >60% | Daily check-ins / Active patients |
| **Intervention latency** | <24 hours | Issue detected → Nurse action |
| **Complications flagged** | Track all | nurse_tasks with type='complication' |
| **Hospital ROI** | 5:1 | ฿ saved / ฿ spent |
| **Pilot → Annual conversion** | >70% | Contract data |

---

## 🚀 Roadmap by Tier

### Q2 2026 (Apr-Jun)

| Tier | Feature | Priority |
|------|---------|----------|
| **Scribe** | Offline mode (cache last 50 notes) | P0 |
| **Scribe** | Search & filter | P1 |
| **Scribe** | Template library (common phrases) | P1 |
| **Care Plan** | Spec + design | P0 |
| **Care Plan** | Build MVP | P0 |
| **Follow-up** | Outcomes dashboard | P0 |
| **Care Intelligence** | EMR integration (HosxP) | P1 |

### Q3 2026 (Jul-Sep)

| Tier | Feature | Priority |
|------|---------|----------|
| **Scribe** | Team collaboration (Clinic plan features) | P1 |
| **Care Plan** | Patient education library (50+ conditions) | P1 |
| **Follow-up** | Vitals integration (glucose, BP) | P1 |
| **Care Intelligence** | Multi-clinic management | P2 |
| **Care Intelligence** | Predictive analytics (ML-based) | P2 |

### Q4 2026 (Oct-Dec)

| Tier | Feature | Priority |
|------|---------|----------|
| **Scribe** | EMR integrations (copy-paste → API) | P1 |
| **Care Plan** | Medication interaction checking | P2 |
| **Follow-up** | Voice-based responses | P2 |
| **Care Intelligence** | Regional expansion (Laos, Cambodia) | P1 |
| **Platform** | Unified analytics dashboard | P0 |

---

## 💰 Pricing Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRICING MATRIX                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  SCRIBE (Individual/SMB)                                                │
├─────────────────────────────────────────────────────────────────────────┤
│  Free       │ ฿0/mo        │ 10 notes/month           │ Self-serve     │
│  Pro        │ ฿990/mo      │ Unlimited notes          │ Self-serve     │
│  Clinic     │ ฿9,990/mo    │ Up to 5 providers        │ Sales-assisted │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  CARE PLAN (Add-on)                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  Add-on     │ +฿2,000/mo   │ For Scribe Pro/Clinic    │ Upsell         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  FOLLOW-UP (Included in Care Intelligence)                              │
├─────────────────────────────────────────────────────────────────────────┤
│  Included   │ Part of      │ With Care Intelligence   │ Enterprise     │
│             │ Enterprise   │ platform                 │                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  CARE INTELLIGENCE (Enterprise)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Pilot      │ ฿60,000/mo   │ 90 days, 500 patients    │ Pilot → Annual │
│  Annual     │ ฿50,000/mo   │ Per clinic, 500 patients │ Contract       │
│  Overage    │ ฿100/patient │ Beyond 500 patients      │ Add-on         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Competitive Positioning

### By Tier

| Competitor | Scribe | Care Plan | Follow-up | Care Intelligence |
|------------|--------|-----------|-----------|-------------------|
| **Nuance DAX** | 🔴 Direct | ❌ No | ❌ No | ❌ No |
| **DeepScribe** | 🔴 Direct | ❌ No | ❌ No | ❌ No |
| **Abridge** | 🔴 Direct | ⚠️ Basic | ❌ No | ❌ No |
| **Thai EMRs** | ⚠️ Feature | ⚠️ Basic | ⚠️ Basic | 🔴 Direct |
| **LINE Healthcare** | ❌ No | ❌ No | 🔴 Direct | ⚠️ Potential |
| **Teladoc/Livongo** | ❌ No | ❌ No | ⚠️ Similar | 🔴 Direct |

### Our Advantage

| Tier | Competitive Moat |
|------|------------------|
| **Scribe** | Thai language, LINE integration, pricing |
| **Care Plan** | Auto-generation from Scribe (unique) |
| **Follow-up** | 60% engagement (vs. 20% for apps) |
| **Care Intelligence** | OneBrain™ risk engine, nurse workflow |

---

## 📞 Go-to-Market by Tier

### Scribe (Self-Serve)

```
Awareness → Landing Page → Free Trial → Upgrade
    │           │              │           │
    │           │              │           └─ In-app prompts
    │           │              └─ Email nurture
    │           └─ SEO, content, referrals
    └─ Social media, medical associations
```

### Care Intelligence (Enterprise Sales)

```
Awareness → Discovery Call → Pilot (90 days) → Annual Contract
    │            │               │                  │
    │            │               │                  └─ CNO/VP Medical
    │            │               └─ Success manager
    │            └─ Sales deck, ROI calc
    └─ Medical conferences, partnerships
```

---

**"From episodic documentation to continuous intelligence."**

*Last Updated: March 9, 2026*
*Next Review: June 9, 2026*
