# Phase 6: Credit System - Research

**Researched:** 2026-01-16
**Domain:** Lemon Squeezy payment integration for SaaS credit system
**Confidence:** HIGH

<research_summary>
## Summary

Lemon Squeezy를 사용한 크레딧 패키지 일회성 구매 시스템 연구. Lemon Squeezy는 Merchant of Record(MoR)로서 세금, 환불, 사기 방지를 모두 처리해주므로 개발자는 결제 로직에만 집중하면 됩니다.

**핵심 발견:**
- 공식 `@lemonsqueezy/lemonsqueezy.js` SDK로 Checkout URL 생성
- Webhook 서명 검증에 `crypto.timingSafeEqual` 필수 (타이밍 공격 방지)
- `checkout_data.custom`으로 user_id 전달 → webhook에서 사용자 식별
- Phase 4에서 이미 `purchases` 테이블과 `add_credit` 함수가 구현됨

**Primary recommendation:** SDK로 Checkout URL 생성 → Overlay로 결제 → Webhook으로 크레딧 충전. 기존 DB 함수 활용.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @lemonsqueezy/lemonsqueezy.js | ^3.0.0 | Lemon Squeezy API SDK | 공식 SDK, 타입 안전, tree-shakeable |
| crypto (Node.js built-in) | - | Webhook 서명 검증 | Node.js 내장, 보안 검증된 HMAC |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/script | (Next.js) | Lemon.js 로딩 | Checkout Overlay 사용 시 |
| zod | ^3.22.0 | Webhook 페이로드 검증 | 이미 프로젝트에 포함됨 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SDK | 직접 fetch | SDK가 타입 안전하고 유지보수 용이 |
| Overlay Checkout | Hosted Checkout | Overlay가 UX 더 좋음 (페이지 이탈 없음) |
| Lemon Squeezy | Stripe | Stripe는 MoR 아님, 세금/환불 직접 처리 필요 |

**Installation:**
```bash
npm install @lemonsqueezy/lemonsqueezy.js
```

**Environment Variables:**
```env
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── api/
│       └── webhook/
│           └── lemon-squeezy/
│               └── route.ts     # Webhook 엔드포인트
├── features/
│   └── purchase/
│       ├── api/
│       │   └── create-checkout.ts  # Server Action
│       ├── ui/
│       │   ├── CreditPackages.tsx  # 패키지 선택 UI
│       │   ├── PurchaseButton.tsx  # 결제 버튼
│       │   └── CreditBalance.tsx   # 잔액 표시
│       └── model/
│           └── credit-packages.ts  # 패키지 정의
└── shared/
    └── lib/
        └── lemon-squeezy/
            ├── client.ts           # SDK 초기화
            └── verify-signature.ts # 서명 검증 유틸
```

