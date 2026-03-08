# Hanna Scribe — Product Wireframe & UX Architecture

> **Version**: 1.0 (Launch Edition)  
> **Date**: March 5, 2026  
> **Status**: Foundation for all future development

---

## 🎯 **Product Vision**

**Hanna Scribe** is a mobile-first clinical documentation assistant that turns voice conversations into structured SOAP notes in 60 seconds.

### **Core Value Proposition:**
> "Doctor speaks. AI writes."

### **Target User:**
- **Primary**: Doctors in Thai/Bangla clinics (1-50 person practices)
- **Secondary**: Nurses, physician assistants, medical scribes
- **Device**: Smartphone (95%), Desktop (5% for admin only)

### **Key Differentiators:**
1. **Mobile-first** (not desktop with mobile skin)
2. **Multilingual** (Thai + Bangla + English + 5 more)
3. **60-second workflow** (record → note → done)
4. **PWA** (no app store, works on any phone)
5. **10x cheaper** than US competitors (Tandem, Abridge)

---

## 📱 **User Journey Map**

### **First-Time User Flow (Onboarding)**

```
┌─────────────────────────────────────────────────────────────┐
│  LANDING PAGE (hanna.care)                                  │
│  - Hero: "Doctor speaks. AI writes."                        │
│  - Problem stats (3 hours/day on docs)                      │
│  - How it works (1-2-3)                                     │
│  - Pricing (Free/Pro/Clinic)                                │
│  - CTA: "Try Free — No Credit Card"                         │
└─────────────────────────────────────────────────────────────┘
                            ↓ Click CTA
┌─────────────────────────────────────────────────────────────┐
│  ONBOARDING (3 screens)                                     │
│  Screen 1: "Tap & Record" (mic icon)                        │
│  Screen 2: "AI Writes Your Note" (SOAP preview)             │
│  Screen 3: "Save & Export" (PDF/clipboard icons)            │
│  CTA: "Get Started" → Login                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓ Get Started
┌─────────────────────────────────────────────────────────────┐
│  LOGIN / SIGN UP                                            │
│  - Email + 6-digit PIN (no passwords)                       │
│  - "Create Account" for new users                           │
│  - Skip onboarding option                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓ Login Success
┌─────────────────────────────────────────────────────────────┐
│  HOME (Empty State)                                         │
│  - Beautiful illustration (phone + mic)                     │
│  - "Create your first clinical note"                        │
│  - "Takes about 60 seconds"                                 │
│  - 3-step visual guide                                      │
│  - FAB (+) button pulsing                                   │
└─────────────────────────────────────────────────────────────┘
```

---

### **Core Workflow (Daily Use)**

