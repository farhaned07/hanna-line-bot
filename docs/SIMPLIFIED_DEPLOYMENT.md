# ✅ SIMPLIFIED DEPLOYMENT ARCHITECTURE

**Date:** March 7, 2026  
**Decision:** **2 deployments, NOT 3**

---

## 🎯 WHY NOT 3 DEPLOYMENTS?

You're absolutely right — **3 separate Vercel projects is overengineered!**

**Problems with 3 deployments:**
- ❌ Complex DNS configuration
- ❌ Hard to maintain
- ❌ Different build configs
- ❌ Confusing user flows
- ❌ More points of failure

---

## ✅ SIMPLIFIED ARCHITECTURE (2 Deployments)

### Deployment 1: Vercel (Landing Page ONLY)

**Project:** `hanna-line-bot`  
**Directory:** `landing/`  
**URL:** `hanna.care`  
**Purpose:** Marketing site with CTA buttons

**Configuration:**
```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "rootDirectory": "landing"
}
```

**CTA Buttons:** Link to Railway `/scribe/` ✅

---

### Deployment 2: Railway (EVERYTHING ELSE)

**Project:** `hanna-line-bot`  
**Directory:** Root (serves everything)  
**URL:** `hanna-line-bot-production.up.railway.app`

**What Railway Serves:**
```
/health               → Health check endpoint
/api/*                → Backend API
/scribe/*             → Scribe App (email-only login)
/dashboard/*          → Nurse Dashboard
/login                → Nurse Dashboard login
```

**Configuration:**
```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
```

**Static Files Served:**
- `/scribe/dist/` → `/scribe/`
- `/client/dist/` → `/dashboard/`

---

## 🎯 USER FUNNEL (SIMPLE)

```
User visits: hanna.care (Vercel - Landing)
    ↓
Sees marketing page
    ↓
Clicks "Try Free" CTA
    ↓
Opens: railway.app/scribe/ (Railway - Scribe App)
    ↓
Email-only login (NO PIN)
    ↓
Enters: demo@hanna.care
    ↓
Scribe Home ✅
```

**Nurse Dashboard:**
```
Nurse visits: railway.app/dashboard/ (Railway)
    ↓
Token auth
    ↓
Dashboard Home ✅
```

---

## 📊 DEPLOYMENT MAP

| Component | Where | URL | Status |
|-----------|-------|-----|--------|
| **Landing Page** | Vercel | `hanna.care` | ✅ |
| **Scribe App** | Railway | `*.railway.app/scribe/` | ✅ |
| **Nurse Dashboard** | Railway | `*.railway.app/dashboard/` | ✅ |
| **Backend API** | Railway | `*.railway.app/api/` | ✅ |

---

## ✅ WHY THIS IS BETTER

| Aspect | 3 Deployments | 2 Deployments |
|--------|--------------|---------------|
| **Complexity** | High | Low |
| **DNS Config** | Complex (3 domains) | Simple (1 domain) |
| **Maintenance** | Hard | Easy |
| **Cost** | More Vercel projects | 1 Vercel + Railway |
| **User Flow** | Confusing | Clear |
| **Points of Failure** | 3 | 2 |

---

## 🚀 WHAT TO DO NOW

### Vercel Dashboard (1 Project)

**Project:** `hanna-line-bot`  
**Settings:**
1. Root Directory: `landing`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Redeploy

**Done!** ✅

### Railway (Already Working)

**No changes needed!** Railway already serves:
- ✅ Backend API
- ✅ Scribe App (`/scribe/`)
- ✅ Nurse Dashboard (`/dashboard/`)

**Just verify:**
```bash
curl https://hanna-line-bot-production.up.railway.app/scribe/
# Should return Scribe app HTML

curl https://hanna-line-bot-production.up.railway.app/dashboard/
# Should return Nurse Dashboard HTML
```

---

## 📋 VERIFICATION CHECKLIST

- [ ] Vercel: Landing page deploys from `landing/`
- [ ] Vercel: CTA buttons link to Railway
- [ ] Railway: `/scribe/` serves Scribe app
- [ ] Railway: `/dashboard/` serves Nurse Dashboard
- [ ] Railway: `/api/*` serves API
- [ ] Railway: `/health` returns OK

---

## 🎉 FINAL STATUS

| Component | Deployment | Status |
|-----------|------------|--------|
| **Landing** | Vercel | ✅ Simple |
| **Scribe** | Railway | ✅ Already works |
| **Dashboard** | Railway | ✅ Already works |
| **API** | Railway | ✅ Already works |

---

**TL;DR:** 1 Vercel project (landing) + Railway (everything else). Simple.

**No need to create 3 separate Vercel projects!**
