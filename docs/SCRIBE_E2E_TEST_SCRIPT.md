# Hanna Scribe — End-to-End Test Script

> **Version**: 1.0 (Launch Edition)  
> **Last Updated**: March 4, 2026  
> **Purpose**: Validate complete user journey from landing page → first paid note  
> **Duration**: ~45-60 minutes per full test cycle

---

## 🎯 Test Objectives

1. **Validate user flow** — Every step works as expected
2. **Identify friction points** — Where do users hesitate or drop off?
3. **Test payment integration** — Stripe checkout + webhook processing
4. **Measure performance** — Load times, processing speed
5. **Document bugs** — Clear reproduction steps for fixes

---

## 📋 Pre-Test Setup

### Environment
- [ ] **Backend running**: `npm start` (port 3000)
- [ ] **Scribe frontend running**: `cd scribe && npm run dev` (port 5174)
- [ ] **Landing page accessible**: `hanna.care` or `localhost:5173`
- [ ] **Database connected**: Supabase PostgreSQL
- [ ] **Stripe test mode**: Enabled in Stripe Dashboard
- [ ] **Test email ready**: e.g., `test+scribe@gmail.com`
- [ ] **Test card ready**: `4242 4242 4242 4242` (Stripe test card)

### Test Accounts
| Account Type | Email | PIN | Plan |
|--------------|-------|-----|------|
| **New User** | `test+new@gmail.com` | `123456` | Free |
| **Pro User** | `test+pro@gmail.com` | `123456` | Pro |
| **Clinic User** | `test+clinic@gmail.com` | `123456` | Clinic |

### Tools Needed
- [ ] Browser DevTools (Network tab open)
- [ ] Screen recording software (optional)
- [ ] Notion/Google Doc for notes
- [ ] Timer/stopwatch
- [ ] Test audio file (3-minute mock consultation)

---

## 🧪 Test Flow Overview

```
Landing Page → Sign Up → Home → New Session → Record → Processing → Note → Export → Upgrade
     ↓              ↓         ↓         ↓          ↓         ↓           ↓        ↓         ↓
   30s           60s       10s       30s        180s      60s        30s      30s      120s
```

**Total time**: ~10-12 minutes (excluding recording time)

---

## 📍 Test 1: Landing Page → Sign Up

### Step 1.1: Landing Page Load
**Action**: Navigate to `hanna.care`

**Expected Behavior**:
- Page loads in < 3 seconds
- Hero section visible: "Doctor speaks. AI writes."
- "Try Free — No Credit Card" button visible
- Pricing section visible (Free/Pro/Clinic)
- No console errors

**Verify**:
- [ ] Page load time: _____ seconds (target: < 3s)
- [ ] Hero headline renders correctly
- [ ] CTA button clickable
- [ ] No 404s in Network tab
- [ ] Mobile responsive (test on phone or DevTools mobile view)

**Screenshot**: Landing page hero

---

### Step 1.2: Click "Try Free"
**Action**: Click "Try Free — No Credit Card" button

**Expected Behavior**:
- Navigates to `/scribe/app`
- Login page loads in < 2 seconds
- Login form visible (email + 6-digit PIN)
- "Create Account" link visible

**Verify**:
- [ ] Navigation successful
- [ ] Login page load time: _____ seconds (target: < 2s)
- [ ] Email input field present
- [ ] PIN input shows 6 boxes
- [ ] Language toggle (EN/TH) works
- [ ] No console errors

**Screenshot**: Login page

---

### Step 1.3: Create Account
**Action**: 
1. Click "Create Account" link
2. Enter email: `test+[timestamp]@gmail.com`
3. Enter display name: `Dr. Test User`
4. Enter 6-digit PIN: `123456`
5. Confirm PIN: `123456`
6. Click "Create Account"

**Expected Behavior**:
- Form validates (all fields required)
- PIN boxes auto-advance as digits entered
- Submit button enabled when all fields filled
- Account created successfully
- Redirected to Home page

**Verify**:
- [ ] Form validation works (empty fields show error)
- [ ] PIN auto-advance works smoothly
- [ ] Submit button state changes (disabled → enabled)
- [ ] Account creation time: _____ seconds (target: < 2s)
- [ ] Redirect to Home page successful
- [ ] Welcome message shows display name

**Screenshot**: Home page with welcome message

**Notes**: Any friction during signup? _______________

---

## 📍 Test 2: Home Page → New Session

### Step 2.1: Home Page Load
**Action**: Observe Home page after login

