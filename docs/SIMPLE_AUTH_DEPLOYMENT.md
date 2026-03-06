# Simple Token-Based Authentication

## Overview
Switched from email+PIN to simple token-based authentication for Hanna Scribe.

## How to Sign In

**Production (hanna.care/scribe/):**
- Enter ANY email address
- Enter ANY 6-digit PIN (the token is used internally)
- Click "Sign In"

**Demo Credentials (for reference):**
- Email: `demo@hanna.care` (or any email)
- PIN: `123456` (or any 6 digits)

## Technical Details

### Backend Token
- Access token: `hanna2026`
- Demo fallback: `demo`
- Location: `src/routes/scribe.js`

### Frontend
- Automatically uses token `hanna2026` for all auth requests
- User's PIN input is replaced with the token internally
- Location: `scribe/src/pages/Login.jsx`

### Authentication Flow
1. User enters email + any 6-digit PIN
2. Frontend replaces PIN with `hanna2026` token
3. Backend validates token (not the actual PIN)
4. Returns JWT token + user object
5. Frontend stores JWT in localStorage

## Deployment

Railway auto-deploys from GitHub `main` branch.

To verify deployment:
```bash
curl -X POST https://hanna-line-bot-production.up.railway.app/api/scribe/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","token":"hanna2026"}'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "access_token": "hanna2026",
  "user": { ... }
}
```

## Files Changed
- `src/routes/scribe.js` - Simplified auth endpoints
- `scribe/src/pages/Login.jsx` - Uses token internally
- `scribe/dist/` - Built frontend with token auth
