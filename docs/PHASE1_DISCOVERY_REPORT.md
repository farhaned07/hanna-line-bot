# 🔍 Phase 1: Discovery Report — Hanna Codebase & Deployment Analysis

**Date**: March 5, 2026  
**Status**: Complete  
**Next**: Awaiting user decisions before Phase 2

---

## 📊 **Executive Summary**

### **The Situation:**

Your Hanna project has **significant complexity and fragmentation**:

| Metric | Count | Status |
|--------|-------|--------|
| **Local Git Repos** | 8 Hanna-related | ⚠️ Too many |
| **GitHub Repos** | 3 active | ✅ Manageable |
| **Deployments** | 3+ (Railway + Vercel) | ⚠️ Confusing |
| **node_modules folders** | 52 in current repo only | ❌ Critical bloat |
| **Backup folders** | 4 (hanna-line-bot-1/2, nurse-dashboard-1) | ❌ Unused |
| **Documentation files** | 33 in /docs | ⚠️ Fragmented |

---

## 🗂️ **1. Git Repository Map**

### **Active Repos (GitHub)**

| Repo | URL | Purpose | Last Commit | Status |
|------|-----|---------|-------------|--------|
| **hanna-line-bot** | github.com/farhaned07/hanna-line-bot | Main backend + Scribe PWA | 2 hours ago | ✅ **ACTIVE** |
| **Hanna-Ai-Nurse** | github.com/farhaned07/Hanna-Ai-Nurse | Landing page (hanna.care) | 1 day ago | ✅ **ACTIVE** |
| **hanna-nurse-dashboard** | github.com/farhaned07/hanna-nurse-dashboard | Nurse dashboard (Care Intelligence) | Unknown | ⚠️ **UNCLEAR** |

### **Local Backup Repos (Should be archived/deleted)**

| Folder | Purpose | Last Commit | Recommendation |
|--------|---------|-------------|----------------|
| `hanna-line-bot-1` | Old backend backup | Feb 25, 2026 | ❌ **DELETE** |
| `hanna-line-bot-2` | Old backend backup | Unknown | ❌ **DELETE** |
| `hanna-line-bot-3` | **CURRENT WORKING FOLDER** | Today | ✅ **KEEP** |
| `hanna-nurse-dashboard-1` | Old dashboard backup | Unknown | ❌ **DELETE** |
| `hannah-server` | Very old server code | Initial commit only | ❌ **DELETE** |

### **Other Projects (NOT Hanna-related)**

Found 40+ other git repos on your machine:
- **onnesha.ai** (17 versions!) — Different project
- **gemini-ai-chatbot** (4 versions) — Different project
- **fastcare** (3 versions) — Different project
- **pump-fun-sniper-bot** — Crypto project
- **ai-chatbot**, **swift-chat**, etc. — Other projects

**Recommendation**: These are fine, but consider cleaning up versioned backups (onnesha.ai-1 through onnesha.ai-17)

---

## 🚂 **2. Deployment Map**

### **Production Deployments**

| Deployment | Platform | URL | Purpose | Status |
|------------|----------|-----|---------|--------|
| **Backend API** | Railway | `hanna-line-bot-production.up.railway.app` | Scribe API + Care Intelligence API | ✅ **LIVE** |
| **Scribe PWA** | Vercel | `hanna.care/scribe/app` | Voice documentation app | ✅ **LIVE** |
| **Landing Page** | Vercel | `hanna.care` | Marketing site | ✅ **LIVE** |
| **Nurse Dashboard** | Vercel | Unknown URL | Care Intelligence dashboard | ⚠️ **NEEDS VERIFICATION** |

### **Deployment Configuration**

**Current Setup:**
```
hanna-line-bot-3/ (current folder)
├── vercel.json → Deploys /client folder (Nurse Dashboard)
├── railway.toml → Deploys backend API
├── scribe/ → Deployed separately to Vercel
└── hanna-web/ → LINE voice interface (deployed where?)
```

