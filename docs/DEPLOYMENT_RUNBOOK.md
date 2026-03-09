# 🚀 Hanna Production Deployment Runbook

**Version**: 1.0.0  
**Date**: March 9, 2026  
**Status**: PRODUCTION READY  
**Deployment Target**: Railway (Backend) + Vercel (Frontends)

---

## 📋 Pre-Deployment Checklist

### Environment Setup

- [ ] Copy `.env.production.template` to `.env` (backend)
- [ ] Copy `scribe/.env.production.template` to `scribe/.env` (scribe frontend)
- [ ] Copy `client/.env.production.template` to `client/.env` (nurse dashboard)
- [ ] Fill in ALL environment variables
- [ ] Verify `NODE_ENV=production` is set

### Required Credentials

| Service | Purpose | Where to Get |
|---------|---------|--------------|
| Supabase | Database | https://app.supabase.com |
| Groq | AI note generation | https://console.groq.com |
| OpenAI | Voice transcription | https://platform.openai.com |
| Stripe | Billing | https://dashboard.stripe.com |
| LINE | Chat bot | https://developers.line.biz |
| LiveKit | Voice calls | https://cloud.livekit.io |
| Resend | Email notifications | https://resend.com |
| Sentry | Error monitoring | https://sentry.io |

### Run Production Tests

```bash
cd /Users/mac/hanna-line-bot-1

# Install dependencies
npm install
cd scribe && npm install
cd ../client && npm install
cd ..

# Run production checklist
node tests/production-checklist.js
```

**Expected Output**: `✅ ALL CHECKS PASSED - Ready for deployment!`

---

## 🏗️ Backend Deployment (Railway)

### Step 1: Connect to Railway

```bash
# Login to Railway
railway login

# Navigate to project
cd /Users/mac/hanna-line-bot-1

# Link or create project
railway init  # If new project
# OR
railway link  # If existing project
```

### Step 2: Set Environment Variables

```bash
# Set all required variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="postgresql://..."
railway variables set JWT_SECRET="your-32-char-secret"
railway variables set GROQ_API_KEY="gsk_..."
railway variables set OPENAI_API_KEY="sk_..."
railway variables set STRIPE_SECRET_KEY="sk_live_..."
railway variables set LINE_CHANNEL_SECRET="..."
railway variables set LINE_CHANNEL_ACCESS_TOKEN="..."
railway variables set LIFF_ID="..."
railway variables set LIVEKIT_URL="wss://..."
railway variables set LIVEKIT_API_KEY="..."
railway variables set LIVEKIT_API_SECRET="..."
railway variables set RESEND_API_KEY="re_..."
railway variables set SENTRY_DSN="https://..."

# Verify all variables
railway variables list
```

### Step 3: Deploy

```bash
# Deploy to production
railway up --prod

# Watch logs
railway logs --follow
```

### Step 4: Verify Deployment

```bash
# Get deployment URL
DEPLOY_URL=$(railway domain)

# Health check
curl https://$DEPLOY_URL/health

# Expected: {"status":"ok","timestamp":"..."}
```

**Success Criteria**:
- [ ] Health endpoint returns 200
- [ ] No errors in Railway logs
- [ ] Database connection successful

---

## 🎨 Scribe Frontend Deployment (Vercel)

### Step 1: Prepare Build

```bash
cd /Users/mac/hanna-line-bot-1/scribe

# Install dependencies
npm install

# Set environment variable
export VITE_API_URL=https://your-railway-url.railway.app/api/scribe
```

### Step 2: Update vercel.json (if needed)

Ensure `vercel.json` has correct rewrites for SPA:

```json
{
  "rewrites": [
    { "source": "/scribe/app/:path*", "destination": "/scribe/app/index.html" }
  ]
}
```

### Step 3: Deploy

```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Set environment variable
vercel env add VITE_API_URL production

# Deploy to production
vercel --prod
```

### Step 4: Verify Deployment

```bash
# Get deployment URL
SCRIBE_URL=$(vercel url --prod)

# Test load
curl $SCRIBE_URL

# Test PWA manifest
curl $SCRIBE_URL/manifest.json
```

**Success Criteria**:
- [ ] App loads without errors
- [ ] PWA manifest accessible
- [ ] Login flow works
- [ ] Icons display correctly

---

## 🏥 Nurse Dashboard Deployment (Vercel)

### Step 1: Prepare Build

```bash
cd /Users/mac/hanna-line-bot-1/client

# Install dependencies
npm install

# Set environment variables
export VITE_SUPABASE_URL=https://...
export VITE_SUPABASE_ANON_KEY=...
export VITE_API_URL=https://your-railway-url.railway.app/api
```

### Step 2: Deploy

```bash
# Deploy to production
vercel --prod
```

### Step 3: Verify

```bash
# Get deployment URL
DASHBOARD_URL=$(vercel url --prod)

# Test load
curl $DASHBOARD_URL
```

---

## ✅ Post-Deployment Verification

### End-to-End Testing

**1. Scribe Flow** (15 minutes)

```
1. Visit: https://hanna.care/scribe/app
2. Login with email
3. Create new session
4. Record 30 seconds of audio
5. Complete recording
6. Verify transcription succeeds
7. Verify SOAP note generated
8. Edit note with AI command
9. Export as PDF
10. Finalize note
```

**Checklist**:
- [ ] Login successful
- [ ] Session created
- [ ] Recording works
- [ ] Transcription completes
- [ ] Note generated correctly
- [ ] PDF export works
- [ ] Note finalized

