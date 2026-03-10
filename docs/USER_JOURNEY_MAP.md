# 🗺️ Hanna Scribe - Complete User Journey Map

**Version:** 2.0  
**Last Updated:** March 10, 2026  
**Status:** Production Ready

---

## 👥 User Personas

| Persona | Role | Goals | Pain Points |
|---------|------|-------|-------------|
| **Dr. Somchai** | Primary User (Doctor) | Fast documentation, accurate notes, team communication | Time pressure, EMR burden, burnout |
| **Nurse Pla** | Secondary User (Nurse) | Track patient follow-ups, manage handovers | Missed alerts, scattered info |
| **Patient John** | End Beneficiary | Understand care plan, adhere to treatment | Confusing instructions, forgets meds |

---

## 📍 Journey Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    HANNA SCRIBE - END-TO-END JOURNEY                      │
└──────────────────────────────────────────────────────────────────────────┘

DR. SOMCHAI (Doctor)
├─ Phase 1: First Use (Onboarding)
├─ Phase 2: Daily Workflow (Record → Note → Care Plan)
├─ Phase 3: Team Collaboration (Handover)
└─ Phase 4: Ongoing Management (Follow-up Tracking)

NURSE PLA (Nurse)
├─ Phase A: Dashboard Review
├─ Phase B: Patient Follow-up
└─ Phase C: Handover Preparation

PATIENT JOHN (Patient)
├─ Phase X: Receives Care Plan
├─ Phase Y: Adherence Tracking
└─ Phase Z: Follow-up Completion
```

---

## 🎯 PHASE 1: First Use (Onboarding)

### Screen Flow: Landing → Login → Home

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Landing Page (hanna.care)                       │
│                                                         │
│ User: Dr. Somchai (hears about Hanna from colleague)    │
│ Action: Clicks "Try Free"                               │
│ Time: 30 seconds                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Login / Register                                │
│                                                         │
│ Email: [dr.somchai@hospital.go.th____]                  │
│                                                         │
│ [Continue with Email]  [Continue with LINE]             │
│                                                         │
│ User: Enters email                                      │
│ Backend: Creates account (auto-register)                │
│ Time: 15 seconds                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Onboarding Tour (3 screens)                     │
│                                                         │
│ Screen 1: "Record patient conversations"                │
│ Screen 2: "AI generates SOAP notes in seconds"          │
│ Screen 3: "Share care plans with patients"              │
│                                                         │
│ User: Taps through (or skips)                           │
│ Time: 30 seconds                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Home Screen (Empty State)                       │
│                                                         │
│ "No sessions yet"                                       │
│ "Tap + to start your first voice session"               │
│                                                         │
│ [ + New Session ]  ← Prominent FAB                      │
│                                                         │
│ User: Taps FAB                                          │
│ Time: 5 seconds                                         │
└─────────────────────────────────────────────────────────┘
```

### Decision Points:
| Decision | Options | Chosen | Why |
|----------|---------|--------|-----|
| Login method | Email, LINE, Google | Email + LINE | LINE is popular in Thailand |
| Onboarding tour | Required, Optional | Optional (skippable) | Doctors are busy |
| First action prompt | Empty state, Tutorial | Empty state + FAB | Clear CTA |

---

## 🎯 PHASE 2: Daily Workflow (Core Loop)

