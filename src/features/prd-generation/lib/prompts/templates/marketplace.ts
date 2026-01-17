export const MARKETPLACE_TEMPLATE = `
<template_context>
This is a Two-Sided Marketplace connecting supply (sellers/providers) and demand (buyers/consumers).
Focus on: chicken-egg problem, liquidity, trust & safety, take rate optimization, and network effects.
</template_context>

<domain_benchmarks>
Industry standards for marketplaces (use these as baseline):
- Take Rate (commission): 10-20% (typical), 5-10% (commodities), 20-30% (high-touch services)
- Gross Merchandise Value (GMV) Growth: 20%+ MoM in early stage
- Repeat Purchase Rate: >30% (healthy), >50% (excellent)
- Supply Fill Rate: >80% of demand matched
- Time to First Transaction: <7 days for new supply (critical)
- Buyer Conversion: 2-5% of visitors make purchase
- Supply Churn: <10% monthly (critical for liquidity)
- Average Order Value (AOV) growth: 10%+ YoY
- Customer Acquisition Cost: Should be <15% of first transaction value
</domain_benchmarks>

<critical_considerations>
MUST address in PRD:
1. **Chicken-Egg Problem Strategy**:
   - Single Player Mode: Provide value to one side without the other (e.g., OpenTable gave restaurants free software)
   - Subsidize One Side: Often subsidize supply initially (e.g., Uber guaranteed minimum earnings)
   - Narrow Focus: Start with one city, one category, one niche (e.g., Amazon started with books)
   - Fake Supply: Manually fulfill early demand (e.g., Zappos founders bought shoes from stores)

2. **Liquidity Strategy**:
   - Define "liquidity" for your market (e.g., "80% of requests get 3+ responses in 24h")
   - Constrain supply/demand geographically or categorically until liquid
   - Measure and optimize time-to-match

3. **Trust & Safety**:
   - Identity verification (levels: email → phone → ID → background check)
   - Review system (bilateral, timing, fraud detection)
   - Payment escrow (release conditions, dispute handling)
   - Insurance/guarantees (what's covered, limits)

4. **Monetization Strategy**:
   - Commission on transactions (most common)
   - Subscription for premium features/visibility
   - Lead fees (pay per qualified lead)
   - Advertising/promoted listings
   - Consider: Who has more pricing power? Charge them.

5. **Disintermediation Prevention**:
   - Why won't users take transactions off-platform after first match?
   - Payment protection, reviews, discovery, convenience
</critical_considerations>

<additional_sections>
- Supply & Demand Strategy (chicken-egg solution, liquidity definition, geographic rollout)
- Trust & Safety (verification levels, review mechanics, fraud prevention, dispute resolution)
- Fee Structure (take rate, who pays, when charged, volume discounts)
- Matching Algorithm (how supply meets demand, ranking factors, quality signals)
- Network Effects Analysis (same-side vs cross-side effects, defensibility)
</additional_sections>

<common_pitfalls>
Avoid these marketplace-specific mistakes:
- Launching too broad: Start narrow (one city, one category) until liquid
- Ignoring supply quality: Bad supply kills marketplaces faster than no supply
- Taking rate too early/high: Subsidize initially, monetize after network effects kick in
- No disintermediation defense: If users can transact off-platform easily, they will
- Treating both sides equally: Usually one side is harder to get—focus there
- Ignoring trust signals: Reviews, verification, guarantees are not optional
- Manual processes that don't scale: Automate matching, verification, support early
</common_pitfalls>

<example_ko>
<idea>프리랜서 디자이너 마켓플레이스</idea>
<prd_excerpt>
## Chicken-Egg Strategy
- **Phase 1 (공급 확보)**: 디자이너 100명 무료 가입, 포트폴리오 자동 임포트 (Behance/Dribbble 연동)
- **Phase 2 (수요 테스트)**: 스타트업 50곳에 첫 프로젝트 50% 할인 제공
- **Phase 3 (유동성)**: 서울 지역, 로고/브랜딩 카테고리만 집중
- 목표: 요청의 80%가 24시간 내 3개 이상 제안서 수신

## Trust Mechanisms
- 디자이너: 포트폴리오 검증, 실명 인증, 첫 고객 리뷰
- 클라이언트: 프로젝트 비용 에스크로 (마일스톤별 릴리즈)
- 분쟁 해결: 3단계 (당사자 협의 → 중재팀 → 환불 정책)

## Fee Structure
- 기본 수수료: 15% (디자이너 부담)
- 반복 고객: 10% (두 번째 프로젝트부터)
- 목표: 초기 6개월은 5%로 유지 (공급 확보 우선)
</prd_excerpt>
</example_ko>

<example_en>
<idea>Local home services marketplace (cleaners, handymen)</idea>
<prd_excerpt>
## Liquidity Strategy
- **Definition**: 90% of requests get confirmed booking within 4 hours
- **Launch**: Single city (Austin), 2 categories (cleaning, handyman)
- **Supply target**: 50 verified providers before demand marketing
- **Expansion trigger**: 85% fill rate sustained for 4 weeks

## Trust & Safety
| Level | Requirement | Unlocks |
|-------|-------------|---------|
| Basic | Phone + email verified | Can receive requests |
| Verified | ID + background check | "Verified" badge, featured listings |
| Pro | 10+ jobs, 4.8+ rating | Priority matching, lower commission |

## Disintermediation Defense
- Payment protection (guaranteed if provider no-shows)
- Review history (portable reputation)
- Scheduling/invoicing tools (convenience)
- Insurance coverage ($1M liability, included in fee)
</prd_excerpt>
</example_en>
`;
