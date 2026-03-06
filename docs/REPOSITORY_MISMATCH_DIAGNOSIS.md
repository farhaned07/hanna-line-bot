# 🎯 REPOSITORY MISMATCH DIAGNOSIS

**Date:** March 7, 2026  
**Issue:** User sees old PIN login in production  
**Root Cause:** **WRONG DEPLOYMENT TARGET**

---

## 🔍 THE REAL PROBLEM

You have **THREE different deployments** serving **THREE different apps**:

| Deployment | Builds This Folder | Serves This App | URL |
|------------|-------------------|-----------------|-----|
| **Vercel #1** (Root) | `client/` | Nurse Dashboard | `hanna.care` |
| **Vercel #2** (Missing) | `scribe/` | **NOT DEPLOYED** | N/A |
| **Railway** | `/src/` + `/scribe/dist/` | Scribe App | `*.railway.app/scribe/` |

---

## 🚨 THE MISMATCH

**You're looking at:** `hanna.care/scribe/app/login`  
**What it actually is:** Nurse Dashboard login (from `client/` folder)  
**What you expect:** Scribe login (from `scribe/` folder)

**Why:** Vercel root project builds `client/`, NOT `scribe/`!

---

## ✅ THE SOLUTION

### Option 1: Use Railway URL (Immediate - 0 minutes)

**Just use this URL:**
```
https://hanna-line-bot-production.up.railway.app/scribe/
```

**Why it works:**
- Railway serves `/scribe/dist/` directly
- Already has new email-only login
- No configuration needed

---

### Option 2: Deploy Scribe to Separate Vercel Project (5 minutes)

**Steps:**
1. Go to https://vercel.com/new
2. Import: `farhaned07/hanna-line-bot`
3. **CRITICAL:** Set Root Directory to `scribe`
4. Build: `npm run build`, Output: `dist`
5. Deploy
6. Add custom domain: `scribe.hanna.care`

**Full guide:** `docs/DEPLOY_SCRIBE_TO_VERCEL_SEPARATE.md`

---

### Option 3: Fix Vercel Proxy (10 minutes - May Not Work)

**Current `vercel.json` tries to proxy:**
```json
{
    "source": "/scribe/:path*",
    "destination": "https://hanna-line-bot-production.up.railway.app/scribe/:path*"
}
```

**Problem:** Vercel may cache the proxy response.

**Fix:**
1. Clear Vercel build cache
2. Redeploy
3. Wait for cache to expire (up to 1 hour)

**Not recommended** - Option 1 or 2 is better.

---

## 📊 CORRECT URLS

| App | Correct URL | Wrong URL |
|-----|-------------|-----------|
| **Scribe** | `https://hanna-line-bot-production.up.railway.app/scribe/` | `hanna.care/scribe/...` |
| **Nurse Dashboard** | `https://hanna.care/dashboard/` | `*.railway.app/dashboard/` |
| **Scribe (Future)** | `https://scribe.hanna.care/` | N/A |

---

## 🔧 WHY THIS HAPPENED

1. **Monorepo Confusion:**
   - `/client/` = Nurse Dashboard
   - `/scribe/` = Scribe App
   - Both in same repo

2. **Vercel Configuration:**
   - Root `vercel.json` builds `client/`
   - `scribe/vercel.json` exists but not connected to Vercel

3. **User Assumption:**
   - `hanna.care/scribe/` should serve Scribe app
   - Actually serves `client/` folder (wrong app)

---

## ✅ VERIFICATION

### Test Railway (Should Work):
```bash
curl https://hanna-line-bot-production.up.railway.app/scribe/ | grep -o "Hanna Scribe"
# Should return: Hanna Scribe
```

### Test Vercel (Wrong App):
```bash
curl https://hanna.care/scribe/ | grep -o "Hanna Scribe"
# May return nothing or wrong app name
```

---

## 🎯 RECOMMENDATION

**Use Railway URL for now:**
```
https://hanna-line-bot-production.up.railway.app/scribe/
```

**Deploy to separate Vercel project for production:**
- Follow `docs/DEPLOY_SCRIBE_TO_VERCEL_SEPARATE.md`
- Use custom domain: `scribe.hanna.care`

**Stop using:** `hanna.care/scribe/...` (wrong app)

---

**Status:** ✅ **DIAGNOSED - USE RAILWAY URL**