```
┌─────────────────────────────────────────────────────────────┐
│  1. HOME (With Sessions)                                    │
│  - Greeting + user name                                     │
│  - Search bar                                               │
│  - Session list (grouped by Today/Yesterday)                │
│  - Each card: Patient name, status, time, template          │
│  - Swipe left → Delete                                      │
│  - Swipe right → Export                                     │
│  - FAB (+) → New session                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓ Tap FAB (+)
┌─────────────────────────────────────────────────────────────┐
│  2. NEW SESSION (Bottom Sheet)                              │
│  - Patient name (required)                                  │
│  - HN - Hospital Number (optional)                          │
│  - Template selector (SOAP/Progress/Free)                   │
│  - "Start Recording" button                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓ Start Recording
┌─────────────────────────────────────────────────────────────┐
│  3. RECORDING (Full Screen)                                 │
│  - Large orb (pulsing animation)                            │
│  - HUGE timer (56px) - impossible to miss                   │
│  - Duration color: White→Yellow→Red                         │
│  - Pause/Resume buttons                                     │
│  - Done button (square icon)                                │
│  - Haptic feedback on start/stop                            │
│  - Transcript preview (optional)                            │
└─────────────────────────────────────────────────────────────┘
                            ↓ Tap Done
┌─────────────────────────────────────────────────────────────┐
│  4. PROCESSING (Full Screen)                                │
│  - Orb animation (3 rings)                                  │
│  - Stage 1: "Uploading audio..." (~1-2s)                    │
│  - Stage 2: "Transcribing..." (~10-30s)                     │
│         - Shows detected language (🇹🇭/🇧🇩/🇬🇧)              │
│         - Time estimate badge                                │
│  - Stage 3: "Generating SOAP note..." (~5-15s)              │
│         - Explains what's happening                          │
│  - Auto-navigate to Note when done                          │
└─────────────────────────────────────────────────────────────┘
                            ↓ Auto-navigate
┌─────────────────────────────────────────────────────────────┐
│  5. NOTE VIEW (Read-Only)                                   │
│  - Patient name + HN + timestamp                            │
│  - "Generated by Hanna AI" badge                            │
│  - 4 SOAP sections (Subjective/Objective/Assessment/Plan)   │
│  - Each section: Icon + title + content card                │
│  - Transcript toggle (expand/collapse)                      │
│  - Bottom actions: Copy | PDF | Edit/Finalize               │
└─────────────────────────────────────────────────────────────┘
                            ↓ Tap Edit
┌─────────────────────────────────────────────────────────────┐
│  6. NOTE EDITOR                                             │
│  - Same 4 SOAP sections (editable)                          │
│  - TipTap rich text editor                                  │
│  - "Regenerate" button per section                          │
│  - Hanna AI command bar (bottom)                            │
│  - "Tell Hanna to edit..." input                            │
│  - Save button (top right)                                  │
│  - "Review & Finalize" button                               │
└─────────────────────────────────────────────────────────────┘
                            ↓ Finalize
┌─────────────────────────────────────────────────────────────┐
│  BACK TO NOTE VIEW                                          │
│  - Status changes to "Clinician-reviewed" (green)           │
│  - "Amend" button instead of "Edit"                         │
└─────────────────────────────────────────────────────────────┘
```

---

### **Secondary Flows**

#### **A. Handover Summary**

```
HOME → Tab Bar (Handover) → HANDOVER PAGE
- Shift summary (auto-generated from today's notes)
- Patient count, urgent count, avg time
- List of patients with status
- Copy | Export PDF | Regenerate buttons
```

#### **B. Settings**

```
HOME → Tab Bar (Settings) → SETTINGS PAGE
- Profile (name, email, hospital)
- Plan (Free/Pro/Clinic) + usage stats
- Language (App language + Note output language)
- Defaults (default template, auto-finalize toggle)
- Help & Feedback
- Sign Out button
```

#### **C. Upgrade Flow**

```
SETTINGS → Plan → UPGRADE MODAL
- Free: 10 notes/month (current)
- Pro: ฿990/month (unlimited)
- Clinic: ฿9,990/month (up to 5 providers)
- Select → Stripe Checkout → Success → Back to Settings
```

---

## 🗺️ **Site Map**

```
hanna.care/
├── / (Landing Page)
│   ├── Hero
│   ├── Problem
│   ├── How It Works
│   ├── Features
│   ├── Vision (Scribe → Care Plan → Follow-up)
│   ├── Trust (Supervised AI)
│   ├── Pricing
│   └── Final CTA
│
└── /scribe/app (PWA)
    ├── /login (Login/Register)
    ├── /onboarding (3-screen walkthrough)
    ├── / (Home - Session List)
    ├── /record/:id (Recording Screen)
    ├── /processing/:id (Processing Screen)
    ├── /note/:id (Note View)
    │   └── /edit (Note Editor)
    ├── /handover (Shift Handover)
    └── /settings (Settings)
```

---

## 🧭 **Navigation Structure**

### **Primary Navigation (Tab Bar)**

Always visible (except during recording/processing/note view):

