# 🏢 Hanna Team Strategy Session

**Date**: March 9, 2026
**Attendees**: CEO/Founder, Product Manager, Engineering Lead, Sales Lead
**Purpose**: Review positioning, roadmap, and next steps

---

## 📋 Agenda

1. Product Positioning Review (PM)
2. Technical Readiness Assessment (Engineering)
3. Go-to-Market Strategy (Sales)
4. Resource Allocation (CEO)
5. Decisions & Action Items (All)

---

## 1. Product Positioning Review

**Presenter**: Product Manager

### What We Have Now

```
Hanna Care Intelligence Platform
│
├── Scribe (Entry Point) — Voice-to-SOAP
├── Care Plan (Add-on) — Auto-generated care plans
├── Follow-up (Monitoring) — 14-day LINE check-ins
└── Care Intelligence (Enterprise) — Population health + risk scoring
```

### Why This Positioning Wins

| Old Positioning | New Positioning |
|-----------------|-----------------|
| "Financial risk engine" (CFO-only) | "Care Intelligence Platform" (broad appeal) |
| Capitation hospitals only | All hospitals + individual doctors |
| Cost avoidance (defensive) | Better outcomes (offensive) |
| Single product (Care Intelligence) | 4-tier ladder (natural progression) |

### Market Size Impact

| Segment | Old TAM | New TAM |
|---------|---------|---------|
| Individual Doctors | ❌ Ignored | ✅ 50,000+ in Thailand |
| Small Clinics | ❌ Ignored | ✅ 2,000+ |
| Mid-tier Hospitals | ✅ 20-30 | ✅ 20-30 |
| Large Hospital Chains | ❌ Ignored | ✅ 5-10 |
| Regional (SE Asia) | ❌ Ignored | ✅ 4 countries |

**PM Recommendation**: ✅ **Approved** — This positioning is correct and scalable.

---

## 2. Technical Readiness Assessment

**Presenter**: Engineering Lead

### Current State (What's Built)

| Tier | Status | Completeness |
|------|--------|--------------|
| **Scribe** | ✅ Production | 95% (offline mode missing) |
| **Care Plan** | 🟡 Spec Complete | 0% (ready for build) |
| **Follow-up** | ✅ Production | 100% (just shipped) |
| **Care Intelligence** | ✅ Production | 90% (outcomes dashboard missing) |

### Technical Debt

| Issue | Priority | Effort | Impact |
|-------|----------|--------|--------|
| Outcomes dashboard not built | P0 | 2 weeks | High (sales blocker) |
| Care Plan not built | P0 | 4 weeks | High (gap in ladder) |
| EMR integrations missing | P1 | 6 weeks | Medium (long-term moat) |
| Offline mode (Scribe) | P1 | 1 week | Medium (user experience) |
| Multi-language expansion | P2 | 3 weeks | Low (nice-to-have) |

### Engineering Concerns

**Concern 1: Care Plan Complexity**
> "The spec is comprehensive, but 4 weeks is optimistic. We need to validate AI generation quality before launch."

**Recommendation**: Start with 10 condition templates, not 50. Iterate based on doctor feedback.

**Concern 2: Outcomes Dashboard**
> "Sales needs this NOW. We should prioritize over Care Plan."

**Recommendation**: Build MVP in 1 week (basic metrics), then iterate.

**Concern 3: Team Capacity**
> "We're one engineer + founder. Can we actually deliver Care Plan + Outcomes + EMR integration in Q2?"

**Recommendation**: Hire contract developer for Care Plan, founder focuses on sales.

### Engineering Verdict

| Initiative | Feasible? | Timeline |
|------------|-----------|----------|
| Outcomes Dashboard (MVP) | ✅ Yes | 1-2 weeks |
| Care Plan (10 templates) | ✅ Yes | 4-6 weeks |
| EMR Integration (HosxP) | ⚠️ Stretch | 8-10 weeks |
| All three in Q2 | ❌ No | Need more resources |