### Pattern 1: Checkout Flow (Server Action)
**What:** 서버에서 Checkout URL 생성 후 클라이언트에서 Overlay 표시
**When to use:** 모든 결제 시작 시
**Example:**
```typescript
// src/features/purchase/api/create-checkout.ts
'use server'

import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'
import { createClient } from '@/shared/lib/supabase/server'

export async function createCreditCheckout(variantId: string) {
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutOptions: {
        embed: true, // Overlay 모드
      },
      checkoutData: {
        email: user.email,
        custom: {
          user_id: user.id, // 웹훅에서 사용자 식별용
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchase=success`,
      },
    }
  )

  if (error) throw error
  return data.data.attributes.url
}
```

### Pattern 2: Webhook Handler with Idempotency
**What:** 서명 검증 → 중복 체크 → 크레딧 충전
**When to use:** Lemon Squeezy에서 order_created 이벤트 수신 시
**Example:**
```typescript
// src/app/api/webhook/lemon-squeezy/route.ts
import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  const rawBody = await request.text()

  // 1. 서명 검증
  const signature = request.headers.get('X-Signature') ?? ''
  const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature, 'hex'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const eventName = event.meta.event_name

  if (eventName !== 'order_created') {
    return NextResponse.json({ message: 'Ignored event' }, { status: 200 })
  }

  const orderId = event.data.id
  const userId = event.meta.custom_data?.user_id
  const status = event.data.attributes.status

  if (status !== 'paid' || !userId) {
    return NextResponse.json({ message: 'Skipped' }, { status: 200 })
  }

  // 2. Service Role로 DB 접근 (RLS 우회)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 3. 중복 체크 (lemon_squeezy_order_id UNIQUE 제약)
  const { error: insertError } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      package: 'pro', // variant_id로 패키지 매핑
      credits_amount: 100,
      amount_cents: event.data.attributes.total,
      currency: event.data.attributes.currency,
      lemon_squeezy_order_id: orderId,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })

  if (insertError?.code === '23505') {
    // 이미 처리된 주문 (중복)
    return NextResponse.json({ message: 'Already processed' }, { status: 200 })
  }

  // 4. 크레딧 충전 (기존 함수 사용)
  await supabase.rpc('add_credit', {
    p_user_id: userId,
    p_amount: 100,
    p_usage_type: 'credit_purchase',
    p_description: `Credit purchase: order ${orderId}`,
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
```

### Pattern 3: Lemon.js Overlay Integration
**What:** Next.js에서 Lemon.js 스크립트 로드 및 Overlay 오픈
**When to use:** 결제 버튼 클릭 시
**Example:**
```typescript
// src/features/purchase/ui/PurchaseButton.tsx
'use client'

import Script from 'next/script'
import { createCreditCheckout } from '../api/create-checkout'

declare global {
  interface Window {
    LemonSqueezy: {
      Url: {
        Open: (url: string) => void
      }
    }
  }
}

export function PurchaseButton({ variantId }: { variantId: string }) {
  async function handlePurchase() {
    const checkoutUrl = await createCreditCheckout(variantId)
    window.LemonSqueezy.Url.Open(checkoutUrl)
  }

  return (
    <>
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        strategy="lazyOnload"
      />
      <button onClick={handlePurchase}>
        Purchase Credits
      </button>
    </>
  )
}
```

### Anti-Patterns to Avoid
- **API 키 클라이언트 노출:** SDK는 반드시 서버에서만 사용
- **raw body 재파싱:** 서명 검증 전에 JSON.parse 하면 안 됨 (request.text() 먼저)
- **동기 처리:** 웹훅은 빠르게 200 반환 후 비동기 처리 권장
- **UNIQUE 제약 없이 처리:** 중복 웹훅으로 인한 이중 충전 위험
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Checkout UI | 커스텀 결제 폼 | Lemon Squeezy Overlay | PCI 규정, 보안, 다양한 결제 수단 지원 |
| 서명 검증 | 단순 문자열 비교 | crypto.timingSafeEqual | 타이밍 공격 방지 필수 |
| 세금 계산 | 직접 세금 로직 | Lemon Squeezy MoR | 국가별 세금 규정 복잡, 자동 처리됨 |
| 환불 처리 | 직접 환불 로직 | Lemon Squeezy Dashboard | MoR가 환불도 처리 |
| 결제 재시도 | 커스텀 재시도 로직 | Lemon Squeezy 자동 재시도 | 지수 백오프 자동 적용 |

**Key insight:** Lemon Squeezy는 Merchant of Record로서 세금, 환불, 사기 방지, 결제 수단 관리를 모두 처리합니다. 개발자는 Checkout URL 생성과 Webhook 처리만 구현하면 됩니다.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Webhook 중복 처리
**What goes wrong:** 동일 주문에 대해 크레딧이 여러 번 충전됨
**Why it happens:** Lemon Squeezy가 응답 실패 시 최대 3회 재시도
**How to avoid:**
- `lemon_squeezy_order_id`를 UNIQUE 제약으로 설정 (이미 Phase 4에서 완료)
- INSERT 실패 시(23505 에러) 이미 처리된 것으로 간주
**Warning signs:** 같은 order_id로 usage_logs에 여러 항목 생성

### Pitfall 2: 서명 검증 타이밍 공격
**What goes wrong:** 공격자가 유효한 서명을 추론할 수 있음
**Why it happens:** 일반 문자열 비교(`===`)는 첫 불일치에서 즉시 반환
**How to avoid:** `crypto.timingSafeEqual()` 사용 (일정 시간 비교)
**Warning signs:** 서명 검증 로직에 `===` 사용

### Pitfall 3: Request Body 재사용 불가
**What goes wrong:** 서명 검증 후 body 파싱 시 빈 스트림
**Why it happens:** Request body는 한 번만 읽을 수 있음
**How to avoid:** `request.text()`로 먼저 읽고, 검증 후 `JSON.parse(rawBody)` 사용
**Warning signs:** `request.json()` 사용 후 서명 검증 시도

### Pitfall 4: Test Mode 웹훅과 Live Mode 혼용
**What goes wrong:** 테스트 주문이 프로덕션 DB에 기록됨
**Why it happens:** 환경별 웹훅 엔드포인트 분리 안 함
**How to avoid:**
- `event.data.attributes.test_mode` 체크
- 개발/프로덕션 환경별 별도 웹훅 설정
**Warning signs:** 테스트 주문 ID가 프로덕션 purchases 테이블에 존재

### Pitfall 5: Custom Data 누락
**What goes wrong:** 웹훅에서 사용자를 식별할 수 없음
**Why it happens:** Checkout 생성 시 `checkout_data.custom.user_id` 누락
**How to avoid:** 항상 user_id를 custom data에 포함
**Warning signs:** `event.meta.custom_data`가 undefined
</common_pitfalls>

<code_examples>
## Code Examples

### 서명 검증 유틸리티
```typescript
// src/shared/lib/lemon-squeezy/verify-signature.ts
import crypto from 'node:crypto'

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !rawBody || !secret) return false

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmac, 'utf8'),
      Buffer.from(signature, 'utf8')
    )
  } catch {
    return false
  }
}
```

### 크레딧 패키지 정의
```typescript
// src/features/purchase/model/credit-packages.ts
export const CREDIT_PACKAGES = {
  starter: {
    name: 'Starter',
    credits: 10,
    priceUsd: 9,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_STARTER!,
  },
  basic: {
    name: 'Basic',
    credits: 30,
    priceUsd: 19,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_BASIC!,
    popular: true,
  },
  pro: {
    name: 'Pro',
    credits: 100,
    priceUsd: 49,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PRO!,
  },
  business: {
    name: 'Business',
    credits: 300,
    priceUsd: 99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_BUSINESS!,
  },
} as const