**Problem**: The main `vercel.json` deploys `/client` (Nurse Dashboard) but Scribe PWA is in `/scribe` and deployed separately. This is confusing.

---

## 📁 **3. Current Codebase Structure**

### **hanna-line-bot-3/ (Current Working Folder)**

```
hanna-line-bot-3/
├── src/                    # Backend API (Express + Node.js)
│   ├── routes/            # API routes (scribe.js, nurse.js, etc.)
│   ├── services/          # Business logic (deepgram.js, groq.js, medicalTerms.js)
│   ├── handlers/          # LINE webhook handlers
│   └── config/            # Configuration
│
├── scribe/                # Scribe PWA (React + TypeScript)
│   ├── src/
│   │   ├── pages/        # Login, Home, Record, Processing, NoteView, etc.
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom hooks (useRecorder, useHapticFeedback, etc.)
│   │   └── api/          # API client
│   ├── dist/             # Build output (DEPLOYED)
│   └── package.json
│
├── client/                # Nurse Dashboard (React) - Care Intelligence
│   ├── src/
│   └── package.json
│
├── hanna-web/             # LINE Voice Interface (LIFF app)
│   ├── src/
│   └── package.json
│
├── public/                # Static files (call.html, index.html)
├── docs/                  # Documentation (33 files!)
├── migrations/            # Database migrations
├── scripts/               # Utility scripts
├── tests/                 # Test files
├── node_modules/          # 52 folders of dependencies! 🚨
└── package.json           # Main backend dependencies
```

### **Issues Found:**

1. **52 node_modules folders** — Massive bloat, slows down everything
2. **3 separate frontend apps** in one repo:
   - `scribe/` — Scribe PWA
   - `client/` — Nurse Dashboard
   - `hanna-web/` — LINE Voice Interface
3. **Mixed deployment configs** — vercel.json deploys `/client` but Scribe is separate
4. **No clear separation** between Scribe and Care Intelligence code

---

## 📚 **4. Documentation Analysis**

### **Current Documentation (33 files in /docs)**

