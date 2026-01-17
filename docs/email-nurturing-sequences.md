# Email Nurturing Sequences

이메일 너처링 시퀀스 설계 문서입니다. 사용자 여정의 각 단계에서 전환율을 높이기 위한 자동화된 이메일 시퀀스를 정의합니다.

## Overview

### Goals
- Trial → Paid 전환율 증가
- 사용자 참여도 향상
- 이탈 방지 및 재활성화
- 업그레이드 유도

### Email Provider 권장
- **Resend** (개발자 친화적, API 기반)
- **Loops** (SaaS 특화, 행동 기반 트리거)
- **ConvertKit** (크리에이터 특화, 자동화 강력)

---

## Sequence 1: Welcome Series (가입 후)

**Trigger**: 회원가입 완료
**Goal**: 첫 PRD 생성 유도

### Email 1: Welcome (즉시)
**Subject**: 🎉 IdeaToPRD에 오신 것을 환영합니다!

```
안녕하세요, {{name}}님!

IdeaToPRD에 가입해 주셔서 감사합니다.

✨ 무료 크레딧 3개가 계정에 추가되었습니다.

지금 바로 첫 PRD를 생성해 보세요:
[PRD 생성하기] → /generate

---
🚀 빠른 시작 가이드:
1. 아이디어를 입력하세요
2. 템플릿을 선택하세요
3. 5분 안에 완성된 PRD를 받아보세요

궁금한 점이 있으시면 언제든 답장해 주세요!

- IdeaToPRD 팀
```

### Email 2: First PRD Reminder (24시간 후, PRD 미생성 시)
**Subject**: 첫 PRD를 아직 생성하지 않으셨네요 🤔

```
안녕하세요, {{name}}님!

아직 첫 PRD를 생성하지 않으셨네요.

💡 아이디어가 떠오르지 않으신다면, 이런 것들은 어떨까요?
- "AI 기반 일정 관리 앱"
- "팀 협업을 위한 Slack 대체 도구"
- "1인 창업자를 위한 회계 자동화 서비스"

무료 크레딧 3개로 위험 부담 없이 테스트해 보세요.

[지금 PRD 생성하기]
```

### Email 3: Use Case Inspiration (3일 후, PRD 미생성 시)
**Subject**: PM들이 IdeaToPRD를 이렇게 활용합니다

```
안녕하세요, {{name}}님!

500명 이상의 PM들이 IdeaToPRD로 PRD를 작성하고 있습니다.

📊 실제 사용 사례:
- 스타트업 PM: "2-3일 걸리던 PRD 작성을 30분으로 단축했습니다"
- 프리랜서: "클라이언트에게 빠르게 제안서를 보낼 수 있게 되었습니다"
- 사이드 프로젝트: "아이디어 검증에 드는 시간을 대폭 줄였습니다"

[무료로 시작하기]
```

---

## Sequence 2: First PRD Follow-up (첫 PRD 생성 후)

**Trigger**: 첫 PRD 생성 완료
**Goal**: 두 번째 PRD 생성 및 구독 전환 유도

### Email 1: Congratulations (즉시)
**Subject**: 🎊 첫 PRD 생성을 축하합니다!

```
안녕하세요, {{name}}님!

첫 번째 PRD "{{prd_title}}"를 성공적으로 생성하셨습니다!

📥 PRD 활용 팁:
1. Markdown으로 복사 → Notion, GitHub에 붙여넣기
2. PDF로 다운로드 → 클라이언트나 팀에 공유
3. 수정 기능 → 특정 섹션만 AI로 다시 생성

남은 크레딧: {{remaining_credits}}개

[대시보드에서 PRD 확인하기]
```

### Email 2: Second PRD Prompt (2일 후)
**Subject**: 다른 아이디어도 PRD로 만들어 보세요

```
안녕하세요, {{name}}님!

"{{prd_title}}" PRD가 잘 도움이 되셨나요?

💡 다른 아이디어도 있으시다면:
- Research 버전으로 시장 분석까지 포함된 PRD 생성
- Detailed 버전으로 더 상세한 기술 스펙 작성

[새 PRD 생성하기]

🎁 Tip: 구독하시면 크레딧당 최대 40% 저렴하게 사용할 수 있습니다.
```

---

## Sequence 3: Credit Depletion (크레딧 소진 임박)

**Trigger**: 크레딧 1개 이하 남음
**Goal**: 크레딧 구매 또는 구독 전환

### Email 1: Low Credit Warning (즉시)
**Subject**: ⚠️ 크레딧이 {{credits}}개 남았습니다

```
안녕하세요, {{name}}님!

현재 크레딧이 {{credits}}개 남았습니다.

💡 크레딧을 충전하는 2가지 방법:

1️⃣ 일회성 구매
- 필요할 때만 구매
- 크레딧당 $0.60~$1.00

2️⃣ 구독 (추천)
- 매월 자동 충전
- 크레딧당 $0.33~$0.50 (최대 40% 저렴)
- 연간 결제 시 추가 20% 할인

[구독 플랜 보기] | [일회성 구매]
```

### Email 2: Credit Empty (크레딧 0개가 된 후 1일)
**Subject**: 크레딧이 모두 소진되었습니다 😢