```
┌─────────────────────────────────────────────────────────────┐
│  [🏠 Home]  [📋 Handover]  [⚙️ Settings]                    │
│     ↑           ↑              ↑                            │
│   Active    Inactive      Inactive                          │
└─────────────────────────────────────────────────────────────┘
```

### **Secondary Navigation (Contextual)**

- **Back buttons**: Top-left corner (← arrow)
- **Action buttons**: Bottom sheet or bottom bar
- **FAB**: Only on Home page (create new session)
- **Overflow menus**: Three dots (⋮) for more options

---

## 📊 **Feature Inventory**

### ✅ **What We Have (Live)**

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Landing Page | ✅ Live | P0 | hanna.care |
| Login/Register | ✅ Live | P0 | Email + PIN |
| Onboarding | ✅ Live | P0 | 3 screens |
| Home (Empty State) | ✅ Live | P0 | With illustration |
| Home (Session List) | ✅ Live | P0 | Grouped by date |
| Swipe Gestures | ✅ Live | P1 | Delete/Export |
| New Session Sheet | ✅ Live | P0 | Patient + HN + Template |
| Recording Screen | ✅ Live | P0 | Orb + 56px timer |
| Haptic Feedback | ✅ Live | P1 | Vibration on actions |
| Processing Screen | ✅ Live | P0 | 3 stages + language |
| Note View | ✅ Live | P0 | SOAP sections |
| Note Editor | ✅ Live | P0 | TipTap + AI commands |
| Handover | ✅ Live | P2 | Shift summary |
| Settings | ✅ Live | P0 | Profile + plan + language |
| Stripe Billing | ✅ Live | P0 | Free/Pro/Clinic |
| Keyboard Shortcuts | ✅ Live | P2 | Cmd+N, Cmd+S, etc. |
| Multilingual (8 langs) | ✅ Live | P0 | Thai/Bangla/English + 5 more |
| Medical Terms DB | ✅ Live | P0 | 200+ terms |

---

### ❌ **What's Missing**

| Feature | Priority | Why Needed | Effort |
|---------|----------|------------|--------|
| **Offline Mode** | P0 | Clinics have poor internet | 3 days |
| **Search Sessions** | P1 | Find old notes quickly | 1 day |
| **Note Templates** | P1 | Common phrases for speed | 2 days |
| **Undo Delete** | P1 | Prevent accidental deletions | 0.5 days |
| **Dark Mode** | P2 | Night use comfort | 2 days |
| **Patient List View** | P2 | See all notes per patient | 2 days |
| **Voice Commands** | P2 | "Hanna, add vitals" | 3 days |
| **EMR Integration** | P3 | Push to hospital systems | 5 days |
| **Team Management** | P3 | Clinic plan feature | 3 days |
| **Analytics Dashboard** | P3 | Usage stats for admins | 3 days |
| **Desktop Dashboard** | P3 | Admin only (5% of usage) | 5 days |

---

## 🎨 **Design System**

### **Colors**

```
Primary: #6366F1 (Indigo)
Secondary: #8B5CF6 (Purple)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Background: #FAFAFA (Light Gray)
Cards: #FFFFFF (White)
Text: #111827 (Dark Gray)
```

### **Typography**

```
Font: Inter (Google Fonts)
Base Size: 16px (mobile-first)
Headings: 22-30px (bold, -0.5px letter-spacing)
Body: 15-16px (regular)
Small: 12-13px (medium)
```

### **Spacing**

```
XS: 4px
SM: 8px
MD: 16px
LG: 24px
XL: 32px
XXL: 48px
```

### **Radii**

```
Small: 10px (buttons, inputs)
Medium: 14-16px (cards)
Large: 20-24px (modals, sheets)
Full: 999px (pills, toggles)
```

### **Shadows**

```
SM: 0 1px 3px rgba(0,0,0,0.04)
MD: 0 4px 12px rgba(0,0,0,0.06)
LG: 0 8px 24px rgba(0,0,0,0.08)
XL: 0 16px 48px rgba(0,0,0,0.1)
```

