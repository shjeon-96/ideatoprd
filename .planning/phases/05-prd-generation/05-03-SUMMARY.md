---
phase: 05-prd-generation
plan: 03
status: complete
---

# 05-03 Summary: PRD 생성 API Route Handler

## Completed

### Task 1: PRD 생성 요청/응답 타입 정의 ✅
- `src/features/prd-generation/model/types.ts` 생성
- `GeneratePRDRequest`: idea, template, version
- `CREDITS_PER_VERSION`: basic=1, detailed=2
- `validateIdea()`: 10~500자 검증

### Task 2: API Route Handler ✅
- `src/app/api/generate-prd/route.ts` 생성
- Edge Runtime 설정 (`runtime = 'edge'`)
- 스트리밍 응답 (`streamText` + `toTextStreamResponse`)
- 인증 체크 (401 for unauthenticated)
- 입력 검증 (400 for invalid input)

## Files Created
- `src/features/prd-generation/model/types.ts`
- `src/app/api/generate-prd/route.ts`

## Files Modified
- `src/features/prd-generation/index.ts` - types export 추가

## Issues Fixed
- AI SDK v6: `maxTokens` → `maxOutputTokens` 변경
- AI SDK v6: `experimental_providerMetadata` 제거 (메시지 레벨 캐싱으로 변경됨)

## Verification
- [x] API route 파일 존재
- [x] Edge Runtime 설정됨
- [x] `npm run build` 성공

## Checkpoint: Human Verify Required

**검증 방법:**
1. `.env.local`에 ANTHROPIC_API_KEY 설정 확인
2. `npm run dev` 실행
3. 로그인 상태에서 curl 테스트:
```bash
curl -X POST http://localhost:3000/api/generate-prd \
  -H "Content-Type: application/json" \
  -H "Cookie: [로그인 쿠키]" \
  -d '{"idea":"AI 기반 이력서 분석 서비스","template":"saas","version":"basic"}'
```
4. 확인 사항:
   - 스트리밍 텍스트 응답 (PRD 마크다운)
   - 비로그인 시 401 응답
   - 짧은 아이디어(10자 미만) 시 400 응답

## Next
→ 05-04: PRD 생성 UI 컴포넌트 (폼 + 뷰어)
