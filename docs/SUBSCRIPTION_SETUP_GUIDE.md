# 구독 시스템 설정 가이드

이 문서는 IdeaToPRD 구독 시스템을 활성화하기 위해 필요한 모든 설정 단계를 안내합니다.

---

## 목차

1. [사전 요구사항](#1-사전-요구사항)
2. [Lemon Squeezy 구독 상품 생성](#2-lemon-squeezy-구독-상품-생성)
3. [Webhook 이벤트 설정](#3-webhook-이벤트-설정)
4. [환경변수 설정](#4-환경변수-설정)
5. [테스트 플로우 검증](#5-테스트-플로우-검증)
6. [프로덕션 체크리스트](#6-프로덕션-체크리스트)

---

## 1. 사전 요구사항

### 1.1 DB 마이그레이션 확인

구독 시스템 마이그레이션이 적용되었는지 확인합니다.

```bash
# Supabase 대시보드 또는 SQL Editor에서 확인
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'subscriptions'
);
```

결과가 `true`면 마이그레이션 완료 상태입니다.

### 1.2 기존 Lemon Squeezy 연동 확인

- [ ] Lemon Squeezy 계정 활성화
- [ ] Store 생성 완료
- [ ] 기존 일회성 크레딧 패키지 작동 확인
- [ ] Webhook 기본 설정 완료

---

## 2. Lemon Squeezy 구독 상품 생성

### 2.1 접속 경로

```
Lemon Squeezy Dashboard > Products > + New Product
```

### 2.2 생성할 상품 목록 (총 6개)

#### Basic 플랜

| 항목 | Monthly | Yearly |
|------|---------|--------|
| **상품명** | Basic Monthly | Basic Yearly |
| **가격** | $15/month | $144/year (월 $12) |
| **결제 유형** | Subscription | Subscription |
| **결제 주기** | Monthly | Yearly |
| **설명** | 월 25 크레딧, 최대 50 크레딧 누적 | 월 25 크레딧, 최대 50 크레딧 누적, 연 20% 할인 |

#### Pro 플랜 (Most Popular)

| 항목 | Monthly | Yearly |
|------|---------|--------|
| **상품명** | Pro Monthly | Pro Yearly |
| **가격** | $35/month | $336/year (월 $28) |
| **결제 유형** | Subscription | Subscription |
| **결제 주기** | Monthly | Yearly |
| **설명** | 월 80 크레딧, 최대 160 크레딧 누적 | 월 80 크레딧, 최대 160 크레딧 누적, 연 20% 할인 |

#### Business 플랜

| 항목 | Monthly | Yearly |
|------|---------|--------|
| **상품명** | Business Monthly | Business Yearly |
| **가격** | $69/month | $662/year (월 $55) |
| **결제 유형** | Subscription | Subscription |
| **결제 주기** | Monthly | Yearly |
| **설명** | 월 200 크레딧, 최대 400 크레딧 누적 | 월 200 크레딧, 최대 400 크레딧 누적, 연 20% 할인 |

### 2.3 상품 생성 단계별 가이드

1. **+ New Product** 클릭
2. **Product type**: `Subscription` 선택
3. **Name**: 상품명 입력 (예: "Pro Monthly")
4. **Price**: 가격 입력
5. **Billing interval**: `Monthly` 또는 `Yearly` 선택
6. **Description**: 설명 입력
7. **Save** 클릭

### 2.4 Variant ID 수집

각 상품 생성 후 **Variant ID**를 기록합니다.

```
Products > [상품 선택] > Variants 탭 > Default variant의 ID 복사
```

**기록 양식:**

| 플랜 | 주기 | Variant ID |
|------|------|------------|
| Basic | Monthly | `_____________` |
| Basic | Yearly | `_____________` |
| Pro | Monthly | `_____________` |
| Pro | Yearly | `_____________` |
| Business | Monthly | `_____________` |
| Business | Yearly | `_____________` |

---

## 3. Webhook 이벤트 설정

### 3.1 접속 경로

```
Lemon Squeezy Dashboard > Settings > Webhooks
```

### 3.2 Webhook 설정

**기존 webhook을 수정하거나 새로 생성합니다.**

| 항목 | 값 |
|------|-----|
| **Callback URL** | `https://your-domain.com/api/webhook/lemon-squeezy` |
| **Signing Secret** | 기존 secret 유지 또는 새로 생성 |

### 3.3 구독할 이벤트 (필수)

다음 이벤트들을 **모두 체크**합니다:

#### 기존 (일회성 구매)
- [x] `order_created`

#### 신규 (구독)
- [x] `subscription_created`
- [x] `subscription_updated`
- [x] `subscription_payment_success`
- [x] `subscription_payment_failed`
- [x] `subscription_cancelled`
- [x] `subscription_expired`
- [x] `subscription_resumed`
- [x] `subscription_paused`
- [x] `subscription_unpaused`

### 3.4 Webhook Secret 업데이트 (신규 생성 시)

새 webhook을 생성했다면 Signing Secret을 환경변수에 업데이트합니다.

```env
LEMONSQUEEZY_WEBHOOK_SECRET=your_new_webhook_secret
```

---

## 4. 환경변수 설정

### 4.1 로컬 개발 환경

`.env.local` 파일에 다음 변수들을 추가합니다:

```env
# =============================================================================
# 구독 플랜 Variant IDs (Step 2에서 수집한 ID 입력)
# =============================================================================

# Basic 플랜
NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_MONTHLY=여기에_variant_id_입력
NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_YEARLY=여기에_variant_id_입력

# Pro 플랜
NEXT_PUBLIC_LS_VARIANT_SUB_PRO_MONTHLY=여기에_variant_id_입력
NEXT_PUBLIC_LS_VARIANT_SUB_PRO_YEARLY=여기에_variant_id_입력

# Business 플랜
NEXT_PUBLIC_LS_VARIANT_SUB_BUSINESS_MONTHLY=여기에_variant_id_입력
NEXT_PUBLIC_LS_VARIANT_SUB_BUSINESS_YEARLY=여기에_variant_id_입력
```

### 4.2 프로덕션 환경 (Vercel)

Vercel 대시보드에서 동일한 환경변수를 설정합니다:

```
Project Settings > Environment Variables
```

각 변수를 `Production`, `Preview`, `Development` 환경에 추가합니다.

### 4.3 환경변수 검증

개발 서버 실행 후 브라우저 콘솔에서 확인:

```javascript
// 브라우저 개발자 도구 콘솔
console.log(process.env.NEXT_PUBLIC_LS_VARIANT_SUB_PRO_MONTHLY);
```

`undefined`가 아닌 실제 값이 출력되면 정상입니다.

---

## 5. 테스트 플로우 검증

### 5.1 테스트 모드 활성화

```
Lemon Squeezy Dashboard > 우측 상단 > Test Mode 토글 ON
```

### 5.2 테스트 결제 정보

| 항목 | 값 |
|------|-----|
| 카드 번호 | `4242 4242 4242 4242` |
| 만료일 | 미래 날짜 아무거나 (예: 12/30) |
| CVC | 아무 숫자 3자리 (예: 123) |
| 이름 | 아무 이름 |
| 우편번호 | 아무 숫자 5자리 |

### 5.3 테스트 시나리오

#### 시나리오 1: 신규 구독 생성

1. 로그인 상태에서 `/subscribe` 페이지 접속
2. Pro Monthly 플랜 선택
3. 테스트 카드로 결제 완료
4. **검증 포인트:**
   - [ ] `subscriptions` 테이블에 레코드 생성 확인
   - [ ] `profiles.subscription_plan` = `pro` 확인
   - [ ] `profiles.subscription_status` = `active` 확인
   - [ ] `profiles.credits` 80 증가 확인
   - [ ] `usage_logs`에 `subscription_credit` 타입 로그 생성 확인
   - [ ] 사이드바에 구독 배지 표시 확인

#### 시나리오 2: 크레딧 캡 테스트

1. 수동으로 크레딧을 160 이상으로 설정 (Supabase SQL Editor)
   ```sql
   UPDATE profiles SET credits = 200 WHERE id = 'your-user-id';
   ```
2. Lemon Squeezy에서 `subscription_payment_success` 이벤트 재전송
3. **검증 포인트:**
   - [ ] 크레딧이 증가하지 않음 (이미 캡 초과)
   - [ ] `usage_logs`에 `credits_delta = 0` 로그 기록

#### 시나리오 3: 구독 취소

1. Lemon Squeezy 테스트 대시보드에서 구독 취소
2. **검증 포인트:**
   - [ ] `subscriptions.cancelled_at` 기록됨
   - [ ] `subscriptions.ends_at` = 현재 기간 종료일
   - [ ] `profiles.subscription_status` = `cancelled`
   - [ ] 설정 페이지에서 "취소됨 (기간 만료 시 종료)" 표시
   - [ ] PRD 생성 기능은 `ends_at`까지 계속 사용 가능

#### 시나리오 4: 구독 만료

1. 취소된 구독의 `ends_at` 도달 시 (또는 수동 이벤트 트리거)
2. **검증 포인트:**
   - [ ] `subscriptions.status` = `expired`
   - [ ] `profiles.subscription_plan` = `NULL`
   - [ ] `profiles.subscription_status` = `NULL`
   - [ ] 사이드바에서 구독 배지 사라짐

#### 시나리오 5: 구독 재개

1. 취소된 구독을 다시 활성화 (Lemon Squeezy 대시보드)
2. **검증 포인트:**
   - [ ] `subscriptions.status` = `active`
   - [ ] `subscriptions.cancelled_at` = `NULL`
   - [ ] `profiles.subscription_status` = `active`

### 5.4 Webhook 로그 확인

```
Lemon Squeezy Dashboard > Settings > Webhooks > [Webhook 선택] > Logs
```

각 이벤트에 대해:
- [ ] HTTP 상태 코드 `200` 확인
- [ ] 응답 시간 확인 (5초 이내)
- [ ] 실패 시 에러 메시지 확인

### 5.5 DB 확인 쿼리

Supabase SQL Editor에서 실행:

```sql
-- 1. 내 구독 정보 확인
SELECT
  s.id,
  s.plan,
  s.status,
  s.billing_interval,
  s.monthly_credits,
  s.credit_cap,
  s.current_period_start,
  s.current_period_end,
  s.cancelled_at,
  s.ends_at
FROM subscriptions s
WHERE s.user_id = 'your-user-id'
ORDER BY s.created_at DESC
LIMIT 1;

-- 2. 프로필 구독 상태 확인
SELECT
  id,
  email,
  credits,
  subscription_plan,
  subscription_status,
  subscription_renews_at
FROM profiles
WHERE id = 'your-user-id';

-- 3. 구독 크레딧 지급 로그 확인
SELECT
  id,
  usage_type,
  credits_delta,
  credits_before,
  credits_after,
  description,
  metadata,
  created_at
FROM usage_logs
WHERE user_id = 'your-user-id'
  AND usage_type = 'subscription_credit'
ORDER BY created_at DESC
LIMIT 10;

-- 4. 모든 구독 현황 (관리자용)
SELECT
  p.email,
  s.plan,
  s.status,
  s.billing_interval,
  s.current_period_end,
  p.credits
FROM subscriptions s
JOIN profiles p ON s.user_id = p.id
WHERE s.status IN ('active', 'cancelled')
ORDER BY s.created_at DESC;
```

---

## 6. 프로덕션 체크리스트

### 6.1 배포 전 확인

- [ ] 모든 테스트 시나리오 통과
- [ ] Vercel 환경변수 설정 완료
- [ ] Webhook URL이 프로덕션 도메인으로 설정됨
- [ ] Lemon Squeezy Test Mode OFF (라이브 모드)

### 6.2 모니터링 설정

- [ ] Webhook 실패 알림 설정 (Lemon Squeezy > Webhooks > Notifications)
- [ ] Supabase 에러 로그 모니터링
- [ ] Vercel 함수 로그 모니터링

### 6.3 롤백 계획

문제 발생 시:
1. Lemon Squeezy에서 구독 상품 비활성화
2. `/subscribe` 페이지 접근 제한 (환경변수로 feature flag)
3. 영향받은 사용자 크레딧 수동 보정

---

## 부록: 트러블슈팅

### A. Webhook이 수신되지 않음

1. Webhook URL이 HTTPS인지 확인
2. 방화벽/CDN에서 Lemon Squeezy IP 허용 확인
3. Vercel 함수 로그에서 에러 확인

### B. 크레딧이 지급되지 않음

1. `usage_logs` 테이블에서 해당 시간대 로그 확인
2. `grant_subscription_credits` RPC 함수 직접 테스트:
   ```sql
   SELECT grant_subscription_credits(
     'user-id'::uuid,
     80,  -- amount
     160, -- cap
     NULL,
     'Test credit grant'
   );
   ```

### C. 프로필 구독 상태가 업데이트되지 않음

1. Webhook 핸들러에서 `profiles` 업데이트 쿼리 확인
2. RLS 정책이 service_role 접근을 허용하는지 확인

### D. Variant ID 매핑 오류

1. `src/features/subscription/model/variant-mapping.ts` 확인
2. 환경변수 값과 Lemon Squeezy 대시보드 값 일치 여부 확인

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| `supabase/migrations/20260117000000_add_subscription_system.sql` | DB 마이그레이션 |
| `app/api/webhook/lemon-squeezy/route.ts` | Webhook 핸들러 |
| `src/features/subscription/model/subscription-plans.ts` | 플랜 설정 |
| `src/features/subscription/model/variant-mapping.ts` | Variant ID 매핑 |
| `app/(protected)/subscribe/page.tsx` | 구독 페이지 |
| `.env.example` | 환경변수 템플릿 |

---

*마지막 업데이트: 2026-01-17*