| File | Purpose | Product | Status |
|------|---------|---------|--------|
| **PRODUCT_WIREFRAME.md** | Scribe UX architecture | Scribe | ✅ **NEW & GOOD** |
| **PRODUCT_CANON.md** | Care Intelligence strategy | Care Intelligence | ⚠️ **OUTDATED** |
| **PRODUCT_MANUAL.md** | Care Intelligence technical | Care Intelligence | ⚠️ **PARTIAL** |
| **README.md** | Main overview | Both | ✅ **UPDATED** |
| **SCRIBE_GUIDE.md** | Scribe user manual | Scribe | ✅ **GOOD** |
| **SCRIBE_LAUNCH_CHECKLIST.md** | Scribe launch prep | Scribe | ✅ **GOOD** |
| **SCRIBE_E2E_TEST_SCRIPT.md** | Scribe testing | Scribe | ✅ **GOOD** |
| **MESSAGING_GUIDE.md** | Language standards | Care Intelligence | ⚠️ **OUTDATED** |
| **REGULATORY_POSTURE.md** | Legal framework | Care Intelligence | ✅ **GOOD** |
| **DEPLOYMENT_RUNBOOK.md** | Deployment guide | Both | ⚠️ **NEEDS UPDATE** |
| **ARCHITECTURE.md** | System design | Both | ✅ **GOOD** |
| **sales/** (10 files) | Sales collateral | Care Intelligence | ⚠️ **LEGACY** |
| **archive/** (2 files) | Old deployment guides | Legacy | ✅ **ARCHIVED** |

### **Documentation Problems:**

1. **Two products, mixed docs** — Scribe and Care Intelligence docs are intermingled
2. **Outdated strategy** — PRODUCT_CANON.md still says "financial risk engine for capitation"
3. **No unified vision** — No document explains how Scribe + Care Intelligence relate
4. **Sales docs for wrong product** — /docs/sales/ is all Care Intelligence (hospital sales)
5. **No Scribe sales docs** — Scribe is self-serve SaaS, needs different collateral

---

## 🎯 **5. Product Confusion**

### **What We're Building (Unclear)**

| Product | Description | Status | Priority |
|---------|-------------|--------|----------|
| **Scribe** | Voice-first clinical documentation | ✅ Live | 🟢 **LAUNCH PRIORITY** |
| **Care Intelligence** | LINE-based chronic monitoring | ✅ Live | 🟡 **MAINTENANCE** |
| **Care Plan** | ??? (mentioned in wireframe) | ❌ Not built | ⚪ **FUTURE** |
| **Follow-up** | ??? (mentioned in wireframe) | ❌ Not built | ⚪ **FUTURE** |

### **Business Model Confusion:**

| Product | Model | Price | Sales Motion |
|---------|-------|-------|--------------|
| **Scribe** | Self-serve SaaS | ฿1,990-4,990/mo | Online signup |
| **Care Intelligence** | B2B Enterprise | ฿50,000-60,000/mo | Hospital sales cycle |

**Problem**: These are **fundamentally different businesses** with different:
- Sales motions (self-serve vs. enterprise sales)
- Pricing (10x difference)
- Target customers (individual doctors vs. hospitals)
- Marketing channels (online vs. hospital visits)

---

## ⚠️ **6. Critical Issues Found**

### **🔴 CRITICAL (Must Fix Before Launch)**

1. **52 node_modules folders** — Bloat, security risk, slow builds
2. **No unified product vision** — Two products, no clear strategy
3. **Mixed deployment configs** — Confusing vercel.json setup
4. **4 backup folders** — Wasting disk space, confusing

### **🟡 HIGH (Should Fix)**

1. **Outdated documentation** — PRODUCT_CANON.md, MESSAGING_GUIDE.md
2. **No Scribe sales docs** — Self-serve needs different collateral
3. **Unclear Nurse Dashboard status** — Is it deployed? Where?
4. **Multiple .env files** — Security risk

### **🟢 MEDIUM (Nice to Have)**

1. **No CI/CD pipeline** — Manual deployments
2. **No staging environment** — Testing directly on production
3. **No error tracking** — No Sentry/log monitoring
4. **No analytics** — No usage tracking

---

## 💡 **7. Recommendations**

### **Option A: Consolidate Everything** (Recommended)

**Create a proper monorepo structure:**

```
hanna/ (new root)
├── apps/
│   ├── backend/           # Current src/ (Railway)
│   ├── scribe/            # Current scribe/ (Vercel)
│   ├── landing/           # Current Hanna-Ai-Nurse repo (Vercel)
│   └── nurse-dashboard/   # Current client/ (Vercel)
├── packages/
│   ├── ui/                # Shared UI components
│   └── config/            # Shared configs
├── docs/
│   ├── PRODUCT_SPEC.md    # Unified product spec
│   ├── scribe/            # Scribe-specific docs
│   └── care-intelligence/ # Care Intelligence docs
└── tooling/
    ├── ci/                # CI/CD pipelines
    └── scripts/           # Shared scripts
```

**Benefits:**
- Clear separation of concerns
- Single source of truth
- Easier to maintain
- Better for team collaboration

**Effort**: 8-12 hours

---

### **Option B: Split into Separate Repos** (Alternative)

**Create separate repos for each product:**

```
hanna-scribe/ (GitHub)
├── backend/
├── app/
└── docs/

hanna-care-intelligence/ (GitHub)
├── backend/
├── nurse-dashboard/
├── line-bot/
└── docs/

hanna-landing/ (GitHub)
└── (current landing page)
```

**Benefits:**
- Complete separation
- Independent deployment
- Clear ownership

**Drawbacks:**
- Code duplication (shared utilities)
- Harder to share components
- More repos to manage

**Effort**: 12-16 hours

---

### **Option C: Keep Current, Clean Up** (Minimum Viable)

**Keep current structure but:**
1. Delete backup folders (hanna-line-bot-1, -2, etc.)
2. Clean up node_modules
3. Update documentation
4. Clarify deployment configs

**Benefits:**
- Fastest (4-6 hours)
- Minimal disruption
- Gets you launch-ready faster

**Drawbacks:**
- Doesn't solve fundamental structure issues
- Will need refactoring later

**Effort**: 4-6 hours

---

## ❓ **8. Questions for You**

Before proceeding to Phase 2, I need answers to:

### **Product Strategy:**

1. **Are we building ONE product or TWO?**
   - Scribe only? (archive Care Intelligence)
   - Both equally? (need unified strategy)
   - Scribe first, Care Intelligence later?

2. **What's the 12-month vision?**
   - Scribe → 1000 paying users?
   - Care Intelligence → 10 hospital contracts?
   - Both?

3. **Should Care Intelligence be:**
   - Maintained as-is?
   - Integrated into Scribe?
   - Archived/sunset?

### **Repository Structure:**

4. **Do you want ONE monorepo or MULTIPLE repos?**
   - Monorepo: Easier to share code, single place
   - Multiple repos: Clearer separation, independent deployment

5. **What should we do with backup folders?**
   - Delete all?
   - Archive to separate "backups" folder?
   - Keep just the latest?

### **Deployments:**

6. **Where should each app be deployed?**
   - Backend API: Railway (current) ✅
   - Scribe PWA: Vercel (current) ✅
   - Landing: Vercel (current) ✅
   - Nurse Dashboard: ??? (unclear)

7. **Do you want staging environments?**
   - Separate staging + production?
   - Or just production for now?

### **Documentation:**

8. **Should I create ONE master document or keep separate?**
   - One PRODUCT_SPEC.md covering both products?
   - Separate docs for Scribe and Care Intelligence?

9. **What sales collateral do you need?**
   - Scribe: Landing page is enough?
   - Care Intelligence: Keep existing sales docs?

---

## 📋 **9. Next Steps**

### **After You Answer Questions:**

**Phase 2: Cleanup** (4-6 hours)
- Delete backup folders
- Clean up node_modules
- Archive legacy code
- Fix deployment configs

**Phase 3: Structure** (4-6 hours)
- Create clear folder structure
- Set up proper monorepo OR separate repos
- Configure CI/CD

**Phase 4: Documentation** (3-4 hours)
- Create master PRODUCT_SPEC.md
- Update README
- Archive outdated docs
- Create developer onboarding guide

**Phase 5: Polish** (3-4 hours)
- Run linter + fix issues
- Verify all deployments
- Test complete user journeys
- Create launch checklist

**Total Remaining Time: 14-20 hours**

---

## 🎯 **My Recommendation**

Based on my analysis:

### **Do Option C (Clean Up) FIRST, Then Option A (Monorepo) LATER**

**Why:**
1. You're **launch-ready for Scribe** — don't delay launch with major refactoring
2. **Clean up first** (delete backups, fix node_modules, update docs) — 4-6 hours
3. **Launch Scribe** — Get users, get feedback
4. **Refactor to monorepo later** — Once you have traction

**Immediate Actions:**
1. ✅ Delete 4 backup folders
2. ✅ Clean up node_modules (run `npm prune` everywhere)
3. ✅ Update PRODUCT_CANON.md to reflect Scribe-first strategy
4. ✅ Clarify deployment configs
5. ✅ Archive Care Intelligence sales docs

**After Launch:**
- Refactor to monorepo
- Add CI/CD
- Add staging environments
- Add error tracking

---

**Please answer the 9 questions above, then I'll proceed with Phase 2!** 🚀
