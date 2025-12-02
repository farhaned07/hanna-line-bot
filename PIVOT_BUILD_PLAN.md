# Hanna B2B Pivot: Asset Inventory & Build Plan

**Goal**: Identify what we have, what we need, and how to repurpose B2C assets for B2B

---

## Current Assets Inventory

### ✅ **PRODUCT - What You Already Have**

#### Core Platform (60% B2B-Ready)

| Asset | Status | B2C Use | B2B Use | Reusability |
|-------|--------|---------|---------|-------------|
| **LINE Bot** | ✅ Production | Patient interface | Patient interface | 100% - Keep as-is |
| **Gemini Live (LIFF)** | ✅ Production | Voice consultation | Voice consultation | 100% - Keep as-is |
| **Onboarding Flow** | ✅ Production | 5-step registration | Simplified for bulk import | 70% - Modify |
| **Daily Check-ins** | ✅ Production | Morning/evening messages | Same | 100% - Keep as-is |
| **Medication Tracking** | ✅ Production | Adherence logging | Adherence reporting | 100% - Keep as-is |
| **Red Flag Detection** | ✅ Production | Emergency alerts | Risk alerts to insurer | 90% - Add insurer notification |
| **Health Data Logging** | ✅ Production | Patient records | Population data | 100% - Keep as-is |
| **Risk Scoring** | ✅ Production | Basic algorithm | Enhanced for insurers | 80% - Enhance |
| **Database Schema** | ✅ Production | Patient data | Need outcomes tables | 70% - Extend |

**Verdict**: Core health monitoring features are **100% reusable** for B2B. This is your foundation.

#### Infrastructure

| Asset | Status | B2C Use | B2B Use | Reusability |
|-------|--------|---------|---------|-------------|
| **Railway Deployment** | ✅ Production | Hosting | Hosting | 100% - Scale up |
| **Supabase Database** | ✅ Production | Patient data | Multi-tenant data | 80% - Add tenant isolation |
| **Gemini API Integration** | ✅ Production | AI responses | AI responses | 100% - Keep as-is |
| **LINE Messaging API** | ✅ Production | Patient comms | Patient comms | 100% - Keep as-is |
| **WebSocket Server** | ✅ Production | Gemini Live | Gemini Live | 100% - Keep as-is |

**Verdict**: Infrastructure is solid, just needs scaling.

---

### ❌ **PRODUCT - What You're Missing for B2B**

#### Critical Gaps (Must Build)

| Feature | Priority | Effort | Cost | Timeline |
|---------|----------|--------|------|----------|
| **Population Health Dashboard** | 🔴 P0 | High | ฿300K | 6-8 weeks |
| **Outcomes Reporting** | 🔴 P0 | Medium | ฿150K | 3-4 weeks |
| **ROI Calculator** | 🔴 P0 | Low | ฿50K | 1 week |
| **Bulk Patient Onboarding** | 🔴 P0 | Medium | ฿100K | 2-3 weeks |
| **Multi-Tenant Architecture** | 🟡 P1 | High | ฿200K | 4-6 weeks |
| **Admin Portal** | 🟡 P1 | Medium | ฿150K | 3-4 weeks |
| **API for Integrations** | 🟡 P1 | Medium | ฿100K | 2-3 weeks |
| **White-Label Branding** | 🟢 P2 | Low | ฿50K | 1 week |

**Total Build Cost**: ฿1.1M (P0 + P1 features)  
**Total Timeline**: 12-16 weeks (3-4 months)

---

### ✅ **MARKETING - What You Already Have (B2C Funnel)**

#### TikTok Content

| Asset | Status | B2C Use | B2B Use | Reusability |
|-------|--------|---------|---------|-------------|
| **TikTok Account** | ❓ Unknown | Consumer awareness | Thought leadership | 50% - Repurpose |
| **TikTok Videos** | ❓ Unknown | Patient education | Case studies | 60% - Repurpose |
| **TikTok Followers** | ❓ Unknown | Direct customers | Credibility signal | 30% - Indirect value |

**B2C TikTok Strategy** (Assumed):
- Content: "How to manage diabetes", "Hanna tips", patient testimonials
- Target: Diabetic patients, caregivers
- CTA: "Try Hanna free for 14 days"

