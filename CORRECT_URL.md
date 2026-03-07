# 🚨 CORRECT URL FOR SCRIBE APP

## Problem

You visited: `https://hanna-line-bot-production.up.railway.app/scribe/`
- ❌ This is the **backend API** URL (Railway)
- ❌ Not the frontend deployment
- ❌ Shows blank page

## Solution: Use Vercel URL

### ✅ Correct URL (Production)

**Vercel Production:** `https://hanna-line-bot.vercel.app/`

This is currently showing the **landing page**, not the Scribe app.

---

## Root Cause

Vercel is deploying the **wrong files**:
- ✅ Building: `scribe/dist/` (correct)
- ❌ Serving: `landing/` files (wrong)

The `outputDirectory` in `vercel.json` points to `scribe/dist`, but Vercel is picking up the landing page files instead.

---

## Immediate Fix Options

### Option 1: Access via Vercel Dashboard (Fastest)

1. Go to: https://vercel.com/dashboard
2. Click "hanna-line-bot" project
3. Click latest **Deployment**
4. Scroll to "Deploy Previews" or "Production"
5. Look for URL ending in `.vercel.app`
6. Click to visit

### Option 2: Deploy Scribe as Separate Project

Create a NEW Vercel project just for Scribe:

```bash
cd /Users/mac/hanna-line-bot-3/scribe

# Create scribe-specific vercel.json
cat > vercel.json << 'EOF'
{
    "buildCommand": "npm install && npm run build",
    "outputDirectory": "dist",
    "installCommand": "npm install",
    "framework": "vite"
}
EOF

# Deploy (creates new project)
vercel --prod
```

This gives you a clean URL like:
- `scribe-xxx.vercel.app`
- Or name it: `hanna-scribe.vercel.app`

### Option 3: Fix Current Deployment

Update Vercel project settings:

1. Go to Vercel Dashboard
2. Project Settings → Build & Development
3. Set:
   ```
   Root Directory: scribe
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. Redeploy

---

## What's Deployed Where

| URL | Content | Status |
|-----|---------|--------|
| `hanna-line-bot.vercel.app/` | Landing page | ✅ Live |
| `hanna-line-bot.vercel.app/scribe/` | Landing page (wrong) | ❌ Wrong files |
| `hanna-line-bot-production.up.railway.app` | Backend API | ✅ Backend only |
| `hanna-line-bot-production.up.railway.app/scribe/` | Blank | ❌ Not frontend |

---

## Quick Test

Run this to check if Scribe files are deployed:

```bash
curl -s "https://hanna-line-bot.vercel.app/" | grep -i "scribe"
```

If it returns landing page HTML → Scribe not deployed yet.

---

## Next Steps

1. **Go to Vercel Dashboard** → https://vercel.com/dashboard
2. **Check deployments** for "hanna-line-bot"
3. **Find the one with Scribe** (should have `scribe/dist` files)
4. **Visit that URL**

OR

**Deploy Scribe separately** (Option 2 above) for clean separation.

---

**Current Status:** Landing page deployed, Scribe app pending correct deployment  
**ETA:** 5 minutes to fix
