# Hanna Scribe — Launch Checklist

> **Launch Target**: March 2026  
> **Status**: 🟡 In Progress  
> **Owner**: Team

---

## 🚀 Pre-Launch Checklist

### 1. Environment Setup

#### Backend (Railway)
- [ ] `DATABASE_URL` configured
- [ ] `GROQ_API_KEY` configured
- [ ] `OPENAI_API_KEY` configured (for Whisper)
- [ ] `STRIPE_SECRET_KEY` configured
- [ ] `STRIPE_WEBHOOK_SECRET` configured
- [ ] `STRIPE_PRO_PRICE_ID` configured
- [ ] `STRIPE_CLINIC_PRICE_ID` configured
- [ ] `JWT_SECRET` configured (min 32 chars)
- [ ] `BASE_URL` set to production URL
- [ ] Node.js version 18+ confirmed

#### Frontend (Vercel)
- [ ] `VITE_API_URL` set to Railway production URL
- [ ] Custom domain configured (hanna.care)
- [ ] SSL certificate active
- [ ] PWA manifest validated

#### Database (Supabase)
- [ ] `schema.sql` migrations applied
- [ ] `012_scribe_tables.sql` applied
- [ ] `013_scribe_billing.sql` applied
- [ ] Database backups enabled
- [ ] Connection pooling configured

---

### 2. Stripe Configuration

#### Product Setup
- [ ] Pro plan product created (฿1,990/month)
- [ ] Clinic plan product created (฿4,990/month)
- [ ] Price IDs added to environment variables
- [ ] PromptPay enabled in Stripe dashboard
- [ ] Card payments enabled