**2. Care Intelligence Flow** (15 minutes)

```
1. Send LINE message to bot
2. Trigger voice call via LIFF
3. Speak for 30 seconds
4. Verify transcription
5. Check risk score calculated
6. Verify task created
7. Check nurse dashboard shows task
8. Resolve task
9. Verify feedback logged
```

**Checklist**:
- [ ] LINE message received
- [ ] Voice call connects
- [ ] Transcription works
- [ ] Risk score calculated
- [ ] Task appears in dashboard
- [ ] Task resolution works

**3. Billing Flow** (5 minutes)

```
1. Login to Scribe
2. Go to Settings
3. Click "Upgrade to Pro"
4. Complete Stripe checkout (test mode)
5. Verify plan updated
6. Verify note limit removed
```

**Checklist**:
- [ ] Upgrade button works
- [ ] Stripe checkout loads
- [ ] Payment succeeds
- [ ] Plan updates immediately

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend won't start

```bash
# Check logs
railway logs --follow

# Common issues:
# 1. Missing environment variables
railway variables list

# 2. Database connection failure
# Check DATABASE_URL format

# 3. Port conflict
# Ensure PORT=3001 is available
```

**Problem**: Database errors

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Run migrations if needed
psql $DATABASE_URL < migrations/*.sql

# Check table existence
psql $DATABASE_URL -c "\dt"
```

**Problem**: AI services failing

```bash
# Test Groq API
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"

# Test OpenAI API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Frontend Issues

**Problem**: PWA won't install

```bash
# Check manifest
curl https://hanna.care/scribe/app/manifest.json

# Verify icons exist
curl https://hanna.care/scribe/app/icons/icon-192.png
curl https://hanna.care/scribe/app/icons/icon-512.png

# Check console for errors
# Open Chrome DevTools → Console
```

**Problem**: API calls failing

```bash
# Check VITE_API_URL is set correctly
vercel env ls

# Verify CORS on backend
# Check Railway logs for CORS errors

# Test API directly
curl https://your-railway-url.railway.app/api/scribe/health
```

---

## 📊 Monitoring Setup

### Sentry Configuration

**Backend** (`src/index.js`):

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: 'production',
    tracesSampleRate: 0.1,
});
```

**Frontend** (`scribe/src/main.jsx`):

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: 'production',
    tracesSampleRate: 0.1,
});
```

### Health Check Endpoint

```bash
# Monitor this endpoint
curl https://hanna.care/api/scribe/status

# Expected response:
{
  "status": "operational",
  "services": {
    "api": "operational",
    "database": "operational",
    "groq": "operational",
    "openai": "operational"
  }
}
```

### Uptime Monitoring

Set up external monitoring with:
- [UptimeRobot](https://uptimerobot.com/) (free, 50 checks)
- [Pingdom](https://www.pingdom.com/) (paid, advanced features)

**Monitor these URLs**:
1. `https://hanna.care/api/scribe/health` (backend)
2. `https://hanna.care/scribe/app` (scribe frontend)
3. `https://hanna.care/dashboard` (nurse dashboard)

---

## 🔄 Rollback Procedure

### Backend Rollback

```bash
# List previous deployments
railway deployments list

# Rollback to specific deployment
railway rollback [deployment-id]

# Or redeploy previous commit
git checkout previous-commit
railway up --prod
```

### Frontend Rollback

```bash
# List deployments
vercel ls

# Rollback
vercel rollback [deployment-url]

# Or redeploy
git checkout previous-commit
vercel --prod
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d $DATABASE_URL /path/to/backup.dump

# Or run migration rollback
psql $DATABASE_URL < migrations/rollback_*.sql
```

---

## 📞 Emergency Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| On-Call Engineer | [phone] | P0 incidents |
| Product Lead | [phone] | Business decisions |
| Clinical Advisor | [phone] | Patient safety issues |

### Incident Severity

| Level | Description | Response Time |
|-------|-------------|---------------|
| P0 | Patient safety risk, data breach | Immediate (<15 min) |
| P1 | Core feature broken | <1 hour |
| P2 | Degraded performance | <4 hours |
| P3 | Minor bug | <24 hours |

---

## 📈 Success Metrics

### Week 1 Targets

| Metric | Target |
|--------|--------|
| Active users | 10+ doctors |
| Notes generated | 50+ |
| Error rate | <1% |
| Uptime | >99% |
| Support response | <2 hours |

### Daily Monitoring

```bash
# Check these daily:
1. Sentry error dashboard
2. Railway logs for errors
3. User feedback (support@hanna.care)
4. Usage metrics (notes generated, active users)
```

---

## 🎯 Go/No-Go Decision

**DO NOT DEPLOY if**:
- ❌ Production checklist has failures
- ❌ Missing critical environment variables
- ❌ Database migrations not tested
- ❌ No rollback plan prepared

**SAFE TO DEPLOY if**:
- ✅ All production tests pass
- ✅ Environment variables verified
- ✅ Migrations tested on staging
- ✅ Team available for monitoring
- ✅ Rollback procedure documented

---

## ✨ Deployment Complete

After successful deployment:

1. **Announce launch**
   - Email to beta users
   - LINE announcement
   - Update status page

2. **Monitor closely** (first 4 hours)
   - Watch error rates
   - Check user feedback
   - Be ready to rollback

3. **Document learnings**
   - Update this runbook
   - Note any issues encountered
   - Record resolution steps

---

**"Deploy with confidence, monitor with vigilance."**

*Last Updated: March 9, 2026*
