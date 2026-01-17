export const SAAS_TEMPLATE = `
<template_context>
This is a SaaS (Software as a Service) product.
Focus on: subscription models, user onboarding, B2B/B2C considerations, scalability, and recurring revenue optimization.
</template_context>

<domain_benchmarks>
Industry standards for SaaS metrics (use these as baseline):
- Monthly Churn Rate: <5% (good), <3% (excellent), >7% (concerning)
- Net Revenue Retention (NRR): >100% (healthy), >120% (excellent)
- CAC Payback Period: <12 months (good), <6 months (excellent)
- LTV:CAC Ratio: >3:1 (minimum viable), >5:1 (excellent)
- Trial-to-Paid Conversion: 15-25% (typical), >30% (excellent)
- Free-to-Paid Conversion (freemium): 2-5% (typical)
- Monthly Active User (MAU) to Paid: 5-10% (typical)
- Time to Value (TTV): <5 minutes for first "aha moment"
</domain_benchmarks>

<critical_considerations>
MUST address in PRD:
1. **Pricing Model Selection**:
   - Freemium: High volume, low marginal cost (e.g., Slack, Dropbox)
   - Free Trial: Complex product needing evaluation (e.g., Salesforce)
   - Usage-based: Variable consumption patterns (e.g., AWS, Twilio)
   - Flat-rate: Simple value prop, predictable cost (e.g., Basecamp)

2. **Onboarding & Activation**:
   - Define "activation" event (first value moment)
   - Target: 40%+ users complete activation within Day 1
   - Consider guided tours, templates, sample data

3. **Retention Mechanics**:
   - Data lock-in (user-generated content, integrations)
   - Workflow dependency (daily habit formation)
   - Collaboration effects (team adoption)

4. **B2B vs B2C Considerations**:
   - B2B: Longer sales cycle, multiple stakeholders, security/compliance, SSO
   - B2C: Viral loops, self-serve, mobile-first, quick decisions
</critical_considerations>

<additional_sections>
- Pricing Strategy (model selection rationale, tier structure, upgrade triggers)
- Onboarding Flow (activation milestones, TTV optimization)
- Retention & Expansion (churn prevention, upsell paths, NRR strategy)
- Customer Acquisition (channels, CAC by channel, viral coefficients)
- Integration Capabilities (API, webhooks, marketplace strategy)
</additional_sections>

<common_pitfalls>
Avoid these SaaS-specific mistakes:
- Pricing too low: Undervaluing product makes scaling harder (can't afford sales/support)
- Feature bloat: Adding features without clear activation/retention impact
- Ignoring churn signals: Not tracking leading indicators (login frequency, feature usage)
- No upgrade path: Single tier with no expansion revenue potential
- Weak onboarding: Assuming users will "figure it out"
- B2B without security: Missing SOC2, SSO, audit logs for enterprise sales
</common_pitfalls>

<example_ko>
<idea>AI 기반 이력서 분석 서비스</idea>
<prd_excerpt>
## 1. Executive Summary
이력서를 업로드하면 AI가 ATS 통과율과 개선점을 제안하는 SaaS.
타겟: 구직자(B2C), 커리어 코치(B2B SMB), HR 담당자(B2B Enterprise)

## Pricing Strategy
- **Free**: 월 3회 분석, 기본 점수만 (Lead generation)
- **Pro ($9.99/월)**: 무제한 분석, 상세 리포트, 템플릿 (Activation: 첫 분석 완료)
- **Team ($29.99/월)**: 팀 관리, API, 우선 지원 (Expansion trigger: 3+ users)
- Trial-to-Paid 목표: 20%, Free-to-Pro 목표: 5%

## Retention Metrics
- Activation: 첫 이력서 분석 완료 (Day 1 목표: 60%)
- Weekly Active: 주 1회 이상 로그인 (목표: 40%)
- Churn Signal: 14일 미접속 → 이메일 캠페인 트리거
</prd_excerpt>
</example_ko>

<example_en>
<idea>Team collaboration tool for remote design teams</idea>
<prd_excerpt>
## Pricing Strategy
- **Free**: Up to 3 users, 1 project (viral adoption in small teams)
- **Pro ($12/user/month)**: Unlimited projects, version history (Activation: first shared feedback)
- **Business ($25/user/month)**: SSO, admin controls, priority support (B2B trigger: 10+ users)
- NRR Target: 110% (expansion through seat growth)

## Onboarding Flow
1. Sign up → Create first project (TTV target: <3 min)
2. Invite teammate → First comment received (Activation event)
3. Day 3: Template suggestion based on project type
4. Day 7: "Team insights" email showing collaboration metrics
</prd_excerpt>
</example_en>
`;