export type CreditPackageKey = keyof typeof CREDIT_PACKAGES
```

### Variant ID로 패키지 매핑
```typescript
// src/features/purchase/model/variant-mapping.ts
import { CREDIT_PACKAGES, type CreditPackageKey } from './credit-packages'

export function getPackageByVariantId(variantId: string): {
  key: CreditPackageKey
  credits: number
} | null {
  for (const [key, pkg] of Object.entries(CREDIT_PACKAGES)) {
    if (pkg.variantId === variantId) {
      return { key: key as CreditPackageKey, credits: pkg.credits }
    }
  }
  return null
}
```

### Webhook 타입 정의
```typescript
// src/features/purchase/model/webhook-types.ts
export interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: 'order_created' | 'order_refunded' | 'subscription_created'
    custom_data?: {
      user_id?: string
    }
  }
  data: {
    type: 'orders'
    id: string
    attributes: {
      store_id: number
      status: 'pending' | 'paid' | 'refunded'
      total: number
      currency: string
      first_order_item: {
        variant_id: number
        product_name: string
      }
      test_mode: boolean
      created_at: string
    }
  }
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Stripe 직접 통합 | Lemon Squeezy MoR | 2023+ | 세금/환불 처리 불필요, 글로벌 판매 용이 |
| Pages Router API Routes | App Router Route Handlers | 2024+ | async/await 네이티브 지원 |
| lemonsqueezy-webhooks 패키지 | 공식 SDK + 직접 검증 | 2024+ | 공식 SDK가 더 완전함 |

**New tools/patterns to consider:**
- **Lemon Squeezy Customer Portal:** 사용자가 직접 구매 내역 조회, 환불 요청 가능
- **Checkout Overlay:** 페이지 이탈 없이 결제 완료 (UX 향상)

**Deprecated/outdated:**
- **dark 테마 옵션:** 개별 색상 옵션으로 대체됨
- **@remorses/lemonsqueezy-webhooks:** 커뮤니티 패키지, 공식 SDK 권장
</sota_updates>

<open_questions>
## Open Questions

1. **Refund 처리 자동화**
   - What we know: `order_refunded` 웹훅으로 환불 감지 가능
   - What's unclear: 환불 시 크레딧 회수 정책 (이미 사용한 크레딧은?)
   - Recommendation: MVP에서는 수동 처리, Phase 6에서 정책 결정 필요

2. **테스트 모드 분리**
   - What we know: `test_mode` 플래그로 테스트 주문 구분 가능
   - What's unclear: 개발/스테이징/프로덕션 환경별 웹훅 설정 전략
   - Recommendation: 환경별 별도 Lemon Squeezy Store 또는 웹훅 URL 사용
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- /websites/lemonsqueezy - Webhook 서명 검증, Checkout API, Event Types
- /lmsqueezy/nextjs-billing - Next.js 통합 패턴, 환경 변수 설정
- /lmsqueezy/lemonsqueezy.js - SDK 사용법
- /websites/lemonsqueezy_api - Checkout Object, Webhook Object API 스펙

### Secondary (MEDIUM confidence)
- [Lemon Squeezy Next.js Tutorial](https://docs.lemonsqueezy.com/guides/tutorials/nextjs-saas-billing) - 공식 가이드
- [lmsqueezy/nextjs-billing GitHub](https://github.com/lmsqueezy/nextjs-billing) - 공식 템플릿

### Tertiary (LOW confidence - needs validation)
- WebSearch 결과의 SaaS 크레딧 시스템 패턴 - Phase 4에서 이미 구현된 패턴과 일치함 확인
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Lemon Squeezy API + SDK
- Ecosystem: Next.js App Router, Supabase
- Patterns: Checkout Flow, Webhook Handler, Idempotency
- Pitfalls: 중복 처리, 서명 검증, Body 재사용

**Confidence breakdown:**
- Standard stack: HIGH - 공식 SDK, 공식 문서 기반
- Architecture: HIGH - 공식 템플릿 + 검증된 패턴
- Pitfalls: HIGH - 공식 문서 + 커뮤니티 경험
- Code examples: HIGH - Context7 + 공식 문서에서 추출

**Research date:** 2026-01-16
**Valid until:** 2026-02-16 (30 days - Lemon Squeezy API 안정적)

**Integration with existing code:**
- Phase 4에서 `purchases` 테이블, `add_credit` 함수 이미 구현됨
- `lemon_squeezy_order_id` UNIQUE 제약으로 idempotency 보장
- `FOR UPDATE` 락으로 동시성 문제 해결됨
</metadata>

---

*Phase: 06-credit-system*
*Research completed: 2026-01-16*
*Ready for planning: yes*
