# Roadmap: IdeaToPRD

## Overview

아이디어 한 줄로 PRD를 자동 생성하는 SaaS 애플리케이션 개발. Foundation → UI → Auth → Database → AI Integration → Payment → Dashboard 순서로 MVP를 구축합니다.

## Domain Expertise

- frontend-design 플러그인 활용 (Phase 2, 7)
- TDD 방식 개발 (모든 단계)
- FSD (Feature-Sliced Design) 아키텍처

## Technology Stack

| 영역         | 기술                            | 변경사항               |
| ------------ | ------------------------------- | ---------------------- |
| Framework    | Next.js 16 (App Router)         | -                      |
| Auth         | **Supabase Auth** + NextAuth.js | Firebase → Supabase    |
| Database     | **Supabase PostgreSQL** + RLS   | Firestore → PostgreSQL |
| AI           | Anthropic Claude API            | -                      |
| Payment      | Lemon Squeezy                   | -                      |
| Architecture | **FSD (Feature-Sliced Design)** | DDD → FSD              |
| Testing      | **Vitest + TDD**                | 추가                   |

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - 프로젝트 기반 설정 (TDD, FSD, 설정) ✓
- [x] **Phase 2: UI Foundation** - 디자인 시스템 + 랜딩 페이지 ✓
- [x] **Phase 3: Authentication** - Supabase Auth + Protected Routes ✓
- [ ] **Phase 4: Database** - Supabase PostgreSQL + 타입 정의
- [ ] **Phase 5: PRD Generation** - Claude API + 템플릿 시스템
- [ ] **Phase 6: Credit System** - Lemon Squeezy 결제 통합
- [ ] **Phase 7: Dashboard** - PRD 히스토리 + 내보내기

## Phase Details

### Phase 1: Foundation ✓ COMPLETE

**Goal**: 프로젝트 기반 설정 - TDD 환경, FSD 구조, React Compiler, 환경변수
**Depends on**: Nothing (first phase)
**Research**: Unlikely (established patterns)
**Plans**: 2 plans executed

Key deliverables:

- ✓ React Compiler 활성화
- ✓ Vitest + Testing Library 설정 (happy-dom)
- ✓ FSD 디렉토리 구조 생성
- ✓ .env.example 및 환경변수 템플릿
- ✓ ESLint/Prettier 강화
- ✓ firebase-debug.log 보안 수정

### Phase 2: UI Foundation ✓ COMPLETE

**Goal**: 디자인 시스템 구축 + 랜딩 페이지 구현 (frontend-design 플러그인 활용)
**Depends on**: Phase 1
**Research**: Unlikely (Tailwind + shadcn/ui patterns)
**Plans**: 3 plans executed

Key deliverables:

- ✓ shadcn/ui 컴포넌트 설치 (Button, Card, Input, Dialog)
- ✓ 디자인 토큰 (브랜드 색상 oklch, 타이포그래피, 그라데이션)
- ✓ 공통 컴포넌트 (src/shared/ui/)
- ✓ 랜딩 페이지 (Hero, Features, Pricing, CTA, Footer)
- ✓ 반응형 레이아웃
- ✓ 다크모드 완벽 지원 (prefers-color-scheme)

### Phase 3: Authentication ✓ COMPLETE

**Goal**: Supabase Auth + Protected Routes 인증 시스템
**Depends on**: Phase 2
**Research**: Completed (Supabase with Next.js App Router)
**Plans**: 4 plans executed

Key deliverables:

- ✓ Supabase 클라이언트 설정 (server/client helpers)
- ✓ Auth 미들웨어 (세션 리프레시)
- ✓ Auth 콜백 라우트 (OAuth 처리)
- ✓ Auth feature 모듈 (FSD 구조)
- ✓ 로그인/회원가입 페이지 (Google OAuth + Email)
- ✓ AuthGuard 서버 컴포넌트
- ✓ useUser 클라이언트 훅
- ✓ 보호된 라우트 그룹 ((protected))
- ✓ UserMenu 컴포넌트
- ✓ 대시보드 플레이스홀더

### Phase 4: Database

**Goal**: Supabase PostgreSQL 스키마 + Row Level Security + TypeScript 타입
**Depends on**: Phase 3
**Research**: Likely (Supabase RLS patterns)
**Research topics**: Supabase RLS best practices, PostgreSQL schema design for SaaS, Supabase client generation
**Plans**: TBD (2-3 plans expected)

Key deliverables:

- users 테이블 (credits, profile)
- prds 테이블 (content, metadata)
- purchases 테이블 (payment records)
- usage_logs 테이블 (audit trail)
- Row Level Security 정책
- TypeScript 타입 자동 생성
- Database hooks/functions

### Phase 5: PRD Generation

**Goal**: Claude API 통합 + PRD 템플릿 시스템 + 생성 로직
**Depends on**: Phase 4
**Research**: Likely (Anthropic Claude API)
**Research topics**: Anthropic Claude API current docs, streaming responses in Next.js, prompt engineering for PRD generation
**Plans**: TBD (3-4 plans expected)

Key deliverables:

- Anthropic SDK 설정
- PRD 템플릿 5종 (SaaS, Mobile, Marketplace, Extension, AI-Wrapper)
- 프롬프트 엔지니어링
- PRD 생성 API 엔드포인트
- 스트리밍 응답 UI
- 생성 진행률 표시
- 기본/상세 버전 분기

### Phase 6: Credit System

**Goal**: Lemon Squeezy 결제 + 크레딧 관리 시스템
**Depends on**: Phase 5
**Research**: Completed (Lemon Squeezy API, webhook patterns)
**Plans**: 3 plans created

Key deliverables:

- Lemon Squeezy SDK 설정 (06-01)
- 웹훅 핸들러 + 서명 검증 (06-01)
- 크레딧 패키지 정의 (06-01)
- Checkout Server Action (06-02)
- Lemon.js Overlay 통합 (06-02)
- 크레딧 패키지 선택 UI (06-02)
- 구매 페이지 (06-02)
- 크레딧 부족 모달 (06-03)
- 헤더 크레딧 표시 (06-03)
- 구매 히스토리 (06-03)

### Phase 7: Dashboard

**Goal**: PRD 히스토리, 내보내기, 사용자 대시보드 (frontend-design 활용)
**Depends on**: Phase 6
**Research**: Unlikely (internal patterns established)
**Plans**: TBD (2-3 plans expected)

Key deliverables:

- 대시보드 레이아웃 (사이드바, 헤더)
- PRD 목록 페이지
- PRD 상세 뷰어
- Markdown 복사 기능
- PDF 다운로드 (유료)
- 프로필/설정 페이지
- 반응형 대시보드

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase             | Plans Complete | Status      | Completed  |
| ----------------- | -------------- | ----------- | ---------- |
| 1. Foundation     | 2/2            | Complete ✓  | 2026-01-14 |
| 2. UI Foundation  | 3/3            | Complete ✓  | 2026-01-14 |
| 3. Authentication | 4/4            | Complete ✓  | 2026-01-14 |
| 4. Database       | 3/3            | Complete ✓  | 2026-01-16 |
| 5. PRD Generation | 5/5            | Complete ✓  | 2026-01-16 |
| 6. Credit System  | 0/3            | Planned     | -          |
| 7. Dashboard      | 0/TBD          | Not started | -          |

---

_Created: 2026-01-14_
_Milestone: v1.0 MVP_
