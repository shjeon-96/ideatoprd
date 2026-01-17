# Email Nurturing Sequences

This document defines automated email sequences designed to increase conversion rates at each stage of the user journey.

## Overview

### Goals
- Increase Trial → Paid conversion rate
- Improve user engagement
- Prevent churn and re-engage inactive users
- Drive subscription upgrades

### Recommended Email Providers
- **Resend** (Developer-friendly, API-based)
- **Loops** (SaaS-focused, behavior-based triggers)
- **ConvertKit** (Creator-focused, powerful automation)

---

## Sequence 1: Welcome Series (Post Sign-up)

**Trigger**: Account registration completed
**Goal**: Drive first PRD generation

### Email 1: Welcome (Immediate)
**Subject**: 🎉 Welcome to IdeaToPRD!

```
Hi {{name}},

Thank you for joining IdeaToPRD!

✨ 3 free credits have been added to your account.

Create your first PRD now:
[Create PRD] → /generate

---
🚀 Quick Start Guide:
1. Enter your idea
2. Choose a template
3. Get your complete PRD in 5 minutes

If you have any questions, just reply to this email!

- The IdeaToPRD Team
```

### Email 2: First PRD Reminder (24 hours later, if no PRD created)
**Subject**: You haven't created your first PRD yet 🤔

```
Hi {{name}},

You haven't created your first PRD yet.

💡 Need some inspiration? Try these ideas:
- "AI-powered scheduling app"
- "Slack alternative for team collaboration"
- "Accounting automation for solopreneurs"

Test it risk-free with your 3 free credits.

[Create Your PRD Now]
```

### Email 3: Use Case Inspiration (3 days later, if no PRD created)
**Subject**: How PMs use IdeaToPRD

```
Hi {{name}},

Over 500 PMs are writing PRDs with IdeaToPRD.

📊 Real Use Cases:
- Startup PM: "Reduced PRD writing from 2-3 days to 30 minutes"
- Freelancer: "Now I can send proposals to clients quickly"
- Side Projects: "Dramatically cut down idea validation time"

[Get Started for Free]
```

---

## Sequence 2: First PRD Follow-up (After First PRD)

**Trigger**: First PRD generation completed
**Goal**: Drive second PRD creation and subscription conversion

### Email 1: Congratulations (Immediate)
**Subject**: 🎊 Congrats on your first PRD!

```
Hi {{name}},

You've successfully created your first PRD: "{{prd_title}}"!

📥 Tips for using your PRD:
1. Copy as Markdown → Paste into Notion, GitHub
2. Download as PDF → Share with clients or team
3. Revise feature → Regenerate specific sections with AI

Remaining credits: {{remaining_credits}}

[View PRD in Dashboard]
```

### Email 2: Second PRD Prompt (2 days later)
**Subject**: Turn more ideas into PRDs

```
Hi {{name}},

Did "{{prd_title}}" help you out?

💡 If you have more ideas:
- Research version: PRD with market analysis included
- Detailed version: More comprehensive technical specs

[Create New PRD]

🎁 Tip: Subscribe to save up to 40% per credit.
```

---

## Sequence 3: Credit Depletion (Low Credits)

**Trigger**: 1 or fewer credits remaining
**Goal**: Drive credit purchase or subscription conversion

### Email 1: Low Credit Warning (Immediate)
**Subject**: ⚠️ You have {{credits}} credit(s) left

```
Hi {{name}},

You currently have {{credits}} credit(s) remaining.

💡 Two ways to refill your credits:

1️⃣ One-time Purchase
- Buy only when needed
- $0.60-$1.00 per credit

2️⃣ Subscription (Recommended)
- Auto-refill monthly
- $0.33-$0.50 per credit (up to 40% cheaper)
- Additional 20% off with annual billing

[View Subscription Plans] | [One-time Purchase]
```

### Email 2: Credit Empty (1 day after reaching 0 credits)
**Subject**: You're out of credits 😢

```
Hi {{name}},

Your credits are depleted - you can't create new PRDs.

Your {{prd_count}} existing PRDs are still accessible in your dashboard.

🎁 Subscription Benefits:
- Pro Plan: 60 credits/month for plenty of PRDs
- 30-day money-back guarantee
- Cancel anytime

[Start Pro Plan]
```

