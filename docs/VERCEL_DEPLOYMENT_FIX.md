# 🚨 CRITICAL: VERCEL DEPLOYMENT FIX

**Date:** March 7, 2026  
**Issue:** TWO Vercel projects deploying from WRONG directory  
**Status:** ⚠️ **MANUAL ACTION REQUIRED**

---

## 🔍 THE PROBLEM

**Both Vercel projects were deploying from `landing/` directory!**

```json
// .vercel/repo.json (BEFORE - BROKEN)
{
  "projects": [
    {
      "name": "hanna-line-bot",
      "directory": "landing"  // ❌ Wrong
    },
    {
      "name": "hanna-ai-nurse-knhp",
      "directory": "landing"  // ❌ Wrong - should be "client"
    }
  ]
}
```

**This caused:**
- Landing page deployed to BOTH projects
- No Nurse Dashboard deployment
- No Scribe deployment
- Broken user funnel

---

## ✅ THE FIX (3 STEPS)

### Step 1: ✅ DONE - Fixed repo.json

```json
// .vercel/repo.json (AFTER - FIXED)
{
  "projects": [
    {
      "name": "hanna-line-bot",
      "directory": "landing"  // ✅ Landing page
    },
    {
      "name": "hanna-ai-nurse-knhp",
      "directory": "client"   // ✅ Nurse Dashboard
    },
    {
      "name": "hanna-scribe",
      "directory": "scribe"   // ✅ Scribe App (NEW)
    }
  ]
}
```

### Step 2: ✅ DONE - Fixed root vercel.json

```json
// vercel.json (AFTER - FIXED)
{
    "buildCommand": "cd landing && npm install && npm run build",
    "outputDirectory": "landing/dist",
    ...
}
```

### Step 3: ⏳ MANUAL - Create/Configure Vercel Projects

**YOU MUST DO THIS IN VERCEL DASHBOARD:**

---

## 📋 MANUAL STEPS (VERCEL DASHBOARD)

### Project 1: hanna-line-bot (Landing Page)

**Status:** ✅ Already exists  
**URL:** `hanna.care`

**Configuration:**
1. Go to https://vercel.com/dashboard
2. Select project: `hanna-line-bot`
3. Settings → General → **Root Directory:** `landing`
4. Settings → Build & Development Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Redeploy

**CTA Links:** Already point to Railway ✅

---

### Project 2: hanna-ai-nurse-knhp (Nurse Dashboard)

**Status:** ✅ Already exists  
**URL:** Configure custom domain (optional)

**Configuration:**
1. Go to https://vercel.com/dashboard
2. Select project: `hanna-ai-nurse-knhp`
3. Settings → General → **Root Directory:** `client`
4. Settings → Build & Development Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Redeploy

**CTA Links:** N/A (internal app)

---

### Project 3: hanna-scribe (Scribe App) - NEW

**Status:** ❌ **MUST CREATE**  
**URL:** `scribe.hanna.care` (custom domain)

**Configuration:**
1. Go to https://vercel.com/new
2. Import: `farhaned07/hanna-line-bot`
3. **⚠️ CRITICAL:** Set Root Directory to `scribe`
4. Settings → Build & Development Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Deploy
6. Settings → Domains → Add: `scribe.hanna.care`
7. Configure DNS (CNAME record)

**CTA Links:** Already configured to proxy API to Railway ✅

---

## 🎯 FINAL ARCHITECTURE

| Project | Directory | URL | Purpose |
|---------|-----------|-----|---------|
| **hanna-line-bot** | `landing/` | `hanna.care` | Landing page with CTA |
| **hanna-ai-nurse-knhp** | `client/` | TBD | Nurse Dashboard |
| **hanna-scribe** | `scribe/` | `scribe.hanna.care` | Scribe App (email-only login) |
| **Railway** | `/src/` + `/scribe/dist/` | `*.railway.app` | Backend API |

---

## 🔄 USER FUNNEL (AFTER FIX)

```
User visits: hanna.care (Vercel Project 1)
    ↓
Sees landing page
    ↓
Clicks "Try Free" CTA
    ↓
Opens: scribe.hanna.care (Vercel Project 3 - NEW)
    ↓
Sees email-only login (NO PIN)
    ↓
Enters: demo@hanna.care
    ↓
Signs in
    ↓
Scribe Home ✅
```

---

## ✅ VERIFICATION

### Test Landing Page
```bash
curl https://hanna.care | grep -o "Try Free"
# Should return: Try Free
```

### Test CTA Link
```bash
curl https://hanna.care | grep "href.*railway"
# Should return Railway URL
```

### Test Scribe (After creating Project 3)
```bash
curl https://scribe.hanna.care | grep -o "Hanna Scribe"
# Should return: Hanna Scribe
```

### Test Nurse Dashboard (After reconfiguring Project 2)
```bash
curl https://hanna-ai-nurse-knhp.vercel.app/dashboard | grep -o "Dashboard"
# Should return: Dashboard
```

---

## ⚠️ WHAT IF I DON'T CREATE PROJECT 3?

**Alternative:** Keep using Railway for Scribe:

1. Landing page CTA → Railway URL ✅ (Already fixed)
2. Don't create `hanna-scribe` Vercel project
3. Use: `hanna-line-bot-production.up.railway.app/scribe/`

**Pros:**
- No extra Vercel project to manage
- Already works
- No DNS configuration needed

**Cons:**
- Different domain (Railway vs. custom domain)
- Less professional appearance

---

## 📊 CURRENT STATUS

| Task | Status | Owner |
|------|--------|-------|
| Fix repo.json | ✅ Done | Dev |
| Fix root vercel.json | ✅ Done | Dev |
| Fix landing CTA links | ✅ Done | Dev |
| Reconfigure Project 1 (landing) | ⏳ Pending | User |
| Reconfigure Project 2 (client) | ⏳ Pending | User |
| Create Project 3 (scribe) | ⏳ Pending | User |

---

## 🚀 IMMEDIATE ACTION REQUIRED

**In Vercel Dashboard (https://vercel.com/dashboard):**

1. **Project 1 (hanna-line-bot):**
   - Set Root Directory to `landing`
   - Redeploy

2. **Project 2 (hanna-ai-nurse-knhp):**
   - Set Root Directory to `client`
   - Redeploy

3. **Project 3 (NEW - hanna-scribe):**
   - Create new project
   - Set Root Directory to `scribe`
   - Deploy
   - Add custom domain (optional)

---

**Code is fixed. Vercel configuration needs manual update.**

**Read:** `docs/VERCEL_DEPLOYMENT_FIX.md` for detailed steps.
