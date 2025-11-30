# Supabase PostgreSQL Setup Guide

## 🎯 Why Supabase?
- **Free tier** with generous limits
- **Direct database access** via SQL editor
- **Auto-backups** and point-in-time recovery
- **Better for local development**
- **Hosted worldwide** for low latency

---

## 📝 Step 1: Create Supabase Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up** or log in (use GitHub for easy access)
3. **Create New Project**:
   - Project Name: `hanna-ai-nurse`
   - Database Password: (Create a strong password - SAVE THIS!)
   - Region: `Southeast Asia (Singapore)` (closest to Thailand)
4. **Wait 2-3 minutes** for project to provision

---

## 📝 Step 2: Get Connection String

1. In your Supabase project dashboard
2. Click **Settings** (⚙️ icon in sidebar)
3. Click **Database** in settings menu
4. Scroll to **Connection string** section
5. Select **URI** tab
6. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
7. **Replace** `[YOUR-PASSWORD]` with your actual password

---

## 📝 Step 3: Update Local Environment

**File**: `.env`

Add or update:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
NODE_ENV=production
```

---

## 📝 Step 4: Update Railway Environment

1. Go to Railway Dashboard
2. Select `hanna-line-bot` project
3. Click on your service
4. Go to **Variables** tab
5. Add/Update:
   - `DATABASE_URL`: (paste your Supabase connection string)
   - `NODE_ENV`: `production`

---

## 📝 Step 5: Run Migration

**Locally** (to test):
```bash
npm run migrate
```

This will:
- ✅ Create `chronic_patients` table
- ✅ Create `check_ins` table
- ✅ Create indexes for performance
- ✅ Verify tables exist

**On Railway**:
Migration will run automatically on next deploy, OR you can run it manually via Railway's terminal.

---

## 📝 Step 6: Verify Database

**Option A: Supabase SQL Editor**
1. In Supabase dashboard
2. Click **SQL Editor** (left sidebar)
3. Run:
   ```sql
   SELECT * FROM chronic_patients;
   SELECT * FROM check_ins;
   ```

**Option B: Local Connection**
```bash
# Install psql (if needed)
brew install postgresql

# Connect to Supabase
psql "postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"

# List tables
\dt

# Exit
\q
```

---

## 🔐 Security Best Practices

1. **Never commit** DATABASE_URL to git
2. **Use .env** file (already in .gitignore)
3. **Rotate password** periodically in Supabase settings
4. **Enable RLS** (Row Level Security) in Supabase for API access

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] `.env` file updated locally
- [ ] Railway environment variables updated
- [ ] Migration script runs successfully
- [ ] Tables visible in Supabase SQL Editor
- [ ] Bot still responds in LINE
- [ ] Health data persists after server restart

---

## 🆘 Troubleshooting

**Error: "password authentication failed"**
- Check password in connection string
- Password might contain special chars - URL encode them

**Error: "connection timeout"**
- Check internet connection
- Verify Supabase project is active
- Try different region

**Error: "relation already exists"**
- Tables already created - this is OK
- Migration script uses `IF NOT EXISTS`

---

## 📊 Monitoring

**Supabase Dashboard**:
- Database size and usage
- Active connections
- Query performance
- Automatic backups

**Check data**:
```sql
-- Count users
SELECT COUNT(*) FROM chronic_patients;

-- Recent check-ins
SELECT * FROM check_ins 
ORDER BY check_in_time DESC 
LIMIT 10;

-- User statistics
SELECT 
  enrollment_status, 
  COUNT(*) 
FROM chronic_patients 
GROUP BY enrollment_status;
```