### Screen Flow: New Session → Record → Processing → Note Editor → Care Plan → Finalize → Export

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: New Session Modal                               │
│                                                         │
│ Patient Name: [John Doe____________]                    │
│ Hospital Number (HN): [HN12345_______] (optional)       │
│                                                         │
│ Note Type:  [SOAP]  [Progress]  [Free]                  │
│                                                         │
│ [Cancel]  [Start Recording →]                           │
│                                                         │
│ User: Fills patient name, taps Start Recording          │
│ Backend: Creates session record                         │
│ Time: 30 seconds                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Recording Screen                                │
│                                                         │
│ [✕]                              ● 00:00                │
│                                                         │
│          John Doe                                       │
│          HN12345                                        │
│                                                         │
│              ┌───────┐                                  │
│              │  ORB  │  ← Pulsing animation             │
│              │  ●●●  │                                  │
│              └───────┘                                  │
│                                                         │
│         [Listening...]                                  │
│                                                         │
│           00:00                                         │
│      Start speaking                                     │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎤 Speak clearly and naturally.            [✕]      │ │
│ │ Transcription happens after you stop.               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│      [⏸ Pause]      [■ Done]                           │
│                                                         │
│ User: Records patient conversation (2-5 min)            │
│ Backend: Streams audio to buffer                        │
│ Time: 2-5 minutes (real-time)                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Processing Screen                               │
│                                                         │
│            [Spinning Loader]                            │
│                                                         │
│      Processing Consultation                            │
│      AI is generating your clinical note                │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✓ Uploading audio                                   │ │
│ │ ✓ Transcribing conversation                         │ │
│ │ ● Generating clinical note    [=====>      ]        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ User: Waits (can't navigate away yet)                   │
│ Backend: Deepgram → Groq Llama 3.3 → Save note          │
│ Time: 30-60 seconds                                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Note Editor (SOAP + Care Plan Tabs)             │
│                                                         │
│ [←] John Doe                           [💾] [📋]        │
│      HN12345 • SOAP                                     │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⚡ AI-Generated Note                                │ │
│ │ Review and edit all sections before finalizing.     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [SOAP Note]  [Care Plan]  ← Tabs                       │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ● Subjective                        [✨ Regenerate] │ │
│ │ Patient reports feeling much better today...        │ │
│ │ [Editable rich text area]                           │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ● Objective                         [✨ Regenerate] │ │
│ │ Vitals stable. No acute distress...                 │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ● Assessment                        [✨ Regenerate] │ │
│ │ Upper respiratory infection, resolving...           │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ● Plan                            [✨ Regenerate]   │ │
│ │ Continue current medications...                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ User: Reviews note, edits if needed, switches to        │
│       Care Plan tab to review                           │
│ Backend: Note stored in draft state                     │
│ Time: 1-2 minutes                                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 5: Care Plan Tab (Auto-Generated)                  │
│                                                         │
│ [SOAP Note]  [Care Plan]  ← Active tab                  │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 💊 MEDICATIONS                                      │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Paracetamol 500mg                               │ │ │
│ │ │ 1 tablet PO q6h PRN pain/fever • 5 days         │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Lisinopril 10mg                                 │ │ │
│ │ │ 1 tablet PO daily • Continue                    │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 FOLLOW-UP                                        │ │
│ │ Return to clinic in 7 days for re-evaluation        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🥗 LIFESTYLE                                        │ │
│ │ • Increase fluid intake to 8-10 glasses daily       │ │
│ │ • Rest as needed                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📚 PATIENT EDUCATION                                │ │
│ │ • Monitor symptoms and report any changes           │ │
│ │ • Take medications as prescribed                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ User: Reviews care plan, edits medications if needed    │
│ Backend: Care Plan generated from SOAP note (AI)        │
│ Time: 30 seconds                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 6: Finalize Note                                   │
│                                                         │
│ User clicks: [✓ FINALIZE NOTE] (sticky bottom button)   │
│                                                         │
│ Confirmation: "Finalize this note?" [Yes] [No]          │
│                                                         │
│ Backend: Marks note as finalized, triggers export flow  │
│ Time: 5 seconds                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 7: Export Options Modal                            │
│                                                         │
│ Note Finalized                                          │
│ Choose how to export                                    │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [📋] Copy to Clipboard                              │ │
│ │      Paste directly into EHR                        │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [🔗] Smart Copy to EHR                              │ │
│ │      Opens EHR with note ready                      │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [📄] Export as PDF                                  │ │
│ │      Download or share PDF                          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 💡 Pro tip: Use Smart Copy to automatically open       │
│    your EHR app with the note formatted.               │
│                                                         │
│ User: Selects export method                             │
│ Backend: Formats note for selected method               │
│ Time: 10 seconds                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 8: Return to Home                                  │
│                                                         │
│ Session now appears in "Recent Sessions" list           │
│ Badge: [✨ Note] indicates completed                    │
│                                                         │
│ User: Can start new session or navigate elsewhere       │
│ Time: 5 seconds                                         │
└─────────────────────────────────────────────────────────┘
```

### Decision Points:
| Decision | Options | Chosen | Why |
|----------|---------|--------|-----|
| Recording UI | Orb only, Waveform only, Both | Orb only | Cleaner, less anxiety |
| Processing wait | Can navigate, Must wait | Must wait (for now) | Simpler state management |
| Note editing | Inline, Section cards | Section cards | Mobile-friendly |
| Care Plan | Manual, Auto-generated | Auto-generated | Reduces friction |
| Export | Copy only, PDF only, Multiple options | Multiple options | Flexibility for different workflows |

---

## 🎯 PHASE 3: Team Collaboration (Handover)

### Screen Flow: Handover Tab → Generate → Review → Share

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Handover Tab (Empty State)                      │
│                                                         │
│ Shift Handover                                          │
│ Generate end-of-shift summary for incoming team         │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │           [📄 Icon]                                 │ │
│ │   No Handover Generated                             │ │
│ │   Generate a comprehensive shift handover           │ │
│ │   summary from today's patient encounters           │ │
│ │                                                     │ │
│ │   [Generate Handover]                               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ User: Taps Generate Handover                            │
│ Time: 5 seconds                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Generating (Loading)                            │
│                                                         │
│ [Spinning loader]                                       │
│ Generating handover summary...                          │
│                                                         │
│ Backend: Aggregates all notes from today, AI summarizes │
│ Time: 15-30 seconds                                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Handover Summary                                │
│                                                         │
│ Day Shift · 10 Mar 2026                                 │
│ Generated by Dr. Somchai                                │
│                                                         │
│ ┌──────────────┐ ┌──────────────┐                       │
│ │ 👥 8         │ │ ⚠️ 2         │                       │
│ │ Patients     │ │ Urgent       │                       │
│ │ Seen         │ │ Follow-ups   │                       │
│ └──────────────┘ └──────────────┘                       │
│                                                         │
│ Patient Summary                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ John Doe                          [Urgent]          │ │
│ │ Upper respiratory infection, resolving.             │ │
│ │ Return in 7 days for follow-up.                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Jane Smith                                          │ │
│ │ Hypertension management.                            │ │
│ │ BP well-controlled on current meds.                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Regenerate]  [Print / PDF]                             │
│                                                         │
│ User: Reviews summary, can regenerate or export         │
│ Backend: AI-generated summary from all notes            │
│ Time: 1-2 minutes                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PHASE 4: Ongoing Management (Care Plan Tracking)

### Screen Flow: Care Plan Tab → Select Patient → View Detail → Track Adherence

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Care Plan Tab (List View)                       │
│                                                         │
│ Care Plans                                              │
│ Patient care plans and treatment tracking               │
│                                                         │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│ │ 👥 5   │ │ ✅ 3   │ │ 💊 12  │ │ 📅 4   │            │
│ │Patients│ │Active  │ │Meds    │ │Follow  │            │
│ └────────┘ └────────┘ └────────┘ └────────┘            │
│                                                         │
│ Recent Care Plans                            [5 plans]  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ❤️ John Doe                  [ACTIVE]               │ │
│ │    HN12345                                          │ │
│ │                                                     │ │
│ │    💊 Medications                                   │ │
│ │    [Paracetamol] [Lisinopril] [+1 more]             │ │
│ │                                                     │ │
│ │    📅 Return to clinic in 7 days    📈 On track     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ User: Taps on a patient card                            │
│ Time: 10 seconds                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Care Plan Detail View                           │
│                                                         │
│ [←] John Doe                          [✏️] [📤]         │
│ HN12345 • Created 2 days ago                            │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ MEDICATIONS (3)                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ ✓ Paracetamol 500mg                             │ │ │
│ │ │   1 tab q6h PRN                                 │ │ │
│ │ │   2 days remaining                              │ │ │
│ │ │   [Mark Taken] [Edit]                           │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ ⚠️ Lisinopril 10mg       [OVERDUE]              │ │ │
│ │ │   1 tab daily                                   │ │ │
│ │ │   OVERDUE (1 day)                               │ │ │
│ │ │   [Mark Taken] [Edit]                           │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ FOLLOW-UP                                           │ │
│ │ 📅 Mar 15, 2026 at 2:00 PM                          │ │
│ │ Return for BP check                                 │ │
│ │                                                     │ │
│ │ [Reschedule] [Complete]                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ LIFESTYLE                                           │ │
│ │ • Low-sodium diet                                   │ │
│ │ • 30 min walk 5x/week                               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ PATIENT EDUCATION                                   │ │
│ │ • Recognize warning signs                           │ │
│ │ • Take meds as prescribed                           │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Share PDF] [Message Patient]                           │
│                                                         │
│ User: Reviews care plan, marks meds as taken,           │
│       can message patient via LINE                      │
│ Backend: Tracks adherence, sends alerts if overdue      │
│ Time: 1-2 minutes                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 NURSE JOURNEY (Secondary User)

### Screen Flow: Dashboard → Patient List → Follow-up Actions

```
┌─────────────────────────────────────────────────────────┐
│ NURSE DASHBOARD (Separate App/Web)                      │
│                                                         │
│ Mission Control                                         │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🚨 CRITICAL ALERTS (2)                              │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ ⚠️ John Doe - Medication Overdue                │ │ │
│ │ │    Lisinopril 10mg - 1 day overdue              │ │ │
│ │ │    [Call Patient] [Mark Resolved]               │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📋 PENDING FOLLOW-UPS (4)                           │ │
│ │ • Jane Smith - BP check (Today)                     │ │
│ │ • Somchai P. - Wound check (Tomorrow)               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Nurse: Reviews alerts, takes action                     │
│ Backend: Aggregates from all patient care plans         │
│ Time: 5-10 minutes per shift                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PATIENT JOURNEY (End Beneficiary)

### Screen Flow: Receives Care Plan → Adheres → Follow-up

```
┌─────────────────────────────────────────────────────────┐
│ PATIENT EXPERIENCE (Via LINE Bot / PDF)                 │
│                                                         │
│ STEP 1: Receives Care Plan                              │
│                                                         │
│ LINE Message from Hanna Bot:                            │
│ "Hi John! Dr. Somchai has shared your care plan.       │
│  Tap to view your medications and follow-up. 💚"        │
│                                                         │
│ [View Care Plan] ← LIFF button                          │
│                                                         │
│ Patient: Taps to view                                   │
│ Time: 30 seconds                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Views Care Plan (Mobile-Friendly)               │
│                                                         │
│ Your Care Plan                                          │
│ Dr. Somchai • Hanna Clinic                              │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 💊 Your Medications                                 │ │
│ │ • Paracetamol 500mg - When you have pain            │ │
│ │ • Lisinopril 10mg - Every morning                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 Next Appointment                                 │ │
│ │ March 15, 2026 at 2:00 PM                           │ │
│ │ [Confirm] [Reschedule]                              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🥗 Healthy Tips                                     │ │
│ │ • Drink 8-10 glasses of water daily                 │ │
│ │ • Walk 30 minutes, 5 times per week                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Patient: Reviews, confirms appointment                  │
│ Time: 2 minutes                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Daily Check-ins (Automated via LINE)            │
│                                                         │
│ Day 1: "Hi John! Did you take your meds today? 💊"     │
│        [Yes ✅] [No ❌]                                 │
│                                                         │
│ Day 3: "How are you feeling? Any side effects?"         │
│        [Feeling good 😊] [Not well 😔]                 │
│                                                         │
│ Day 7: "Reminder: Appointment in 1 week!"               │
│        [Confirm ✅] [Reschedule 📅]                     │
│                                                         │
│ Patient: Responds to messages                           │
│ Backend: Tracks responses, alerts nurse if concerning   │
│ Time: 30 seconds per day                                │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Complete Journey Metrics

| Phase | Steps | Total Time | Success Metric |
|-------|-------|------------|----------------|
| **Onboarding** | 4 | 2 min | Account created |
| **Core Loop** | 8 | 5-8 min | Note finalized |
| **Handover** | 3 | 2 min | Summary generated |
| **Care Plan Tracking** | 2 | 2 min | Adherence recorded |
| **Nurse Review** | 1 | 5-10 min | Alerts actioned |
| **Patient Journey** | 3 | Ongoing | Appointment kept |

---

## 🔗 Backend Integrations by Journey

| Journey Phase | API Endpoints | External Services |
|---------------|---------------|-------------------|
| Onboarding | `/auth/login` | - |
| Recording | `/sessions`, `/transcribe` | Deepgram |
| Note Generation | `/generate-note` | Groq (Llama 3.3) |
| Care Plan | `/careplan/generate` | Groq (Llama 3.3) |
| Export | `/export/:id` | - |
| Handover | `/generate-handover` | Groq (Llama 3.3) |
| Patient Comms | `/followup/*` | LINE Bot API |
| Nurse Alerts | `/nurse/tasks` | - |

---

## ⚠️ Edge Cases & Error States

| Scenario | Handling |
|----------|----------|
| **Mic permission denied** | Show error + retry button |
| **Recording interrupted** | Auto-save buffer, allow resume |
| **Transcription fails** | Mock transcript + warning |
| **AI generation fails** | Retry 2x, then manual entry option |
| **Offline during recording** | Queue locally, sync when online |
| **Patient no-show** | Alert nurse after 24hrs |
| **Medication overdue** | Alert + LINE reminder to patient |

---

## 🎯 Summary: End-to-End Flow

```
Doctor: Login → Record → AI Note → Care Plan → Finalize → Export
                                          ↓
Patient: Receive Plan → Adhere → Follow-up → Complete
                                          ↓
Nurse:  Dashboard → Monitor → Alert → Resolve
```

**Total Journey Time:** 10-15 minutes (first use), 5 minutes (subsequent)

**Key Differentiators:**
1. ✅ **Voice-first** (10x faster than typing)
2. ✅ **AI-generated care plans** (not just notes)
3. ✅ **Patient tracking** (adherence + follow-ups)
4. ✅ **Team collaboration** (handover + nurse alerts)
5. ✅ **LINE integration** (Thai market fit)

---

## 📱 App Navigation Structure

```
┌─────────────────────────────────────────┐
│ [🏠]   [📄]   [🎤]   [💚]    [⚙️]       │
│ Home  Handover  Record  Care Plan  Settings
└─────────────────────────────────────────┘
```

| Tab | Route | Purpose |
|-----|-------|---------|
| 🏠 Home | `/` | Session dashboard, quick actions |
| 📄 Handover | `/handover` | Shift summaries, team collaboration |
| 🎤 Record (FAB) | `/record` | Primary action - new recording |
| 💚 Care Plan | `/careplan` | Patient care plans, adherence tracking |
| ⚙️ Settings | `/settings` | Profile, preferences, usage stats |

---

**Document Version:** 2.0  
**Last Updated:** March 10, 2026  
**Next Review:** Post-launch (30 days)
