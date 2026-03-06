# Vercel Deployment Fix for Hanna Scribe

## Problem
The Scribe app was configured to deploy at `/scribe/` subdirectory, but this causes routing issues on Vercel.

## Solution: Deploy to Root

### Option 1: Deploy Scribe to Root (Recommended)

Update `vercel.json` to deploy Scribe directly to the root:

```json
{
    "buildCommand": "cd scribe && npm install && npm run build",
    "outputDirectory": "scribe/dist",
    "installCommand": "cd scribe && npm install",
    "framework": "vite"
}
```

Then update `scribe/vite.config.js` to use root path:
```js
export default defineConfig({
    base: '/',  // Changed from '/scribe/'
    // ... rest of config
})
```

### Option 2: Keep Subdirectory

If you need `/scribe/` subdirectory, ensure:
1. `vite.config.js` has `base: '/scribe/'`
2. `vercel.json` has proper rewrites for `/scribe/*`
3. Vercel project is configured correctly

## Manual Vercel Setup

If automatic deployment fails:

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Build & Development**
4. Set:
   - **Root Directory**: `scribe`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Redeploy from **Deployments** tab

## Testing Locally

Preview the production build locally:

```bash
cd scribe
npm run preview
```

Visit `http://localhost:4173/scribe/` to test.

## Troubleshooting

### Blank Page
- Check browser console for errors
- Verify asset paths in built `index.html`
- Ensure `basename` in `main.jsx` matches `base` in `vite.config.js`

### 404 on Refresh
- Vercel rewrites must be configured
- SPA fallback to `index.html` required

### PWA Not Working
- Check `manifest.json` is served at correct path
- Verify service worker registration
- Clear cache and reload

## Current Status

✅ Code pushed to GitHub
⏳ Vercel auto-deploying
🔗 Production URL: `hanna.care/scribe/`
