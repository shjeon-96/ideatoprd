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

- [ ] **Phase 1: Foundation** - 프로젝트 기반 설정 (TDD, FSD, 설정)
- [ ] **Phase 2: UI Foundation** - 디자인 시스템 + 랜딩 페이지
- [ ] **Phase 3: Authentication** - Supabase Auth + NextAuth.js
- [ ] **Phase 4: Database** - Supabase PostgreSQL + 타입 정의
- [ ] **Phase 5: PRD Generation** - Claude API + 템플릿 시스템
- [ ] **Phase 6: Credit System** - Lemon Squeezy 결제 통합
- [ ] **Phase 7: Dashboard** - PRD 히스토리 + 내보내기

## Phase Details

### Phase 1: Foundation

**Goal**: 프로젝트 기반 설정 - TDD 환경, FSD 구조, React Compiler, 환경변수
**Depends on**: Nothing (first phase)
**Research**: Unlikely (established patterns)
**Plans**: TBD (3-4 plans expected)

Key deliverables:

- React Compiler 활성화
- Vitest + Testing Library 설정
- FSD 디렉토리 구조 생성
- .env.example 및 환경변수 템플릿
- ESLint/Prettier 강화
- firebase-debug.log 보안 수정

### Phase 2: UI Foundation

**Goal**: 디자인 시스템 구축 + 랜딩 페이지 구현 (frontend-design 플러그인 활용)
**Depends on**: Phase 1
**Research**: Unlikely (Tailwind + shadcn/ui patterns)
**Plans**: TBD (2-3 plans expected)

Key deliverables:

- shadcn/ui 컴포넌트 설치
- 디자인 토큰 (색상, 타이포그래피, 스페이싱)
- 공통 컴포넌트 (Button, Card, Input, Dialog)
- 랜딩 페이지 (Hero, Features, CTA, Pricing)
- 반응형 레이아웃

### Phase 3: Authentication

**Goal**: Supabase Auth + NextAuth.js 통합 인증 시스템
**Depends on**: Phase 2
**Research**: Likely (Supabase + NextAuth integration)
**Research topics**: Supabase Auth with Next.js 16 App Router, NextAuth.js v5 adapter patterns, Google OAuth setup
**Plans**: TBD (3-4 plans expected)

Key deliverables:

- Supabase 프로젝트 설정
- NextAuth.js v5 설정 (App Router)
- Google OAuth 프로바이더
- 이메일/비밀번호 인증
- 세션 관리 + 미들웨어
- 로그인/회원가입 페이지
- AuthGuard 컴포넌트

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
**Research**: Likely (Lemon Squeezy API)
**Research topics**: Lemon Squeezy API for Next.js, webhook signature verification, credit package patterns
**Plans**: TBD (2-3 plans expected)

Key deliverables:

- Lemon Squeezy 계정/상품 설정
- 크레딧 패키지 (Starter, Basic, Pro, Business)
- 결제 체크아웃 플로우
- 웹훅 엔드포인트
- 크레딧 차감/충전 로직
- 크레딧 부족 모달
- 구매 히스토리

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

| Phase             | Plans Complete | Status      | Completed |
| ----------------- | -------------- | ----------- | --------- |
| 1. Foundation     | 0/TBD          | Not started | -         |
| 2. UI Foundation  | 0/TBD          | Not started | -         |
| 3. Authentication | 0/TBD          | Not started | -         |
| 4. Database       | 0/TBD          | Not started | -         |
| 5. PRD Generation | 0/TBD          | Not started | -         |
| 6. Credit System  | 0/TBD          | Not started | -         |
| 7. Dashboard      | 0/TBD          | Not started | -         |

---

_Created: 2026-01-14_
_Milestone: v1.0 MVP_
