---
phase: 05-prd-generation
plan: 02
status: complete
---

# 05-02 Summary: PRD 템플릿 5종 프롬프트 작성

## Completed

### Task 1: SaaS & Mobile 템플릿 ✅
- `templates/saas.ts`: 구독 모델, B2B/B2C, Pricing Strategy 특화
- `templates/mobile.ts`: 플랫폼 전략, 오프라인, 푸시 알림 특화

### Task 2: Marketplace, Extension, AI-Wrapper 템플릿 ✅
- `templates/marketplace.ts`: 양면 플랫폼, Chicken-Egg 전략 특화
- `templates/extension.ts`: 브라우저 권한, 스토어 정책 특화
- `templates/ai-wrapper.ts`: 모델 선택, 비용 분석, Prompt Engineering 특화

### Task 3: 템플릿 통합 ✅
- `templates/index.ts`: TEMPLATE_MAP으로 타입 안전하게 접근
- `system.ts`: getSystemPrompt() 함수가 템플릿별 프롬프트 결합

## Files Created
- `src/features/prd-generation/lib/prompts/templates/saas.ts`
- `src/features/prd-generation/lib/prompts/templates/mobile.ts`
- `src/features/prd-generation/lib/prompts/templates/marketplace.ts`
- `src/features/prd-generation/lib/prompts/templates/extension.ts`
- `src/features/prd-generation/lib/prompts/templates/ai-wrapper.ts`
- `src/features/prd-generation/lib/prompts/templates/index.ts`

## Files Modified
- `src/features/prd-generation/lib/prompts/system.ts` - getSystemPrompt 완성
- `src/features/prd-generation/index.ts` - TEMPLATE_MAP export 추가

## Issue Fixed
- PLAN에 `ai-wrapper` (hyphen)로 명시되어 있었으나, DB enum은 `ai_wrapper` (underscore)
- `templates/index.ts`에서 키를 `ai_wrapper`로 수정

## Verification
- [x] 5개 템플릿 파일 모두 존재
- [x] TEMPLATE_MAP이 PRDTemplate 타입과 일치
- [x] `npm run build` 성공

## Next
→ 05-03: API Route Handler (스트리밍 엔드포인트)