**B2B Repurposing**:
- ✅ **Keep TikTok for B2C** (proof of concept users)
- ✅ **Extract testimonials** for B2B sales deck
- ✅ **Show engagement metrics** to insurers (proof of patient adoption)
- ❌ **Don't use TikTok for insurer marketing** (wrong channel)

#### Landing Page

| Asset | Status | B2C Use | B2B Use | Reusability |
|-------|--------|---------|---------|-------------|
| **Landing Page** | ❓ Unknown | Consumer sign-ups | Not applicable | 0% - Build new |
| **Copy/Messaging** | ❓ Unknown | "Take control of your diabetes" | "Reduce claims by 20%" | 0% - Rewrite |
| **Design Assets** | ❓ Unknown | Patient-focused | Clinical/ROI-focused | 30% - Rebrand |
| **Conversion Funnel** | ❓ Unknown | Trial → Paid | Demo → Pilot → Contract | 0% - Rebuild |

**B2C Landing Page** (Assumed):
- Headline: "Your AI Nurse for Diabetes Care"
- Features: Voice chat, daily check-ins, medication reminders
- CTA: "Start Free Trial"
- Conversion: 2-5% (typical for health apps)

**B2B Landing Page** (Needed):
- Headline: "Reduce Diabetes Claims by 20% with AI-Powered Care"
- Features: Population health dashboard, outcomes reporting, ROI proof
- CTA: "Schedule Demo" or "Download Case Study"
- Conversion: 10-20% (for demo requests)

**Verdict**: Build **separate B2B landing page**, keep B2C for patient acquisition.

---

### ❌ **MARKETING - What You're Missing for B2B**

#### Sales & Marketing Assets

| Asset | Priority | Effort | Cost | Timeline |
|---------|----------|--------|------|----------|
| **B2B Landing Page** | 🔴 P0 | Low | ฿50K | 1 week |
| **Sales Deck (PowerPoint)** | 🔴 P0 | Medium | ฿100K | 2 weeks |
| **Case Study / White Paper** | 🔴 P0 | Medium | ฿150K | 3 weeks |
| **ROI Calculator (Excel)** | 🔴 P0 | Low | ฿30K | 1 week |
| **Product Demo Video** | 🟡 P1 | Medium | ฿80K | 2 weeks |
| **LinkedIn Presence** | 🟡 P1 | Low | ฿20K | Ongoing |
| **Insurance Industry Events** | 🟡 P1 | Low | ฿50K/event | Ongoing |
| **PR / Media Coverage** | 🟢 P2 | Medium | ฿100K | 1-2 months |

**Total Marketing Cost**: ฿580K (P0 + P1)

---

## Detailed Asset Analysis

### 1. **TikTok Strategy: B2C vs B2B**

#### Current B2C TikTok (Keep Running)

**Purpose**: Acquire proof-of-concept patients

**Content Strategy**:
- ✅ Patient education (diabetes tips, meal ideas)
- ✅ Hanna feature demos (voice chat, reminders)
- ✅ User testimonials (with permission)
- ✅ Behind-the-scenes (AI nurse development)

**Metrics to Track** (for B2B sales):
- Total followers (credibility)
- Engagement rate (patient interest)
- Testimonial videos (social proof)
- User-generated content (adoption proof)

**B2B Value**:
- Show insurers: "We have 10K+ engaged followers"
- Proof: "Patients love our product" (testimonials)
- Credibility: "We're thought leaders in diabetes care"

**Investment**: ฿20K-50K/month (content creator + ads)

#### New B2B Content Strategy (LinkedIn, Not TikTok)

**Why LinkedIn, Not TikTok**:
- Insurance executives don't use TikTok for work
- LinkedIn is where B2B decisions happen
- Professional content, not entertainment

**LinkedIn Content Strategy**:
- 📊 **Data posts**: "How AI reduces diabetes claims by 20%"
- 📰 **Industry insights**: "Thailand diabetes crisis costs insurers ฿50B/year"
- 🎯 **Case studies**: "How we helped 100 patients reduce HbA1c by 0.8%"
- 🎤 **Thought leadership**: "The future of chronic disease management"

**Target Audience**:
- Chief Medical Officers (CMOs)
- Actuaries
- Product Managers (health insurance)
- Innovation Directors

**Investment**: ฿30K-50K/month (content + LinkedIn ads)

