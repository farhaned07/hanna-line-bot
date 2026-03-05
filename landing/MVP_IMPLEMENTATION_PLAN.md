# HANNA MVP LANDING PAGE - IMPLEMENTATION PLAN

## 📋 EXECUTIVE SUMMARY

**Objective:** Redesign the Hanna landing page to match the comprehensive MVP specification with 7-day trial focus, voice-first positioning, and conversion-optimized structure.

**Current State:**
- ✅ Basic landing page exists with Hero, Problem, Solution, WhyLine, TrustCredibility, Pricing, FinalCTA
- ✅ Using Tailwind CSS + Framer Motion
- ✅ Thai language primary
- ✅ Mobile-responsive design

**Target State:**
- 11 sections following the new specification
- Enhanced voice-first messaging
- Simplified pricing (consider removing Basic tier)
- New sections: "How Hanna Works" (4-step flow), "Why Voice Matters" (comparison table), "Features Grid", "FAQ", "Get Started"
- Updated copy throughout to match new positioning

---

## 📊 GAP ANALYSIS

### ✅ Existing Components (Keep & Update)
1. **Hero** - Update copy, emphasize voice + 7-day trial
2. **Problem** - Update to emotional family-focused pain points
3. **Solution** - Restructure to 4-step visual flow
4. **WhyLine** - Transform into "Why Voice Matters" comparison table
5. **TrustCredibility** - Update to 3-pillar trust section
6. **Pricing** - Simplify tiers, emphasize trial
7. **FinalCTA** - Update copy, add "Get Started" steps
8. **Footer** - Keep as-is

### 🆕 New Components (Create)
1. **HowItWorks** - 4-step visual flow with screenshots/mockups
2. **WhyVoice** - Comparison table (Regular Apps vs Hanna)
3. **FeaturesGrid** - 2x3 grid of key features
4. **FAQ** - Accordion-style Q&A section
5. **GetStarted** - 3-step onboarding visual

### 🗑️ Components to Remove/Merge
- **Audience.tsx** - Merge into TrustCredibility
- **Safety.tsx** - Merge into TrustCredibility
- **Timeline.tsx** - Replace with HowItWorks
- **LiveCounter/UserCounter** - Remove (no social proof yet for MVP)
- **TrustBadges** - Merge into TrustCredibility

---

## 🎯 IMPLEMENTATION PHASES

### **PHASE 1: CONTENT AUDIT & CONSTANTS UPDATE** ⏱️ 1-2 hours

**Tasks:**
- [ ] 1.1 Create new `constants-mvp.tsx` with all new copy from specification
- [ ] 1.2 Map existing constants to new structure
- [ ] 1.3 Add FAQ content (10 Q&As)
- [ ] 1.4 Add "How It Works" 4-step content
- [ ] 1.5 Add "Why Voice" comparison data
- [ ] 1.6 Add "Features Grid" content
- [ ] 1.7 Add "Get Started" 3-step content
- [ ] 1.8 Update pricing to match new structure (consider removing Basic)

**Deliverable:** `constants-mvp.tsx` file ready

---

### **PHASE 2: UPDATE EXISTING COMPONENTS** ⏱️ 3-4 hours

#### 2.1 Hero Component
**Changes:**
- [ ] Update headline: "ฮันนา - พยาบาล AI ที่คอยดูแลคุณทุกวัน ผ่านไลน์ที่คุณใช้อยู่แล้ว"
- [ ] Update subheadline: "เช็คสุขภาพทุกเช้า • เตือนกินยาไม่พลาด • คุยด้วยเสียงได้ทันที มีพยาบาลวิชาชีพคอยดูแล"
- [ ] Emphasize "ทดลองฟรี 7 วัน - ไม่ต้องใส่บัตร" in CTA
- [ ] Keep QR code prominent
- [ ] Update trust indicators below CTA

**File:** `components/Hero.tsx`

#### 2.2 Problem Component
**Changes:**
- [ ] Update headline: "คุณไม่สามารถอยู่กับพ่อแม่ตลอดเวลา แต่ต้องห่วงสุขภาพทุกวัน"
- [ ] Replace 4 pain points with 3 emotional cards:
  - กังวลว่ากินยาหรือยัง (😰)
  - กลัวอาการแย่แต่ไม่บอก (🏥)
  - รู้สึกผิดที่ไม่ได้อยู่ใกล้ (😔)
- [ ] Add transition text: "ตอนนี้... มีฮันนาแล้ว ดูแลพ่อแม่แทนคุณ ทุกวัน ทุกเวลา"

**File:** `components/Problem.tsx`

#### 2.3 Pricing Component
**Changes:**
- [ ] Consider removing Basic tier (simplify to Plus + Premium only)
- [ ] Update Plus pricing: ฿599/month or ฿5,990/year (save ฿1,198)
- [ ] Update Premium: ฿999/month or ฿9,990/year (save ฿1,998)
- [ ] Add family add-on: +฿199/person
- [ ] Emphasize "ทดลองฟรี 7 วัน • ไม่ต้องใส่บัตร" above pricing
- [ ] Update feature lists to match spec

