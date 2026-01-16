# 07-01: Dashboard Layout + PRD List - Summary

**Completed:** 2026-01-16
**Status:** SUCCESS

## Overview

대시보드 레이아웃과 PRD 목록 기능을 구현했습니다. 기존 `(protected)` 레이아웃에 중첩 레이아웃으로 사이드바를 추가하고, PRD 목록을 그리드 형식으로 표시하는 기능을 완성했습니다.

## Completed Tasks

### Task 1: 대시보드 사이드바 위젯 생성
- `src/widgets/dashboard/sidebar.tsx` 생성
- `src/widgets/dashboard/index.ts` barrel export 생성
- 4개 네비게이션 항목: Dashboard, My PRDs, Credits, Settings
- lucide-react 아이콘 사용 (Home, FileText, CreditCard, Settings)
- usePathname으로 현재 경로 활성 상태 표시
- cn() 유틸리티로 조건부 스타일링

### Task 2: 대시보드 중첩 레이아웃 생성
- `app/(protected)/dashboard/layout.tsx` 생성
- 기존 `(protected)/layout.tsx`에서 `<main>` 태그 제거하여 중첩 레이아웃과 호환성 확보
- 사이드바: hidden md:flex, w-64, border-r, shrink-0
- 메인 콘텐츠: flex-1, overflow-auto, p-6

### Task 3: PRD 목록 API 함수 및 컴포넌트 생성
- `src/features/prd/api/get-prds.ts` 생성
  - getPrds() 함수: prds 테이블에서 사용자 PRD 목록 조회
  - RLS 정책으로 자동 user_id 필터링
  - PrdListItem 타입 정의 (title nullable 처리)
- `src/features/prd/ui/prd-list.tsx` 생성
  - Server Component로 데이터 직접 페칭
  - 빈 목록: 안내 메시지 + /generate 링크
  - 목록: Card 그리드 (md:grid-cols-2 lg:grid-cols-3)
- `src/features/prd/index.ts` barrel export 생성

### Task 4: 대시보드 홈 페이지 업데이트
- `app/(protected)/dashboard/page.tsx` 업데이트
- 페이지 제목: "My PRDs"
- 부제목: "Manage your generated PRD documents"
- New PRD 버튼: /generate 링크
- PrdList 컴포넌트 렌더링

## Files Created/Modified

### Created
- `src/widgets/dashboard/sidebar.tsx`
- `src/widgets/dashboard/index.ts`
- `app/(protected)/dashboard/layout.tsx`
- `src/features/prd/api/get-prds.ts`
- `src/features/prd/ui/prd-list.tsx`
- `src/features/prd/index.ts`

### Modified
- `app/(protected)/layout.tsx` - `<main>` 태그 제거 (중첩 레이아웃 지원)
- `app/(protected)/dashboard/page.tsx` - placeholder에서 PRD 목록 페이지로 변경

## Verification Results

- [x] `npm run build` 성공
- [x] Dashboard 레이아웃에 사이드바 표시 (md 이상)
- [x] PRD 목록 그리드 표시 (또는 빈 상태 메시지)
- [x] 사이드바 네비게이션 활성 상태 표시 동작
- [x] TypeScript 타입 오류 없음

## Technical Notes

### Title Nullable 처리
- prds 테이블의 title 필드가 `string | null` 타입
- PrdListItem 타입에서 nullable 반영
- UI에서 `prd.title ?? 'Untitled PRD'`로 fallback 처리

### 레이아웃 구조
```
(protected)/layout.tsx
  └── AuthGuard
      └── header + {children}
          └── dashboard/layout.tsx
              └── Sidebar + main
                  └── page.tsx (PrdList)
```

### FSD 구조 준수
- widgets: 대시보드 사이드바 (재사용 가능한 독립 컴포넌트)
- features: PRD 관련 기능 (API + UI)
- entities: 타입 정의 재사용

## Next Steps

- 07-02: PRD 상세 페이지 (`/dashboard/prds/[id]`)
- 07-03: Markdown 뷰어 및 PDF 다운로드
- 07-04: Settings 페이지

---

*Phase: 07-dashboard*
*Plan: 01*
*Completed: 2026-01-16*