---

## 3. Go-to-Market Strategy

**Presenter**: Sales Lead

### Target Customers (Prioritized)

| Priority | Segment | Why | Expected Close Rate |
|----------|---------|-----|---------------------|
| **P1** | Private Hospitals (50-200 beds) | Budget approved, faster decision | 30-40% |
| **P2** | Mid-tier Hospital Chains | Multiple clinics, higher ACV | 20-30% |
| **P3** | Government Hospitals (SSS/UCS) | Large volume, slow procurement | 10-20% |
| **P4** | Individual Doctors (Scribe) | Self-serve, low ACV | 5-8% conversion |

### Sales Motion by Tier

| Tier | Sales Motion | Cycle Length | ACV |
|------|--------------|--------------|-----|
| **Scribe** | Self-serve (website) | Instant | ฿0-12K/year |
| **Scribe + Care Plan** | Demo + trial | 1-2 weeks | ฿36K/year |
| **Care Intelligence** | Pilot (90 days) → Annual | 3-6 months | ฿600K/year |

### Pipeline Targets (Q2 2026)

| Metric | Target | Rationale |
|--------|--------|-----------|
| Scribe Free Users | 500 | Top of funnel |
| Scribe Pro Conversion | 25 (5%) | ฿300K ARR |
| Care Plan Attach Rate | 5 (20%) | ฿120K ARR |
| Care Intelligence Pilots | 5 | 2-3 convert to annual |
| **Total Q2 ARR** | **฿1.5M** | Achievable with 1 sales person |

### Sales Concerns

**Concern 1: No Case Studies**
> "Hospitals want proof. We have zero published outcomes."

**Recommendation**: Complete 3 pilots ASAP, even if discounted. Get testimonials.

**Concern 2: Outcomes Dashboard Missing**
> "CFOs want to see ROI dashboard. We can't demo this yet."

**Recommendation**: Build MVP dashboard first (before Care Plan).

**Concern 3: Pricing Confusion**
> "Is Scribe separate from Care Intelligence? How do they connect?"

**Recommendation**: Create one-pager showing 4-tier ladder with clear upgrade path.

### Sales Verdict

| Need | Priority | Owner |
|------|----------|-------|
| Outcomes Dashboard (MVP) | P0 | Engineering |
| 3 Pilot Case Studies | P0 | Sales + CEO |
| Pricing One-Pager | P1 | PM + Sales |
| Demo Environment | P1 | Engineering |

---

## 4. Resource Allocation

**Presenter**: CEO/Founder

### Current Resources

| Resource | Status | Availability |
|----------|--------|--------------|
| **Founder/CEO** | Full-time | Sales + product strategy |
| **Engineering** | 1 person (founder-led) | Product development |
| **Contractors** | None yet | Budget: ฿200K available |
| **Cash Runway** | 6 months | Need revenue by Q3 |

### Hiring Plan

| Role | When | Why | Cost |
|------|------|-----|------|
| **Customer Success Manager** | April 2026 | Onboard pilots, training | ฿45K/month |
| **Contract Developer** | March 2026 | Care Plan build | ฿80K/month (3 months) |
| **Sales Person** | June 2026 | Scale enterprise sales | ฿60K/month + commission |

### Budget Allocation (Q2 2026)

| Category | Budget | % of Total |
|----------|--------|------------|
| Engineering (contractor) | ฿240K | 40% |
| Customer Success | ฿135K | 22% |
| Marketing (website, content) | ฿100K | 17% |
| Sales (travel, events) | ฿75K | 13% |
| Legal/IP (trademark, contracts) | ฿50K | 8% |
| **Total** | **฿600K** | 100% |

### CEO Decisions

**Decision 1: Prioritize Outcomes Dashboard**
> "Sales can't sell without this. Engineering, drop Care Plan for 2 weeks and build this first."