#### Webhook Setup
- [ ] Webhook endpoint added: `https://your-url.railway.app/api/scribe/billing/webhook`
- [ ] Webhook secret added to environment
- [ ] Events subscribed:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_failed`
- [ ] Webhook tested with Stripe CLI

#### Test Mode
- [ ] Test mode enabled in Stripe dashboard
- [ ] Test card numbers documented
- [ ] Test checkout flow completed successfully
- [ ] Webhook events received in test mode

**Test Card Numbers**:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

---

### 3. End-to-End User Journey Testing

#### Flow 1: New User Registration → First Note
- [ ] Navigate to hanna.care/scribe/app
- [ ] Tap "Create Account"
- [ ] Enter email (test email)
- [ ] Enter 6-digit PIN
- [ ] Enter display name
- [ ] Account created successfully
- [ ] Redirected to Home screen
- [ ] Welcome message shows display name

#### Flow 2: Create Session → Record → Generate
- [ ] Tap + button (FAB)
- [ ] Enter patient name: "Test Patient"
- [ ] Enter HN: "TEST001"
- [ ] Select template: SOAP
- [ ] Tap "Start Recording"
- [ ] Orb animation appears
- [ ] Tap orb to start recording
- [ ] Speak for 30 seconds (test phrase)
- [ ] Tap "Done" button
- [ ] Processing screen appears
- [ ] Stage 1: "Uploading audio..." ✓
- [ ] Stage 2: "Transcribing..." ✓
- [ ] Stage 3: "Generating note..." ✓
- [ ] Redirected to Note View
- [ ] SOAP sections populated
- [ ] Patient name displayed

#### Flow 3: Edit Note → Finalize → Export
- [ ] Tap "Edit" button
- [ ] Note Editor opens
- [ ] Tap "Regenerate" on Assessment
- [ ] Wait for regeneration
- [ ] New content appears
- [ ] Type Hanna Command: "Make this more concise"
- [ ] Command applied successfully
- [ ] Tap "Save"
- [ ] "Saved" confirmation appears
- [ ] Tap "Review & Finalize"
- [ ] Note status changes to "Clinician-reviewed"
- [ ] Tap "Copy"
- [ ] Content copied to clipboard
- [ ] Tap "PDF"
- [ ] PDF downloads successfully
- [ ] Open PDF, verify formatting

#### Flow 4: Free Plan Limit → Upgrade Prompt
- [ ] Create 10 notes (Free plan limit)
- [ ] Tap + button for 11th note
- [ ] Upgrade modal appears
- [ ] Pricing displayed correctly (฿1,990/฿4,990)
- [ ] Features listed correctly
- [ ] Tap "Select Pro"
- [ ] Redirected to Stripe Checkout
- [ ] Stripe page loads
- [ ] Complete test payment (4242 4242 4242 4242)
- [ ] Redirected back to app
- [ ] Plan upgraded to "pro"
- [ ] Can create 11th note

#### Flow 5: Handover Summary
- [ ] Tap "Handover" tab
- [ ] Summary generates automatically
- [ ] Patient count correct
- [ ] Urgent count displayed
- [ ] Tap "Copy"
- [ ] Handover text copied
- [ ] Tap "Export PDF"
- [ ] PDF downloads
- [ ] Verify PDF content

#### Flow 6: Settings → Logout → Login
- [ ] Tap "Settings" tab
- [ ] Email displayed correctly
- [ ] Plan displayed correctly
- [ ] Tap "Logout"
- [ ] Redirected to Login screen
- [ ] Enter email + PIN
- [ ] Login successful
- [ ] Back to Home screen

---

### 4. UI/UX Polish

#### Visual Design
- [ ] All screens use consistent color scheme (#6366F1 accent)
- [ ] Fonts load correctly (Inter)
- [ ] Icons render properly (Lucide)
- [ ] Gradients smooth (no banding)
- [ ] Shadows consistent
- [ ] Border radius consistent (14-16px cards)

#### Animations
- [ ] Orb breathing animation smooth (60fps)
- [ ] Page transitions work (Framer Motion)
- [ ] Button tap feedback works
- [ ] Loading spinners appear
- [ ] Skeleton loaders show during load
- [ ] No janky animations

#### Responsive Design
- [ ] Works on iPhone SE (small screen)
- [ ] Works on iPhone 15 Pro (medium)
- [ ] Works on iPhone 15 Pro Max (large)
- [ ] Works on Android (Chrome)
- [ ] Works on iPad (tablet)
- [ ] Safe area insets respected (notch)

#### Accessibility
- [ ] Text contrast meets WCAG AA
- [ ] Touch targets ≥44x44px
- [ ] Focus states visible
- [ ] Error messages clear
- [ ] Loading states indicated
- [ ] Offline state handled (show error)

---

### 5. Error Handling

#### Network Errors
- [ ] No internet → Show error message
- [ ] Slow connection → Show loading spinner
- [ ] Request timeout → Retry option
- [ ] Server error (500) → User-friendly message
- [ ] API rate limit → Queue or retry

#### Validation Errors
- [ ] Empty email → Show error
- [ ] Invalid email format → Show error
- [ ] PIN < 6 digits → Disable submit
- [ ] Empty patient name → Allow "Unknown Patient"
- [ ] Recording < 5 seconds → Warn user

#### Edge Cases
- [ ] Recording > 15 minutes → Warn, allow continue
- [ ] Very large audio file → Compress or reject
- [ ] Duplicate session creation → Handle gracefully
- [ ] Note generation fails → Show retry option
- [ ] PDF export fails → Show error message

---

### 6. Security Checklist

#### Authentication
- [ ] PINs hashed (SHA-256)
- [ ] JWT tokens expire (30 days)
- [ ] Token refresh works
- [ ] Logout invalidates token
- [ ] Guest mode disabled for production

#### Data Protection
- [ ] HTTPS enforced (no HTTP)
- [ ] CORS configured correctly
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize inputs)
- [ ] Rate limiting on auth endpoints

#### Stripe Security
- [ ] Webhook signature verification
- [ ] No sensitive data in metadata
- [ ] PCI compliance (via Stripe)
- [ ] Secret keys not in frontend

---

### 7. Performance

#### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] API response < 500ms (cached)
- [ ] Note generation < 60 seconds
- [ ] PDF export < 5 seconds

#### Bundle Size
- [ ] Main bundle < 500KB
- [ ] CSS < 50KB
- [ ] Images optimized
- [ ] Fonts subset (only needed characters)

#### Caching
- [ ] Static assets cached (1 year)
- [ ] API responses cached (where appropriate)
- [ ] Service worker registered (PWA)
- [ ] Offline fallback page

---

### 8. Analytics & Monitoring

#### Error Tracking
- [ ] Sentry/error logging configured
- [ ] Error alerts set up (email/Slack)
- [ ] Error boundaries in React
- [ ] Console logs cleaned up (no PII)

#### Usage Analytics
- [ ] Page views tracked
- [ ] Note creation tracked
- [ ] Upgrade events tracked
- [ ] Error events tracked
- [ ] Performance metrics tracked

#### Business Metrics
- [ ] Daily active users (DAU)
- [ ] Notes per user per day
- [ ] Free → Pro conversion rate
- [ ] Churn rate
- [ ] MRR tracking

---

### 9. Legal & Compliance

#### Terms & Policies
- [ ] Terms of Service drafted
- [ ] Privacy Policy published
- [ ] Cookie policy (if applicable)
- [ ] PDPA compliance (Thai law)
- [ ] HIPAA alignment documented

#### User Consent
- [ ] Terms acceptance on signup
- [ ] Privacy policy link visible
- [ ] Data usage explained
- [ ] Right to deletion offered

#### Disclaimers
- [ ] "Not a medical device" disclaimer
- [ ] "Clinician review required" warning
- [ ] AI-generated content disclaimer
- [ ] Emergency care disclaimer (not for emergencies)

---

### 10. Go-Live Tasks

#### Final Checks (Day Before)
- [ ] All tests passing
- [ ] No critical bugs open
- [ ] Team notified of launch
- [ ] Support channel ready
- [ ] Status page live

#### Launch Day
- [ ] Deploy backend (Railway)
- [ ] Deploy frontend (Vercel)
- [ ] Verify production URLs
- [ ] Test live site end-to-end
- [ ] Monitor error logs
- [ ] Monitor Stripe webhooks
- [ ] Check database connections

#### Post-Launch (Week 1)
- [ ] Daily check-ins with team
- [ ] Monitor user feedback
- [ ] Fix critical bugs within 24h
- [ ] Track key metrics
- [ ] Send launch announcement

---

## 📊 Launch Metrics (Success Criteria)

### Week 1 Targets
- [ ] 50+ registered users
- [ ] 100+ notes generated
- [ ] < 5% error rate
- [ ] < 2 second average API response
- [ ] 0 critical bugs

### Month 1 Targets
- [ ] 200+ registered users
- [ ] 500+ notes generated
- [ ] 5%+ free → pro conversion
- [ ] ฿100,000+ MRR
- [ ] < 5% churn rate

### Quarter 1 Targets
- [ ] 1,000+ registered users
- [ ] 5,000+ notes generated
- [ ] ฿500,000+ MRR
- [ ] 8%+ conversion rate
- [ ] < 3% churn rate

---

## 🆘 Emergency Rollback Plan

If critical issues arise post-launch:

### Rollback Triggers
- Data loss or corruption
- Security breach
- > 50% error rate
- Payment processing failures
- Legal/compliance issues

### Rollback Steps
1. **Notify team** (Slack/phone)
2. **Freeze deployments** (lock main branch)
3. **Revert backend** (Railway rollback)
4. **Revert frontend** (Vercel rollback)
5. **Notify users** (status page update)
6. **Post-mortem** (document root cause)

### Contact List
- **Tech Lead**: [Name] — [Phone]
- **DevOps**: [Name] — [Phone]
- **Support**: [Name] — [Phone]
- **Legal**: [Name] — [Phone]

---

## ✅ Sign-Off

### Engineering
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance targets met
- [ ] Security audit complete

**Signed**: _________________  **Date**: _________

### Product
- [ ] User journey validated
- [ ] UX polish approved
- [ ] Metrics dashboard ready
- [ ] Launch plan approved

**Signed**: _________________  **Date**: _________

### Business
- [ ] Pricing validated
- [ ] Payment flow tested
- [ ] Support ready
- [ ] Marketing materials ready

**Signed**: _________________  **Date**: _________

---

**"Launch is not the end. It's the beginning of learning."**

Good luck, team! 🚀