**Expected Behavior**:
- Welcome message: "Good morning/afternoon/evening, [Name]"
- "Hanna Scribe" branding visible (top right)
- Search bar visible
- Empty state shown (no sessions yet)
- FAB (+) button visible (bottom right)
- Tab bar visible (Home, Handover, Settings)

**Verify**:
- [ ] Greeting matches time of day
- [ ] User's display name shown
- [ ] Search bar functional (type and clear)
- [ ] Empty state illustration + text visible
- [ ] FAB button clickable
- [ ] Tab bar navigation works (all 3 tabs)

**Screenshot**: Home page (empty state)

---

### Step 2.2: Create New Session
**Action**: Click FAB (+) button

**Expected Behavior**:
- Bottom sheet slides up
- Patient name input visible
- HN (hospital number) input visible
- Template selector visible (SOAP/Progress/Free)
- "Start Recording" button enabled

**Verify**:
- [ ] Bottom sheet animation smooth
- [ ] Patient name field focused
- [ ] HN field optional (can be empty)
- [ ] Template selector works (SOAP default)
- [ ] "Start Recording" button enabled
- [ ] "Cancel" button works (closes sheet)

**Screenshot**: New session bottom sheet

---

### Step 2.3: Enter Patient Details
**Action**:
1. Enter patient name: `Test Patient`
2. Enter HN: `TEST001`
3. Select template: `SOAP` (default)
4. Click "Start Recording"

**Expected Behavior**:
- Form validates (patient name required)
- Session created in database
- Navigates to Record page
- Orb animation visible
- Microphone permission requested (first time)

**Verify**:
- [ ] Session creation time: _____ seconds (target: < 1s)
- [ ] Navigation to `/record/[sessionId]` successful
- [ ] Orb animation starts immediately
- [ ] Recording timer starts at 00:00
- [ ] Mic permission prompt appears (if first time)
- [ ] Patient name displayed on Record page

**Screenshot**: Record page with orb

**Notes**: Any delay between clicking and recording start? _______________

---

## 📍 Test 3: Recording Flow

### Step 3.1: Start Recording
**Action**: Tap the orb (or it auto-starts)

**Expected Behavior**:
- Red recording dot appears (top bar)
- Timer starts counting up
- Orb pulses/breathes during recording
- "Listening" status shown
- Transcript area shows "Transcript will appear here..."

**Verify**:
- [ ] Recording indicator visible (red dot)
- [ ] Timer counts up smoothly (no stuttering)
- [ ] Orb animation smooth (60fps)
- [ ] Status text: "กำลังฟัง..." / "Listening..."
- [ ] No console errors
- [ ] Browser shows recording indicator (if supported)

**Screenshot**: Recording in progress

---

### Step 3.2: Speak Test Audio
**Action**: Play 3-minute mock consultation audio

**Mock Script** (if recording live):
```
Patient: I've been having headaches for the past 3 days.
Doctor: Can you describe the pain?
Patient: It's a dull ache, mostly in the forehead.
Doctor: Any other symptoms?
Patient: Some nausea, no fever.
Doctor: Let me check your vitals... Blood pressure is 140/90.
Assessment: Tension headache, possibly stress-related.
Plan: Rest, hydration, paracetamol 500mg PRN. Follow up in 1 week.
```

**Expected Behavior**:
- Audio captured clearly
- Waveform/orb reacts to voice
- No clipping or distortion
- Timer continues counting

**Verify**:
- [ ] Audio quality clear (playback test)
- [ ] Orb responds to voice volume
- [ ] No audio dropouts
- [ ] Recording duration: _____ seconds (target: 180s)

**Screenshot**: Mid-recording

---

### Step 3.3: Pause/Resume (Optional)
**Action**: 
1. Tap pause button (during recording)
2. Wait 5 seconds
3. Tap resume button

**Expected Behavior**:
- Pause: Orb stops pulsing, timer pauses
- Resume: Orb resumes pulsing, timer continues
- No audio lost during pause

**Verify**:
- [ ] Pause button visible and clickable
- [ ] Timer pauses immediately
- [ ] Orb animation changes (paused state)
- [ ] Resume works smoothly
- [ ] Audio continues after resume

**Skip if**: Not testing pause feature

---

### Step 3.4: Stop Recording
**Action**: Tap "Done" button (square icon)

**Expected Behavior**:
- Recording stops immediately
- Navigates to Processing page
- Audio blob created (check DevTools)
- No audio lost (full duration preserved)

**Verify**:
- [ ] "Done" button clickable
- [ ] Navigation to `/processing/[sessionId]` immediate
- [ ] Audio blob size: _____ KB (expected: ~100-300 KB for 3 min)
- [ ] No error messages
- [ ] Recording duration preserved: _____ seconds

