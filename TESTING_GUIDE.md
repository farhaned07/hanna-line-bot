# 🧪 Hanna Scribe - Local Testing Guide

## ✅ Current Setup (All Running on Localhost)

| Server | Port | URL | Status |
|--------|------|-----|--------|
| **Landing Page** | 3000 | http://localhost:3000 | ✅ Running |
| **Scribe PWA** | 5174 | http://localhost:5174/scribe/app/ | ✅ Running |
| **Test Backend** | 3001 | http://localhost:3001 | ✅ Running |

---

## 🚀 Quick Start Testing

### **1. Open the App**

**Landing Page:**
```
http://localhost:3000
```

**Scribe PWA (Direct):**
```
http://localhost:5174/scribe/app/login
```

---

### **2. Test Authentication**

**Test Credentials:**
- **Email**: Any valid email format (e.g., `doctor@test.com`, `test@hospital.go.th`)
- **Password**: None required (passwordless auth)
- **Name**: Optional (for registration)

**Test Flow:**
1. Visit http://localhost:5174/scribe/app/login
2. Enter email: `doctor@test.com`
3. Click "Sign In" (or "Create Account" for new user)
4. Should redirect to Home page

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to `/` (Home)
- ✅ User data stored in localStorage

---

### **3. Test Full Workflow**

#### **Step 1: Create Session**
1. From Home, tap **+** (FAB button)
2. Enter patient name: "John Doe"
3. Enter HN: "123456"
4. Select template: "SOAP"
5. Click "Start Recording"

**Expected API Call:**
```
POST /api/scribe/sessions
Response: { id: "session_xxx", patient_name: "John Doe", ... }
```

---

#### **Step 2: Recording (Mock)**
1. Recording screen appears with orb animation
2. Timer starts counting
3. Click "Done"

**Note:** Real audio recording requires HTTPS or proper browser permissions. For testing, you can skip to mock transcription.

---

#### **Step 3: Transcription (Mock)**
After clicking "Done", you'll see:
- Processing screen with 3 stages
- Mock transcript appears

**Mock Transcript:**
```
Patient presents with chief complaint of fatigue for the past two weeks...
```

---

#### **Step 4: Note Generation (Mock)**
After processing:
- Auto-navigates to Note View
- Shows generated SOAP note with 4 sections:
  - **Subjective**: Patient's symptoms
  - **Objective**: Physical exam findings
  - **Assessment**: Diagnosis
  - **Plan**: Treatment plan

---

#### **Step 5: Edit Note**
1. Click "Edit" button
2. Modify any section
3. Try AI commands:
   - "Make concise"
   - "Expand"
   - "Add vitals"
4. Click "Save"

**Expected API Call:**
```
PATCH /api/scribe/notes/:id
Response: Updated note object
```

---

#### **Step 6: Finalize Note**
1. Click "Review & Finalize"
2. Note status changes to "Clinician-reviewed"
3. Green badge appears

**Expected API Call:**
```
POST /api/scribe/notes/:id/finalize
Response: { status: "finalized", finalized_at: "..." }
```

---

#### **Step 7: Export/Share**
1. Click "Copy" to copy note to clipboard
2. Click "PDF" to download (mock PDF)
3. Swipe left on session card → Delete
4. Swipe right → Export

---

## 🧪 Test Scenarios

### **Scenario 1: Free Plan → Upgrade**

1. Login with new email
2. Create 10 sessions (free plan limit)
3. Try to create 11th session
4. Upgrade modal should appear
5. Click "Select Pro"
6. Mock Stripe checkout opens

**Expected:**
- ✅ Usage counter shows "10/10 notes"
- ✅ Upgrade modal blocks further creation
- ✅ Checkout URL: `https://checkout.stripe.com/test?plan=pro`

---

### **Scenario 2: Session Management**

**Create Multiple Sessions:**
```bash
# Test via API
curl -X POST http://localhost:3001/api/scribe/sessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patient_name":"Patient 1","hn":"001"}'
```

**Expected:**
- ✅ Sessions appear in Home list
- ✅ Grouped by date (Today/Yesterday)
- ✅ Swipe gestures work (delete/export)