```
안녕하세요, {{name}}님!

크레딧이 모두 소진되어 새 PRD를 생성할 수 없습니다.

지금까지 생성하신 PRD {{prd_count}}개는 계속 확인하실 수 있습니다.

🎁 구독 특별 혜택:
- Pro 플랜: 월 60크레딧으로 충분한 PRD 생성
- 30일 환불 보장
- 언제든지 해지 가능

[Pro 플랜으로 시작하기]
```

---

## Sequence 4: Inactive User Re-engagement (비활성 사용자)

**Trigger**: 14일 이상 로그인 없음 (PRD 생성 이력 있음)
**Goal**: 재활성화 및 재방문 유도

### Email 1: We Miss You (14일 후)
**Subject**: {{name}}님, 요즘 어떻게 지내세요?

```
안녕하세요, {{name}}님!

IdeaToPRD에서 {{name}}님을 기다리고 있습니다.

📊 {{name}}님의 PRD:
- 생성한 PRD: {{prd_count}}개
- 마지막 방문: {{last_visit}}

새로운 아이디어가 생기셨다면, 언제든 돌아와 주세요.
크레딧 {{credits}}개가 기다리고 있습니다.

[대시보드 방문하기]
```

### Email 2: What's New (21일 후)
**Subject**: IdeaToPRD의 새로운 기능을 확인해 보세요

```
안녕하세요, {{name}}님!

최근 IdeaToPRD에 추가된 기능을 소개합니다:

✨ 새로운 기능:
- PRD 수정 기능: 특정 섹션만 AI로 다시 생성
- Research 버전: 시장 조사 기반 PRD 작성
- 버전 히스토리: 이전 버전 비교 및 복원

[새 기능 확인하기]
```

---

## Sequence 5: Subscription Upsell (일회성 구매 고객)

**Trigger**: 일회성 크레딧 2회 이상 구매
**Goal**: 구독 전환 유도

### Email 1: Subscription Value (두 번째 구매 후 3일)
**Subject**: 구독이 더 경제적일 수 있습니다 💰

```
안녕하세요, {{name}}님!

지금까지 일회성 크레딧을 {{purchase_count}}회 구매하셨네요.
총 {{total_spent}}를 사용하셨습니다.

💡 구독으로 전환하시면:
- 같은 크레딧을 최대 40% 저렴하게
- 매월 자동 충전으로 중단 없이 사용
- 사용하지 않은 크레딧은 다음 달로 이월

예상 절약액: 연간 약 ${{yearly_savings}}

[구독 플랜 비교하기]
```

---

## Sequence 6: Trial Ending (체험 기간 종료)

**Trigger**: 가입 후 7일 경과 (무료 크레딧 사용)
**Goal**: 구독 또는 구매 전환

### Email 1: Trial Recap (7일 후)
**Subject**: 지난 7일간 IdeaToPRD 사용 리포트 📊

```
안녕하세요, {{name}}님!

IdeaToPRD에 가입하신 지 7일이 되었습니다!

📊 {{name}}님의 활동:
- 생성한 PRD: {{prd_count}}개
- 사용한 크레딧: {{used_credits}}개
- 남은 크레딧: {{remaining_credits}}개

{{#if has_prds}}
PRD 작성에 IdeaToPRD가 도움이 되셨나요?
계속 사용하시려면 크레딧을 충전해 주세요.
{{else}}
아직 PRD를 생성하지 않으셨네요.
남은 무료 크레딧 {{remaining_credits}}개로 테스트해 보세요!
{{/if}}

[크레딧 충전하기] | [구독 시작하기]
```

---

## Implementation Notes

### 기술 구현 방안

1. **이메일 발송 서비스**
   - Resend API 연동
   - React Email로 템플릿 작성

2. **트리거 구현**
   - Supabase Edge Functions 또는 Vercel Cron
   - 사용자 이벤트 기반 트리거

3. **추적 지표**
   - 오픈율 (Open Rate)
   - 클릭률 (CTR)
   - 전환율 (Conversion Rate)
   - 구독 전환율

### 데이터베이스 스키마 추가 필요

```sql
-- 이메일 발송 기록
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

-- 이메일 구독 설정
ALTER TABLE profiles ADD COLUMN email_preferences JSONB DEFAULT '{
  "marketing": true,
  "product_updates": true,
  "usage_reports": true
}';
```

### A/B 테스트 우선순위

1. **Subject Line 테스트** - 이모지 유무, 개인화 유무
2. **CTA 버튼 텍스트** - "시작하기" vs "무료로 시작하기"
3. **발송 시간** - 오전 9시 vs 오후 2시

---

## Metrics & KPIs

| Sequence | Target Open Rate | Target CTR | Target Conversion |
|----------|-----------------|------------|-------------------|
| Welcome | 60%+ | 20%+ | 30% (첫 PRD 생성) |
| First PRD | 50%+ | 15%+ | 20% (두 번째 PRD) |
| Credit Depletion | 70%+ | 25%+ | 15% (구매/구독) |
| Re-engagement | 30%+ | 10%+ | 5% (재방문) |
| Upsell | 40%+ | 15%+ | 10% (구독 전환) |

---

## 다음 단계

1. [ ] Resend 계정 설정 및 도메인 인증
2. [ ] React Email 템플릿 개발
3. [ ] Supabase Edge Function으로 트리거 구현
4. [ ] A/B 테스트 프레임워크 설정
5. [ ] 이메일 발송 대시보드 구축
