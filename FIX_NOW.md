# 🚨 URGENT: Production Debug Steps

## Current Status

**Local Build:** ✅ Working perfectly  
**Production:** ❌ Broken (blank page, no CSS)  
**Cause:** Vercel serving old build or misconfigured

---

## IMMEDIATE ACTION REQUIRED

### Option 1: Fix via Vercel Dashboard (RECOMMENDED - 2 minutes)

1. **Go to Vercel**
   - Visit: https://vercel.com/dashboard
   - Login if needed

2. **Find Your Project**
   - Click on "hanna-line-bot"
   - You'll see recent deployments

3. **Check Build Settings**
   - Click **Settings** tab
   - Go to **Build & Development**
   - Verify these EXACT values:
     ```
     Root Directory: [LEAVE EMPTY]
     Build Command: cd scribe && npm install && npm run build
     Output Directory: scribe/dist
     Install Command: cd scribe && npm install
     ```

4. **Redeploy**
   - Go to **Deployments** tab
   - Find latest deployment
   - Click the **⋮** (three dots) menu
   - Click **Redeploy**
   - ✅ UNCHECK "Use existing Build Cache"
   - Click **Redeploy** again

5. **Wait 2-3 minutes**
   - Watch deployment progress
   - Should show "Building" → "Ready"

6. **Test**
   - Visit: https://hanna.care/
   - Hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)

---

### Option 2: Deploy Scribe as Separate Project (If Option 1 fails)

This creates a clean deployment:

```bash
# 1. Navigate to scribe folder
cd /Users/mac/hanna-line-bot-3/scribe

# 2. Create scribe-specific vercel.json
cat > vercel.json << 'EOF'
{
    "buildCommand": "npm install && npm run build",
    "outputDirectory": "dist",
    "installCommand": "npm install",
    "framework": "vite"
}
EOF

# 3. Deploy
vercel --prod
```

This will give you a NEW URL like `scribe-xxx.vercel.app`

---

### Option 3: Manual Upload (Nuclear option)

If Vercel is completely broken:

1. **Download built files** from local:
   ```bash
   cd /Users/mac/hanna-line-bot-3/scribe/dist
   # Zip all files
   zip -r dist.zip .
   ```

2. **Upload to Netlify Drop**:
   - Visit: https://app.netlify.com/drop
   - Drag the `dist` folder
   - Get instant URL

---

## Debug Checklist

After deployment, verify:

- [ ] Visit https://hanna.care/
- [ ] Open DevTools (F12)
- [ ] Check **Console** - should have NO red errors
- [ ] Check **Network** tab:
  - [ ] `index.html` → 200 OK
  - [ ] `index-*.css` → 200 OK (18.68 KB)
  - [ ] `index-*.js` → 200 OK (296 KB)
- [ ] See login form with purple orb

---

## What You Should See (When Working)

```
┌─────────────────────────────────────┐
│                                     │
│           🟣 (purple orb)           │
│                                     │
│           hanna                     │
│                                     │
│      Sign in to platform            │
│      Welcome back. Please enter     │
│      your credentials.              │
│                                     │
│      ┌─────────────────────────┐   │
│      │ WORK EMAIL              │   │
│      │ name@hospital.com       │   │
│      └─────────────────────────┘   │
│                                     │
│      ┌─────────────────────────┐   │
│      │ ACCESS KEY              │   │
│      │ ••••••••                │   │
│      └─────────────────────────┘   │
│                                     │
│      ┌─────────────────────────┐   │
│      │    Create session       │   │
│      └─────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## If STILL Broken

Share these screenshots:

1. **Vercel Deployment Logs**
   - Go to vercel.com → Deployments → Click latest
   - Screenshot the build output

2. **Browser Console**
   - F12 → Console tab
   - Screenshot all red errors

3. **Network Tab**
   - F12 → Network tab
   - Refresh page
   - Screenshot showing which files failed (404)

---

## Quick Test Command

Run this to check if production is serving correct files:

```bash
curl -s https://hanna.care/ | grep -o 'assets/[^"]*\.css'
```

**Expected output:**
```
assets/index-De72-hyA.css
```

**If you get:**
- Nothing → HTML broken
- `/scribe/assets/...` → Old build still cached
- Correct filename → CSS file itself is 404

---

**Time to fix:** 2-5 minutes  
**Difficulty:** Easy (just click buttons in Vercel UI)
