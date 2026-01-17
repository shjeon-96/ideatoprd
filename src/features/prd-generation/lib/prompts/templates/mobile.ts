export const MOBILE_TEMPLATE = `
<template_context>
This is a Mobile Application (iOS/Android).
Focus on: platform-specific UX, offline capability, performance, push engagement, and app store optimization.
</template_context>

<domain_benchmarks>
Industry standards for mobile apps (use these as baseline):
- Day 1 Retention: >25% (good), >40% (excellent), <20% (poor)
- Day 7 Retention: >15% (good), >25% (excellent)
- Day 30 Retention: >8% (good), >15% (excellent)
- DAU/MAU Ratio: >20% (engaged), >50% (highly sticky)
- Session Length: >3 min (typical), >5 min (engaged)
- Sessions per Day: >2 (engaged user)
- App Store Rating: >4.5 (required for featuring), <4.0 (concerning)
- Crash-free Rate: >99.5% (minimum), >99.9% (excellent)
- Cold Start Time: <2s (good), <1s (excellent)
- Install-to-Registration: 50-70% (typical)
</domain_benchmarks>

<critical_considerations>
MUST address in PRD:
1. **Platform Strategy Decision**:
   - iOS First: Premium users, higher ARPU, stricter quality bar, faster review
   - Android First: Larger market, more device fragmentation, flexible distribution
   - Cross-platform (Flutter/React Native): Faster dev, 70-90% code share, some native compromises

2. **Offline-First Design**:
   - What core features work without internet?
   - Sync strategy: last-write-wins, conflict resolution, queue management
   - Storage: local DB (SQLite/Realm), secure storage for credentials

3. **Performance Budgets**:
   - App size: <50MB ideal (impacts install rate), <100MB acceptable
   - Memory usage: <200MB for typical usage
   - Battery: Background tasks must be optimized, avoid constant GPS/network

4. **Push Notification Strategy**:
   - Timing: User timezone aware, not during sleep hours
   - Frequency: <1/day for non-essential, can backfire if overused
   - Permission ask: Delay until user sees value (not on first launch)
   - Categories: Transactional (always ok) vs Marketing (careful)

5. **App Store Considerations**:
   - iOS: 1-3 day review, strict IAP rules (30% cut), guidelines compliance
   - Android: Hours to review, more flexibility, but fragmentation testing needed
</critical_considerations>

<additional_sections>
- Platform Strategy (decision rationale, native vs cross-platform trade-offs)
- Offline Functionality (which features, sync strategy, conflict resolution)
- Push Notification Strategy (permission timing, frequency caps, personalization)
- App Store Optimization (keywords, screenshots, A/B testing, review strategy)
- Device Permissions (minimization strategy, progressive asking, fallback UX)
- Performance Requirements (size, speed, battery impact budgets)
</additional_sections>

<common_pitfalls>
Avoid these mobile-specific mistakes:
- Asking all permissions upfront: Request only when needed, explain why
- Ignoring offline: Users expect apps to work in elevators, subways, planes
- Web mindset: Mobile users expect native gestures, animations, haptics
- Notification spam: #1 reason for uninstalls after first week
- Ignoring app size: Every 6MB over 100MB reduces installs by 1%
- No deep linking: Critical for marketing attribution and user experience
- Testing on WiFi only: Real users have 3G/LTE with variable latency
</common_pitfalls>

<example_ko>
<idea>습관 추적 앱</idea>
<prd_excerpt>
## Platform Strategy
- **Phase 1**: iOS (SwiftUI) - 타겟 유저가 프리미엄, 건강에 관심 많음
- **Phase 2**: Flutter로 Android 확장 (6개월 후)
- 선택 근거: 습관 앱은 위젯/워치 연동이 중요 → 네이티브 우선

## Performance Budgets
- 앱 크기: <30MB (빠른 설치 유도)
- 콜드 스타트: <1.5s
- 오프라인: 모든 기록/조회 가능, 온라인 시 동기화

## Push Strategy
- 권한 요청: 첫 습관 완료 후 (가치 인식 후)
- 알림 유형: 리마인더(사용자 설정), 격려(주 2회 이하)
- D7 권한 허용 목표: 60%
</prd_excerpt>
</example_ko>

<example_en>
<idea>Meditation and mindfulness app</idea>
<prd_excerpt>
## Platform Strategy
- **Native iOS (Swift)**: Watch integration critical for meditation tracking
- **Android (Kotlin)**: 3 months post-iOS launch
- Rationale: Meditation users skew iOS, Watch for heart rate during sessions

## Retention Targets
- D1: 35% (complete first meditation)
- D7: 20% (establish habit)
- D30: 12% (converted to routine)
- Activation event: Complete 3-minute session

## Offline Requirements
- All meditation audio cached (user-selected favorites)
- Session tracking works offline, syncs on reconnect
- Max cache size: 500MB (configurable)
</prd_excerpt>
</example_en>
`;
