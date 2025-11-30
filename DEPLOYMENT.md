# Hanna LINE Bot - Deployment Guide

## Step-by-Step Deployment Process

### Phase 1: Pre-Deployment Setup (15 minutes)

#### Step 1.1: Get LINE Credentials

1. **Go to LINE Developers Console**: https://developers.line.biz/console/
2. **Select your Provider** (or create one)
3. **Open your Messaging API Channel** (the one you already created)
4. **Copy the following**:
   - **Channel Secret**: Messaging API tab → Channel secret
   - **Channel Access Token**: Messaging API tab → Issue token (long-lived)
   
   ```
   Example:
   Channel Secret: abc123def456...
   Channel Access Token: xyz789abc123...
   ```

#### Step 1.2: Prepare PromptPay ID

Replace the placeholder in `src/handlers/payment.js`:

```javascript
// Line 31 - Change this:
const mobileNumber = '0812345678'; // PLACEHOLDER

// To your real PromptPay ID (one of these):
const mobileNumber = '0812345678';  // Your phone number (10 digits)
// OR
const mobileNumber = '1234567890123'; // Your Tax ID (13 digits)
```

---

### Phase 2: Database Setup (10 minutes)

**Option A: Supabase (Recommended - FREE)**

1. Go to https://supabase.com
2. Click "Start your project" → Sign up (free)
3. Create new project:
   - Name: `hanna-db`
   - Database Password: (save this!)
   - Region: Southeast Asia (Singapore)
4. Wait 2 minutes for provisioning
5. Go to Project Settings → Database
6. Copy the **Connection String** (URI format)
   ```
   postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres
   ```
7. In Supabase SQL Editor, paste the content of `schema.sql` and run it

**Option B: Railway (Also FREE)**

1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Provision PostgreSQL
4. Copy Connection String from the database service
5. Use Railway's web-based PostgreSQL client to run `schema.sql`

**Option C: Heroku Postgres**

```bash
heroku addons:create heroku-postgresql:essential-0
heroku pg:psql < schema.sql
```

---

### Phase 3: Deploy Application (15 minutes)

**Option A: Railway (Easiest - Recommended)**

1. **Push to GitHub**:
   ```bash
   cd /Users/mac/.gemini/antigravity/scratch/hanna-line-bot
   git init
   git add .
   git commit -m "Initial Hanna bot"
   gh repo create hanna-line-bot --private --source=. --push
   ```

2. **Deploy on Railway**:
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `hanna-line-bot`
   - Railway will auto-detect Node.js and deploy

3. **Set Environment Variables**:
   - In Railway dashboard, click on your service
   - Go to "Variables" tab
   - Add:
     ```
     LINE_CHANNEL_ACCESS_TOKEN=<your_token>
     LINE_CHANNEL_SECRET=<your_secret>
     DATABASE_URL=<your_postgres_url>
     PORT=3000
     ```
   - BASE_URL will be auto-generated after deployment

4. **Get Deployment URL**:
   - Go to "Settings" tab → "Generate Domain"
   - Copy the URL (e.g., `https://hanna-line-bot-production.up.railway.app`)
   - This is your `BASE_URL` - add it to environment variables

5. **Set Webhook URL in LINE**:
   - Your webhook URL: `https://your-railway-domain.up.railway.app/webhook`
   - Go to LINE Developers Console
   - Messaging API tab → Webhook URL
   - Paste and click "Verify" (should show "Success")
   - Enable "Use webhook"

**Option B: Render (Free)**

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables (same as Railway)
6. Deploy
7. Copy the `.onrender.com` URL and use as webhook

**Option C: ngrok (Local Testing)**

```bash
# Terminal 1: Start server locally
npm start

# Terminal 2: Expose via ngrok
ngrok http 3000

# Copy the HTTPS URL from ngrok (e.g., https://abc123.ngrok-free.app)
# Use https://abc123.ngrok-free.app/webhook as webhook URL
```

⚠️ **Note**: ngrok free URLs change every restart - for permanent testing, use Railway/Render

---

### Phase 4: LINE Console Configuration (5 minutes)

1. **Go to LINE Developers Console**
2. **Messaging API Tab**:
   - ✅ **Webhook URL**: `https://your-domain/webhook` (from Phase 3)
   - ✅ **Use webhook**: ON
   - ✅ **Webhook redelivery**: ON (recommended)
