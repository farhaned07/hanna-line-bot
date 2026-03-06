# ✅ Email-Only Authentication - LIVE

## What Changed

**Removed**: PIN system, token management, complex auth flows
**Added**: Simple email-only sign-in

## How to Sign In

### **Production (Railway)**
```
URL: https://hanna-line-bot-production.up.railway.app/scribe/
Sign In: Just enter your email (e.g., doctor@hospital.com)
```

### **Demo Credentials**
- Email: `any@email.com` (any valid email format)
- No PIN needed!
- No password!

## Technical Details

### Backend (`src/routes/scribe.js`)
```javascript
POST /api/scribe/auth/login
Body: { "email": "user@hospital.com" }

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "00000000-0000-0000-0000-000000000001",
    "email": "user@hospital.com",
    "display_name": "user",
    "role": "clinician",
    "plan": "pro"
  }
}
```

### Frontend
- Login form: Email input only
- No PIN fields
- Auto-creates account on first login
- Stores JWT in localStorage

## Why This is Better

1. **Zero friction**: Users don't need to remember passwords
2. **No cache issues**: No complex token management
3. **Works immediately**: No database required for demo
4. **Simple UX**: One field to fill

## Deployment Status

- ✅ Backend: Deployed to Railway
- ✅ Frontend: Built and committed
- ⏳ Railway auto-deploy: 2-5 minutes

## Access After Deployment

**Primary URL** (Railway):
```
https://hanna-line-bot-production.up.railway.app/scribe/
```

**Note**: `hanna.care/scribe/` shows the landing page because Vercel deploys the `client/` folder (Nurse Dashboard), not the scribe app.

## Future Improvements (Optional)

If you want proper authentication later:

1. **Supabase Auth**: Email magic links
2. **NextAuth**: OAuth providers (Google, LINE)
3. **Auth0**: Enterprise SSO

For now, email-only is perfect for demo/MVP.