---

### 2. **Landing Page Strategy: Dual Funnel**

#### B2C Landing Page (Keep for Patient Acquisition)

**URL**: `hanna.health` or `hanna.co.th`

**Purpose**: Acquire trial users for clinical proof

**Sections**:
1. **Hero**: "Your AI Nurse for Diabetes Care" + Hanna avatar
2. **Features**: Voice chat, daily check-ins, medication reminders
3. **Social Proof**: TikTok testimonials, user count
4. **Pricing**: "Free 14-day trial, then ฿2,999/month"
5. **CTA**: "Start Free Trial" → LINE bot

**Traffic Sources**:
- TikTok ads
- Facebook ads
- Google Search (diabetes keywords)
- LINE OA discovery

**Conversion Goal**: 100-200 trial sign-ups/month

**Investment**: ฿50K build + ฿30K-50K/month ads

#### B2B Landing Page (New - For Insurers)

**URL**: `hanna.health/insurers` or `hanna-enterprise.com`

**Purpose**: Generate demo requests from insurers

**Sections**:
1. **Hero**: "Reduce Diabetes Claims by 20% with AI-Powered Care"
   - Subheadline: "Proven outcomes. Real savings. Scalable solution."
   - CTA: "Schedule Demo"

2. **Problem Statement**:
   - "Diabetes costs Thai insurers ฿50B+ annually"
   - "70% of diabetics are non-adherent to medication"
   - "Preventable complications drive 80% of claims"

3. **Solution Overview**:
   - AI-powered daily monitoring
   - Real-time red flag detection
   - Medication adherence tracking
   - Population health dashboard

4. **ROI Calculator** (Interactive):
   - Input: Number of diabetic members
   - Output: Estimated annual savings
   - Example: "10,000 members = ฿180M saved/year"

5. **Clinical Outcomes** (Data from B2C pilot):
   - "0.8% average HbA1c reduction in 3 months"
   - "85% medication adherence rate"
   - "12 critical incidents prevented"

6. **Product Demo** (Video):
   - Dashboard walkthrough
   - Patient journey
   - Reporting features

7. **Case Study** (After pilot):
   - "How [Insurer X] reduced diabetes claims by 22%"
   - PDF download

8. **Trust Signals**:
   - "10,000+ patients monitored"
   - "PDPA compliant"
   - "ISO 27001 certified" (if applicable)
   - Partner logos (clinics, hospitals)

9. **CTA**: "Schedule Demo" → Calendly link

**Traffic Sources**:
- LinkedIn ads (targeted at insurance executives)
- Google Search ("diabetes management for insurers")
- Direct outreach (email, LinkedIn DM)
- Industry events

**Conversion Goal**: 5-10 demo requests/month

**Investment**: ฿80K-100K build (more complex than B2C)

---

### 3. **Sales Deck (PowerPoint)**

**Purpose**: Pitch deck for insurer meetings

**Slide Structure** (15-20 slides):

1. **Cover**: "Hanna: AI-Powered Diabetes Care for Insurers"
2. **Problem**: "Diabetes is draining your bottom line"
   - ฿50B+ annual cost to Thai insurers
   - 70% non-adherence rate
   - 80% of claims are preventable
3. **Solution**: "AI nurse that monitors 24/7"
   - Daily check-ins via LINE
   - Real-time red flag detection
   - Medication adherence tracking
4. **How It Works**: Patient journey (screenshots)
5. **Technology**: Gemini Live, LINE integration, dashboard
6. **Clinical Outcomes**: Data from B2C pilot
   - HbA1c reduction
   - Adherence rates
   - Incidents prevented
7. **ROI Model**: "Save ฿180K per patient per year"
   - Breakdown: Fewer hospitalizations, ER visits, complications
8. **Dashboard Demo**: Screenshots of population health view
9. **Reporting**: Sample reports (individual + population)
10. **Implementation**: "Go live in 4 weeks"
    - Week 1: Data integration
    - Week 2: Patient onboarding
    - Week 3: Training
    - Week 4: Launch
11. **Pricing**: "฿6,000-12,000 per patient per year"
    - Tiered based on volume
12. **Case Study**: "How we helped 100 patients" (B2C data)
13. **Security & Compliance**: PDPA, ISO 27001, data encryption
14. **Team**: Founders, advisors, clinical partners
15. **Ask**: "Let's start with a 3-month pilot (1,000 patients)"

