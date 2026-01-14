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
| Styling | Tailwind CSS 4 | 이미 설정됨 |
| Auth | Firebase Auth + NextAuth.js | Google OAuth, 세션 관리 |
| Database | Firebase Firestore | NoSQL, 실시간 업데이트 |
| AI | Anthropic Claude API | PRD 생성 품질 |
| Payment | Lemon Squeezy | 크레딧 판매 |
| Hosting | Vercel | Next.js 최적화, Edge Functions |

**아키텍처 패턴:**
- DDD (Domain-Driven Design) 구조 채택
- 서버 액션으로 API 라우트 최소화
- 타입 안전성: TypeScript strict mode

---

## Constraints

**기술적 제약:**
- React Compiler 활성화 필요 (현재 미설정)
- 테스트 인프라 구축 필요 (현재 없음)
- Firebase SDK 설치 필요 (CLI만 초기화됨)

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
- [ ] 프로젝트 초기 설정 (React Compiler, 테스트 등)
- [ ] DDD 디렉토리 구조 생성
- [ ] Firebase SDK 설치 및 설정
- [ ] 인증 시스템 구현
- [ ] 랜딩 페이지 구현

---

## Workflow Mode

**Mode:** Standard (밸런스)
**Rationale:**
- MVP 빠른 출시 + 품질 유지 균형
- 핵심 기능에 집중, 과도한 추상화 방지
- TDD 적용하되 필수 테스트만

---

*Initialized: 2026-01-14*
*Last Updated: 2026-01-14*
