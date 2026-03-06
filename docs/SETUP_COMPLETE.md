# ✅ SETUP COMPLETE: scribe.hanna.care

**Date:** March 7, 2026  
**Status:** ⏳ **AWAITING RAILWAY DOMAIN SETUP**

---

## 🎯 WHAT'S DONE

### Code Changes ✅
- [x] Landing page CTA buttons → `https://scribe.hanna.care`
- [x] All 4 CTA buttons updated (nav, hero, pricing, final)
- [x] Landing page rebuilt
- [x] Pushed to GitHub main

### Documentation ✅
- [x] Custom domain setup guide created
- [x] DNS configuration documented

---

## ⏳ MANUAL STEPS (RAILWAY DASHBOARD)

### Step 1: Add Custom Domain

1. Go to https://railway.app/
2. Sign in (GitHub)
3. Select project: **`hanna-line-bot`**
4. Click **"Settings"** tab
5. Scroll to **"Domains"** section
6. Click **"Add Domain"**
7. Enter: **`scribe.hanna.care`**
8. Click **"Add"**

### Step 2: Configure DNS

Railway will show you a CNAME record like:
```
Type: CNAME
Name: scribe
Value: [some-value].railway.app
TTL: Auto
```

**Add this to your DNS provider** (where `hanna.care` is managed):

**GoDaddy:**
1. Go to DNS Management
2. Add Record → CNAME
3. Host: `scribe`
4. Points to: `[RAILWAY_VALUE]`
5. TTL: Auto

**Namecheap:**
1. Advanced DNS
2. Add New Record → CNAME
3. Host: `scribe`
4. Value: `[RAILWAY_VALUE]`
5. TTL: Auto

**Cloudflare:**
1. DNS → Records
2. Add Record → CNAME
3. Name: `scribe`
4. Target: `[RAILWAY_VALUE]`
5. Proxy: Disabled (grey cloud)
6. TTL: Auto

### Step 3: Wait for DNS Propagation

**Time:** 5-30 minutes (usually 5-10 min)

**Test:**
```bash
# Should return 200 after propagation
curl -I https://scribe.hanna.care/
```

---

## 🎯 FINAL USER FUNNEL

```
User visits: hanna.care (Vercel)
    ↓
Clicks "Try Free — No Credit Card"
    ↓
Opens: scribe.hanna.care (Railway custom domain)
    ↓
Sees: Email-only login (NO PIN)
    ↓
Enters: demo@hanna.care
    ↓
Signs in ✅
```

---

## 📊 DEPLOYMENT MAP

| Component | URL | Provider | Status |
|-----------|-----|----------|--------|
| **Landing Page** | `hanna.care` | Vercel | ✅ Live |
| **Scribe App** | `scribe.hanna.care` | Railway | ⏳ DNS pending |
| **Nurse Dashboard** | `hanna.care/dashboard` | Railway | ⏳ Deploy pending |
| **Backend API** | `hanna.care/api` | Railway | ✅ Live |

---

## 🧪 VERIFICATION

### After DNS Propagation

**Test Scribe:**
```bash
curl https://scribe.hanna.care/
# Should return 200 with Scribe HTML
```

**Test Landing CTA:**
```bash
curl https://hanna.care | grep "scribe.hanna.care"
# Should return CTA links with scribe.hanna.care
```

**Test Direct Railway (backup):**
```bash
curl https://hanna-line-bot-production.up.railway.app/scribe/
# Should return 200 (always works as backup)
```

---

## ⚠️ TROUBLESHOOTING

### DNS Not Propagating After 30 Minutes

**Check:**
```bash
# Check DNS record
nslookup scribe.hanna.care

# Should show CNAME to Railway
```

**Fix:**
1. Verify CNAME record in DNS provider
2. Clear DNS cache (or wait longer)
3. Contact DNS provider support if >1 hour

### Railway Domain Not Working

**Check:**
1. Domain added in Railway Settings → Domains
2. SSL certificate issued (Railway auto-provisions)
3. No typos in domain name

**Fix:**
1. Remove and re-add domain in Railway
2. Force SSL renewal
3. Contact Railway support

---

## 📋 CHECKLIST

- [ ] Railway: Add domain `scribe.hanna.care`
- [ ] DNS: Add CNAME record
- [ ] Wait: 5-30 minutes for propagation
- [ ] Test: `curl https://scribe.hanna.care/`
- [ ] Verify: Landing page CTA works
- [ ] Document: Update any hardcoded URLs

---

## 🎉 AFTER COMPLETION

**Production URLs:**
- ✅ Landing: `hanna.care`
- ✅ Scribe: `scribe.hanna.care`
- ✅ Dashboard: `hanna.care/dashboard` (after deploy)
- ✅ API: `hanna.care/api`

**Professional, branded URLs for all components!**

---

**Status:** ⏳ **AWAITING RAILWAY DOMAIN SETUP**

**Next:** Complete manual steps in Railway dashboard (5 minutes)

**Guide:** `docs/SETUP_SCRIBE_CUSTOM_DOMAIN.md`
