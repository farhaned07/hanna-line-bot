# 🗺️ DEPLOYMENT MAP & FIX

## Problem

**User visits:** `www.hanna.care/scribe/app/login`  
**Sees:** OLD Nurse Dashboard Login (with PIN) ❌  
**Should see:** NEW Scribe Login (email-only) ✅

## Root Cause

| Domain | Vercel Project | Builds Folder | What It Shows |
|--------|---------------|---------------|---------------|
| `hanna.care` | `hanna-line-bot` | `/client/` | Nurse Dashboard ❌ |
| `hanna-line-bot-production.up.railway.app` | Railway | `/src/` + `/scribe/dist/` | Scribe App ✅ |

**The Scribe app (`/scribe/` folder) is NOT deployed to Vercel at all!**

---

## The Fix: Deploy Scribe to NEW Vercel Project

### Step 1: Deploy Scribe to Vercel

```bash
cd /Users/mac/hanna-line-bot-3/scribe
vercel --prod
```

**OR via Dashboard:**

1. Go to https://vercel.com/new
2. Import: `farhaned07/hanna-line-bot`
3. **Root Directory:** `scribe`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Click **Deploy**

### Step 2: Add Custom Domain

In Vercel Dashboard (for the NEW Scribe project):

1. Go to **Project Settings** → **Domains**
2. Add: `scribe.hanna.care` or `app.hanna.care`
3. Verify DNS (add CNAME record)

### Step 3: Update vercel.json (Already Done)

The `scribe/vercel.json` already has:
- API proxy to Railway
- SPA rewrites

---

## After Fix: User Flows

### ✅ CORRECT Flow

```
User visits: scribe.hanna.care
    ↓
Vercel serves: /scribe/dist/ (Scribe App)
    ↓
User sees: Email-only login
    ↓
User enters: doctor@hospital.com
    ↓
Click "Sign In"
    ↓
Frontend calls: /api/scribe/auth/login
    ↓
Vercel proxies to Railway API
    ↓
Railway returns JWT token
    ↓
User logged in! ✅
```

---

## Current Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend API | ✅ Deployed | Railway |
| Scribe Frontend (Railway) | ✅ Deployed | `hanna-line-bot-production.up.railway.app/scribe/` |
| Scribe Frontend (Vercel) | ❌ NOT DEPLOYED | Need new Vercel project |
| Nurse Dashboard | ✅ Deployed | `hanna.care` |

---

## Quick Test (Works NOW)

While setting up Vercel, use Railway URL:

```
https://hanna-line-bot-production.up.railway.app/scribe/
```

- Enter any email
- Click Sign In
- Works! ✅

---

## Files Ready for Deployment

- ✅ `scribe/dist/` - Built frontend (email-only auth)
- ✅ `scribe/vercel.json` - Vercel config with API proxy
- ✅ `scribe/vite.config.js` - Correct base path
- ✅ Backend - Email-only auth on Railway

---

## Action Required

**Deploy Scribe to Vercel as separate project from `/scribe/` folder**

Then users can access:
- `scribe.hanna.care` (custom domain)
- OR Railway URL (immediate access)
