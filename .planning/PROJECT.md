# PROJECT.md

**Project:** IdeaToPRD
**Type:** SaaS Web Application
**Status:** Initialized

---

## Overview

**한 줄 설명:** 아이디어 한 줄로 개발 가능한 PRD 자동 생성

**타겟 유저:**

- Primary: 바이브 코더 (Claude, Cursor로 앱 개발하는 비개발자/입문자)
- Secondary: 인디 해커 / 솔로 메이커
- Tertiary: 스타트업 PM

**비즈니스 모델:** 크레딧 기반 과금

- 가입 시 3 크레딧 무료 지급
- 크레딧 패키지 구매 (Lemon Squeezy)

---

## Goals

**핵심 목표:**

- PRD 작성 시간: 2-3일 → **5분**
- 사용자 만족도: NPS 50+
- 6개월 내 MRR $10,000 달성

**성공 지표:**

- 런칭 후 1개월: 1,000 가입, 100 유료 전환
- 3개월: 5,000 가입, MRR $3,000
- 6개월: 15,000 가입, MRR $10,000

---

## Technical Decisions

**Tech Stack:**
| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| Frontend | Next.js 16 (App Router) | 서버 컴포넌트, 이미 설정됨 |
| Styling | Tailwind CSS 4 + shadcn/ui | 유틸리티 CSS + 컴포넌트 |
| Auth | **Supabase Auth** + NextAuth.js | Google OAuth, 세션 관리 |
| Database | **Supabase PostgreSQL** | SQL, RLS 보안, 타입 생성 |
| AI | Anthropic Claude API | PRD 생성 품질 |
| Payment | Lemon Squeezy | 크레딧 판매 |
| Hosting | Vercel | Next.js 최적화, Edge Functions |
| Testing | **Vitest** + Testing Library | TDD 워크플로우 |

**아키텍처 패턴:**

- **FSD (Feature-Sliced Design)** 구조 채택
- 서버 액션으로 API 라우트 최소화
- 타입 안전성: TypeScript strict mode
- **TDD**: 테스트 먼저 작성 후 구현

**FSD 디렉토리 구조:**

```
src/
├── app/           # Next.js App Router (라우팅만)
├── widgets/       # 페이지 구성 블록 (Header, Sidebar)
├── features/      # 비즈니스 기능 (generate-prd, buy-credits)
├── entities/      # 도메인 엔티티 (user, prd, purchase)
├── shared/        # 공통 유틸, UI, API 클라이언트
└── pages/         # 페이지별 컴포넌트 조합
```

---

## Constraints

**기술적 제약:**

- React Compiler 활성화 필요 (현재 미설정)
- 테스트 인프라 구축 필요 (현재 없음)
- Supabase 프로젝트 설정 필요

**비즈니스 제약:**

- MVP 2주 내 출시 목표
- 1인 개발 (솔로 메이커)
- 초기 서버 비용 최소화

---

## PRD Reference

전체 PRD 문서: `docs/plan.md` (1100+ 줄)

**MVP 기능 (P0):**

1. 사용자 인증 (Google OAuth, 이메일/비밀번호)
2. PRD 생성 (아이디어 → 구조화된 문서)
3. PRD 템플릿 (SaaS, Mobile, Marketplace 등)
4. 내보내기 (Markdown 복사, PDF 다운로드)
5. 크레딧 시스템
6. PRD 히스토리

**Phase 2 기능 (P1):**

- PRD 편집
- 경쟁 분석
- Notion/Linear 내보내기
- 버전 히스토리

---

## Current State

**완료됨:**

- [x] Next.js 16 프로젝트 생성
- [x] Tailwind CSS 4 설정
- [x] ESLint 설정
- [x] PRD 문서 작성 (docs/plan.md)
- [x] 코드베이스 분석 (.planning/codebase/)

**다음 단계:**

- [ ] Phase 1: Foundation (React Compiler, Vitest, FSD 구조)
- [ ] Phase 2: UI Foundation (디자인 시스템, 랜딩 페이지)
- [ ] Phase 3: Authentication (Supabase Auth)
- [ ] Phase 4: Database (Supabase PostgreSQL)
- [ ] Phase 5: PRD Generation (Claude API)
- [ ] Phase 6: Credit System (Lemon Squeezy)
- [ ] Phase 7: Dashboard (히스토리, 내보내기)

## Key Decisions

| 날짜       | 결정                     | 이유                            |
| ---------- | ------------------------ | ------------------------------- |
| 2026-01-14 | Firebase → Supabase      | PostgreSQL, RLS, 타입 생성 지원 |
| 2026-01-14 | DDD → FSD                | 기능 중심 구조, 확장성          |
| 2026-01-14 | TDD 적용                 | 품질 보장, 리팩토링 안전성      |
| 2026-01-14 | frontend-design 플러그인 | 고품질 UI 빠른 구현             |

---

## Workflow Mode

**Mode:** Standard (밸런스)
**Rationale:**

- MVP 빠른 출시 + 품질 유지 균형
- 핵심 기능에 집중, 과도한 추상화 방지
- TDD 적용하되 필수 테스트만

---

_Initialized: 2026-01-14_
_Last Updated: 2026-01-14_