---

## Sequence 4: Inactive User Re-engagement

**Trigger**: No login for 14+ days (with PRD history)
**Goal**: Re-activation and return visit

### Email 1: We Miss You (14 days later)
**Subject**: {{name}}, how have you been?

```
Hi {{name}},

We miss you at IdeaToPRD!

📊 Your PRD Stats:
- PRDs created: {{prd_count}}
- Last visit: {{last_visit}}

Whenever you have a new idea, come back anytime.
{{credits}} credits are waiting for you.

[Visit Dashboard]
```

### Email 2: What's New (21 days later)
**Subject**: Check out what's new at IdeaToPRD

```
Hi {{name}},

Here's what we've added to IdeaToPRD recently:

✨ New Features:
- PRD Revision: Regenerate specific sections with AI
- Research Version: PRD with market research included
- Version History: Compare and restore previous versions

[Explore New Features]
```

---

## Sequence 5: Subscription Upsell (Repeat Purchasers)

**Trigger**: 2+ one-time credit purchases
**Goal**: Drive subscription conversion

### Email 1: Subscription Value (3 days after second purchase)
**Subject**: A subscription might save you money 💰

```
Hi {{name}},

You've made {{purchase_count}} one-time credit purchases.
Total spent: {{total_spent}}

💡 By switching to a subscription:
- Get the same credits at up to 40% off
- Auto-refill monthly without interruption
- Unused credits roll over to next month

Estimated savings: ~${{yearly_savings}}/year

[Compare Subscription Plans]
```

---

## Sequence 6: Trial Ending (Free Trial Wrap-up)

**Trigger**: 7 days after sign-up (free credits used)
**Goal**: Drive subscription or purchase conversion

### Email 1: Trial Recap (7 days later)
**Subject**: Your 7-day IdeaToPRD report 📊

```
Hi {{name}},

It's been 7 days since you joined IdeaToPRD!

📊 Your Activity:
- PRDs created: {{prd_count}}
- Credits used: {{used_credits}}
- Credits remaining: {{remaining_credits}}

{{#if has_prds}}
Has IdeaToPRD helped with your PRD writing?
Refill your credits to keep going.
{{else}}
You haven't created a PRD yet.
Try it out with your {{remaining_credits}} free credits!
{{/if}}

[Buy Credits] | [Start Subscription]
```

---

## Implementation Notes

### Technical Implementation

1. **Email Service**
   - Integrate Resend API
   - Build templates with React Email

2. **Trigger Implementation**
   - Supabase Edge Functions or Vercel Cron
   - Event-based user triggers

3. **Tracking Metrics**
   - Open Rate
   - Click-Through Rate (CTR)
   - Conversion Rate
   - Subscription Conversion Rate

### Database Schema Additions

```sql
-- Email send records
CREATE TABLE email_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  sequence_name TEXT NOT NULL,
  email_name TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- Email subscription preferences
ALTER TABLE profiles ADD COLUMN email_preferences JSONB DEFAULT '{
  "marketing": true,
  "product_updates": true,
  "usage_reports": true
}';
```

### A/B Testing Priorities

1. **Subject Line Tests** - With/without emoji, with/without personalization
2. **CTA Button Text** - "Get Started" vs "Get Started Free"
3. **Send Time** - 9 AM vs 2 PM

---

## Metrics & KPIs

| Sequence | Target Open Rate | Target CTR | Target Conversion |
|----------|-----------------|------------|-------------------|
| Welcome | 60%+ | 20%+ | 30% (first PRD) |
| First PRD | 50%+ | 15%+ | 20% (second PRD) |
| Credit Depletion | 70%+ | 25%+ | 15% (purchase/subscribe) |
| Re-engagement | 30%+ | 10%+ | 5% (return visit) |
| Upsell | 40%+ | 15%+ | 10% (subscription) |

---

## Next Steps

1. [ ] Set up Resend account and verify domain
2. [ ] Develop React Email templates
3. [ ] Implement triggers with Supabase Edge Functions
4. [ ] Set up A/B testing framework
5. [ ] Build email analytics dashboard
