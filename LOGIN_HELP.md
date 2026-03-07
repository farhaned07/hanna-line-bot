# 🔐 LOGIN TROUBLESHOOTING

## Test the Login

### 1. Open Test Page
```
http://localhost:4173/test-login.html
```

### 2. Click "Test Login"
This will test the API connection directly.

### 3. Expected Result
```
✅ LOGIN SUCCESS!

Token: eyJhbGci...
User: {
  "email": "demo@hanna.care",
  "display_name": "demo",
  "role": "clinician"
}
```

---

## If Test Page Works But App Doesn't

The issue is in the Scribe app's login form. Check:

### Browser Console (F12)
1. Open DevTools (F12)
2. Go to Console tab
3. Try to login in the app
4. Look for errors

### Common Issues

**Issue 1: Wrong API URL**
```
Error: Failed to fetch
Fix: Make sure vite.config.ts has the proxy
```

**Issue 2: CORS Error**
```
Access-Control-Allow-Origin error
Fix: Backend needs CORS headers
```

**Issue 3: Wrong Form Data**
```
400 Bad Request
Fix: Check what fields the form is sending
```

---

## Manual Login Test

Open browser console on `http://localhost:4173/scribe/app/` and run:

```javascript
fetch('/api/scribe/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'demo@hanna.care'})
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected:**
```json
{
  "token": "eyJhbGci...",
  "user": {...}
}
```

---

## API Status

| Endpoint | Status |
|----------|--------|
| `/api/scribe/auth/login` | ✅ Working (tested with curl) |
| Railway backend | ✅ Online |
| Vite proxy | ✅ Configured |

---

**Try the test page first:** `http://localhost:4173/test-login.html`
