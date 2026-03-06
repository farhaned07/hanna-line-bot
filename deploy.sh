#!/bin/bash

# ═══════════════════════════════════════════════════════════
# HANNA SCRIBE — PRODUCTION DEPLOYMENT SCRIPT
# ═══════════════════════════════════════════════════════════

set -e

echo "🚀 Deploying Hanna Scribe to Production..."
echo ""

# Step 1: Navigate to scribe directory
cd "$(dirname "$0")/scribe"

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

# Step 3: Build
echo "🔨 Building production bundle..."
npm run build

# Step 4: Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📊 Build Output:"
du -sh dist/*
echo ""

# Step 5: Deploy to Vercel
echo "🌐 Deploying to Vercel..."
echo ""
echo "⚠️  Vercel CLI requires interactive input."
echo ""
echo "Please run one of these commands:"
echo ""
echo "  # Option 1: Deploy to existing project"
echo "  cd scribe && vercel --prod"
echo ""
echo "  # Option 2: Deploy with specific project name"
echo "  cd scribe && vercel --prod --name hanna-scribe"
echo ""
echo "  # Option 3: Deploy via Vercel Dashboard"
echo "  1. Go to vercel.com"
echo "  2. Import project from GitHub"
echo "  3. Set Root Directory to 'scribe'"
echo "  4. Deploy"
echo ""

# Step 6: Preview locally (optional)
echo "🔍 Want to preview locally first?"
echo "  npm run preview"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "✅ Deployment preparation complete!"
echo "═══════════════════════════════════════════════════════"