**Screenshot**: Processing page (stage 1)

**Notes**: Any delay between tap and navigation? _______________

---

## 📍 Test 4: Processing Flow

### Step 4.1: Upload Stage
**Action**: Observe Processing page (first 1-2 seconds)

**Expected Behavior**:
- Stage 1 highlighted: "Uploading audio..."
- Progress bar shows 1/3 complete
- Orb animation continues (blue)
- Subtext: "Preparing your recording"

**Verify**:
- [ ] Stage 1 label visible
- [ ] Progress indicator shows 33%
- [ ] Orb animation smooth
- [ ] Upload time: _____ seconds (target: < 2s)
- [ ] No console errors

**Screenshot**: Processing stage 1

---

### Step 4.2: Transcription Stage
**Action**: Observe Processing page (seconds 2-10)

**Expected Behavior**:
- Stage 2 highlighted: "Transcribing..."
- Progress bar shows 2/3 complete
- Subtext: "Whisper AI is processing speech"
- Orb animation continues

**Verify**:
- [ ] Stage transition smooth (1 → 2)
- [ ] Stage 2 label visible
- [ ] Progress indicator shows 66%
- [ ] Transcription time: _____ seconds (target: 5-10s)
- [ ] No timeout errors

**Screenshot**: Processing stage 2

---

### Step 4.3: Note Generation Stage
**Action**: Observe Processing page (seconds 10-30)

**Expected Behavior**:
- Stage 3 highlighted: "Generating note..."
- Progress bar shows 3/3 complete
- Subtext: "Creating your clinical note"
- Orb animation continues

**Verify**:
- [ ] Stage transition smooth (2 → 3)
- [ ] Stage 3 label visible
- [ ] Progress indicator shows 100%
- [ ] Generation time: _____ seconds (target: 10-20s)
- [ ] No timeout errors

**Screenshot**: Processing stage 3

---

### Step 4.4: Navigate to Note
**Action**: Wait for processing to complete

**Expected Behavior**:
- Automatically navigates to `/note/[noteId]`
- Note content fully rendered
- All 4 SOAP sections visible
- Patient name displayed
- "Finalize" and "Edit" buttons visible

**Verify**:
- [ ] Navigation automatic (no user action needed)
- [ ] Note load time: _____ seconds (target: < 1s)
- [ ] All 4 sections present (S/O/A/P)
- [ ] Content not empty (AI generated text)
- [ ] Patient name correct
- [ ] Timestamp visible
- [ ] "Finalized" / "Draft" badge shown

**Screenshot**: Note view (full page)

**Total Processing Time**: _____ seconds (target: < 30s)

**Notes**: Any stage that felt too slow? _______________

---

## 📍 Test 5: Note Review & Edit

### Step 5.1: Review Note Content
**Action**: Read through all SOAP sections

**Expected Behavior**:
- Subjective: Patient's symptoms, history
- Objective: Vitals, exam findings
- Assessment: Diagnosis, reasoning
- Plan: Treatment, follow-up

**Verify**:
- [ ] Subjective section coherent
- [ ] Objective section includes vitals
- [ ] Assessment has diagnosis
- [ ] Plan includes medication + follow-up
- [ ] Medical terminology accurate
- [ ] Thai/English matches recording language
- [ ] No gibberish or hallucinations

**Notes**: Quality score (1-10): _____  
**Issues found**: _______________

---

### Step 5.2: Expand/Collapse Sections
**Action**: Tap each section header

**Expected Behavior**:
- Sections expand/collapse smoothly
- Content hidden when collapsed
- Icon/arrow indicates state

**Verify**:
- [ ] All sections collapsible
- [ ] Animation smooth
- [ ] State indicator clear
- [ ] No content lost on collapse

---

### Step 5.3: View Transcript
**Action**: Tap "View transcript" button

**Expected Behavior**:
- Transcript expands below note
- Full transcription visible
- Toggle button changes to "Hide transcript"

**Verify**:
- [ ] Transcript visible
- [ ] Matches what was spoken
- [ ] Timestamp included (if available)
- [ ] Toggle works (show/hide)

**Screenshot**: Note with transcript expanded

---

### Step 5.4: Copy Note
**Action**: Tap "Copy" button

**Expected Behavior**:
- Note content copied to clipboard
- Button shows "Copied" confirmation
- Toast/snackbar appears (if implemented)

**Verify**:
- [ ] Copy button clickable
- [ ] Confirmation shown ("Copied")
- [ ] Paste into text editor works
- [ ] Format preserved (plain text)
- [ ] All sections included

