# 🎯 UNIFIED DEPLOYMENT PLAN

## Current Mess (Let's Fix This)

```
❌ Vercel #1: hanna.care → /client/ (Nurse Dashboard)
❌ Vercel #2: ??? → /landing/ (Marketing)
❌ Railway: Backend + Scribe static
❌ Scribe: NOT deployed properly anywhere
```

---

## ✅ Simple Solution: ONE Platform for Everything

### Option A: All on Railway (Easiest - 10 minutes)

**What:** Backend + ALL frontends on Railway  
**Why:** One platform, one URL, no configuration hell

**Steps:**
1. Backend serves everything from Railway
2. Frontends are just static files
3. One URL: `hanna-line-bot-production.up.railway.app`

**Routes:**
```
/railway/           → Landing page
/railway/scribe/    → Scribe App ✅
/railway/dashboard/ → Nurse Dashboard
/railway/api/*      → Backend API
```

---

### Option B: All on Vercel (Clean URLs)

**What:** Create separate Vercel projects for each app  
**Why:** Custom domains, better performance

**Projects:**
```
1. hanna-landing → hanna.care (marketing)
2. hanna-scribe → scribe.hanna.care (Scribe app)
3. hanna-dashboard → dashboard.hanna.care (Nurse dashboard)
4. Railway → API only (hanna-line-bot-production.up.railway.app/api)
```

---

## 🚀 RECOMMENDED: Option A (Railway Everything)

### Why?
- ✅ Already works
- ✅ One deployment
- ✅ No Vercel configuration
- ✅ No domain setup needed
- ✅ Works RIGHT NOW

### Access:
```
https://hanna-line-bot-production.up.railway.app/scribe/
```

---

## 📋 What to Do RIGHT NOW

### If you want SIMPLE (Recommended):

**Use Railway URL:**
```
https://hanna-line-bot-production.up.railway.app/scribe/
```

- Email-only login ✅
- Works immediately ✅
- No setup needed ✅

### If you want CUSTOM DOMAIN:

**Do ONE Vercel deployment:**

1. Go to: https://vercel.com/new
2. Import: `farhaned07/hanna-line-bot`
3. **Root Directory:** `scribe`
4. Deploy
5. Add domain: `scribe.hanna.care`

That's it. ONE project, not multiple.

---

## 🗺️ Final Architecture

```
Users → scribe.hanna.care (Vercel - Scribe frontend)
                ↓
        Railway API (Backend)
                ↓
        Supabase (Database)
```

**OR (simpler):**

```
Users → Railway (Everything in one)
├── /scribe/ (Frontend)
├── /api/ (Backend)
└── Supabase (Database)
```

---

## ⚡ Decision Time

**Choose ONE:**

### A) Simple & Fast (Railway)
- URL: `hanna-line-bot-production.up.railway.app/scribe/`
- Setup: 0 minutes
- ✅ **RECOMMENDED FOR NOW**

### B) Custom Domain (Vercel + Railway)
- URL: `scribe.hanna.care`
- Setup: 10 minutes
- Do this later when you have time

---

## 🎯 Action Items

**Today:**
- [ ] Use Railway URL (works now)
- [ ] Test email-only login

**Later (Optional):**
- [ ] Deploy Scribe to Vercel as separate project
- [ ] Add custom domain

---

## 📞 Questions?

**Q: Why is this so complicated?**  
A: Because we have 3 apps (landing, scribe, dashboard) and 2 platforms (Vercel, Railway). Let's simplify to ONE app for now: **Scribe**.

**Q: What should I do RIGHT NOW?**  
A: Use Railway URL. It works. Deploy to Vercel later when you have time.

**Q: Which option is best?**  
A: Option A (Railway) for now. Simple, fast, works.

---

**Start here:** https://hanna-line-bot-production.up.railway.app/scribe/
