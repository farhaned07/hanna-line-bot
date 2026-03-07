#!/bin/bash

# ═══════════════════════════════════════════════════════════
# HANNA SCRIBE - VERCEL DEPLOYMENT SCRIPT
# ═══════════════════════════════════════════════════════════

set -e

echo "🚀 Deploying Hanna Scribe to Vercel..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Step 1: Rebuild everything
echo "📦 Rebuilding landing page..."
cd landing
npm install --silent
npm run build
cd ..

echo "📦 Rebuilding Scribe app..."
cd scribe
npm install --silent
npm run build
cd ..

# Step 2: Copy Scribe build to landing
echo "📋 Copying Scribe build to landing/dist/scribe/app/..."
rm -rf landing/dist/scribe/app
cp -r scribe/dist landing/dist/scribe/app

# Step 3: Verify build
echo "✅ Verifying build..."
if [ ! -f "landing/dist/scribe/app/index.html" ]; then
    echo "❌ Error: Scribe app not found in landing/dist/scribe/app/"
    exit 1
fi

if [ ! -f "landing/dist/index.html" ]; then
    echo "❌ Error: Landing page not found in landing/dist/"
    exit 1
fi

echo "✅ Build verified!"
echo ""

# Step 4: Commit and push
echo "💾 Committing build artifacts..."
git add landing/dist
git commit -m "🔧 Rebuild for Vercel deployment ($(date '+%Y-%m-%d %H:%M:%S'))" || true
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🌐 Vercel should now auto-deploy."
echo ""
echo "📊 Check deployment status:"
echo "   https://vercel.com/dashboard"
echo ""
echo "🔗 Production URL (after deploy):"
echo "   https://hanna-line-bot.vercel.app/"
echo "   https://hanna-line-bot.vercel.app/scribe/app/"
echo ""
echo "⚠️  If deployment fails:"
echo "   1. Go to Vercel Dashboard"
echo "   2. Click 'hanna-line-bot' project"
echo "   3. Click latest deployment → Redeploy"
echo "   4. UNCHECK 'Use existing Build Cache'"
echo ""