3. **LINE Official Account Manager** (https://manager.line.biz):
   - Settings → Response settings:
     - ✅ **Auto-reply messages**: OFF
     - ✅ **Greeting message**: OFF (we handle in code)
     - ✅ **Webhooks**: ON

---

### Phase 5: Testing (10 minutes)

#### Test 1: Add Bot
1. Open LINE app on your phone
2. Scan the QR code from LINE Official Account page
3. Add Hanna as friend
4. **Expected**: Receive welcome message: "✨ สวัสดีค่ะ! ฉันชื่อฮันนา..."

#### Test 2: Onboarding Flow
1. Reply with your name
2. Reply with your age
3. Select diabetes type (quick reply buttons)
4. Select measurement frequency
5. **Expected**: See trial offer with Flex Message

#### Test 3: Trial Activation
1. Click "เริ่มทดลองใช้ฟรี!" button
2. **Expected**: See confirmation message
3. **Verify in Database**:
   ```sql
   SELECT * FROM chronic_patients WHERE line_user_id = 'U...';
   -- Should show enrollment_status = 'trial'
   ```

#### Test 4: Payment Flow
1. Go through onboarding again with a test account
2. Click "ดูแพ็คเกจรายเดือน"
3. **Expected**: See PromptPay QR code
4. Click "โอนแล้ว ✅"
5. **Expected**: See confirmation message
6. **Verify in Database**:
   ```sql
   SELECT * FROM chronic_patients WHERE enrollment_status = 'active';
   ```

#### Test 5: Scheduled Messages
1. Wait until 8:00 AM or 7:00 PM Bangkok time
2. **Expected**: Receive morning check-in or evening reminder
3. **Or force test**:
   ```bash
   # SSH into Railway or run locally
   # Modify scheduler to run immediately for testing
   ```

---

### Phase 6: Update Website (5 minutes)

1. **www.hanna.care QR Code**:
   - Go to LINE Official Account Manager
   - Settings → Account settings → QR code
   - Download QR code image
   - Replace QR on your website

2. **Add "Add Friend" Button** (optional):
   ```html
   <a href="https://line.me/R/ti/p/@your_line_id">
     <img src="line-add-friend-button.png" alt="Add Hanna">
   </a>
   ```

---

## Environment Variables Summary

Create `.env` file (or set in Railway/Render):

```bash
# LINE Credentials
LINE_CHANNEL_ACCESS_TOKEN=your_long_lived_token_here
LINE_CHANNEL_SECRET=your_channel_secret_here

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Deployment
BASE_URL=https://your-railway-domain.up.railway.app
PORT=3000
```

---

## Monitoring & Logs

### Railway
- Dashboard → Deployments → Logs (real-time)
- Watch for:
  ```
  listening on 3000
  Scheduler initialized
  ```

### Testing Logs
```bash
# Watch for incoming webhooks
curl -X POST https://your-domain/webhook \
  -H "Content-Type: application/json" \
  -d '{"destination":"","events":[]}'
# Should return 200 OK
```

---

## Troubleshooting

### Issue: "Webhook verification failed"
**Solution**: 
- Check LINE_CHANNEL_SECRET is correct
- Ensure URL is HTTPS (not HTTP)
- Verify webhook URL ends with `/webhook` (no trailing slash)

### Issue: Bot doesn't respond
**Solution**:
- Check Railway logs for errors
- Verify DATABASE_URL is correct
- Test database connection:
  ```sql
  SELECT 1; -- Should work in Supabase SQL editor
  ```

### Issue: QR code doesn't show
**Solution**:
- Check PromptPay ID format (10 or 13 digits)
- Test QR URL in browser: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101...`

### Issue: No scheduled messages
**Solution**:
- Check server time: `date` (should be Bangkok time or UTC)
- Verify cron expression: `0 8 * * *` = 8:00 AM
- Check database has active/trial users

---

## Post-Deployment Checklist

- [ ] Webhook verified in LINE Console
- [ ] Environment variables set correctly
- [ ] Database schema applied
- [ ] PromptPay ID updated
- [ ] Test account can complete onboarding
- [ ] Trial activation works
- [ ] Payment QR generates
- [ ] Website QR code updated
- [ ] Scheduled jobs running (check logs at 8:00 AM / 7:00 PM)

---

## Cost Summary (Free Tier)

| Service | Free Tier | Expected Cost |
|---------|-----------|---------------|
| Railway | $5 credit/month | ฿0 (sufficient for MVP) |
| Supabase | 500MB database | ฿0 |
| LINE Messaging API | Unlimited webhooks | ฿0 |
| ngrok (optional) | 1 tunnel | ฿0 |
| **Total** | | **฿0/month** |

For 100 active users, still FREE within limits.

---

## Next Steps After Deployment

1. **Monitor first 24 hours**: Check logs, watch for errors
2. **Test with real users**: Have 5-10 friends try it
3. **Gather feedback**: What works, what's confusing?
4. **Iterate**: Fix bugs, improve Thai language
5. **Add features**: Voice calls, nurse dashboard, family notifications

---

## Emergency Rollback

If something breaks:

```bash
# Railway: Revert to previous deployment
Railway Dashboard → Deployments → Click previous successful deployment → Redeploy

# Or pause service temporarily
Railway Dashboard → Settings → Pause Service
```

---

**You're ready to deploy!** Follow Phase 1 → Phase 6 in order. Estimated total time: **60 minutes**.