**Decision 2: Hire Contractor for Care Plan**
> "Founder focuses on sales. Contractor builds Care Plan. Parallel tracks."

**Decision 3: Close 3 Pilots at Any Cost**
> "Discount to ฿40K/month if needed. We need case studies more than revenue right now."

---

## 5. Decisions & Action Items

### Decisions Made

| Decision | Rationale | Owner |
|----------|-----------|-------|
| **Outcomes Dashboard first** | Sales blocker | Engineering (2 weeks) |
| **Care Plan contractor** | Parallel development | CEO (hire by March 16) |
| **3 pilots at discount** | Need case studies | Sales (close by May 31) |
| **Positioning locked** | No more changes | All (use new language) |

### Action Items (Next 30 Days)

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Build Outcomes Dashboard (MVP) | Engineering | March 23 | 🟡 In Progress |
| Hire contract developer | CEO | March 16 | 🔴 Not Started |
| Close 1 pilot customer | Sales + CEO | March 31 | 🔴 Not Started |
| Update website (new positioning) | PM | March 30 | 🔴 Not Started |
| Create pricing one-pager | PM + Sales | March 20 | 🔴 Not Started |
| Update ARCHITECTURE.md | Engineering | March 20 | 🔴 Not Started |
| File trademark (Hanna Care Intelligence) | CEO | March 31 | 🔴 Not Started |

### Action Items (Next 90 Days)

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Complete Care Plan (10 templates) | Contractor | June 15 | 🔴 Not Started |
| Close 3 pilot customers | Sales + CEO | May 31 | 🔴 Not Started |
| Publish 3 case studies | PM | June 30 | 🔴 Not Started |
| Hire Customer Success Manager | CEO | April 30 | 🔴 Not Started |
| EMR integration (HosxP) | Engineering | June 30 | 🔴 Not Started |

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Run out of cash** | Medium | 🔴 Critical | Close 3 pilots by May, raise pre-seed |
| **Care Plan delayed** | High | 🟡 High | Hire contractor, reduce scope (10 templates) |
| **No pilot conversions** | Medium | 🔴 Critical | Discount pricing, add features, extend pilot |
| **Competitor copies** | High | 🟡 Medium | Speed to market, EMR partnerships |
| **Team burnout** | Medium | 🟡 Medium | Hire CS manager, founder focuses on sales only |

---

## 7. Success Metrics (Q2 2026)

### Company-Level OKRs

| Objective | Key Result | Target | Current |
|-----------|------------|--------|---------|
| **Validate Product-Market Fit** | Pilot customers closed | 3 | 0 |
| | Pilot → Annual conversion | 70% | N/A |
| | NPS (doctors) | >50 | N/A |
| **Build Revenue Foundation** | Q2 ARR | ฿1.5M | ฿0 |
| | Scribe Pro users | 25 | 0 |
| | Care Intelligence pilots | 5 | 0 |
| **Prepare for Scale** | Team size | 4 people | 1 (founder) |
| | EMR partnerships signed | 1 | 0 |
| | Trademark filed | 1 | 0 |

---

## 8. Closing Remarks

### CEO
> "We have a clear product, clear positioning, and clear roadmap. Now execute. Sales is priority #1. Everything else supports that."

### Product Manager
> "Documentation is aligned. Now we need to make sure website, sales deck, and all external comms match."

### Engineering Lead
> "Outcomes Dashboard first. Then Care Plan. Need contractor support to hit Q2 targets."

### Sales Lead
> "I can close 3 pilots if we have demo + outcomes dashboard. Let's make this happen."

---

## 📋 Meeting Adjourned

**Next Team Session**: March 23, 2026 (Review Outcomes Dashboard MVP)

**Meeting Notes Distributed**: All attendees + advisors

---

*"From episodic documentation to continuous intelligence."*

*Strategy Session Complete: March 9, 2026*
