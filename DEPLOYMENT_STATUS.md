# Deployment Status — March 8, 2026 (UPDATED)

## ✅ LATEST: Monorepo Build System Fixed (17:45 ICT)

### What Changed:
1. **Created build script**: `scripts/combine-builds.js`
2. **Updated `package.json`**: Added `build:all` command
3. **Updated `vercel.json`**: Points to combined `dist/` folder
4. **Pushed to GitHub**: Commit `818fd8c`

### Build Structure:
```
dist/
├── index.html (landing page)
├── assets/ (landing assets)
└── scribe/
    └── app/
        ├── index.html (scribe PWA)
        ├── assets/ (scribe assets)
        └── manifest.webmanifest
```

### Expected Behavior After Deploy:
- `https://hanna.care/` → Landing page ✅
- `https://hanna.care/scribe/app/` → Scribe PWA ✅
- `https://hanna.care/scribe/app/login` → Scribe login ✅

---

## ✅ What's Been Done

### 1. Pricing Updates (Complete)
Updated Scribe pricing across **10 documents**:
- **Free**: ฿0 (10 notes/month)
- **Pro**: ฿990/month (was ฿1,990) ← **50% price reduction**
- **Clinic**: ฿9,990/month (was ฿4,990) ← **2x price increase**

Files updated:
- `docs/PRODUCT_SPEC.md`
- `docs/PRODUCT_WIREFRAME.md`
- `README.md`
- `docs/SCRIBE_GUIDE.md`
- `docs/SCRIBE_LAUNCH_CHECKLIST.md`
- `docs/SCRIBE_E2E_TEST_SCRIPT.md`
- `docs/PHASE1_DISCOVERY_REPORT.md`
- `docs/PHASE2_COMPLETION_REPORT.md`
- `docs/FINAL_CONFIRMATION_REPORT.md`
- `vercel.json` (fixed invalid configuration)

### 2. Code Pushed to GitHub ✅
- Commit: `2491d74` — "Fix: Simplify root vercel.json for GitHub integration"
- All pricing changes committed and pushed
- `vercel.json` fixed (removed invalid `deploymentProtection` property)

---

## ⚠️ Current Issue: Vercel Deployment Protection

### Problem
When visiting `hanna.care`, you see a **Vercel authentication page** instead of the landing page.

**Root Cause**: Your Vercel team has **Deployment Protection** enabled, which requires authentication before showing the site.

### Evidence
```
HTTP/2 307
location: https://www.hanna.care/
server: Vercel
```

The site is deployed, but Vercel is blocking public access.

---

## 🔧 Solutions (Choose One)

### **Option A: Disable Deployment Protection (Recommended)**

1. Go to [vercel.com](https://vercel.com)
2. Navigate to your team: **farhansabbir07-gmailcoms-projects**
3. Go to **Settings** → **Deployment Protection**
4. Disable **"Deployment Protection"** for production deployments
5. Wait 1-2 minutes
6. Sites will be publicly accessible

**Impact**: Sites become publicly accessible (no authentication required)

---

### **Option B: Use Bypass Token**

If you want to keep Deployment Protection enabled but allow public access:

1. Go to Vercel Dashboard → Project Settings
2. Find **Deployment Protection** section
3. Generate a **bypass token**
4. Add query parameter to URLs:
   ```
   https://hanna.care/?x-vercel-protection-bypass=YOUR_TOKEN
   ```

**Impact**: Keeps protection for random visitors, allows access with token

---

### **Option C: Wait for GitHub Integration**

Vercel should auto-deploy from GitHub pushes:

1. ✅ Code pushed to `main` branch
2. ⏳ Vercel GitHub integration should trigger build
3. ⏳ Wait 2-5 minutes for deployment to complete
4. Check deployment status at: [vercel.com/dashboard](https://vercel.com/dashboard)

**Impact**: Automatic deployments on every push (no manual action needed)

---

## 📊 Deployment URLs

### Current Deployments

| App | Vercel Project | Status | URL |
|-----|---------------|--------|-----|
| **Landing Page** | `landing` | ⚠️ Protected | https://landing-30fhl23uo-farhansabbir07-gmailcoms-projects.vercel.app |
| **Scribe PWA** | `scribe` | ⚠️ Protected | https://scribe-rer8lqocb-farhansabbir07-gmailcoms-projects.vercel.app |
| **Nurse Dashboard** | `client` | ⚠️ Protected | https://client-a3fygd6uq-farhansabbir07-gmailcoms-projects.vercel.app |
| **Monorepo** | `hanna-line-bot-1` | ⏳ Building | https://hanna-line-bot-1-jiiwz2x9s-farhansabbir07-gmailcoms-projects.vercel.app |

### Production Domains (After Protection Disabled)

| Domain | Points To | Status |
|--------|-----------|--------|
| `hanna.care` | Landing Page | ⚠️ Protected |
| `www.hanna.care` | Landing Page | ⚠️ Protected |
| `hanna.care/scribe/app` | Scribe PWA | ⚠️ Protected |

---

## 🎯 Next Steps

### Immediate (Do This Now):

1. **Disable Deployment Protection** (Option A above)
   - Go to Vercel Dashboard → Team Settings
   - Disable Deployment Protection
   - Wait 2 minutes

2. **Verify Deployments**
   - Visit `https://hanna.care` — should show landing page
   - Click "Try Free" — should go to `/scribe/app/`
   - Login page should appear (new version)

3. **Update Stripe Products** (if not done)
   - Go to Stripe Dashboard
   - Update Pro plan price: ฿990/month
   - Update Clinic plan price: ฿9,990/month

### This Week:

1. **Test Upgrade Flow**
   - Create 10 notes (hit free limit)
   - Verify upgrade modal shows correct prices
   - Test Stripe checkout with new prices

2. **Update Marketing Materials**
   - Update any screenshots with old pricing
   - Update sales decks
   - Update social media posts

---

## 📝 Technical Notes

### Vercel Configuration Fixed

**Before** (Invalid):
```json
{
  "deploymentProtection": {
    "preview": "none",
    "production": "none"
  }
}
```

**After** (Valid):
```json
{
  "framework": "vite",
  "github": {
    "silent": false,
    "autoJobCancelation": false
  }
}
```

The `deploymentProtection` property is **not valid** in `vercel.json` — it must be configured in the Vercel Dashboard.

---

## 🆘 If Issues Persist

### Clear Vercel Cache
```bash
# In each project folder
vercel --prod --yes
```

### Check Build Logs
1. Go to Vercel Dashboard
2. Click on project
3. View **Deployments** tab
4. Click latest deployment
5. Check **Build Logs** for errors

### Manual Deployment (Fallback)
```bash
# Landing Page
cd landing
vercel --prod --yes

# Scribe PWA
cd scribe
vercel --prod --yes

# Nurse Dashboard
cd client
vercel --prod --yes
```

---

**Last Updated**: March 8, 2026, 17:35 ICT
**Status**: ⏳ Awaiting Deployment Protection disable
