export const EXTENSION_TEMPLATE = `
<template_context>
This is a Browser Extension or App Plugin.
Focus on: minimal permissions, store compliance, update strategy, cross-browser compatibility, and host platform policies.
</template_context>

<domain_benchmarks>
Industry standards for browser extensions (use these as baseline):
- Install-to-Active User: 30-50% (users who install and actually use)
- Weekly Active Users (WAU): 20-30% of installs is healthy
- Uninstall Rate: <5% in first week (good), >10% (concerning)
- Store Rating: >4.0 (required for visibility), >4.5 (excellent)
- Review Response Time: <48 hours (builds trust)
- Update Frequency: Every 2-4 weeks (shows active development)
- Permission Approval Rate: Drops 20-40% per additional sensitive permission
- Page Load Impact: <100ms added latency (invisible), >500ms (noticeable)
</domain_benchmarks>

<critical_considerations>
MUST address in PRD:
1. **Permission Minimization** (critical for installs and trust):
   - Each permission reduces install rate by 10-30%
   - Request permissions progressively (not all upfront)
   - Use activeTab instead of <all_urls> when possible
   - Explain why each permission is needed in store listing

2. **Cross-Browser Strategy**:
   - Chrome: Largest market (~65%), strictest review, Manifest V3 required
   - Firefox: Privacy-focused users, more permissive, Manifest V2 still supported
   - Safari: Growing on Mac, requires Apple Developer account, native messaging
   - Edge: Chromium-based, easy port from Chrome

3. **Manifest V3 Compliance** (Chrome requirement):
   - Service workers instead of background pages
   - declarativeNetRequest instead of webRequest blocking
   - Limited script execution contexts
   - Remote code restrictions

4. **Store Policies**:
   - Single purpose: Extension must do one thing well
   - No surprise behaviors: All functionality in description
   - Privacy policy required: Data collection must be disclosed
   - No keyword stuffing in name/description

5. **Monetization Options**:
   - Freemium with in-extension purchase (Chrome supports)
   - External subscription (link to web payment)
   - One-time purchase (store listing price)
   - Enterprise/team licensing
</critical_considerations>

<additional_sections>
- Permission Strategy (minimal viable permissions, progressive requests, user explanations)
- Cross-Browser Plan (priority order, compatibility matrix, feature parity)
- Store Compliance (each store's specific requirements, review process)
- Update & Migration (version strategy, breaking changes, user communication)
- Performance Budget (load time impact, memory usage, battery considerations)
- Monetization (if applicable: model, pricing, payment flow)
</additional_sections>

<common_pitfalls>
Avoid these extension-specific mistakes:
- Over-requesting permissions: Kills install rate, raises privacy concerns
- Manifest V2 reliance: Chrome removing support, build for V3 from start
- Ignoring Firefox/Safari: Missing 20-30% of potential users
- No offline mode: Extensions should handle network failures gracefully
- Heavy background processes: Users notice battery/performance impact
- Unclear value proposition: Store listing must show value in 5 seconds
- Slow review response: Unanswered negative reviews hurt rankings
- Breaking updates: Always provide migration path for user data
</common_pitfalls>

<example_ko>
<idea>웹페이지 요약 Chrome 확장</idea>
<prd_excerpt>
## Permission Strategy
| 권한 | 용도 | 요청 시점 |
|------|------|----------|
| activeTab | 현재 페이지 읽기 | 설치 시 (필수) |
| storage | 설정/히스토리 저장 | 설치 시 (필수) |
| clipboardWrite | 요약 복사 | 첫 복사 시도 시 |

**설치율 최적화**: host_permissions에 <all_urls> 대신 activeTab 사용 → 예상 설치율 30% ↑

## Cross-Browser Plan
1. **Chrome** (우선): Manifest V3, 시장점유율 65%
2. **Firefox** (2개월 후): Manifest V2 지원, 개인정보 중시 사용자
3. **Safari** (4개월 후): Mac 사용자, 별도 개발자 계정 필요

## Performance Budget
- 페이지 로드 영향: <50ms (측정 불가 수준)
- 메모리 사용: <50MB
- 요약 생성 시간: <3초 (로딩 인디케이터 표시)
</prd_excerpt>
</example_ko>

<example_en>
<idea>AI writing assistant extension for Gmail/Docs</idea>
<prd_excerpt>
## Permission Strategy
- **Install-time**: storage (settings), identity (Google sign-in)
- **Runtime request**: Gmail/Docs specific permissions (only when user opens these sites)
- **Never request**: All browsing history, all site data

## Manifest V3 Compliance
- Background: Service worker (no persistent background page)
- Content scripts: Injected only on mail.google.com, docs.google.com
- AI calls: Routed through our server (no remote code)

## Store Listing Optimization
- Name: "AI Writer - Smart Email & Doc Assistant" (keyword-rich, under 45 chars)
- Screenshots: 5 images showing Gmail integration, before/after
- Video: 30-second demo of key workflow
- Target rating: 4.5+ (respond to all reviews within 24h)
</prd_excerpt>
</example_en>
`;