**Investment**: ฿100K (designer + content writer)

---

### 4. **Case Study / White Paper**

**Purpose**: Credibility document for insurers

**Title**: "Reducing Diabetes Claims Through AI-Powered Continuous Care: A 6-Month Pilot Study"

**Sections**:
1. **Executive Summary**
   - 100 patients monitored for 6 months
   - 0.8% average HbA1c reduction
   - 85% medication adherence
   - Estimated ฿18M savings (฿180K/patient)

2. **Background**
   - Diabetes burden in Thailand
   - Current care gaps
   - Technology opportunity

3. **Methodology**
   - Patient selection criteria
   - Intervention (Hanna platform)
   - Measurement (HbA1c, adherence, incidents)

4. **Results**
   - Clinical outcomes (charts, graphs)
   - Cost savings calculation
   - Patient satisfaction (NPS score)

5. **Discussion**
   - Why it works (daily engagement, AI personalization)
   - Scalability (can handle 100K+ patients)
   - ROI for insurers

6. **Conclusion**
   - Recommendation for insurer adoption
   - Next steps (pilot program)

**Format**: 10-15 page PDF, professional design

**Investment**: ฿150K (medical writer + designer)

---

### 5. **ROI Calculator (Excel + Web)**

**Purpose**: Show insurers their potential savings

**Inputs**:
- Number of diabetic members
- Average annual claims cost per diabetic (default: ฿100K)
- Current medication adherence rate (default: 60%)
- Current HbA1c control rate (default: 40%)

**Calculations**:
- Improved adherence → 20% reduction in hospitalizations
- Better HbA1c control → 15% reduction in complications
- Early intervention → 10% reduction in ER visits
- **Total savings**: 18-25% of annual claims cost

**Outputs**:
- Annual savings (฿)
- Hanna cost (฿6K-12K per patient)
- Net savings (฿)
- ROI (%)
- Payback period (months)

**Example**:
- 10,000 diabetic members
- Current claims: ฿1B/year
- Hanna cost: ฿80M/year (฿8K/patient)
- Savings: ฿200M/year (20% reduction)
- **Net benefit**: ฿120M/year
- **ROI**: 150%

**Formats**:
- Excel spreadsheet (for detailed analysis)
- Web calculator (on B2B landing page)

**Investment**: ฿30K (developer)

---

## Complete Build Plan

### Phase 1: Proof of Concept (Months 1-3) - **B2C Focus**

**Goal**: Get 100 patients, collect clinical outcomes

**Assets to Build**:
| Asset | Cost | Timeline |
|-------|------|----------|
| ✅ Product (already built) | ฿0 | Done |
| ✅ TikTok content (ongoing) | ฿50K/month | Ongoing |
| ✅ B2C landing page | ฿50K | Week 1 |
| ✅ Facebook/TikTok ads | ฿50K/month | Ongoing |

**Total Investment**: ฿200K (Month 1-3)

**Deliverables**:
- 100 trial users
- Clinical outcomes data (HbA1c, adherence)
- Patient testimonials
- Cost savings estimate

---

### Phase 2: B2B MVP (Months 4-6) - **Dual Track**

**Goal**: Build insurer features, start sales outreach

**Assets to Build**:

#### Product (Priority Order)
| Asset | Cost | Timeline | Developer |
|-------|------|----------|-----------|
| 1. Population Health Dashboard | ฿300K | 6-8 weeks | 2 devs |
| 2. Outcomes Reporting | ฿150K | 3-4 weeks | 1 dev |
| 3. Bulk Patient Onboarding | ฿100K | 2-3 weeks | 1 dev |
| 4. ROI Calculator (web) | ฿50K | 1 week | 1 dev |
| **Subtotal** | **฿600K** | **12 weeks** | |

#### Marketing
| Asset | Cost | Timeline | Resource |
|-------|------|----------|----------|
| 1. B2B Landing Page | ฿80K | 1 week | Designer + dev |
| 2. Sales Deck | ฿100K | 2 weeks | Designer + writer |
| 3. Case Study / White Paper | ฿150K | 3 weeks | Medical writer |
| 4. ROI Calculator (Excel) | ฿30K | 1 week | Analyst |
| 5. Product Demo Video | ฿80K | 2 weeks | Videographer |
| 6. LinkedIn content | ฿50K/month | Ongoing | Content creator |
| **Subtotal** | **฿490K + ฿50K/month** | **8 weeks** | |

