# 📋 Hanna Care Plan — Product Specification

**Version**: 1.0.0
**Date**: March 9, 2026
**Status**: 🟡 **SPECIFICATION COMPLETE — READY FOR BUILD**
**Priority**: P0 (Gap in product ladder)

---

## 📋 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [User Journey](#3-user-journey)
4. [Features Specification](#4-features-specification)
5. [Technical Architecture](#5-technical-architecture)
6. [API Specification](#6-api-specification)
7. [UI/UX Specification](#7-uiux-specification)
8. [Integration with Scribe](#8-integration-with-scribe)
9. [Success Metrics](#9-success-metrics)
10. [Roadmap](#10-roadmap)

---

## 1. Executive Summary

### What is Hanna Care Plan?

**Hanna Care Plan** is an **automated care plan generation system** that transforms Scribe SOAP notes into actionable, patient-ready care plans.

### The Problem

After a consultation, doctors spend **10-15 minutes** manually creating:
- Patient education materials
- Medication schedules
- Follow-up instructions
- Lifestyle recommendations

This is **repetitive, time-consuming work** that takes away from patient care.

### The Solution

Care Plan **auto-generates** all of this from the Scribe SOAP note in **30 seconds**:

```
Scribe Note (SOAP)
    ↓
AI Processing (Llama 3.3)
    ↓
Care Plan (Ready to print/send)
    ↓
Patient receives via LINE/PDF
```

### Value Proposition

| Stakeholder | Value |
|-------------|-------|
| **Doctors** | Save 10 minutes per patient → 2+ hours/day |
| **Patients** | Clear, actionable instructions in their language |
| **Clinic** | Better adherence → Better outcomes → More referrals |

### Pricing

- **Add-on for Scribe Pro**: +฿2,000/mo
- **Included in Scribe Clinic**: No extra cost
- **Standalone**: Not available (must have Scribe)

### Target Conversion

- **Scribe Pro → Care Plan**: 20%
- **Expected MRR impact**: +฿40,000/mo per 20 users

---

## 2. Product Overview

### What Care Plan Is

✅ **Automated generation** from Scribe SOAP notes
✅ **Patient education** materials (Thai + English)
✅ **Medication schedules** with reminders
✅ **Follow-up appointment** scheduling
✅ **Lifestyle recommendations** (diet, exercise)
✅ **Printable/PDF** patient handouts
✅ **LINE delivery** to patients

### What Care Plan Is NOT

❌ **Not a replacement** for clinical judgment
❌ **Not a diagnosis tool** (uses existing SOAP note)
❌ **Not standalone** (requires Scribe subscription)
❌ **Not an EMR** (doesn't store full patient records)

---

## 3. User Journey

### 3.1 Doctor Journey (Care Plan Creation)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 1: Complete Scribe Note                                           │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Record patient consultation                                         │
│  2. Review generated SOAP note                                          │
│  3. Edit if needed                                                      │
│  4. Tap "Finalize"                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 2: Care Plan Modal Appears                                        │
├─────────────────────────────────────────────────────────────────────────┤
│  "Generate Care Plan for this patient?"                                 │
│                                                                         │
│  [Preview Care Plan]  [Skip]  [Generate]                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 3: Review & Customize                                             │
├─────────────────────────────────────────────────────────────────────────┤
│  Auto-generated sections:                                               │
│  ├─ Medications (from Plan section)                                     │
│  ├─ Follow-up schedule                                                  │
│  ├─ Patient education                                                   │
│  └─ Lifestyle recommendations                                           │
│                                                                         │
│  Doctor can:                                                            │
│  ├─ Edit any section                                                    │
│  ├─ Add custom instructions                                             │
│  └─ Select language (Thai/English)                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 4: Deliver to Patient                                             │
├─────────────────────────────────────────────────────────────────────────┤
│  Delivery options:                                                      │
│  ├─ Send via LINE (if patient enrolled)                                 │
│  ├─ Print PDF (for clinic handout)                                      │
│  └─ Download PDF (for email)                                            │
│                                                                         │
│  [Send via LINE]  [Print PDF]  [Download]  [Done]                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Patient Journey (Care Plan Receipt)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 1: Receive Care Plan via LINE                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  LINE Message from Hanna:                                               │
│  "สวัสดีค่ะ คุณสมชาย                                                      │
│                                                                         │
│  หมอได้ส่งแผนการดูแลรักษาของคุณแล้วค่ะ                                   │
│                                                                         │
│  [ดูแผนการรักษา]  [ดาวน์โหลด PDF]"                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 2: View Care Plan                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  Mobile-friendly view with:                                             │
│  ├─ Medications (with icons)                                            │
│  ├─ Schedule (calendar view)                                            │
│  ├─ Do's & Don'ts (visual)                                              │
│  └─ Emergency contacts                                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 3: Set Reminders                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  "ตั้งการแจ้งเตือนกินยา?" (Set medication reminders?)                  │
│                                                                         │
│  [Set Reminders]  [Later]                                               │
│                                                                         │
│  If Yes:                                                                │
│  ├─ Morning: 8:00 AM ✅                                                 │
│  ├─ Afternoon: 12:00 PM ✅                                              │
│  └─ Evening: 8:00 PM ✅                                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Features Specification

### 4.1 Auto-Generation from SOAP

**Input**: Scribe SOAP note (structured JSON)

```json
{
  "subjective": "Patient reports increased thirst and frequent urination for 2 weeks",
  "objective": "BP 145/90, FBS 285 mg/dL, HbA1c 8.5%",
  "assessment": "Type 2 Diabetes Mellitus, uncontrolled",
  "plan": "Start Metformin 500mg BID, lifestyle modification, follow-up in 2 weeks"
}
```

**Output**: Care Plan (structured JSON)

```json
{
  "medications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "timing": "Morning & Evening",
      "instructions": "Take with food to reduce stomach upset",
      "duration": "Ongoing",
      "side_effects": "Nausea, diarrhea (usually temporary)"
    }
  ],
  "follow_up": {
    "type": "Clinic visit",
    "timing": "2 weeks",
    "purpose": "Check blood sugar response to medication",
    "preparation": "Fast for 8 hours before FBS test"
  },
  "lifestyle": {
    "diet": [
      "Reduce rice portions to 1 fist-sized per meal",
      "Avoid sugary drinks and sweets",
      "Eat more vegetables and lean protein"
    ],
    "exercise": [
      "Walk 30 minutes daily (at least 5 days/week)",
      "Start slow if you haven't exercised recently"
    ],
    "monitoring": [
      "Check blood sugar daily (fasting)",
      "Record readings in logbook or app"
    ]
  },
  "warnings": [
    "Return immediately if: excessive vomiting, difficulty breathing",
    "Call clinic if: blood sugar >300 mg/dL for 3 consecutive days"
  ]
}
```

### 4.2 Patient Education Library

**Pre-built templates** for 50+ common conditions:

| Category | Conditions |
|----------|------------|
| **Endocrine** | Diabetes Type 1, Diabetes Type 2, Hypothyroidism, Hyperthyroidism |
| **Cardiovascular** | Hypertension, Heart Failure, Atrial Fibrillation |
| **Respiratory** | Asthma, COPD, Pneumonia |
| **GI** | GERD, Peptic Ulcer, IBS, Hepatitis |
| **MSK** | Osteoarthritis, Osteoporosis, Low Back Pain |
| **Mental Health** | Depression, Anxiety, Insomnia |
| **Women's Health** | Pregnancy, Menopause, Contraception |
| **Preventive** | Vaccinations, Health Screening, Weight Management |

**Each template includes**:
- Condition explanation (Thai + English)
- What to expect
- Warning signs
- When to seek help

### 4.3 Medication Schedules

**Auto-extracted** from Plan section:

| Feature | Description |
|---------|-------------|
| **Morning/Afternoon/Evening** | Organized by timing |
| **With/Without Food** | Clear instructions |
| **Duration** | How long to take |
| **Side Effects** | Common ones to expect |
| **Interactions** | Basic warnings (P1) |
| **Refill Reminders** | When to reorder (P1) |

### 4.4 Follow-up Scheduling

**Auto-suggested** from Plan section:

| Component | Details |
|-----------|---------|
| **Timing** | "2 weeks", "1 month", "3 months" |
| **Type** | Clinic visit, Lab test, Teleconsult |
| **Purpose** | "Check BP", "Repeat labs", "Medication adjustment" |
| **Preparation** | "Fast 8 hours", "Bring logbook", "Arrive early" |
| **Calendar Integration** | Add to Google/Apple Calendar |

### 4.5 Lifestyle Recommendations

**Condition-specific** advice:

| Category | Examples |
|----------|----------|
| **Diet** | Portion sizes, Foods to avoid, Healthy alternatives |
| **Exercise** | Type, Duration, Frequency, Precautions |
| **Sleep** | Duration, Quality tips |
| **Stress** | Management techniques |
| **Substances** | Smoking cessation, Alcohol limits |

### 4.6 Delivery Options

| Method | Format | Use Case |
|--------|--------|----------|
| **LINE Message** | Interactive card | Most patients |
| **PDF Print** | Clinic handout | Elderly, non-LINE users |
| **PDF Download** | Email attachment | Record-keeping |
| **SMS Link** | Short URL (P1) | Patients without smartphone |

---

## 5. Technical Architecture

### 5.1 System Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CARE PLAN ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  FRONTEND (Scribe PWA)                                                  │
│  ├─ CarePlanModal.jsx (Enrollment UI)                                   │
│  ├─ CarePlanEditor.jsx (Review & customize)                             │
│  ├─ CarePlanPreview.jsx (Patient view)                                  │
│  └─ CarePlanDelivery.jsx (Send/Print/Download)                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  BACKEND API (Railway)                                                  │
│  ├─ /api/careplan/generate (POST)                                       │
│  ├─ /api/careplan/:id (GET)                                             │
│  ├─ /api/careplan/:id (PATCH)                                           │
│  ├─ /api/careplan/:id/deliver (POST)                                    │
│  └─ /api/careplan/templates (GET)                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SERVICES                                                               │
│  ├─ careplanGenerator.js (AI generation logic)                          │
│  ├─ patientEducation.js (Template library)                              │
│  ├─ medicationExtractor.js (Parse Plan section)                         │
│  ├─ pdfGenerator.js (PDF export)                                        │
│  └─ lineDelivery.js (LINE messaging)                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  DATABASE (Supabase)                                                    │
│  ├─ care_plans (Generated plans)                                        │
│  ├─ care_plan_templates (Condition templates)                           │
│  └─ patient_education (Education library)                               │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Database Schema

```sql
-- Care Plans Table
CREATE TABLE care_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scribe_note_id UUID REFERENCES scribe_notes(id),
    clinician_id UUID REFERENCES clinicians(id),
    patient_name VARCHAR(255) NOT NULL,
    patient_hn VARCHAR(100),
    
    -- Generated content
    medications JSONB, -- [{name, dosage, frequency, timing, instructions}]
    follow_up JSONB, -- {type, timing, purpose, preparation}
    lifestyle JSONB, -- {diet[], exercise[], monitoring[]}
    warnings TEXT[],
    patient_education JSONB, -- {condition, explanation, what_to_expect}
    
    -- Customization
    language VARCHAR(10) DEFAULT 'th', -- 'th', 'en'
    custom_instructions TEXT,
    
    -- Delivery
    delivery_method VARCHAR(50), -- 'line', 'print', 'download'
    delivered_at TIMESTAMP,
    line_message_id VARCHAR(255),
    
    -- Metadata
    template_used VARCHAR(100),
    generation_time_ms INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_careplans_scribe_note ON care_plans(scribe_note_id);
CREATE INDEX idx_careplans_clinician ON care_plans(clinician_id);
CREATE INDEX idx_careplans_patient ON care_plans(patient_hn);

-- Care Plan Templates Table
CREATE TABLE care_plan_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condition_name VARCHAR(255) NOT NULL,
    condition_code VARCHAR(50), -- ICD-10 code
    
    -- Template content
    medications_default JSONB,
    lifestyle_default JSONB,
    warnings_default TEXT[],
    patient_education JSONB,
    
    -- Metadata
    language VARCHAR(10) DEFAULT 'th',
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_condition ON care_plan_templates(condition_name);
```

---

## 6. API Specification

### 6.1 Generate Care Plan

**POST /api/careplan/generate**

**Request:**
```json
{
  "scribeNoteId": "uuid",
  "language": "th",
  "includeEducation": true,
  "includeLifestyle": true
}
```

**Response:**
```json
{
  "success": true,
  "carePlan": {
    "id": "uuid",
    "medications": [...],
    "follow_up": {...},
    "lifestyle": {...},
    "warnings": [...],
    "patient_education": {...}
  },
  "generationTimeMs": 1250
}
```

### 6.2 Get Care Plan

**GET /api/careplan/:id**

**Response:**
```json
{
  "success": true,
  "carePlan": {
    "id": "uuid",
    "patient_name": "Somchai Jaidee",
    "created_at": "2026-03-09T10:00:00Z",
    "medications": [...],
    "follow_up": {...},
    "lifestyle": {...},
    "warnings": [...],
    "patient_education": {...}
  }
}
```

### 6.3 Update Care Plan

**PATCH /api/careplan/:id**

**Request:**
```json
{
  "medications": [...], // Updated
  "custom_instructions": "Take medication after meals"
}
```

### 6.4 Deliver Care Plan

**POST /api/careplan/:id/deliver**

**Request:**
```json
{
  "method": "line",
  "lineUserId": "U1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "delivery": {
    "method": "line",
    "lineMessageId": "msg-123456",
    "deliveredAt": "2026-03-09T10:05:00Z"
  }
}
```

### 6.5 Get Templates

**GET /api/careplan/templates**

**Query Parameters:**
- `condition` (optional): Filter by condition name
- `language` (optional): 'th' or 'en'

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "uuid",
      "condition_name": "Diabetes Type 2",
      "condition_code": "E11",
      "language": "th",
      "usage_count": 150
    }
  ]
}
```

---

## 7. UI/UX Specification

### 7.1 Care Plan Modal (Post-Finalize)

**Trigger**: After doctor taps "Finalize" on Scribe note

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Generate Care Plan for this Patient?                    [X]            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Save 10 minutes by auto-generating:                                    │
│                                                                         │
│  ✅ Medications (from Plan section)                                     │
│  ✅ Follow-up schedule                                                  │
│  ✅ Patient education (Diabetes Type 2)                                 │
│  ✅ Lifestyle recommendations                                           │
│                                                                         │
│  Language: [Thai ▼]  [English]                                          │
│                                                                         │
│  [Preview]  [Skip]  [Generate]                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Care Plan Editor

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Care Plan for: Somchai Jaidee (HN12345)                   [Save] [X]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ Medications ────────────────────────────────────────────────────┐   │
│  │  1. Metformin 500mg                                               │   │
│  │     Frequency: [Twice daily ▼]  Timing: [Morning & Evening ▼]    │   │
│  │     Instructions: [Take with food to reduce stomach upset...]    │   │
│  │     [+ Add Medication]                                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ Follow-up ──────────────────────────────────────────────────────┐   │
│  │  Type: [Clinic visit ▼]  Timing: [2 weeks ▼]                     │   │
│  │  Purpose: [Check blood sugar response to medication]              │   │
│  │  Preparation: [Fast for 8 hours before FBS test]                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ Lifestyle ──────────────────────────────────────────────────────┐   │
│  │  Diet:                                                           │   │
│  │  • [Reduce rice portions to 1 fist-sized per meal]               │   │
│  │  • [Avoid sugary drinks and sweets]                              │   │
│  │  [+ Add Recommendation]                                           │   │
│  │                                                                  │   │
│  │  Exercise:                                                       │   │
│  │  • [Walk 30 minutes daily (at least 5 days/week)]                │   │
│  │  [+ Add Recommendation]                                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ Patient Education ──────────────────────────────────────────────┐   │
│  │  [Diabetes Type 2 - What is it?]                                 │   │
│  │  [Warning Signs] [When to Seek Help]                             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Custom Instructions (Optional):                                        │
│  [_______________________________________________________________]      │
│                                                                         │
│  [Cancel]  [Preview]  [Save & Send]                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Patient View (LINE)

**LINE Flex Message:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  📋 แผนการรักษาของคุณ (Your Care Plan)                                  │
│  คุณสมชาย Jaidee                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  💊 ยา (Medications)                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Metformin 500mg                                                  │   │
│  │ เช้า-เย็น (Morning & Evening)                                    │   │
│  │ กินหลังอาหาร (Take after food)                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📅 นัดหมาย (Follow-up)                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ อีก 2 สัปดาห์ (2 weeks)                                          │   │
│  │ ตรวจน้ำตาล (Check blood sugar)                                  │   │
│  │ งดอาหาร 8 ชม. (Fast 8 hours)                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  🥗 คำแนะนำ (Recommendations)                                           │
│  • ลดข้าว 1 กำมือต่อมื้อ                                              │
│  • หลีกเลี่ยงน้ำหวาน                                                   │
│  • เดิน 30 นาทีทุกวัน                                                  │
│                                                                         │
│  [ดูแผนเต็ม]  [ดาวน์โหลด PDF]                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Integration with Scribe

### 8.1 Trigger Points

| Trigger | Action |
|---------|--------|
| **Note Finalized** | Show Care Plan modal |
| **Patient Enrolled in Follow-up** | Auto-include Care Plan |
| **Care Plan Delivered** | Update Scribe note status |

### 8.2 Data Flow

```
Scribe Note (SOAP)
    │
    │ Doctor taps "Finalize"
    ▼

Care Plan Modal
    │
    │ Doctor taps "Generate"
    ▼

POST /api/careplan/generate
    │
    ├─ Extract medications from Plan
    ├─ Match condition to template
    ├─ Generate lifestyle recommendations
    └─ Build patient education
    ▼

Care Plan Editor (Doctor reviews)
    │
    │ Doctor taps "Save & Send"
    ▼

Deliver to Patient
    │
    ├─ LINE message
    ├─ PDF print
    └─ PDF download
    ▼

Update Scribe Note
    │
    └─ care_plan_generated: true
```

### 8.3 Shared Components

| Component | Shared From Scribe |
|-----------|-------------------|
| **Authentication** | JWT tokens |
| **API Client** | `api/client.js` |
| **UI Components** | shadcn/ui (Button, Card, Dialog) |
| **PDF Generator** | Same backend service |
| **LINE Delivery** | Same LINE service |

---

## 9. Success Metrics

### Adoption Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Scribe → Care Plan conversion** | 20% | Care Plan users / Scribe Pro users |
| **Care Plans generated/month** | 500+ | Backend analytics |
| **Average time to generate** | <30 seconds | API timing |
| **Edit rate** | <30% | Plans edited / Plans generated |

### Patient Engagement Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LINE open rate** | >80% | LINE analytics |
| **PDF download rate** | >40% | Delivery analytics |
| **Medication adherence** | >70% | Follow-up responses |
| **Follow-up attendance** | >80% | Clinic data (manual tracking) |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **MRR from Care Plan** | ฿40,000/mo | Stripe data |
| **Churn reduction** | -20% | Users with Care Plan vs. without |
| **NPS (Doctor)** | >50 | Quarterly survey |
| **NPS (Patient)** | >60 | Post-delivery survey |

---

## 10. Roadmap

### Phase 1: MVP (4 weeks)

**Week 1-2: Core Generation**
- [ ] Care Plan Generator service (AI prompts)
- [ ] Medication extraction logic
- [ ] Template library (10 conditions)
- [ ] Database schema + API

**Week 3: UI**
- [ ] CarePlanModal.jsx
- [ ] CarePlanEditor.jsx
- [ ] CarePlanPreview.jsx

**Week 4: Delivery**
- [ ] PDF generation
- [ ] LINE delivery integration
- [ ] Testing + bug fixes

**Launch Criteria:**
- ✅ Generate care plan in <30 seconds
- ✅ 10 condition templates (Thai + English)
- ✅ PDF + LINE delivery working
- ✅ 5 beta users testing

---

### Phase 2: Enhancement (4 weeks)

**Week 5-6: Template Expansion**
- [ ] 50 condition templates (from 10)
- [ ] Custom template builder (for clinics)
- [ ] ICD-10 code mapping

**Week 7-8: Advanced Features**
- [ ] Medication interaction checking
- [ ] Refill reminders
- [ ] Calendar integration (Google/Apple)

**Launch Criteria:**
- ✅ 50 condition templates
- ✅ Basic interaction warnings
- ✅ Calendar integration working

---

### Phase 3: Intelligence (6 weeks)

**Week 9-11: AI Improvements**
- [ ] Personalization based on patient history
- [ ] Multi-language expansion (Burmese, Lao)
- [ ] Voice-based care plan (audio summary)

**Week 12-14: Analytics**
- [ ] Adherence tracking dashboard
- [ ] Outcomes reporting
- [ ] Integration with Follow-up system

**Launch Criteria:**
- ✅ Personalization working
- ✅ Adherence dashboard live
- ✅ Outcomes data collected

---

## 11. Risks & Mitigations

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI generates incorrect dosage | Low | High | Doctor review required before sending |
| Medication interactions missed | Medium | High | Disclaimer + manual verification |
| LINE delivery fails | Low | Medium | Fallback to PDF/SMS |
| Template library too small | Medium | Low | Start with 10, expand to 50 |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low adoption (<10%) | Medium | High | In-app prompts, demo videos |
| Doctors don't trust AI | Medium | Medium | Emphasize "review before send" |
| Patients don't read | Low | Medium | LINE format, visual design |
| Competitors copy feature | High | Medium | First-mover advantage, Thai templates |

---

## 12. Go-to-Market

### Launch Strategy

**Week 1: Beta (10 users)**
- Existing Scribe Pro users
- Collect feedback, iterate

**Week 2-4: Soft Launch**
- All Scribe Pro users (email announcement)
- In-app modal promotion
- 7-day free trial of Care Plan

**Week 5+: Full Launch**
- Pricing: +฿2,000/mo
- Case studies from beta users
- Demo videos

### Marketing Channels

| Channel | Tactic | Expected Conversion |
|---------|--------|---------------------|
| **In-app** | Modal after finalize | 5-10% |
| **Email** | Announcement to Scribe Pro | 2-5% |
| **Social** | Demo video (Facebook/LinkedIn) | 1-2% |
| **Referral** | "Invite colleague, get 1 month free" | 3-5% |

---

## 13. Appendix

### A. Sample AI Prompt for Care Plan Generation

```
You are a medical care plan generator. Convert the following SOAP note into a patient-ready care plan.

SOAP Note:
{
  "subjective": "...",
  "objective": "...",
  "assessment": "Type 2 Diabetes Mellitus, uncontrolled",
  "plan": "Start Metformin 500mg BID, lifestyle modification, follow-up in 2 weeks"
}

Generate a care plan with:
1. Medications (name, dosage, frequency, timing, instructions, side effects)
2. Follow-up (type, timing, purpose, preparation)
3. Lifestyle (diet, exercise, monitoring)
4. Warnings (when to return, when to call)
5. Patient Education (condition explanation, what to expect)

Language: Thai
Reading Level: Grade 6
Tone: Encouraging, clear, actionable
```

### B. Condition Template Priority

**Phase 1 (10 conditions):**
1. Diabetes Type 2
2. Hypertension
3. Hyperlipidemia
4. GERD
5. Upper Respiratory Infection
6. Low Back Pain
7. Osteoarthritis
8. Depression
9. Anxiety
10. Insomnia

**Phase 2 (40 more):**
- See full list in `docs/careplan/condition_templates.md`

### C. Competitive Analysis

| Competitor | Care Plan Feature | Gap |
|------------|-------------------|-----|
| **Nuance DAX** | After-visit summary | No patient education |
| **DeepScribe** | Basic instructions | No lifestyle recommendations |
| **Abridge** | Patient handouts | Not automated |
| **Thai EMRs** | Template-based | Manual entry required |

**Our Advantage**: Full automation from Scribe note + Thai language + LINE delivery

---

**"Turn notes into actionable care plans automatically."**

*Specification Complete: March 9, 2026*
*Ready for Build: Week of March 16, 2026*
*Target Launch: April 13, 2026*
