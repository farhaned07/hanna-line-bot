# Internal Operations Playbook

> **Internal Document** — Running the company  
> **Last Updated:** 2025-12-31  
> **Classification:** Operational

---

## Philosophy: Product-First Focus

**Current Strategy: Manual Ops, Automated Product.**

We have decided to **PAUSE** internal agent automation (n8n/Dify) to focus 100% of engineering bandwidth on the core product (Hanna).

- **Company Ops:** Manual (Founder led). Do things that don't scale.
- **Product Delivery:** Automated (Falcon/Titan). Sell the scalable product.

---

## Operational Stack (Current status)

### Company Ops (Manual)

| Role | Responsibilities | Method |
|------|------------------|--------|
| **Executive Admin** | Inbox, Scheduling | Founder (Manual) |
| **Social Media** | Content, Posting | Founder (Manual) |
| **Sales Outreach** | Lead Gen, Follow-up | Founder (Manual) |
| **Content/SEO** | Blog writing | Founder (Manual) |

*Decision:* We will revisit automating these roles only after Hanna reaches critical mass or revenue milestones.

### Product Agents (Hanna System)

**STATUS: ACTIVE & PRIORITY**
These are the revenue-generating agents living in `/agents/revenue/`.

| Agent | Location | Purpose |
|-------|----------|---------|
| **Falcon** | `/agents/revenue/falcon` | Revenue Intelligence & Strategy |
| **Titan** | `/agents/revenue/titan` | High-value lead engagement |
| **Closer** | `/agents/revenue/closer` | Deal closing & checkout generation |
| **Core** | `/agents/core/` | Shared utilities (LLM, DB, Logger) |

---

## Workflow Integration

### Daily Routine (Manual)

- **Morning:** Triage inbox, check Railway logs for Falcon/Titan health.
- **Mid-Day:** Manual sales outreach (LinkedIn/Email).
- **Evening:** Code/Product development.

---

## Future Roadmap (On Hold)

*The following workstreams are paused:*
- [ ] Deploy n8n/Dify for internal ops
- [ ] Automate social media posting
- [ ] Automate SEO blog drafting

---

## Summary

| Focus Area | Strategy |
|------------|----------|
| **Internal Ops** | **Manual** (Don't over-engineer yet) |
| **Product (Hanna)** | **Automated** (Focus all code here) |

**"Do things that don't scale, so you can build the thing that does."**
