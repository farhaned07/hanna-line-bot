# Hanna Scribe - Debug Report

**Date:** March 7, 2026  
**Issue:** Blank page, broken CSS on production  
**Status:** 🔍 Debugging

---

## Build Status (Local)

```
✅ Build successful (16.48s)
✅ CSS: 18.68 KB (index-De72-hyA.css)
✅ JS: 296 KB main + 46.73 KB react + 133.53 KB ui + 369.02 KB editor
✅ Total: 859 KB uncompressed / 264 KB gzipped
✅ PWA: Service Worker generated
✅ All assets in dist/assets/
```

## Local Preview Test

```
✅ http://localhost:4173/ returns valid HTML
✅ CSS link present: /assets/index-De72-hyA.css
✅ JS script present: /assets/index-DQVRvD8Q.js
✅ All paths use root (/) not /scribe/
```

## Production Issue Analysis

### What's Working
- ✅ Build completes successfully
- ✅ Asset paths are correct (root `/`)
- ✅ No TypeScript errors
- ✅ All imports resolved

### What's Broken (Based on Screenshot)
- ❌ CSS not loading on production
- ❌ Login form not rendering
- ❌ Page appears blank

## Root Cause

**Vercel is likely:**
1. Serving old cached build (with `/scribe/` paths)
2. Or build failed on Vercel side
3. Or output directory misconfiguration

## Solution

### Step 1: Clear Vercel Cache & Redeploy

Go to Vercel Dashboard:
1. Visit: https://vercel.com/dashboard
2. Click on "hanna-line-bot" project
3. Go to **Settings** → **Build & Development**
4. Verify settings:
   ```
   Root Directory: [BLANK - should be empty]
   Build Command: cd scribe && npm install && npm run build
   Output Directory: scribe/dist
   Install Command: cd scribe && npm install
   ```
5. Go to **Deployments** tab
6. Click latest deployment → **Redeploy**
7. Check "Use existing Build Cache" = OFF

### Step 2: Check Build Logs

After redeploy:
1. Click on deployment in progress
2. View build logs
3. Look for:
   - ✅ "npm run build" executed
   - ✅ "dist/" folder created
   - ✅ No errors during build
   - ✅ Files uploaded

### Step 3: Verify Deployment

After deployment completes:
1. Visit production URL
2. Open DevTools (F12)
3. Check **Console** for errors
4. Check **Network** tab:
   - `index.html` should load (200)
   - `index-*.css` should load (200)
   - `index-*.js` should load (200)

### Step 4: Hard Refresh

If CSS still broken:
```
Mac: Cmd + Shift + R
Windows: Ctrl + Shift + R
```

Or clear cache:
```
DevTools → Network tab → Check "Disable cache"
```

---

## Alternative: Manual Vercel Configuration

If automatic deployment keeps failing:

### Create `vercel.json` in scribe folder:

```json
{
    "buildCommand": "npm install && npm run build",
    "outputDirectory": "dist",
    "installCommand": "npm install",
    "framework": "vite"
}
```

### Then deploy from scribe directory:

```bash
cd scribe
vercel --prod
```

This deploys Scribe as a separate Vercel project.

---

## Debug Commands

### Check if Vercel is serving correct files:

```bash
# Fetch production HTML
curl -s https://hanna.care/ | grep -E "(css|js)"

# Should show:
# - /assets/index-*.css
# - /assets/index-*.js
# NOT /scribe/assets/...
```

### Check CSS file exists:

```bash
curl -I https://hanna.care/assets/index-De72-hyA.css

# Should return:
# HTTP/2 200
# content-type: text/css
```

---

## Current Configuration

### vite.config.js
```js
base: '/'  // ✅ Correct - root path
```

### main.jsx
```js
<BrowserRouter>  // ✅ Correct - no basename
```

### vercel.json (root)
```json
{
    "buildCommand": "cd scribe && npm install && npm run build",
    "outputDirectory": "scribe/dist",  // ✅ Correct
    "installCommand": "cd scribe && npm install"
}
```

### index.html (built)
```html
<link rel="stylesheet" href="/assets/index-De72-hyA.css">  ✅ Correct
<script src="/assets/index-DQVRvD8Q.js"></script>  ✅ Correct
```

---

## Expected Behavior (When Working)

When you visit `https://hanna.care/`:

1. **HTML loads** → Shows `<div id="root"></div>`
2. **CSS loads** → Purple gradient, proper styling
3. **JS executes** → React renders Login component
4. **Visible:**
   - Purple gradient orb animation
   - "hanna" branding
   - "Sign in to platform" heading
   - Email input field
   - Password field
   - "Create Account" toggle

---

## Action Items

- [ ] **Check Vercel deployment status** at vercel.com/dashboard
- [ ] **View build logs** for errors
- [ ] **Redeploy** if needed (with cache cleared)
- [ ] **Hard refresh** browser after deployment
- [ ] **Check DevTools console** for runtime errors
- [ ] **Verify CSS file loads** in Network tab

---

## Contact Info

If still broken after following these steps:

1. **Share Vercel build logs** (screenshot)
2. **Share browser console errors** (screenshot)
3. **Share Network tab** showing which files 404

---

**Last Updated:** March 7, 2026  
**Build:** ✅ Successful locally  
**Deployment:** ⏳ Pending Vercel
