# Changelog: 2025-01-17

## 프롬프트 강화

### 시스템 프롬프트 (`system.ts`)
- `<critical_principle>` 추가: 최신 정보 우선 원칙 명시
- `<success_metrics_guidelines>` 추가: 산업별 벤치마크 기반 현실적 지표
- `<timeline_guidelines>` 추가: 팀 규모별 타임라인 가이드
- `<complexity_criteria>` 추가: S/M/L/XL 복잡도 기준
- Research 프롬프트: Tavily 데이터 우선 활용 강화

### 템플릿 강화 (5개 전체)
각 템플릿에 추가된 섹션:
- `<domain_benchmarks>`: 산업별 KPI 벤치마크
- `<critical_considerations>`: 필수 고려사항
- `<common_pitfalls>`: 흔한 실수 및 회피 방법
- `<example_ko>`, `<example_en>`: 한/영 예시

| 템플릿 | 주요 추가 내용 |
|--------|---------------|
| SaaS | CAC/LTV 비율, MRR 성장률, Churn Rate |
| Mobile | DAU/MAU, Retention D1/D7/D30, 오프라인 퍼스트 |
| Marketplace | 치킨-에그 문제, 유동성, Trust & Safety |
| Extension | 권한 최소화, Manifest V3, 크로스 브라우저 |
| AI Wrapper | 방어 가능한 해자, 비용 최적화, 안정성 |

---

## 신규 기능

### PRD 품질 평가 기능
- **DB**: `prds` 테이블에 `rating`, `rating_feedback`, `rated_at` 컬럼 추가
- **API**: `POST /api/prds/rate` - 평가 제출 엔드포인트
- **UI**: `PrdRating` 컴포넌트 - 👍/👎 버튼 + 선택적 피드백

```
파일:
- supabase/migrations/20260117300000_add_prd_rating.sql
- src/features/prd/ui/prd-rating.tsx
- app/api/prds/rate/route.ts
- src/features/prd/api/get-prd.ts (수정)
- app/(protected)/dashboard/prds/[id]/page.tsx (수정)
```

### Anthropic 프롬프트 캐싱
- `generate-prd/route.ts`: 시스템 프롬프트 캐싱 적용
- `revise-prd/route.ts`: 시스템 프롬프트 캐싱 적용
- 예상 효과: 입력 토큰 비용 ~90% 절감

```typescript
messages: [
  {
    role: 'system',
    content: systemPrompt,
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  },
  { role: 'user', content: userPrompt },
],
```

---

## 버그 수정

### 빌드 에러 해결
- **원인**: Client Component에서 barrel file 통해 Server Component 포함
- **해결**: 직접 경로 import로 변경

```typescript
// Before
import { useUser } from '@/src/features/auth';

// After
import { useUser } from '@/src/features/auth/hooks/use-user';
```

수정 파일:
- `src/features/onboarding/ui/dashboard-checklist.tsx`
- `src/features/onboarding/ui/dashboard-onboarding.tsx`
