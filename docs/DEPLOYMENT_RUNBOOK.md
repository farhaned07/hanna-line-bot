# Hanna Deployment Runbook
**For Deploying New Hospital Tenants**

---

## Overview

This runbook documents the process for deploying a new hospital tenant on Hanna. The entire process should take **< 15 minutes** with no code changes required.

---

## Prerequisites

Before starting, ensure you have:

- [ ] Signed pilot agreement from the hospital
- [ ] Hospital admin contact information (name, email)
- [ ] Access to the production server or CLI
- [ ] Database connection credentials (in `.env`)
- [ ] System admin token for testing

---

## Step 1: Provision Tenant (5 min)

Run the provisioning script with the hospital's details:

```bash
cd /path/to/hanna-line-bot-1

node scripts/provision_tenant.js \
  --name "Hospital Name" \
  --code "CODE" \
  --admin-email "admin@hospital.com" \
  --admin-name "Admin Name"
```

**Example:**
```bash
node scripts/provision_tenant.js \
  --name "Thainakarin Hospital" \
  --code "THNK" \
  --admin-email "cno@thainakarin.com" \
  --admin-name "Nurse Supatra"
```

**Expected Output:**
```
✅ Tenant Created: Thainakarin Hospital (THNK)
✅ Program Created: Chronic Care Program
✅ Care Team Created: Default Care Team
✅ Admin Staff Created: Nurse Supatra

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CREDENTIALS (Save these!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dashboard URL: https://dashboard.hanna.care
Auth Token: thnk_a1b2c3d4e5f6...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> ⚠️ **Save the auth token immediately!** It's shown only once.

---

## Step 2: Send Onboarding Email (2 min)

Send the following to the hospital admin:

**Subject:** Hanna Dashboard Access - [Hospital Name]

**Body:**
```
สวัสดีค่ะ คุณ[Admin Name],

ยินดีต้อนรับสู่ Hanna! 

Below are your dashboard credentials:

📊 Dashboard URL: https://dashboard.hanna.care/login
🔑 Auth Token: [PASTE TOKEN HERE]

กรุณาเก็บรักษา Auth Token ไว้อย่างปลอดภัย

ขั้นตอนถัดไป:
1. เข้าสู่ระบบด้วย Token ด้านบน
2. อัพโหลดรายชื่อผู้ป่วยผ่านหน้า Patients (รูปแบบ CSV)
3. ดาวน์โหลด Template ได้ที่ปุ่ม "Download Template"

หากมีคำถามใด ๆ กรุณาติดต่อเราได้เลยค่ะ

ขอบคุณค่ะ,
Hanna Team
```

---

## Step 3: Hospital Uploads Patients (5 min)

The hospital admin will:

1. Download the CSV template from the dashboard
2. Fill in patient information
3. Upload via the Patients page

**CSV Template Format:**
```csv
line_user_id,name,age,condition,phone_number
U1234567890abcdef,สมชาย ใจดี,65,diabetes,0891234567
```

> 💡 **Note:** `line_user_id` must match the patient's LINE OA user ID (starts with U, 33 characters).

---

## Step 4: Verify Setup (3 min)

### 4.1 Dashboard Verification

1. Log in with the hospital's auth token
2. Navigate to **Patients** page
3. Confirm uploaded patients appear
4. Check **Analytics** for initial stats (should show active patients count)

### 4.2 LINE Bot Verification

1. Have a test patient send a message to the LINE bot
2. Verify response is received
3. Check that a check-in appears in the dashboard

### 4.3 Task Generation Verification

1. Simulate an abnormal response (e.g., "ไม่ได้ทานยา")
2. Verify a nurse task is generated
3. Confirm task appears in the hospital's dashboard (not others)

---

## Troubleshooting

### Tenant provisioning fails

**Error:** "Tenant code already exists"
**Solution:** Choose a different 3-10 character code

**Error:** "Database connection failed"
**Solution:** Verify DATABASE_URL in `.env` is correct

### Auth token not working

**Cause:** Token may have been regenerated or staff deactivated
**Solution:** 
```bash
# Check staff status in database
SELECT * FROM staff WHERE email = 'admin@hospital.com';

# If needed, regenerate via API:
POST /api/admin/staff/:id/regenerate-token
```

### Patients not appearing after upload

**Cause:** CSV format error or validation failures
**Solution:** 
1. Check upload response for error details
2. Verify line_user_id format (U + 32 hex characters)
3. Ensure required fields (line_user_id, name) are present

### Tenant isolation not working

**Cause:** Missing tenant_id on patient records
**Solution:**
```sql
-- Check patient tenant assignment
SELECT id, name, tenant_id FROM chronic_patients 
WHERE tenant_id IS NULL;

-- Manually fix if needed
UPDATE chronic_patients SET tenant_id = 'uuid-here' 
WHERE line_user_id = 'Uxxxxxx';
```

---

## Rollback Procedure

If something goes wrong and you need to remove the tenant:

```sql
-- WARNING: This deletes all tenant data!
-- Run in order due to foreign key constraints

DELETE FROM nurse_tasks 
WHERE patient_id IN (SELECT id FROM chronic_patients WHERE tenant_id = 'TENANT_UUID');

DELETE FROM check_ins 
WHERE line_user_id IN (SELECT line_user_id FROM chronic_patients WHERE tenant_id = 'TENANT_UUID');

DELETE FROM patient_state 
WHERE patient_id IN (SELECT id FROM chronic_patients WHERE tenant_id = 'TENANT_UUID');

DELETE FROM chronic_patients WHERE tenant_id = 'TENANT_UUID';

DELETE FROM staff WHERE tenant_id = 'TENANT_UUID';

DELETE FROM care_teams WHERE program_id IN (SELECT id FROM programs WHERE tenant_id = 'TENANT_UUID');

DELETE FROM programs WHERE tenant_id = 'TENANT_UUID';

DELETE FROM tenants WHERE id = 'TENANT_UUID';
```

---

## Checklist Summary

| Step | Action | Time | Verified |
|------|--------|------|----------|
| 1 | Run `provision_tenant.js` | 1 min | [ ] |
| 2 | Save auth token | 30 sec | [ ] |
| 3 | Send onboarding email | 2 min | [ ] |
| 4 | Hospital uploads patients | 5 min | [ ] |
| 5 | Verify dashboard access | 1 min | [ ] |
| 6 | Verify patients visible | 1 min | [ ] |
| 7 | Verify LINE bot responds | 2 min | [ ] |
| 8 | Verify task generation | 2 min | [ ] |
| **Total** | | **~15 min** | |

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-03 | 1.0 | Initial runbook |

---

*Last updated: 2026-02-03*
