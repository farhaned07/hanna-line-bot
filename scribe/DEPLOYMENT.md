# Hanna Scribe — Production Deployment Guide

## ✅ Build Status

**Build:** ✅ Successful  
**Bundle Size:** 859 KB (uncompressed) / 264 KB (gzipped)  
**PWA:** ✅ Service Worker generated  
**Build Time:** ~4 seconds

---

## Option 1: Deploy to Vercel (Recommended)

### Automatic Deployment (GitHub)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy Scribe PWA with 2026 UI standards"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - **Configure:**
     - **Framework Preset:** Vite
     - **Root Directory:** `scribe`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### CLI Deployment

```bash
# Navigate to scribe directory
cd scribe

# Install dependencies
npm install

# Build
npm run build

# Deploy to production
vercel --prod
```

---

## Option 2: Deploy to Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

2. **Configure Build**
   ```bash
   # Root Directory
   scribe

   # Build Command
   npm install && npm run build

   # Start Command
   npx serve dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.railway.app
   PORT=5000
   ```

4. **Deploy**
   - Click "Deploy"

---

## Option 3: Static Hosting (Netlify/Cloudflare Pages)

### Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import from Git"

2. **Build Settings**
   ```
   Base directory: scribe
   Build command: npm run build
   Publish directory: scribe/dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

### Cloudflare Pages

1. **Connect Repository**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Click "Create a project" → "Connect to Git"

2. **Build Settings**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: scribe
   ```

---

## Post-Deployment Checklist

### PWA Verification
- [ ] Visit deployed URL
- [ ] Check "Add to Home Screen" prompt appears
- [ ] Install app on device
- [ ] Verify app launches in standalone mode
- [ ] Check icons display correctly

### Offline Mode
- [ ] Disconnect network (airplane mode)
- [ ] Reload page → offline.html should show
- [ ] Reconnect network → app should reload

### PDPA Compliance
- [ ] Consent modal appears on first visit
- [ ] Toggle buttons work
- [ ] "Decline" option functional
- [ ] Consent stored in localStorage

### Session Timeout
- [ ] Wait 25 minutes (or simulate)
- [ ] Warning modal appears
- [ ] "Extend Session" works
- [ ] Auto-logout after 30 minutes

### Mobile UX
- [ ] All buttons ≥48px touch target
- [ ] Tab bar reachable with thumb
- [ ] FAB easy to tap
- [ ] No horizontal scroll

### Accessibility
- [ ] Tab through all elements
- [ ] Focus states visible
- [ ] Screen reader compatible

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.hanna.care` |
| `VITE_SCRIBE_TOKEN` | (Optional) Demo token | `demo` |

---

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain: `scribe.hanna.care`
3. Update DNS records as shown
4. SSL certificate auto-provisioned

### Railway
1. Go to Project → Settings → Domains
2. Add custom domain
3. Update DNS A record
4. Enable HTTPS

---

## Monitoring

### Performance Metrics
```bash
# Run Lighthouse
npm install -g lighthouse
lighthouse https://your-deployment-url --view
```

### PWA Validation
```bash
# Use Lighthouse PWA audit
# Or visit: https://web.dev/measure/
```

### Error Tracking
Consider adding:
- Sentry for error monitoring
- Google Analytics for usage stats
- Vercel Analytics for performance

---

## Rollback

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Manual Rollback
1. Go to Vercel Dashboard
2. Select deployment
3. Click "Promote to Production"

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PWA Not Working
1. Check manifest.json is served at `/manifest.json`
2. Verify service worker registered (DevTools → Application)
3. Clear cache and reload

### API Calls Fail
1. Check `VITE_API_URL` is set correctly
2. Verify CORS headers on backend
3. Check network tab in DevTools

---

## Production URLs

| Environment | URL | Status |
|-------------|-----|--------|
| **Production** | `https://hanna.care/scribe` | ⏳ Pending |
| **Preview** | `https://[branch]-[hash].vercel.app` | ⏳ Pending |
| **Backend API** | `https://api.hanna.care` | ✅ Active |

---

## Next Steps After Deployment

1. **Submit to App Stores** (Optional)
   - Use [PWABuilder](https://www.pwabuilder.com/) to package PWA
   - Submit to Google Play Store
   - Submit to Apple App Store

2. **Monitor Analytics**
   - Track PWA installation rate
   - Monitor offline mode usage
   - Track session timeout events

3. **Collect Feedback**
   - Add feedback button in Settings
   - Monitor error logs
   - Track conversion rate (trial → paid)

---

## Support

**Issues?** Check:
- [UI_AUDIT_REPORT.md](./UI_AUDIT_REPORT.md) — Full audit details
- [README.md](../README.md) — Project documentation
- [docs/](../docs/) — Additional guides

---

**Last Updated:** March 7, 2026  
**Status:** ✅ Ready for Production
