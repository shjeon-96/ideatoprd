---
phase: 04-database
plan: 03
subsystem: database
tags: [supabase, postgresql, functions, typescript, types]

# Dependency graph
requires:
  - phase: 04-02
    provides: prds, purchases, usage_logs tables
provides:
  - Credit management functions (deduct_credit, add_credit, get_user_credits)
  - TypeScript types auto-generated from schema
  - Type-safe Supabase client
affects: [05-prd-generation, 06-credit-system, 07-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: [security definer functions, FOR UPDATE row locking, barrel exports]

key-files:
  created:
    - supabase/migrations/20260116114251_create_functions.sql
  modified:
    - src/shared/types/database.ts
    - src/entities/index.ts

key-decisions:
  - "Keep database.ts in shared/types (existing import paths preserved)"
  - "Type aliases in entities/index.ts for convenience"
  - "FOR UPDATE locking for atomic credit transactions"

patterns-established:
  - "Supabase type generation: npx supabase gen types typescript --linked 2>/dev/null"
  - "Type aliases pattern: export type X = Database['public']['Tables']['x']['Row']"
  - "Credit functions return boolean for success/failure"

issues-created: []

# Metrics
duration: 10min
completed: 2026-01-16
---

# Phase 4 Plan 03: Functions & TypeScript Types Summary

**크레딧 관리 함수 생성 및 TypeScript 타입 자동 생성**

## Performance

- **Duration:** 10 min
- **Started:** 2026-01-16T11:45:00Z
- **Completed:** 2026-01-16T11:55:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 3

## Accomplishments
- 크레딧 차감 함수 (deduct_credit) - FOR UPDATE 락으로 원자적 트랜잭션
- 크레딧 충전 함수 (add_credit) - 구매/환불/보너스 지원
- 크레딧 조회 함수 (get_user_credits) - RPC 호출용
- TypeScript 타입 자동 생성 (supabase gen types)
- 타입 alias 정의 (Profile, PRD, Purchase, UsageLog 등)
- 빌드 검증 완료

## Task Commits

1. **Task 1-2: Functions + Types** - `7b47af6` (feat)
2. **Task 3: Human Verification** - Approved ✅

## Files Created/Modified
- `supabase/migrations/20260116114251_create_functions.sql` - 크레딧 관리 함수
- `src/shared/types/database.ts` - 자동 생성된 Supabase 타입
- `src/entities/index.ts` - 타입 alias 및 barrel export

## Database Schema (Final)

```
┌─────────────────┐     ┌─────────────────┐
│    profiles     │     │      prds       │
├─────────────────┤     ├─────────────────┤
│ id (PK, FK→auth)│◄────│ user_id (FK)    │
│ email           │     │ idea            │
│ display_name    │     │ template (enum) │
│ avatar_url      │     │ version (enum)  │
│ credits         │     │ title           │
│ created_at      │     │ content (jsonb) │
│ updated_at      │     │ credits_used    │
└─────────────────┘     │ created_at      │
        │               │ updated_at      │
        │               └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   purchases     │     │   usage_logs    │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ user_id (FK)    │     │ user_id (FK)    │
│ package (enum)  │     │ usage_type(enum)│
│ credits_amount  │     │ credits_delta   │
│ amount_cents    │     │ credits_before  │
│ currency        │     │ credits_after   │
│ lemon_squeezy_* │     │ related_prd_id  │
│ status (enum)   │     │ related_purchase│
│ created_at      │     │ description     │
│ completed_at    │     │ metadata (jsonb)│
└─────────────────┘     │ created_at      │
                        └─────────────────┘
```

## Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `deduct_credit(user_id, amount, prd_id?, desc?)` | PRD 생성 시 크레딧 차감 | boolean |
| `add_credit(user_id, amount, purchase_id?, type?, desc?)` | 크레딧 충전 (구매/환불/보너스) | boolean |
| `get_user_credits(user_id)` | 현재 크레딧 조회 | integer |

## TypeScript Types

```typescript
// Row types
Profile, PRD, Purchase, UsageLog

// Insert types
ProfileInsert, PRDInsert, PurchaseInsert, UsageLogInsert

// Update types
ProfileUpdate, PRDUpdate, PurchaseUpdate

// Enum types
PRDTemplate, PRDVersion, PurchaseStatus, CreditPackage, UsageType
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Minor] stderr 포함 문제**
- **Found during:** Task 2 (TypeScript 타입 생성)
- **Issue:** `supabase gen types` 출력에 "Initialising login role..." 메시지 포함
- **Fix:** `2>/dev/null`로 stderr 리다이렉트
- **Verification:** 빌드 성공

---

**Total deviations:** 1 auto-fixed, 0 deferred
**Impact on plan:** 없음, 계획대로 완료

## Issues Encountered
None

## Phase 4 Completion

Phase 4 (Database) 전체 완료:
- ✅ 04-01: Supabase 초기화 + profiles 테이블
- ✅ 04-02: prds, purchases, usage_logs 테이블
- ✅ 04-03: 크레딧 함수 + TypeScript 타입

**다음 Phase:** 05-prd-generation (PRD 생성 기능)

---
*Phase: 04-database*
*Completed: 2026-01-16*