**Total Investment**: ฿1.09M + ฿50K/month

**Deliverables**:
- Insurer-ready product (dashboard, reporting)
- Complete sales collateral
- 5-10 insurer meetings scheduled

---

### Phase 3: Pilot Deal (Months 7-12) - **B2B Focus**

**Goal**: Sign 1 pilot insurer, deliver results

**Assets to Build**:
| Asset | Cost | Timeline |
|-------|------|----------|
| Multi-tenant architecture | ฿200K | 4-6 weeks |
| Admin portal | ฿150K | 3-4 weeks |
| API for integrations | ฿100K | 2-3 weeks |
| White-label branding | ฿50K | 1 week |
| **Subtotal** | **฿500K** | **10 weeks** |

**Sales Investment**:
| Activity | Cost | Timeline |
|----------|------|----------|
| Enterprise sales hire | ฿150K/month | Ongoing |
| Industry events (3 events) | ฿150K | Months 7-12 |
| LinkedIn ads | ฿50K/month | Ongoing |
| **Subtotal** | **฿1.05M** | **6 months** |

**Total Investment**: ฿1.55M

**Deliverables**:
- 1 signed pilot contract (1,000-5,000 patients)
- ฿5M-25M annual contract value
- Proof of ROI for scale

---

## Total Investment Summary

### Months 1-3 (B2C Proof of Concept)
- Product: ฿0 (already built)
- Marketing: ฿200K (ads, landing page)
- **Total**: ฿200K

### Months 4-6 (B2B MVP)
- Product: ฿600K (dashboard, reporting)
- Marketing: ฿490K + ฿150K (3 months content) = ฿640K
- **Total**: ฿1.24M

### Months 7-12 (Pilot Deal)
- Product: ฿500K (enterprise features)
- Sales: ฿1.05M (team + events + ads)
- **Total**: ฿1.55M

### **GRAND TOTAL (12 months)**: ฿2.99M (~฿3M)

---

## Funding Strategy

### Option 1: Bootstrap (Slow but Safe)

**Source**: B2C revenue

**Timeline**:
- Months 1-3: Launch B2C, get 100 users → ฿360K/year revenue
- Months 4-6: Scale to 300 users → ฿1.08M/year revenue
- Use revenue to fund B2B development (slow)

**Pros**: No dilution, full control
**Cons**: Slow (12-18 months to pilot), limited resources

### Option 2: Angel Round (Recommended)

**Raise**: ฿5M-10M

**Valuation**: ฿20M-30M pre-money (20-33% dilution)

**Use of Funds**:
- ฿3M: Product + marketing (as per plan)
- ฿2M: Sales team (2-3 people)
- ฿2M: Runway (6-12 months)
- ฿1M: Buffer

**Timeline**: 6-9 months to pilot deal

**Pros**: Fast execution, hire talent, multiple shots on goal
**Cons**: 20-33% dilution

### Option 3: Strategic Partner (Insurer Co-Development)

**Partner**: Mid-size insurer (Bangkok Insurance, Dhipaya)

**Deal Structure**:
- Insurer pays ฿3M-5M for exclusive pilot
- You build custom features for them
- They get 12-month exclusivity
- You keep IP and can sell to others after

**Pros**: No dilution, built-in customer, credibility
**Cons**: Slower (insurer bureaucracy), limited to 1 customer initially

---

## Recommended Approach: **Hybrid**

### Month 1-3: Bootstrap with B2C
- Launch soft launch (20-100 users)
- Generate ฿360K-1M revenue
- Collect clinical outcomes
- **Investment**: ฿200K (from savings or small loan)

### Month 4: Raise Angel Round
- **Pitch**: "We have 100 users, proven outcomes, ready to scale to insurers"
- **Ask**: ฿5M-10M at ฿25M valuation
- **Investors**: Thai VCs (500 TukTuks, Beacon VC, Gobi Partners)

### Month 4-6: Build B2B MVP
- Use angel funding to hire 2-3 developers
- Build dashboard, reporting, sales collateral
- Start insurer outreach

