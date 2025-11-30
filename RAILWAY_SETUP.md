# Railway Deployment Guide for Hanna LINE Bot

## Step 1: Push Code to GitHub (5 minutes)

Your code is already committed locally. Now we need to push it to GitHub:

```bash
# Create a new GitHub repository (you'll need GitHub CLI or do this on github.com)
# Option A: Using GitHub website
# 1. Go to https://github.com/new
# 2. Repository name: hanna-line-bot
# 3. Make it Private
# 4. Don't initialize with README (we already have code)
# 5. Click "Create repository"

# Option B: Using command line (if you have GitHub CLI)
gh repo create hanna-line-bot --private --source=. --push
```

If you don't have GitHub CLI, I'll help you push manually:

```bash
# After creating repo on GitHub, run these commands:
cd /Users/mac/.gemini/antigravity/scratch/hanna-line-bot
git remote add origin https://github.com/YOUR_USERNAME/hanna-line-bot.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Railway (5 minutes)

### 2.1 Create New Service

1. Go to your Railway project: https://railway.com/project/a1c037a9-05d3-45c6-a203-52ff26088531
2. Click **"+ New"** button
3. Select **"GitHub Repo"**
4. If prompted, authorize Railway to access your GitHub
5. Select **"hanna-line-bot"** repository
6. Railway will automatically detect it's a Node.js app and start deploying

### 2.2 Add Environment Variables

Once the service is created:

1. Click on the service (it will be named "hanna-line-bot" or similar)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add these:

```
LINE_CHANNEL_ACCESS_TOKEN=YRCo7UkEBixVyTU9P3KxXnUzJRhqW/7KlP/F7XQQRZOalsMMx9kP83H3kmANOgBhdNFOTSgrCP2/iO9cdlmLyAorGCKwAi4tqMyAT0wdw8OnB4xfsZzxn7HA7cB3RW0sZSM+MMWgLRzvV6LAHHgVSAdB04t89/1O/w1cDnyilFU=

LINE_CHANNEL_SECRET=26189fc96e75f32a6116f122177c2e6c

PORT=3000
```

(Don't add DATABASE_URL or BASE_URL yet - Railway will generate BASE_URL automatically)

### 2.3 Generate Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy the generated URL (e.g., `https://hanna-line-bot-production.up.railway.app`)

### 2.4 Add BASE_URL Variable

1. Go back to **"Variables"** tab
2. Add one more variable:

```
BASE_URL=https://your-generated-domain.up.railway.app
```

(Replace with the actual domain from step 2.3)

---

## Step 3: Wait for Deployment (2 minutes)

1. Go to **"Deployments"** tab
2. Watch the build logs
3. Wait for status to show **"Success"** (green checkmark)
4. If it fails, check the logs for errors

---

## Step 4: Set Webhook in LINE Console (2 minutes)

1. Go to LINE Developers Console: https://developers.line.biz/console/channel/2008589873/messaging-api
2. Scroll to **"Webhook settings"**
3. Click **"Edit"** next to Webhook URL
4. Enter: `https://your-railway-domain.up.railway.app/webhook`
5. Click **"Update"**
6. Click **"Verify"** - should show **"Success"**
7. Toggle **"Use webhook"** to **ON**

---

## Step 5: Test Your Bot! (1 minute)

1. Open LINE app on your phone
2. Go to your Hanna Official Account (@519fiets)
3. Send a message: "Hello"
4. **Expected:** Hanna should reply!

---

## Troubleshooting

### If webhook verification fails:
- Check Railway logs for errors
- Ensure all environment variables are set correctly
- Make sure the deployment is successful (green checkmark)

### If bot doesn't respond:
- Check Railway logs in real-time
- Look for error messages
- Verify LINE credentials are correct

---

## Quick Commands Reference

```bash
# View Railway logs (if you install Railway CLI)
railway logs

# Redeploy after code changes
git add .
git commit -m "Update"
git push

# Railway will auto-deploy on push!
```

---

**Ready to start? Let's begin with Step 1!**
