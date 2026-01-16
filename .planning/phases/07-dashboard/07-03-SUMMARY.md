# 07-03: PDF Download + Settings Page - Summary

**Completed:** 2026-01-16
**Status:** SUCCESS

## Overview

PDF 다운로드 기능과 설정 페이지를 구현했습니다. @react-pdf/renderer를 dynamic import + ssr: false로 클라이언트에서만 로드하여 SSR 빌드 에러를 방지했습니다. 설정 페이지에서 사용자 프로필 정보와 크레딧 현황을 표시합니다.

## Completed Tasks

### Task 1: @react-pdf/renderer 설치 및 PrdDocument 컴포넌트 생성
- `@react-pdf/renderer` 패키지 설치 (52개 패키지 추가)
- `src/features/prd/ui/prd-document.tsx` 생성
  - Document, Page, Text, View, StyleSheet 사용
  - A4 사이즈 페이지, padding 40
  - 제목: fontSize 24, marginBottom 20
  - 콘텐츠: fontSize 12, lineHeight 1.6
  - stripMarkdown 함수로 Markdown 태그 제거 (headers, bold, italic, code, links 등)
  - Footer: "IdeaToPRD - Transform your ideas..."

### Task 2: PDF 다운로드 버튼 컴포넌트 생성
- `src/features/prd/ui/prd-pdf-download.tsx` 생성
  - 'use client' 지시어
  - **CRITICAL**: next/dynamic으로 PDFDownloadLink 로드 (ssr: false)
  - **CRITICAL**: PrdDocument도 dynamic import로 로드 (ssr: false)
  - useState + useEffect로 isClient 상태 관리
  - isClient가 false일 때: "Preparing PDF..." 비활성 버튼
  - isClient가 true일 때: PDFDownloadLink 렌더링
  - fileName: title에서 공백을 하이픈으로 변환 + .pdf
  - Button variant="secondary", Download 아이콘 (lucide-react)

### Task 3: PRD 상세 페이지에 PDF 다운로드 버튼 추가
- `app/(protected)/dashboard/prds/[id]/page.tsx` 수정
  - PrdPdfDownload import 추가
  - CopyMarkdownButton 옆에 PDF 다운로드 버튼 배치
  - prd 객체 props 전달 (id, title, content)
  - null을 undefined로 변환하여 타입 에러 해결
- `src/features/prd/index.ts` 업데이트
  - PrdPdfDownload, PrdDocument export 추가

### Task 4: 설정 페이지 생성
- `app/(protected)/dashboard/settings/page.tsx` 생성
  - Server Component
  - createClient로 현재 사용자 정보 조회
  - profiles 테이블에서 display_name, avatar_url, credits 조회
  - 페이지 구조:
    - 페이지 제목: "Settings"
    - 프로필 섹션 (Card):
      - Avatar (이미지 또는 이니셜)
      - Display Name
      - Email (읽기 전용)
      - Member since 날짜
    - 크레딧 섹션 (Card):
      - 현재 보유 크레딧 (숫자)
      - "Purchase Credits" 버튼 -> /purchase 링크
  - 메타데이터: title="Settings | IdeaToPRD"

## Files Created/Modified

### Created
- `src/features/prd/ui/prd-document.tsx` - PDF 문서 컴포넌트
- `src/features/prd/ui/prd-pdf-download.tsx` - PDF 다운로드 버튼
- `app/(protected)/dashboard/settings/page.tsx` - 설정 페이지

### Modified
- `app/(protected)/dashboard/prds/[id]/page.tsx` - PDF 다운로드 버튼 추가
- `src/features/prd/index.ts` - PrdPdfDownload, PrdDocument export
- `package.json` - @react-pdf/renderer 의존성 추가

## Verification Results

- [x] `npm run build` 성공
- [x] @react-pdf/renderer 설치 완료
- [x] PDF 다운로드 버튼이 PRD 상세 페이지에 표시됨
- [x] 설정 페이지 라우트 생성됨 (`/dashboard/settings`)
- [x] TypeScript 타입 오류 없음
- [x] barrel export 완료

## Technical Notes

### Dynamic Import Pattern (CRITICAL)
```typescript
// @react-pdf/renderer MUST use dynamic import + ssr: false
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <Button disabled>Loading...</Button> }
);

const PrdDocument = dynamic(
  () => import('./prd-document').then((mod) => mod.PrdDocument),
  { ssr: false }
);
```

이 패턴을 따르지 않으면 빌드 시 `ba.Component is not a constructor` 에러가 발생합니다.

### Markdown 태그 제거
PDF에서는 Markdown 렌더링을 지원하지 않으므로, 정규식으로 Markdown 태그를 제거하고 일반 텍스트만 표시합니다:
- Headers (#, ##, ### 등)
- Bold/Italic (**, *, __, _)
- Inline code (`)
- Code blocks (```)
- Links ([text](url))
- Images (![alt](url))
- Horizontal rules (---, ***)
- List markers (-, *, +, 1.)

### 타입 안전성
`prd.content`가 `PrdContent | null` 타입이므로, PrdPdfDownload에 전달할 때 `?? undefined`로 변환하여 타입 에러를 방지했습니다.

## Dependencies Added

```json
{
  "dependencies": {
    "@react-pdf/renderer": "^4.x.x"
  }
}
```

## Phase 7 Complete

MVP Dashboard 구현 완료:
- 07-01: 대시보드 레이아웃 (사이드바, 메뉴)
- 07-02: PRD 목록 및 상세 뷰 (Markdown 렌더링, 코드 하이라이팅)
- 07-03: PDF 다운로드, 설정 페이지

**대시보드 전체 기능:**
- 사이드바 네비게이션 (Dashboard, My PRDs, Credits, Settings)
- PRD 목록 그리드 (카드 형태)
- PRD 상세 뷰 (Markdown 렌더링, GFM 테이블, 코드 블록)
- Markdown 복사 버튼
- PDF 다운로드 버튼
- 설정 페이지 (프로필 정보, 크레딧 현황)
- 반응형 레이아웃 (모바일에서 사이드바 숨김)

## Next Steps

- Human verification checkpoint
- Phase 8 이후 작업 또는 MVP v1.0 릴리스 준비

---

*Phase: 07-dashboard*
*Plan: 03*
*Completed: 2026-01-16*