---

## 📱 **Mobile-First Principles**

### **Thumb Zone Design**

```
┌─────────────────────────────────────────────────────────────┐
│  TOP (Hard to reach)                                        │
│  - Back buttons                                             │
│  - Profile/settings                                         │
│                                                             │
│  MIDDLE (Content area)                                      │
│  - Session list                                             │
│  - Note content                                             │
│  - Scrollable                                               │
│                                                             │
│  BOTTOM (Easy to reach - Thumb Zone)                        │
│  - Tab bar navigation                                       │
│  - FAB (+) button                                           │
│  - Primary actions (Record, Done, Save)                     │
└─────────────────────────────────────────────────────────────┘
```

### **Touch Targets**

- **Minimum**: 44x44px (Apple HIG standard)
- **FAB**: 56x56px (now 64x64px)
- **Tab icons**: 48x48px clickable area
- **Buttons**: Full width, 48px height minimum

### **Gestures**

- **Swipe**: Left/Right on list items
- **Tap**: All buttons/cards
- **Long Press**: Future (context menus)
- **Pull to Refresh**: Not implemented (not needed)

---

## 🚀 **Roadmap**

### **Phase 1: Launch Ready (NOW)**

- [x] Core workflow (Record → Note → Export)
- [x] Mobile-first UI polish
- [x] Multilingual support
- [x] Swipe gestures
- [x] Haptic feedback
- [ ] **Offline mode** (P0 - missing)
- [ ] **Search** (P1 - missing)

### **Phase 2: Week 1-2**

- [ ] Note templates (common phrases)
- [ ] Undo delete functionality
- [ ] Patient list view
- [ ] Better error handling
- [ ] Onboarding improvements

### **Phase 3: Month 1**

- [ ] Dark mode
- [ ] Voice commands ("Hanna, add vitals")
- [ ] Team management (Clinic plan)
- [ ] Analytics dashboard

### **Phase 4: Month 2-3**

- [ ] EMR integration (HL7/FHIR)
- [ ] Desktop dashboard (admin only)
- [ ] Care Plan feature (next product)
- [ ] Patient follow-up via LINE

---

## 🔧 **Technical Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Vercel)                                          │
│  - React 19 + TypeScript                                    │
│  - Vite (build tool)                                        │
│  - Tailwind CSS v4                                          │
│  - Framer Motion (animations)                               │
│  - TipTap (rich text editor)                                │
│  - PWA (offline support - TODO)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Railway)                                          │
│  - Node.js + Express                                        │
│  - PostgreSQL (Supabase)                                    │
│  - Deepgram (transcription)                                 │
│  - Groq (Llama 3.3 70B for notes)                           │
│  - Stripe (billing)                                         │
│  - PDFKit (PDF export)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 **Next Actions**

### **Immediate (This Week):**

1. **Fix Onboarding Trigger** - Show onboarding for first-time users
2. **Implement Offline Mode** - Cache last 50 notes, queue uploads
3. **Add Search** - Filter sessions by patient name/HN
4. **Add Undo Delete** - 5-second toast with "Undo" button

### **Next Week:**

1. **Note Templates** - Pre-defined phrases for common conditions
2. **Patient List View** - See all notes for a single patient
3. **Better Error States** - More helpful error messages
4. **Onboarding Improvements** - Add video demo, skip logic

### **Next Month:**

1. **Dark Mode** - Full theme support
2. **Voice Commands** - "Hanna, add blood pressure"
3. **Team Management** - Invite providers (Clinic plan)
4. **Analytics** - Usage stats, notes per day, etc.

---

## ✅ **Definition of Done**

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
- [ ] Documented in this wireframe

---

**This wireframe is the single source of truth for all future development.**

Any new feature must:
1. Fit within this architecture
2. Follow mobile-first principles
3. Be documented here before coding starts
