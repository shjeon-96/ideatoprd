# 07-02: PRD Detail View + Markdown Rendering - Summary

**Completed:** 2026-01-16
**Status:** SUCCESS

## Overview

PRD 상세 페이지와 Markdown 렌더링 기능을 구현했습니다. react-markdown + remark-gfm으로 GFM 테이블, 코드 블록을 지원하고, react-syntax-highlighter로 코드 하이라이팅을 추가했습니다. 클립보드 복사 기능도 구현했습니다.

## Completed Tasks

### Task 1: Markdown 패키지 설치 및 PrdViewer 컴포넌트 생성
- `react-markdown`, `remark-gfm`, `react-syntax-highlighter` 패키지 설치
- `@types/react-syntax-highlighter` 타입 설치
- `src/features/prd/ui/prd-viewer.tsx` 생성
  - 'use client' 지시어 (클라이언트 컴포넌트)
  - react-markdown + remarkGfm 플러그인
  - Prism SyntaxHighlighter + oneDark 테마
  - 커스텀 components: CodeBlock, ResponsiveTable
  - prose 클래스: `prose prose-neutral dark:prose-invert max-w-none`

### Task 2: 클립보드 훅 및 복사 버튼 컴포넌트 생성
- `src/shared/hooks/` 디렉토리 생성
- `src/shared/hooks/use-copy-to-clipboard.ts` 생성
  - navigator.clipboard.writeText 사용
  - try-catch로 에러 처리 (구형 브라우저, 권한 거부)
  - 반환: { copiedText, copy, reset }
- `src/shared/hooks/index.ts` barrel export 생성
- `src/features/prd/ui/copy-markdown-button.tsx` 생성
  - useCopyToClipboard 훅 사용
  - 복사 후 2초간 "Copied!" 표시
  - lucide-react: Copy, Check 아이콘
  - Button variant="outline" size="sm"

### Task 3: PRD 단건 조회 API 함수 생성
- `src/features/prd/api/get-prd.ts` 생성
  - getPrd(id) 함수: prds 테이블에서 id로 단건 조회
  - select: id, title, idea, template, version, content, created_at, updated_at
  - PrdDetailItem, PrdContent 타입 정의
  - PGRST116 에러 (not found) 시 null 반환
  - RLS가 자동으로 소유권 확인

### Task 4: PRD 상세 페이지 생성 및 barrel export 업데이트
- `app/(protected)/dashboard/prds/[id]/page.tsx` 생성
  - Server Component
  - params에서 id 추출 (Promise 패턴 for Next.js 16)
  - 없으면 notFound() 호출
  - 페이지 구조:
    - Back navigation 버튼
    - 상단: 제목, template/version 배지, 날짜
    - Original idea 박스
    - CopyMarkdownButton 액션 버튼
    - PrdViewer로 Markdown 렌더링
- `src/features/prd/index.ts` 업데이트
  - getPrd, PrdDetailItem, PrdContent export
  - PrdViewer, CopyMarkdownButton export

### 추가 작업: Badge 컴포넌트 생성
- `src/shared/ui/badge.tsx` 생성
  - cva로 variants 정의 (default, secondary, destructive, outline)
  - `src/shared/ui/index.ts`에 export 추가

## Files Created/Modified

### Created
- `src/features/prd/ui/prd-viewer.tsx`
- `src/features/prd/ui/copy-markdown-button.tsx`
- `src/features/prd/api/get-prd.ts`
- `src/shared/hooks/use-copy-to-clipboard.ts`
- `src/shared/hooks/index.ts`
- `src/shared/ui/badge.tsx`
- `app/(protected)/dashboard/prds/[id]/page.tsx`

### Modified
- `src/features/prd/index.ts` - getPrd, PrdViewer, CopyMarkdownButton export 추가
- `src/shared/ui/index.ts` - Badge export 추가
- `package.json` - react-markdown, remark-gfm, react-syntax-highlighter, @types/react-syntax-highlighter 추가

## Verification Results

- [x] `npm run build` 성공
- [x] react-markdown, remark-gfm, react-syntax-highlighter 설치됨
- [x] PRD 상세 페이지 라우트 생성됨 (`/dashboard/prds/[id]`)
- [x] TypeScript 타입 오류 없음
- [x] barrel export 완료

## Technical Notes

### Next.js 16 Params 처리
- `params`가 Promise로 변경됨
- `const { id } = await params;`로 추출

### PrdViewer 컴포넌트 구조
```typescript
// 클라이언트 컴포넌트 (syntax highlighter 때문에 필수)
'use client';

// react-markdown + remark-gfm + react-syntax-highlighter
// oneDark 테마 사용
// 커스텀 components로 code, table 오버라이드
```

### Content 구조
```typescript
interface PrdContent {
  markdown?: string;  // 전체 PRD Markdown 텍스트
  [key: string]: unknown;
}
```

### FSD 구조 준수
- shared/hooks: 재사용 가능한 커스텀 훅
- shared/ui: Badge 컴포넌트
- features/prd: API 함수 + UI 컴포넌트

## Dependencies Added

```json
{
  "dependencies": {
    "react-markdown": "^9.x.x",
    "remark-gfm": "^4.x.x",
    "react-syntax-highlighter": "^15.x.x"
  },
  "devDependencies": {
    "@types/react-syntax-highlighter": "^15.x.x"
  }
}
```

## Next Steps

- 07-03: PDF 다운로드 기능 (예정)
- 07-04: Settings 페이지
- 07-05: Credits 페이지

---

*Phase: 07-dashboard*
*Plan: 02*
*Completed: 2026-01-16*
