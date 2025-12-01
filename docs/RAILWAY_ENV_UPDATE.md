# Railway Environment Variables Setup for Supabase

After running the migration locally, you need to update Railway with the Supabase connection string.

## Steps:

1. **Go to Railway Dashboard**: https://railway.app/
2. **Select Project**: `hanna-line-bot`
3. **Click on your service** (the main app, not database)
4. **Go to Variables tab**
5. **Add/Update these variables**:

```
DATABASE_URL=postgresql://postgres:V6h9ds97!@db.hozputqagilvsbilojgr.supabase.co:5432/postgres
NODE_ENV=production
```

6. **Save changes**
7. **Railway will automatically redeploy** with the new environment variables

## Verification:

After Railway redeploys:
- Bot should still respond in LINE
- Health data should persist
- Check Supabase SQL Editor to see data:
  ```sql
  SELECT * FROM chronic_patients ORDER BY created_at DESC LIMIT 10;
  SELECT * FROM check_ins ORDER BY check_in_time DESC LIMIT 10;
  ```

## Note:
Railway will keep using the old SQLite database until you update the DATABASE_URL environment variable. Once updated, it will switch to Supabase and all new data will be stored there.
