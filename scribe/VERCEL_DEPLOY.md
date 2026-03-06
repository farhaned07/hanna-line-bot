# Deploy Scribe to Vercel

## Steps:

1. **Go to Vercel Dashboard**
   https://vercel.com/new

2. **Import Git Repository**
   - Repository: farhaned07/hanna-line-bot
   - Root Directory: `scribe`
   - Framework: Vite

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables** (if needed)
   - VITE_API_URL: https://hanna-line-bot-production.up.railway.app

5. **Deploy**

6. **After Deploy, Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add: `scribe.hanna.care` OR `app.hanna.care`

## OR Use CLI:

```bash
cd scribe
vercel --prod
```

Then configure domain in Vercel dashboard.
