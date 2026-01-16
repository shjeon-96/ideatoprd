---
phase: 05-prd-generation
plan: 05
status: complete
---

# 05-05 Summary: 크레딧 차감 + PRD DB 저장 통합

## Completed

### Task 1: PRD 저장 API 함수 ✅
- `src/features/prd-generation/api/save-prd.ts` 생성
- `savePRD()`: PRD를 prds 테이블에 저장
- `extractPRDTitle()`: 첫 번째 H1 헤딩에서 제목 추출
- `parsePRDContent()`: 마크다운을 JSON 형식으로 저장

### Task 2: API Route 크레딧 차감 + PRD 저장 ✅
- `deduct_credit` RPC 호출로 원자적 크레딧 차감
- 402 Payment Required for 크레딧 부족
- `onChunk` 콜백으로 전체 콘텐츠 누적
- `onFinish` 콜백에서 PRD DB 저장

### Task 3: 크레딧 실시간 업데이트 ✅
- `/generate` 페이지 우측 상단에 보유 크레딧 표시
- 생성 완료 후 `refetch()`로 크레딧 갱신

## Files Created
- `src/features/prd-generation/api/save-prd.ts`

## Files Modified
- `src/app/api/generate-prd/route.ts` - 크레딧 차감 + PRD 저장 로직
- `app/(protected)/generate/page.tsx` - 크레딧 UI + refetch

## Issues Fixed
- AI SDK v6: `chunk.textDelta` → `chunk.text` 변경
- 서버/클라이언트 컴포넌트 분리: `save-prd.ts`는 barrel export 제외
- `content` 타입: `object` → `Json` (Supabase 타입 호환)

## API Flow
```
1. POST /api/generate-prd
2. Validate input (400 if invalid)
3. Authenticate user (401 if not logged in)
4. Deduct credits via RPC (402 if insufficient)
5. Stream PRD generation
6. Accumulate content via onChunk
7. Save to DB via onFinish
8. Client calls refetch() to update UI
```

## Verification
- [x] `npm run build` 성공
- [x] 크레딧 차감 로직 구현 (deduct_credit RPC)
- [x] PRD 저장 로직 구현 (savePRD)
- [x] 크레딧 UI 실시간 갱신 (refetch)

## Checkpoint: Human Verify Required

**검증 방법:**
1. `npm run dev` 실행
2. Supabase Dashboard에서 테스트 유저 크레딧 확인 (profiles 테이블)
3. /generate 페이지 접속
4. PRD 생성 실행
5. 확인 사항:
   - a) 크레딧 차감: profiles 테이블에서 credits 감소 확인
   - b) PRD 저장: prds 테이블에 새 레코드 생성
   - c) usage_logs: 크레딧 차감 로그 생성됨
   - d) UI: 페이지 우측 상단 크레딧 실시간 갱신
6. 크레딧 부족 시: 402 에러 + "크레딧이 부족합니다" 메시지
7. 비로그인 시: 401 에러

---

# Phase 5 Complete Summary

## Deliverables

### 1. AI SDK + Claude 클라이언트 (05-01)
- `ai@6.0.38`, `@ai-sdk/anthropic@3.0.15` 설치
- `defaultModel`: claude-3-5-haiku-latest
- `advancedModel`: claude-sonnet-4-20250514

### 2. PRD 템플릿 5종 (05-02)
- SaaS, Mobile, Marketplace, Extension, AI-Wrapper
- XML 태그 기반 프롬프트 (Claude 권장 패턴)

### 3. 스트리밍 API (05-03)
- POST /api/generate-prd
- Edge Runtime + streamText
- 인증/입력 검증

### 4. PRD 생성 UI (05-04)
- TemplateSelector, PRDForm, PRDViewer
- /generate 페이지 + 스트리밍 표시

### 5. 크레딧 + DB 통합 (05-05)
- 원자적 크레딧 차감 (deduct_credit RPC)
- PRD 데이터베이스 저장
- 실시간 크레딧 UI 갱신

## Next Phase
→ **Phase 06: Credit System** (Lemon Squeezy 결제 통합)