---

### **Scenario 3: AI Commands**

**In Note Editor:**
1. Select a section (e.g., Subjective)
2. Type command: "Make it shorter"
3. Click send

**Mock Responses:**
- "make concise" → Truncated text
- "expand" → Added details
- "add vitals" → Appends vital signs

---

### **Scenario 4: Offline Mode (PWA)**

**Test Offline:**
1. Open DevTools → Network tab
2. Select "Offline"
3. Reload page
4. Should show offline.html

**Expected:**
- ✅ Service worker registered
- ✅ Cached assets load
- ✅ Offline page appears

---

## 🐛 Debugging Tips

### **Check API Calls**

**Browser DevTools:**
1. Open DevTools (F12)
2. Network tab
3. Filter: `/api/scribe`
4. Check request/response

**Expected Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

### **Check localStorage**

**Browser Console:**
```javascript
// Check authentication
localStorage.getItem('scribe_token')
localStorage.getItem('scribe_user')

// Check PDPA consent
localStorage.getItem('scribe_pdpa_consent')

// Clear all
localStorage.clear()
```

---

### **Check Backend Logs**

**Terminal running test-backend.js:**
```
✅ User logged in: doctor@test.com
📝 Session created: session_xxx
📄 Note generated: note_xxx
✏️ Note updated: note_xxx
✅ Note finalized: note_xxx
```

---

## 🔧 Restart Servers

If something breaks:

```bash
# Kill all servers
killall node

# Restart test backend
cd /Users/mac/hanna-line-bot-1
node test-backend.js &

# Restart Scribe (in another terminal)
cd scribe
npm run dev &

# Restart Landing (in another terminal)
cd landing
npm run dev &
```

---

## 📊 Test Data

### **Mock Users Created:**
- `test@test.com` (Pro plan)
- `doctor@hospital.go.th` (Pro plan)
- Any email you use during testing

### **Mock Sessions/Notes:**
- Stored in-memory (cleared when backend restarts)
- Each user can only access their own data
- JWT token expires in 30 days

---

## 🎯 Testing Checklist

### **Critical Paths (P0)**
- [ ] Login/Register works
- [ ] Create session
- [ ] Recording UI appears
- [ ] Processing screen shows stages
- [ ] Note view displays SOAP sections
- [ ] Note editor allows editing
- [ ] Finalize note works
- [ ] Export/Copy works

### **Important Features (P1)**
- [ ] Swipe gestures (delete/export)
- [ ] AI commands work
- [ ] Regenerate section works
- [ ] Billing status shows correct plan
- [ ] Upgrade modal appears at limit
- [ ] PDPA consent modal appears

### **Nice-to-Have (P2)**
- [ ] Handover summary generates
- [ ] Settings page works
- [ ] Language toggle works
- [ ] Keyboard shortcuts work
- [ ] Haptic feedback (mobile only)
- [ ] PWA install prompt appears

---

## 🆘 Common Issues

### **"Network Error" on Login**
**Fix:** Check if test backend is running on port 3001
```bash
lsof -i :3001
```

### **"404 Not Found" on API calls**
**Fix:** Check vite proxy config in `scribe/vite.config.js`
```javascript
proxy: {
    '/api': {
        target: 'http://localhost:3001',  // Should be 3001
        changeOrigin: true
    }
}
```

### **Blank Page After Login**
**Fix:** Clear localStorage and reload
```javascript
localStorage.clear()
location.reload()
```

### **Orb Animation Not Showing**
**Fix:** Check browser console for CSS errors. May need to rebuild:
```bash
cd scribe
npm run build
```

---

## 📝 Test Script Template

**Copy this for testing sessions:**

```
TEST SESSION: [Feature Name]
DATE: [Date]
TESTER: [Your Name]

STEPS:
1. [Step 1]
2. [Step 2]
3. [Step 3]

EXPECTED: [What should happen]
ACTUAL: [What actually happened]
STATUS: ✅ Pass / ❌ Fail
NOTES: [Any observations]
```

---

**Happy Testing! 🎉**

For issues or questions, check the backend terminal logs or browser console.