**Test**: Paste into Notes/TextEdit and verify content

---

### Step 5.5: Export PDF
**Action**: Tap "PDF" button

**Expected Behavior**:
- PDF generated
- Download starts automatically
- PDF opens in new tab (or downloads)

**Verify**:
- [ ] PDF button clickable
- [ ] Download starts: _____ seconds (target: < 3s)
- [ ] PDF file size: _____ KB
- [ ] PDF opens correctly
- [ ] All sections included
- [ ] Formatting clean (readable)
- [ ] Patient name in filename

**Screenshot**: PDF preview

**Issues found**: _______________

---

### Step 5.6: Edit Note (AI Regenerate)
**Action**: 
1. Tap "Edit" button
2. Navigate to Note Editor
3. Tap "Regenerate" on Assessment section
4. Wait for regeneration

**Expected Behavior**:
- Navigates to `/note/[noteId]/edit`
- All 4 sections editable (TipTap editor)
- "Regenerate" button on each section
- Regeneration completes in < 10s
- New content replaces old

**Verify**:
- [ ] Navigation to editor successful
- [ ] All sections editable
- [ ] TipTap toolbar visible (if implemented)
- [ ] Regenerate button works
- [ ] Regeneration time: _____ seconds (target: 5-10s)
- [ ] New content different from original
- [ ] Other sections unchanged

**Screenshot**: Note editor

---

### Step 5.7: Hanna Command
**Action**:
1. Type in command bar: "Make this more concise"
2. Press Enter
3. Wait for AI to apply

**Expected Behavior**:
- Command sent to backend
- All sections updated
- Loading indicator shown
- Changes applied in < 15s

**Verify**:
- [ ] Command input visible
- [ ] Enter key works
- [ ] Loading state shown
- [ ] Command applied: _____ seconds (target: 10-15s)
- [ ] Note is more concise
- [ ] Medical accuracy preserved

**Notes**: Command quality (1-10): _____

---

### Step 5.8: Save Changes
**Action**: Tap "Save" button

**Expected Behavior**:
- Changes saved to database
- "Saved" confirmation shown
- Button changes to green checkmark

**Verify**:
- [ ] Save button clickable
- [ ] Save time: _____ seconds (target: < 2s)
- [ ] Confirmation shown ("Saved")
- [ ] Changes persist (refresh and check)

---

### Step 5.9: Finalize Note
**Action**: Tap "Review & Finalize" button

**Expected Behavior**:
- Note status changes to "Finalized"
- Navigates back to Note View
- "Clinician-reviewed" badge shown
- Note locked from further edits (or requires amendment)

**Verify**:
- [ ] Finalize button clickable
- [ ] Status changes to "Finalized"
- [ ] Badge: "Clinician-reviewed" visible
- [ ] Timestamp updated
- [ ] Note persists after refresh

**Screenshot**: Finalized note

---

## 📍 Test 6: Free Plan Limit → Upgrade

### Step 6.1: Check Usage
**Action**: Navigate to Settings tab

**Expected Behavior**:
- Current plan shown: "Free"
- Notes this month: [count]
- Limit: 10 notes/month
- "Upgrade" button visible

**Verify**:
- [ ] Plan displayed correctly
- [ ] Note count accurate
- [ ] Limit shown (10 notes)
- [ ] Upgrade button visible

**Screenshot**: Settings page

---

### Step 6.2: Exceed Free Limit
**Action**: Create 10+ notes (or simulate)

**Expected Behavior**:
- On 11th note attempt, upgrade modal appears
- Modal shows pricing (Pro/Clinic)
- "Select Pro" button enabled

**Verify**:
- [ ] Upgrade modal triggers at note 11
- [ ] Pricing displayed (฿1,990/฿4,990)
- [ ] Features listed correctly
- [ ] Modal cannot be dismissed (force upgrade)

**Skip if**: Manually trigger upgrade modal instead

---

### Step 6.3: Open Upgrade Modal
**Action**: Tap "Upgrade" button (from Settings or FAB)

**Expected Behavior**:
- Modal slides up
- Pro plan highlighted as "POPULAR"
- Clinic plan shows "Up to 5 team members"
- Both CTAs enabled

**Verify**:
- [ ] Modal animation smooth
- [ ] Pro plan features listed
- [ ] Clinic plan features listed
- [ ] Pricing correct
- [ ] Payment methods shown (Card/PromptPay)

**Screenshot**: Upgrade modal

---

### Step 6.4: Select Pro Plan
**Action**: Tap "Select Pro" button

