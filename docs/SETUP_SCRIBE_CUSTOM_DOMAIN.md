# 🚀 SETUP: scribe.hanna.care

**Goal:** Production URL at `scribe.hanna.care`

---

## ✅ OPTION 1: Railway Custom Domain (RECOMMENDED - 5 minutes)

Railway supports custom domains natively!

### Step 1: Add Domain in Railway

1. Go to https://railway.app/
2. Select project: `hanna-line-bot`
3. Click **"Settings"** tab
4. Scroll to **"Domains"** section
5. Click **"Add Domain"**
6. Enter: `scribe.hanna.care`
7. Click **"Add"**

### Step 2: Configure DNS

Railway will show you a CNAME record. Add this to your DNS provider:

```
Type: CNAME
Name: scribe
Value: [RAILWAY_PROVIDED_VALUE]
TTL: Auto
```

**Where to add:**
- GoDaddy: DNS Management
- Namecheap: Advanced DNS
- Cloudflare: DNS Records

### Step 3: Update Landing Page CTA

Update `landing/components/ScribeLanding.tsx`:

```tsx
// Change from:
href="https://hanna-line-bot-production.up.railway.app/scribe/"

// To:
href="https://scribe.hanna.care/"
```

### Step 4: Wait for DNS Propagation

**Time:** 5-30 minutes

**Test:**
```bash
curl https://scribe.hanna.care/
# Should return Scribe app HTML
```

---

## ✅ OPTION 2: Vercel Project (Alternative - 10 minutes)

Deploy Scribe to a separate Vercel project.

### Step 1: Create New Vercel Project

1. Go to https://vercel.com/new
2. Import: `farhaned07/hanna-line-bot`
3. **Root Directory:** `scribe`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **"Deploy"**

### Step 2: Add Custom Domain

1. Go to Project Settings → Domains
2. Add: `scribe.hanna.care`
3. Vercel shows DNS records

### Step 3: Configure DNS

```
Type: CNAME
Name: scribe
Value: cname.vercel-dns.com
TTL: Auto
```

### Step 4: Update Landing Page CTA

Same as Option 1.

---

## 🎯 RECOMMENDED: Option 1 (Railway)

**Why:**
- ✅ Already deployed on Railway
- ✅ No extra Vercel project to manage
- ✅ Simpler architecture
- ✅ Faster setup (5 min vs 10 min)

---

## 📋 DNS CONFIGURATION (For Either Option)

**In your DNS provider (where hanna.care is managed):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | scribe | [PROVIDER_VALUE] | Auto |

**Wait:** 5-30 minutes for propagation

**Test:**
```bash
# Should return 200
curl -I https://scribe.hanna.care/
```

---

## ✅ AFTER SETUP

### Update Landing Page

**File:** `landing/components/ScribeLanding.tsx`

**Change ALL CTA buttons from:**
```tsx
href="https://hanna-line-bot-production.up.railway.app/scribe/"
```

**To:**
```tsx
href="https://scribe.hanna.care/"
```

### Rebuild & Deploy Landing

```bash
cd landing
npm run build
git add dist/
git commit -m "Update CTA to scribe.hanna.care"
git push origin main
```

---

## 🎯 FINAL ARCHITECTURE

| Component | URL | Provider |
|-----------|-----|----------|
| **Landing** | `hanna.care` | Vercel |
| **Scribe** | `scribe.hanna.care` | Railway (custom domain) |
| **Dashboard** | `hanna.care/dashboard` | Railway |
| **API** | `hanna.care/api` | Railway |

---

## 🚀 QUICK START (DO THIS NOW)

1. **Railway:** Add domain `scribe.hanna.care`
2. **DNS:** Add CNAME record
3. **Wait:** 5-30 minutes
4. **Test:** `curl https://scribe.hanna.care/`
5. **Update:** Landing page CTA links
6. **Rebuild:** Landing page

---

**Status:** ⏳ **AWAITING DNS SETUP**
