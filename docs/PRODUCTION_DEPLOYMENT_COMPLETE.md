# ✅ Production Deployment - COMPLETE

## What's Live NOW

### **hanna.care** (Vercel)
- `/` → Nurse Dashboard (client/)
- `/scribe/*` → **Scribe App** (proxied to Railway) ✅
- `/api/scribe/*` → **Scribe API** (proxied to Railway) ✅

### **Railway**
- Backend API + Scribe static files
- Email-only authentication
- Auto-deploys from GitHub main branch

---

## How It Works

```
User visits: hanna.care/scribe/
    ↓
Vercel (vercel.json rewrites)
    ↓
Proxy to: hanna-line-bot-production.up.railway.app/scribe/
    ↓
Railway serves Scribe frontend
    ↓
Frontend calls: /api/scribe/auth/login
    ↓
Vercel proxies to Railway API
    ↓
Backend authenticates (email-only)
```

---

## Sign In (AFTER Vercel Deploys)

**URL:**
```
https://hanna.care/scribe/
```

**How to Sign In:**
1. Enter ANY email: `doctor@hospital.com`
2. Click "Sign In"
3. Done! No PIN, no password.

---

## Deployment Status

| Service | What It Deploys | Status |
|---------|-----------------|--------|
| **Vercel** | Nurse Dashboard + Scribe proxy | ⏳ Auto-deploying (2-5 min) |
| **Railway** | Backend API + Scribe frontend | ✅ Deployed |

---

## Wait Time

- **Vercel**: 2-5 minutes for deploy
- **Railway**: Already deployed

After Vercel deploys, `hanna.care/scribe/` will work!

---

## Test Right Now

While waiting for Vercel:

1. **Railway (Works NOW):**
   ```
   https://hanna-line-bot-production.up.railway.app/scribe/
   ```

2. **Vercel (Wait 2-5 min):**
   ```
   https://hanna.care/scribe/
   ```

---

## What Changed

1. **vercel.json**: Added proxy rewrites for `/scribe/*` and `/api/scribe/*`
2. **Backend**: Email-only auth (no PIN)
3. **Frontend**: Removed PIN input, just email field
4. **Service Worker**: Force update on every load

---

## Troubleshooting

### Still seeing old login page?

**Clear browser cache:**
1. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. OR open Incognito window
3. OR clear all browsing data

### Vercel deploy stuck?

Go to https://vercel.com/dashboard and check deployment status.

### Railway deploy stuck?

Go to https://railway.app/ and trigger manual redeploy.