**Expected Behavior**:
- Stripe Checkout opens (new tab or redirect)
- Product details shown: "Hanna Scribe Pro"
- Price: ฿1,990/month
- Email pre-filled (from account)

**Verify**:
- [ ] Stripe Checkout loads: _____ seconds (target: < 3s)
- [ ] Product name correct
- [ ] Price correct (฿1,990)
- [ ] Email pre-filled
- [ ] Payment methods available (Card, PromptPay)

**Screenshot**: Stripe Checkout page

---

### Step 6.5: Complete Payment
**Action**:
1. Enter test card: `4242 4242 4242 4242`
2. Expiry: Any future date
3. CVC: Any 3 digits
4. Click "Pay"

**Expected Behavior**:
- Payment processes
- Success page shown
- Redirects back to app
- Plan updates to "Pro"

**Verify**:
- [ ] Payment processes: _____ seconds (target: 3-5s)
- [ ] Success page visible
- [ ] Redirect to app automatic
- [ ] Plan updates to "Pro" immediately
- [ ] Usage limit removed (unlimited notes)

**Screenshot**: Payment success

---

### Step 6.6: Verify Upgrade
**Action**: Navigate to Settings tab

**Expected Behavior**:
- Plan shown: "Pro"
- Notes this month: [count]
- Limit: "Unlimited"
- Next billing date shown

**Verify**:
- [ ] Plan displays "Pro"
- [ ] Limit shows "Unlimited"
- [ ] Billing cycle date shown
- [ ] Receipt email received (check inbox)

**Screenshot**: Settings page (Pro plan)

---

## 📍 Test 7: Post-Upgrade Flow

### Step 7.1: Create Unlimited Notes
**Action**: Create 11th note (first as Pro user)

**Expected Behavior**:
- No upgrade modal
- Recording starts immediately
- Full features available

**Verify**:
- [ ] No upgrade modal
- [ ] Note created successfully
- [ ] All features work (PDF, AI commands, etc.)

---

### Step 7.2: Test Handover Feature (Pro Only)
**Action**: Navigate to Handover tab

**Expected Behavior**:
- Handover summary generated
- Patient list shown
- "Export PDF" button enabled

**Verify**:
- [ ] Handover tab accessible
- [ ] Summary auto-generates
- [ ] Patient count correct
- [ ] PDF export works

---

## 📊 Performance Benchmarks

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Landing page load | < 3s | _____ | ☐ |
| Login page load | < 2s | _____ | ☐ |
| Account creation | < 2s | _____ | ☐ |
| Session creation | < 1s | _____ | ☐ |
| Recording start | < 1s | _____ | ☐ |
| Processing total | < 30s | _____ | ☐ |
| Note generation | < 20s | _____ | ☐ |
| PDF export | < 3s | _____ | ☐ |
| Stripe checkout | < 3s | _____ | ☐ |
| Payment processing | < 5s | _____ | ☐ |

---

## 🐛 Bug Tracking Template

For each bug found, document:

```
### Bug #[Number]: [Short Description]

**Severity**: Critical / High / Medium / Low

**Location**: [Page/Component]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:


**Actual Behavior**:


**Screenshot/Video**:


**Browser/Device**:


**Notes**:
```

---

## ✅ Test Completion Checklist

- [ ] All 7 test flows completed
- [ ] All performance metrics recorded
- [ ] All bugs documented
- [ ] Screenshots captured
- [ ] Feedback notes compiled
- [ ] Priority issues identified
- [ ] Ready for UI/UX improvement phase

---

## 📈 Success Criteria

**Test passes if**:
- ✅ No critical bugs (app-breaking)
- ✅ 90%+ of steps complete successfully
- ✅ Average performance within 20% of targets
- ✅ Payment flow works end-to-end
- ✅ Note quality acceptable (7/10+)

**Test fails if**:
- ❌ Critical bug in core flow (signup, record, payment)
- ❌ >3 high-severity bugs
- ❌ Performance >50% over targets
- ❌ Payment fails twice
- ❌ Note quality unacceptable (<5/10)

---

## 🔄 Iteration Plan

After each test cycle:
1. **Review findings** (15 min)
2. **Prioritize bugs** (15 min)
3. **Fix critical issues** (2-4 hours)
4. **Re-test failed steps** (30 min)
5. **Document improvements** (15 min)

**Target**: 3 test cycles before launch

---

**Test Conductor**: _______________  
**Date**: _______________  
**Total Duration**: _______________  
**Overall Result**: ☐ Pass / ☐ Fail / ☐ Conditional Pass

**Notes for UI/UX Team**:
_______________
_______________
_______________