### Month 7-12: Close Pilot Deal
- Pitch 10-15 insurers
- Close 1 pilot (฿5M-25M contract)
- Deliver results

### Month 13+: Scale
- Raise Series A (฿50M-100M)
- Sign 3-5 more insurers
- Build integrations (claims, EMR)

---

## Asset Reusability Matrix

### What to Keep from B2C

| Asset | B2C Use | B2B Use | Action |
|-------|---------|---------|--------|
| LINE Bot | ✅ Keep | ✅ Keep | No changes |
| Gemini Live | ✅ Keep | ✅ Keep | No changes |
| Health monitoring | ✅ Keep | ✅ Keep | No changes |
| TikTok account | ✅ Keep | ⚠️ Repurpose | Extract testimonials |
| TikTok content | ✅ Keep | ⚠️ Repurpose | Use for credibility |
| B2C landing page | ✅ Keep | ❌ Don't use | Keep separate |
| Trial/payment flow | ✅ Keep | ❌ Don't use | Insurers pay differently |

### What to Build New for B2B

| Asset | Priority | Cost | Timeline |
|-------|----------|------|----------|
| Population dashboard | 🔴 P0 | ฿300K | 6-8 weeks |
| Outcomes reporting | 🔴 P0 | ฿150K | 3-4 weeks |
| B2B landing page | 🔴 P0 | ฿80K | 1 week |
| Sales deck | 🔴 P0 | ฿100K | 2 weeks |
| Case study | 🔴 P0 | ฿150K | 3 weeks |
| ROI calculator | 🔴 P0 | ฿50K | 1 week |
| LinkedIn presence | 🟡 P1 | ฿50K/month | Ongoing |
| Multi-tenant architecture | 🟡 P1 | ฿200K | 4-6 weeks |

---

## Quick Start Checklist (This Week)

### Immediate Actions (฿0 cost)
- [ ] Review current TikTok content - identify best testimonials
- [ ] Screenshot Hanna features (LINE bot, Gemini Live) for sales deck
- [ ] Draft B2B value proposition (1-pager)
- [ ] List 10 target insurers (AIA, Muang Thai, Bangkok Insurance, etc.)
- [ ] Research insurance industry events (next 6 months)

### Week 1 Actions (฿50K-100K)
- [ ] Design B2C landing page (Figma mockup)
- [ ] Start TikTok ads (฿20K budget)
- [ ] Create LinkedIn company page
- [ ] Draft sales deck outline (PowerPoint)
- [ ] Build simple ROI calculator (Excel)

### Month 1 Actions (฿200K)
- [ ] Launch B2C landing page
- [ ] Run TikTok/Facebook ads (get 20-50 users)
- [ ] Collect first clinical data points
- [ ] Finalize sales deck (with early data)
- [ ] Schedule 3-5 informational meetings with insurers

---

## Summary: What You Have vs. Need

### ✅ **What You Already Have (60% Ready)**
- Complete health monitoring platform
- Gemini Live voice technology
- LINE bot infrastructure
- Red flag detection
- Medication tracking
- Database with patient data
- TikTok presence (for testimonials)

### 🔨 **What You Need to Build (40% Missing)**
- Population health dashboard (6-8 weeks, ฿300K)
- Outcomes reporting (3-4 weeks, ฿150K)
- B2B sales collateral (3-4 weeks, ฿330K)
- Multi-tenant architecture (4-6 weeks, ฿200K)
- Sales team (hire 1-2 people, ฿150K-300K/month)

### 💰 **Total Investment Needed**
- **Months 1-3**: ฿200K (B2C proof of concept)
- **Months 4-6**: ฿1.24M (B2B MVP)
- **Months 7-12**: ฿1.55M (Pilot deal)
- **Total**: ฿3M

### 🎯 **Expected Return**
- **Month 12**: ฿5M-25M pilot contract
- **Year 2**: ฿100M-200M revenue (3-5 insurers)
- **Year 5**: ฿1B-2B revenue, exit for ฿10B-15B

**ROI**: 3,000-5,000% over 5 years 🚀

---

**Bottom Line**: You have the hard part (AI, voice, clinical features). You need the "boring" part (dashboards, reports, sales). Total cost: ฿3M. Total upside: ฿10B+. **This is a no-brainer.**
