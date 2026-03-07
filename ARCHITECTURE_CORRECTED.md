# ✅ CORRECT ARCHITECTURE - DEPLOYED

## Understanding (Now Clear)

**What we have:**
- `hanna.care/` → Landing page (marketing site with CTA button)
- `hanna.care/scribe/app/` → Scribe app (the actual product)

**File Structure:**
- `/landing` → Landing page source
- `/landing/dist/scribe/app/` → Scribe app (built, ready to deploy)
- `/scribe` → Scribe app source (separate build)

---

## What I Just Did

1. ✅ Rebuilt Scribe app with `base: '/scribe/app/'`
2. ✅ Updated router basename to `/scribe/app`
3. ✅ Copied build to `landing/dist/scribe/app/`
4. ✅ Committed and pushed to GitHub
5. ⏳ Vercel is now deploying

---

## URLs (After Deployment Completes)

| URL | Purpose | Status |
|-----|---------|--------|
| `https://hanna.care/` | Landing page | ✅ Already live |
| `https://hanna.care/scribe/app/` | Scribe app | ⏳ Deploying now |
| `https://hanna-line-bot.vercel.app/` | Vercel preview | ✅ Live |
| `https://hanna-line-bot.vercel.app/scribe/app/` | Vercel Scribe preview | ⏳ Deploying |

---

## How It Works

### User Journey
1. User visits `hanna.care/` → Sees landing page
2. Clicks "Try Free" or "Get Started" CTA button
3. Taken to `hanna.care/scribe/app/` → Scribe app loads
4. Logs in or registers
5. Uses Scribe for clinical documentation

### Landing Page CTA Button
The landing page should have a button linking to:
```html
<a href="/scribe/app/">Try Free</a>
```

Or if on external domain:
```html
<a href="https://hanna.care/scribe/app/">Try Free</a>
```

---

## Deployment Flow

```
GitHub Push → Vercel Auto-Deploy
    ↓
Builds landing/ folder
    ↓
Serves at hanna.care/
    ↓
Includes /scribe/app/ subdirectory
    ↓
Scribe app accessible at hanna.care/scribe/app/
```

---

## Verify Deployment (In 2-4 Minutes)

### 1. Check Landing Page
```bash
curl -s "https://hanna-line-bot.vercel.app/" | grep -i "speak"
# Should return: "Doctor speaks. AI writes."
```

### 2. Check Scribe App
```bash
curl -s "https://hanna-line-bot.vercel.app/scribe/app/" | grep -i "scribe"
# Should return Scribe app HTML with login form
```

### 3. Visit in Browser
1. `https://hanna-line-bot.vercel.app/` → Landing page
2. `https://hanna-line-bot.vercel.app/scribe/app/` → Scribe app

---

## What's Deployed

### Landing Page (`/`)
- Marketing content
- Hero section
- Features
- Pricing
- CTA buttons → Link to `/scribe/app/`

### Scribe App (`/scribe/app/`)
- Login/Register
- Dashboard
- Recording
- Note editor
- PWA features
- PDPA consent
- Session timeout
- Offline mode

---

## Next Steps

### 1. Wait for Vercel Deployment (2-4 minutes)
- Monitor at: https://vercel.com/dashboard
- Look for green checkmark

### 2. Test Both URLs
- Landing: `https://hanna-line-bot.vercel.app/`
- Scribe: `https://hanna-line-bot.vercel.app/scribe/app/`

### 3. Update Custom Domain (If Using hanna.care)
- Go to Vercel Dashboard → Project Settings → Domains
- Add `hanna.care`
- Update DNS as instructed
- Both `/` and `/scribe/app/` will work on custom domain

### 4. Update Landing Page CTA
If the landing page CTA button doesn't point to `/scribe/app/`, update it in:
- `/landing/components/HeroB2B.tsx` or wherever the CTA is defined
- Change href to `/scribe/app/`

---

## Files Changed

| File | Change |
|------|--------|
| `scribe/vite.config.js` | `base: '/scribe/app/'` |
| `scribe/src/main.jsx` | `basename="/scribe/app"` |
| `landing/dist/scribe/app/*` | New Scribe build |
| All Scribe assets | Updated paths |

---

**Status:** ⏳ Deploying to Vercel  
**ETA:** 2-4 minutes  
**Expected Result:**
- Landing at `/`
- Scribe at `/scribe/app/`
