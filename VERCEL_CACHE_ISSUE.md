# 🚨 VERCEL DEPLOYMENT ISSUE - CACHE PROBLEM

## Current Status

### ✅ What's Working
- **Landing Page:** `https://hanna-line-bot.vercel.app/` → Working (200 OK)
- **Scribe App HTML:** `https://hanna-line-bot.vercel.app/scribe/app/` → Returns HTML (200 OK)

### ❌ What's Broken
- **Scribe App Assets:** Serving OLD filenames
  - HTML references: `index-BEu-Hxzk.js` (NEW) ✅
  - Vercel serves: `index-D53A5idC.js` (OLD) ❌
  - CSS also wrong: `index-De72-hyA.css` vs `index-F6VSA9kX.css`

### Root Cause
**Vercel has cached the old build** and isn't serving the new files we just pushed.

---

## Evidence

### Local Build (Correct)
```bash
scribe/dist/index.html references:
- /scribe/app/assets/index-BEu-Hxzk.js ✅
- /scribe/app/assets/index-De72-hyA.css ✅
```

### Vercel Deployment (Wrong)
```bash
https://hanna-line-bot.vercel.app/scribe/app/ references:
- /scribe/app/assets/index-D53A5idC.js ❌ (OLD)
- /scribe/app/assets/index-F6VSA9kX.css ❌ (OLD)
```

### File Check
```bash
# NEW files exist on Vercel (return 200 but serve HTML)
https://hanna-line-bot.vercel.app/scribe/app/assets/index-BEu-Hxzk.js
→ Returns: text/html (wrong content-type!)

# OLD files still cached
https://hanna-line-bot.vercel.app/scribe/app/assets/index-D53A5idC.js  
→ Returns: application/javascript (correct but old build)
```

---

## Solution: Force Vercel Cache Clear

### Option 1: Vercel Dashboard (RECOMMENDED)

1. **Go to:** https://vercel.com/dashboard
2. **Click:** "hanna-line-bot" project
3. **Go to:** Deployments tab
4. **Find latest deployment** (should be commit `2fddca7`)
5. **Click the ⋮ menu** → **Redeploy**
6. **IMPORTANT:** Uncheck "Use existing Build Cache"
7. **Click:** Redeploy

This will force Vercel to:
- Clear all cached assets
- Rebuild from scratch
- Deploy new filenames

### Option 2: Vercel CLI

```bash
cd /Users/mac/hanna-line-bot-3
vercel --prod --force
```

### Option 3: Nuclear Option (If all else fails)

1. Go to Vercel Dashboard
2. Project Settings → Git
3. Click "Disconnect Git"
4. Reconnect the repository
5. Trigger new deployment

---

## What Should Happen After Redeploy

### Correct File Structure
```
https://hanna-line-bot.vercel.app/
├── index.html                          ✅ Landing page
└── scribe/app/
    ├── index.html                      ✅ Scribe entry
    ├── assets/
    │   ├── index-BEu-Hxzk.js          ✅ NEW JS bundle
    │   ├── index-De72-hyA.css         ✅ NEW CSS bundle
    │   ├── react-vendor-BGHYeCi2.js   ✅ React vendors
    │   └── ui-vendor-C2Ccslqu.js      ✅ UI vendors
    ├── manifest.webmanifest            ✅ PWA manifest
    └── sw.js                           ✅ Service worker
```

### Expected Behavior
1. Visit `/scribe/app/` → Loads HTML
2. HTML requests `index-BEu-Hxzk.js` → 200 OK (JavaScript)
3. HTML requests `index-De72-hyA.css` → 200 OK (Stylesheet)
4. App renders → Login form visible

---

## Verification Steps

After redeploy, run these checks:

### 1. Check HTML References
```bash
curl -s "https://hanna-line-bot.vercel.app/scribe/app/" | grep -E "script|css"
# Should show: index-BEu-Hxzk.js and index-De72-hyA.css
```

### 2. Check JS Loads
```bash
curl -s -I "https://hanna-line-bot.vercel.app/scribe/app/assets/index-BEu-Hxzk.js"
# Should return: content-type: application/javascript
```

### 3. Check CSS Loads
```bash
curl -s -I "https://hanna-line-bot.vercel.app/scribe/app/assets/index-De72-hyA.css"
# Should return: content-type: text/css
```

### 4. Browser Test
1. Visit: `https://hanna-line-bot.vercel.app/scribe/app/`
2. Open DevTools (F12)
3. Check Console → Should have NO errors
4. Check Network → All assets 200 OK
5. Should see login form (not blank page)

---

## Current Git Status

**Latest Commit:** `2fddca7` — ✨ Clean deployment: Landing + Scribe app  
**Status:** ✅ Pushed to GitHub  
**Vercel:** ❌ Not deployed (cached old build)

---

## Timeline

1. **Now:** Code pushed, Vercel caching old files
2. **After Redeploy:** 3-4 minutes for build
3. **Then:** Test and verify

---

**Action Required:** Go to Vercel Dashboard and trigger redeploy WITH cache cleared.

**DO NOT** just wait - the cache won't clear automatically.
