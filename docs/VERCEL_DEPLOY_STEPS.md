# 🚀 URGENT: Deploy Scribe to Vercel - MANUAL STEPS

## ⚠️ Why Manual?

Vercel CLI requires interactive login. Follow these steps in your browser.

---

## ✅ STEP-BY-STEP (5 Minutes)

### **Step 1: Go to Vercel Dashboard**

Open: https://vercel.com/new

### **Step 2: Import Git Repository**

1. Click **"Import Git Repository"**
2. Find: `farhaned07/hanna-line-bot`
3. Click **"Import"**

### **Step 3: ⚠️ CRITICAL - Configure Root Directory**

This is where most people make mistakes!

1. Click **"Edit"** next to **Root Directory**
2. Type: `scribe`
3. Press Enter

**✅ Correct:** Root Directory shows `scribe`  
**❌ Wrong:** Root Directory is empty or `/`

### **Step 4: Configure Build Settings**

- **Framework Preset:** Vite (should auto-detect)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### **Step 5: Add Project Name**

- **Name:** `hanna-scribe` (or any name you prefer)

### **Step 6: Click "Deploy"**

Wait 2-3 minutes for build to complete.

---

## ✅ STEP 7: Add Custom Domain

After deployment completes:

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter: `scribe.hanna.care`
4. Click **"Add"** again

### **Step 8: Configure DNS**

Vercel will show you a CNAME record. Add this to your DNS:

```
Type: CNAME
Name: scribe
Value: cname.vercel-dns.com
TTL: Automatic
```

**Where to add:**
- GoDaddy: DNS Management
- Namecheap: Advanced DNS
- Cloudflare: DNS Records

Wait 5-10 minutes for DNS propagation.

---

## ✅ Test Deployment

### **Before Custom Domain (Works Immediately):**

```
https://hanna-scribe-[random].vercel.app/
```

You'll see this URL in Vercel dashboard after deployment.

**Test Login:**
1. Enter: `test@hospital.com`
2. Click "Sign In"
3. Should redirect to home page ✅

### **After Custom Domain:**

```
https://scribe.hanna.care/
```

---

## 🎯 What You Should See

### ✅ CORRECT (New Scribe App):
- ONE email input field
- NO PIN boxes
- "Sign In" button only
- Clean, simple design

### ❌ WRONG (Old Nurse Dashboard):
- Email + PIN fields
- 6 PIN input boxes
- "Sign In" + "Create Account" toggle
- Complex design

---

## 🔧 Troubleshooting

### "Build Failed"

**Error:** `package.json not found`  
**Fix:** Make sure Root Directory is `scribe` (not empty)

**Error:** `dist folder not found`  
**Fix:** Build Command should be `npm run build`

### "404 on /api/scribe/login"

**Fix:** Check `scribe/vercel.json` has API proxy (it does ✅)

### "Still seeing old login with PIN"

**Fix:** You're on the wrong URL!
- ❌ `hanna.care` → Wrong (Nurse Dashboard)
- ✅ `scribe.hanna.care` or `hanna-scribe-[random].vercel.app` → Correct

---

## 📊 Deployment Map

| Project | Folder | URL | Status |
|---------|--------|-----|--------|
| **hanna-line-bot** | `/client/` | `hanna.care` | Nurse Dashboard |
| **hanna-scribe** (NEW) | `/scribe/` | `scribe.hanna.care` | **Scribe App** ✅ |
| **Railway** | `/src/` | `*.railway.app` | Backend API ✅ |

---

## 🚀 Quick Access (While Setting Up)

**Railway works RIGHT NOW:**

```
https://hanna-line-bot-production.up.railway.app/scribe/
```

- Email-only login ✅
- No PIN needed ✅
- Fully functional ✅

---

## ✅ Checklist

- [ ] Go to vercel.com/new
- [ ] Import `farhaned07/hanna-line-bot`
- [ ] **Set Root Directory to `scribe`** ⚠️
- [ ] Build: `npm run build`, Output: `dist`
- [ ] Click Deploy
- [ ] Wait for build to complete
- [ ] Test on `*.vercel.app` URL
- [ ] Add custom domain `scribe.hanna.care`
- [ ] Configure DNS (CNAME record)
- [ ] Test on custom domain

---

## 📞 Need Help?

If stuck, check:
1. Root Directory is `scribe` (most common mistake!)
2. Using correct URL (not `hanna.care`)
3. Railway URL works while waiting

**Good luck! 🎉**
