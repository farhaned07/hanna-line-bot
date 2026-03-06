# 🚀 DEPLOY SCRIBE TO VERCEL - STEP BY STEP

## The Problem

Your Vercel project (`hanna-line-bot`) builds the **`/client/`** folder (Nurse Dashboard).

The **Scribe app** is in **`/scribe/`** folder — **NOT deployed to Vercel**.

That's why `hanna.care/scribe/app/login` shows the OLD login page.

---

## Solution: Deploy Scribe as SEPARATE Vercel Project

### Option A: Use Vercel CLI (Fastest - 2 minutes)

```bash
# 1. Navigate to scribe folder
cd /Users/mac/hanna-line-bot-3/scribe

# 2. Login to Vercel (if not already)
vercel login

# 3. Deploy to NEW project
vercel --prod

# When prompted:
# - Link to existing project? NO (create new)
# - Project name: hanna-scribe
# - Directory: . (current)
```

### Option B: Use Vercel Dashboard (3 minutes)

1. **Go to:** https://vercel.com/new

2. **Import Git Repository:**
   - Git Provider: GitHub
   - Repository: `farhaned07/hanna-line-bot`

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `scribe` (CLICK "EDIT" and type this)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Click "Deploy"**

5. **Wait 2-3 minutes** for build to complete

---

## After Deployment: Add Custom Domain

1. **In Vercel Dashboard** → Select "hanna-scribe" project

2. **Go to:** Settings → Domains

3. **Add Domain:**
   - `scribe.hanna.care` (recommended)
   - OR `app.hanna.care`
   - OR `hanna.care` (if you want Scribe on root)

4. **Verify DNS:**
   - Vercel will show you a CNAME record to add
   - Add it in your DNS provider (GoDaddy, Namecheap, etc.)
   - Example: `scribe.hanna.care CNAME cname.vercel-dns.com`

---

## Test Deployment

### Before Custom Domain (Vercel subdomain):
```
https://hanna-scribe-xxxx.vercel.app/
```

### After Custom Domain:
```
https://scribe.hanna.care/
```

**What you should see:**
- ✨ ONE email input field
- ❌ NO PIN boxes
- ✅ "Sign In" button

**Test Login:**
1. Enter: `test@hospital.com`
2. Click "Sign In"
3. Should redirect to home page ✅

---

## What About Railway?

Railway is **ALREADY working** and serves:
- Backend API: `/api/scribe/*`
- Frontend: `/scribe/`

**Railway URL (works NOW):**
```
https://hanna-line-bot-production.up.railway.app/scribe/
```

Use this while setting up Vercel.

---

## Summary

| Platform | What It Hosts | URL | Status |
|----------|---------------|-----|--------|
| **Vercel (hanna.care)** | Nurse Dashboard | `/` | ✅ Live |
| **Vercel (NEW)** | Scribe App | `scribe.hanna.care` | ⏳ Deploy |
| **Railway** | Backend + Scribe static | `*.railway.app` | ✅ Live |

---

## Troubleshooting

### "Build failed"
- Check that Root Directory is `scribe` (not root)
- Verify `scribe/package.json` exists

### "404 on /api/scribe/login"
- Check `scribe/vercel.json` has API proxy
- Railway backend must be running

### "Still seeing old login"
- Clear browser cache
- Use incognito window
- Check you're on NEW Vercel URL, not `hanna.care`