**File:** `components/Pricing.tsx`

#### 2.4 TrustCredibility Component
**Changes:**
- [ ] Restructure to 3 pillars:
  - 🔒 ข้อมูลปลอดภัย (PDPA, encryption, no data selling)
  - 👩‍⚕️ พยาบาลวิชาชีพ (licensed, daily monitoring, consultation)
  - ✅ ง่ายและสะดวก (LINE, no download, cancel anytime)
- [ ] Remove social proof elements (no testimonials for MVP)

**File:** `components/TrustCredibility.tsx`

#### 2.5 FinalCTA Component
**Changes:**
- [ ] Update headline: "พร้อมแล้วหรือยัง? ให้ฮันนาดูแลคุณหรือคนที่คุณรัก"
- [ ] Add social proof text: "💚 เข้าร่วมกับผู้ใช้หลายร้อยคนที่ไว้วางใจฮันนา"
- [ ] Keep large QR code
- [ ] Emphasize trial benefits

**File:** `components/FinalCTA.tsx`

---

### **PHASE 3: CREATE NEW COMPONENTS** ⏱️ 4-6 hours

#### 3.1 HowItWorks Component
**Structure:**
- Section: "ฮันนาดูแลอย่างไร?"
- 4 cards in vertical flow with mockups
- CTA at bottom

**File:** `components/HowItWorks.tsx` (NEW)

#### 3.2 WhyVoice Component
**Structure:**
- Section: "ทำไมต้องคุยด้วยเสียง?"
- Comparison table: Regular Apps vs Hanna
- Key message emphasis

**File:** `components/WhyVoice.tsx` (NEW)

#### 3.3 FeaturesGrid Component
**Structure:**
- Section: "ทุกอย่างที่ฮันนาช่วยคุณได้"
- 2x3 grid of features with icons

**File:** `components/FeaturesGrid.tsx` (NEW)

#### 3.4 FAQ Component
**Structure:**
- Accordion-style Q&A
- 10 questions from spec

**File:** `components/FAQ.tsx` (NEW)

#### 3.5 GetStarted Component
**Structure:**
- Section: "เริ่มใช้งานได้ใน 3 ขั้นตอน"
- Visual flow with arrows

**File:** `components/GetStarted.tsx` (NEW)

---

### **PHASE 4: UPDATE APP STRUCTURE** ⏱️ 1 hour

**New section order:**
1. Hero
2. Problem
3. HowItWorks (NEW)
4. WhyVoice (NEW)
5. FeaturesGrid (NEW)
6. TrustCredibility (updated)
7. Pricing (updated)
8. FAQ (NEW)
9. GetStarted (NEW)
10. FinalCTA (updated)
11. Footer

**File:** `App.tsx`

---

### **PHASE 5: ASSETS & MOCKUPS** ⏱️ 2-3 hours

**Required Assets:**
- [ ] LINE chat screenshot mockup
- [ ] Medication reminder notification mockup
- [ ] Gemini Live UI mockup
- [ ] Nurse badge icon/illustration
- [ ] Feature icons (if not using Lucide)
- [ ] QR code image (update to actual @hanna.nurse)

---

### **PHASE 6: TYPOGRAPHY & SPACING REFINEMENT** ⏱️ 1-2 hours

**Apply improvements from previous plan:**
- [ ] Consistent heading hierarchy
- [ ] Standardized spacing
- [ ] Improved line-heights and letter-spacing
- [ ] Better responsive scaling

---

### **PHASE 7: TESTING & OPTIMIZATION** ⏱️ 2-3 hours

**Testing Checklist:**
- [ ] Mobile responsiveness
- [ ] Tablet view
- [ ] Desktop view
- [ ] QR code scannable
- [ ] All CTAs functional
- [ ] Load time < 2 seconds
- [ ] Accessibility

---

## ⏱️ TIMELINE ESTIMATE

**Total: 15-21 hours**

**Recommended Schedule:**
- **Day 1 (4-5 hours):** Phase 1 + Start Phase 5
- **Day 2 (5-6 hours):** Phase 2 + Phase 3 (partial)
- **Day 3 (5-6 hours):** Phase 3 (complete) + Phase 4 + Phase 6
- **Day 4 (2-3 hours):** Phase 7 (testing & refinement)

---

## 📋 PRE-EXECUTION CHECKLIST

Before starting execution, confirm:
- [ ] Specification document fully understood
- [ ] Current codebase structure reviewed
- [ ] Timeline approved
- [ ] Git branch created for MVP redesign

---

## 🎬 NEXT STEPS

**Questions for You:**
1. Should we remove the Basic tier (฿299) and only offer Plus (฿599) + Premium (฿999)?
2. Do you have actual LINE chat screenshots, or should I create mockups?
3. What's the actual LINE Official Account ID? (currently using @hanna)
4. Do you want to keep any existing components (Timeline, LiveCounter, etc.)?
5. Ready to proceed with Phase 1?

**Ready to proceed with execution?** 🚀
