# IdeaToPRD - Product Requirements Document

## 개요

**제품명:** IdeaToPRD  
**한 줄 설명:** 아이디어 한 줄로 개발 가능한 PRD 자동 생성  
**타겟:** 바이브 코더, 인디 해커, 솔로 메이커, 스타트업 PM  
**수익 모델:** 크레딧 기반 과금

---

## 1. 문제 정의

### 현재 상황

- 바이브 코딩 시대: 개발 능력의 희소성 급감
- AI로 누구나 코드 작성 가능
- **병목이 "개발"에서 "기획"으로 이동**

### 해결하려는 문제

| 문제             | 상세                                    |
| ---------------- | --------------------------------------- |
| 기획서 작성 시간 | 아이디어는 있지만 PRD 작성에 2-3일 소요 |
| 구조화 어려움    | 어떤 내용을 포함해야 할지 모름          |
| 기술 스택 선정   | 비개발자는 어떤 기술을 써야 할지 막막   |
| MVP 범위 설정    | 기능 우선순위 결정 어려움               |

### 목표 지표

- PRD 작성 시간: 2-3일 → **5분**
- 사용자 만족도: NPS 50+
- 6개월 내 MRR $10,000 달성

---

## 2. 타겟 유저

### Primary Persona: 바이브 코더

- **특징:** Claude, Cursor 등으로 앱 개발하는 비개발자 또는 입문자
- **Pain Point:** 코드는 AI가 짜주는데, 뭘 만들지 정리가 안 됨
- **Goal:** 아이디어를 구조화해서 AI에게 명확히 전달하고 싶음

### Secondary Persona: 인디 해커 / 솔로 메이커

- **특징:** 1인 개발로 SaaS, 앱 출시하는 개발자
- **Pain Point:** 기획에 시간 쓰기 싫음, 빨리 만들고 검증하고 싶음
- **Goal:** 빠르게 MVP 범위 정하고 개발 시작

### Tertiary Persona: 스타트업 PM

- **특징:** 기획 문서 작성이 본업
- **Pain Point:** 반복적인 PRD 템플릿 작성 지루함
- **Goal:** 초안 자동 생성 후 수정하는 방식으로 효율화

### Anti-Persona (타겟 아님)

- 대기업 PM (복잡한 내부 프로세스, 커스텀 템플릿 필요)
- 완전 비기술자 (앱/웹 개발 자체에 관심 없음)

---

## 3. 핵심 기능

### 3.1 MVP 기능 (P0 - Must Have)

#### 3.1.1 사용자 인증

- Google OAuth 로그인 (Supabase Auth)
- 이메일/비밀번호 로그인 (Magic Link)
- 로그인 없이 1회 체험 가능 (결과 저장 X)

#### 3.1.2 PRD 생성

- **Input:** 아이디어 텍스트 (1줄 ~ 500자)
- **Options:**
  - 기본 버전 (무료): 간략한 PRD
  - 상세 버전 (1 크레딧): 풀 PRD + 기술 스택 + 일정
- **Output:** 구조화된 PRD 문서

#### 3.1.3 PRD 템플릿

| 템플릿           | 용도           | 포함 내용                       |
| ---------------- | -------------- | ------------------------------- |
| SaaS             | 웹 서비스      | 가격 정책, 구독 모델            |
| Mobile App       | iOS/Android 앱 | 앱스토어 전략, 푸시 알림        |
| Marketplace      | 양면 플랫폼    | 공급자/수요자 분리, 수수료 모델 |
| Chrome Extension | 브라우저 확장  | 권한 설명, 스토어 등록          |
| AI Wrapper       | AI 기반 서비스 | API 비용 분석, 프롬프트 설계    |

#### 3.1.4 내보내기

- Markdown 복사
- PDF 다운로드 (1 크레딧)

#### 3.1.5 크레딧 시스템

- 가입 시 3 크레딧 무료 지급
- 크레딧 패키지 구매 (Lemon Squeezy)

#### 3.1.6 PRD 히스토리

- 생성한 PRD 목록 조회
- PRD 상세 보기
- PRD 삭제

### 3.2 Phase 2 기능 (P1 - Should Have)

#### 3.2.1 PRD 편집

- 생성된 PRD 섹션별 수정
- 섹션 추가/삭제
- AI 재생성 (특정 섹션만)

#### 3.2.2 경쟁 분석

- 유사 서비스 자동 검색 (Web Search)
- 경쟁사 기능/가격 비교표 생성

#### 3.2.3 추가 내보내기

- Notion 내보내기
- Linear 티켓 자동 생성
- Markdown 파일 다운로드

#### 3.2.4 버전 히스토리

- PRD 수정 이력 저장
- 이전 버전 복원

### 3.3 Phase 3 기능 (P2 - Nice to Have)

#### 3.3.1 팀 협업

- PRD 공유 링크 생성
- 코멘트 기능
- 팀 워크스페이스

#### 3.3.2 와이어프레임 생성

- PRD 기반 간단한 UI 스케치 생성
- Excalidraw 형식 내보내기

#### 3.3.3 사용자 스토리 생성

- PRD에서 유저 스토리 자동 추출
- Jira/Linear 형식 변환

---

## 4. 생성되는 PRD 구조

```markdown
# [제품명] PRD

## 1. 개요

- 한 줄 설명
- 해결하려는 문제
- 목표 지표 (성공 기준)

## 2. 타겟 유저

### Primary Persona

- 특징
- Pain Point
- Goal

### Secondary Persona

- 특징
- Pain Point
- Goal

### Anti-Persona

- 타겟이 아닌 유저 정의

## 3. 경쟁 분석

| 경쟁사 | 강점 | 약점 | 차별화 포인트 |
| ------ | ---- | ---- | ------------- |
| ...    | ...  | ...  | ...           |

## 4. 핵심 기능

### MVP (P0)

- 기능 1: 설명
- 기능 2: 설명
- ...

### Phase 2 (P1)

- 기능 1: 설명
- ...

### Phase 3 (P2)

- 기능 1: 설명
- ...

## 5. 유저 플로우

### 온보딩

1. 단계 1
2. 단계 2
   ...

### 핵심 루프

1. 단계 1
2. 단계 2
   ...

### 결제 전환

1. 단계 1
2. 단계 2
   ...

## 6. 기술 스택 추천

| 영역     | 기술 | 선택 이유 |
| -------- | ---- | --------- |
| Frontend | ...  | ...       |
| Backend  | ...  | ...       |
| Database | ...  | ...       |
| Hosting  | ...  | ...       |
| Payment  | ...  | ...       |

## 7. 데이터 모델

### 주요 엔티티

- Entity 1: 필드 목록
- Entity 2: 필드 목록
  ...

### ERD (텍스트)

Entity1 --< Entity2
Entity2 >-- Entity3

## 8. MVP 개발 일정

### Week 1

| Day | 작업 |
| --- | ---- |
| 1   | ...  |
| 2   | ...  |

...

### Week 2

| Day | 작업 |
| --- | ---- |
| 1   | ...  |
| 2   | ...  |

...

## 9. 수익 모델

### 가격 정책

| 플랜 | 가격  | 포함 내용 |
| ---- | ----- | --------- |
| Free | $0    | ...       |
| Pro  | $X/월 | ...       |

...

### 수익 시뮬레이션

| 지표   | 1개월 | 3개월 | 6개월 |
| ------ | ----- | ----- | ----- |
| 사용자 | ...   | ...   | ...   |
| 매출   | ...   | ...   | ...   |

## 10. 리스크 및 대응

| 리스크 | 가능성         | 영향도         | 대응 방안 |
| ------ | -------------- | -------------- | --------- |
| ...    | 높음/중간/낮음 | 높음/중간/낮음 | ...       |

## 11. 성공 지표

### 런칭 후 1개월

- 지표 1: 목표값
- 지표 2: 목표값

### 3개월

- 지표 1: 목표값
- 지표 2: 목표값

### 6개월

- 지표 1: 목표값
- 지표 2: 목표값
```

---

## 5. 유저 플로우

### 5.1 온보딩

```
┌─────────────────────────────────────────────────┐
│  Landing Page                                   │
│                                                 │
│  "아이디어 한 줄로 PRD 자동 생성"              │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 아이디어를 입력하세요...                │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [무료로 시작하기] ← 로그인 없이 1회 체험       │
│  [Google로 로그인]                              │
│                                                 │
└─────────────────────────────────────────────────┘
           │
           ▼ (체험 또는 로그인)
┌─────────────────────────────────────────────────┐
│  PRD 생성 완료                                  │
│                                                 │
│  [회원가입하고 저장하기] ← 체험 유저           │
│  [대시보드로 이동] ← 로그인 유저               │
└─────────────────────────────────────────────────┘
```

### 5.2 핵심 루프 (PRD 생성)

```
Dashboard
    │
    ▼
[새 PRD 만들기]
    │
    ▼
┌─────────────────────────────────────────────────┐
│  아이디어 입력                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ "PT 트레이너가 고객 체중을 관리하는    │    │
│  │  SaaS 서비스"                           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  템플릿 선택:                                   │
│  [SaaS] [Mobile App] [Marketplace] ...         │
│                                                 │
│  생성 옵션:                                     │
│  ○ 기본 (무료)   ● 상세 (1 크레딧)            │
│                                                 │
│  [PRD 생성하기 →]                               │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│  생성 중... (10-20초)                          │
│                                                 │
│  ████████████░░░░░░░░░░ 60%                     │
│                                                 │
│  ✓ 문제 정의 완료                              │
│  ✓ 타겟 유저 분석 완료                         │
│  → 기능 설계 중...                              │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│  PRD 생성 완료                                  │
│                                                 │
│  [목차]              [본문]                     │
│  1. 개요            │ # FitClient PRD          │
│  2. 타겟 유저       │                          │
│  3. 경쟁 분석       │ ## 1. 개요               │
│  4. 핵심 기능       │ PT 트레이너가 고객의...  │
│  5. 유저 플로우     │                          │
│  ...                │ ...                       │
│                                                 │
│  [복사] [PDF 다운로드] [히스토리에 저장]       │
└─────────────────────────────────────────────────┘
```

### 5.3 결제 전환

```
크레딧 부족 시:
┌─────────────────────────────────────────────────┐
│  🪙 크레딧이 부족합니다                         │
│                                                 │
│  현재 보유: 0 크레딧                            │
│  필요: 1 크레딧                                 │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  ⭐ Basic Pack (인기)                   │    │
│  │  15 크레딧 - $9.99                      │    │
│  │  개당 $0.67 (33% 할인)                  │    │
│  │  [구매하기]                             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  다른 패키지:                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Starter  │ │ Pro      │ │ Business │        │
│  │ 5 크레딧 │ │ 50 크레딧│ │ 200크레딧│        │
│  │ $4.99    │ │ $24.99   │ │ $79.99   │        │
│  │ $1.00/개 │ │ $0.50/개 │ │ $0.40/개 │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
    │
    ▼ (Lemon Squeezy Checkout)
┌─────────────────────────────────────────────────┐
│  Lemon Squeezy 결제 페이지                     │
│  (Overlay 또는 새 탭)                          │
└─────────────────────────────────────────────────┘
    │
    ▼ (결제 완료)
┌─────────────────────────────────────────────────┐
│  ✓ 결제 완료                                   │
│                                                 │
│  15 크레딧이 추가되었습니다.                   │
│  현재 보유: 15 크레딧                          │
│                                                 │
│  [PRD 생성으로 돌아가기]                       │
└─────────────────────────────────────────────────┘
```

---

## 6. 기술 스택

### 6.1 Frontend

| 기술            | 버전            | 용도                 |
| --------------- | --------------- | -------------------- |
| Next.js         | 15 (App Router) | 프레임워크           |
| React           | 19              | UI 라이브러리        |
| TypeScript      | 5.x             | 타입 안정성          |
| Tailwind CSS    | 4.x             | 스타일링             |
| shadcn/ui       | latest          | UI 컴포넌트          |
| TanStack Query  | 5.x             | 서버 상태 관리       |
| Zustand         | 5.x             | 클라이언트 상태 관리 |
| React Hook Form | 7.x             | 폼 관리              |
| Zod             | 3.x             | 스키마 검증          |
| react-markdown  | latest          | Markdown 렌더링      |

### 6.2 Backend

| 기술               | 용도               |
| ------------------ | ------------------ |
| Next.js API Routes | API 엔드포인트     |
| Supabase Client    | 서버사이드 DB 접근 |

### 6.3 Database & Auth

| 기술                | 용도                       |
| ------------------- | -------------------------- |
| Supabase PostgreSQL | 메인 데이터베이스          |
| Supabase Auth       | 사용자 인증 (Google OAuth) |
| Supabase RLS        | Row Level Security         |

### 6.4 AI & External Services

| 기술                 | 용도      |
| -------------------- | --------- |
| Anthropic Claude API | PRD 생성  |
| Lemon Squeezy        | 결제 처리 |

### 6.5 Infrastructure

| 기술             | 용도                    |
| ---------------- | ----------------------- |
| Vercel           | 호스팅 + Edge Functions |
| Vercel Analytics | 웹 분석                 |

### 6.6 Development Tools

| 기술     | 용도        |
| -------- | ----------- |
| ESLint   | 코드 린팅   |
| Prettier | 코드 포맷팅 |
| Husky    | Git hooks   |

---

## 7. 데이터 모델

### 7.1 Supabase PostgreSQL 스키마

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users 테이블 (Supabase Auth와 연동)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  credits INTEGER DEFAULT 3 NOT NULL,
  free_credits_used INTEGER DEFAULT 0 NOT NULL,
  total_credits_used INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- PRDs 테이블
CREATE TABLE public.prds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  idea TEXT NOT NULL,
  template TEXT NOT NULL CHECK (template IN ('saas', 'mobile', 'marketplace', 'extension', 'ai-wrapper')),
  type TEXT NOT NULL CHECK (type IN ('basic', 'detailed')),
  content TEXT NOT NULL,
  credit_used INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Purchases 테이블
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'completed' NOT NULL CHECK (status IN ('completed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Usage Logs 테이블
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('generate_prd', 'download_pdf')),
  credits_used INTEGER DEFAULT 0 NOT NULL,
  prd_id UUID REFERENCES public.prds(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_prds_user_id ON public.prds(user_id);
CREATE INDEX idx_prds_created_at ON public.prds(created_at DESC);
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_usage_logs_user_id ON public.usage_logs(user_id);

-- Updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER prds_updated_at
  BEFORE UPDATE ON public.prds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users
CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies: PRDs
CREATE POLICY "Users can view own PRDs"
  ON public.prds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own PRDs"
  ON public.prds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own PRDs"
  ON public.prds FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies: Purchases
CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies: Usage Logs
CREATE POLICY "Users can view own logs"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- 신규 유저 자동 생성 트리거 (Supabase Auth 연동)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, photo_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 7.2 TypeScript 타입 정의

```typescript
// types/database.ts
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          photo_url: string | null;
          credits: number;
          free_credits_used: number;
          total_credits_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          photo_url?: string | null;
          credits?: number;
          free_credits_used?: number;
          total_credits_used?: number;
        };
        Update: {
          display_name?: string | null;
          photo_url?: string | null;
          credits?: number;
          free_credits_used?: number;
          total_credits_used?: number;
        };
      };
      prds: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          idea: string;
          template: PRDTemplate;
          type: PRDType;
          content: string;
          credit_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          idea: string;
          template: PRDTemplate;
          type: PRDType;
          content: string;
          credit_used?: number;
        };
        Update: {
          title?: string;
          content?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          order_id: string;
          product_name: string;
          credits: number;
          amount: number;
          status: PurchaseStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          order_id: string;
          product_name: string;
          credits: number;
          amount: number;
          status?: PurchaseStatus;
        };
        Update: {
          status?: PurchaseStatus;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          action: UsageAction;
          credits_used: number;
          prd_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: UsageAction;
          credits_used?: number;
          prd_id?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: never;
      };
    };
  };
};

// types/prd.ts
export type PRDTemplate =
  | 'saas'
  | 'mobile'
  | 'marketplace'
  | 'extension'
  | 'ai-wrapper';
export type PRDType = 'basic' | 'detailed';
export type PurchaseStatus = 'completed' | 'refunded';
export type UsageAction = 'generate_prd' | 'download_pdf';

export type User = Database['public']['Tables']['users']['Row'];
export type PRD = Database['public']['Tables']['prds']['Row'];
export type Purchase = Database['public']['Tables']['purchases']['Row'];
export type UsageLog = Database['public']['Tables']['usage_logs']['Row'];

// types/credit.ts
export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  discount: number;
  popular: boolean;
  lemonsqueezyVariantId: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 5,
    price: 4.99,
    pricePerCredit: 1.0,
    discount: 0,
    popular: false,
    lemonsqueezyVariantId: 'xxx',
  },
  {
    id: 'basic',
    name: 'Basic Pack',
    credits: 15,
    price: 9.99,
    pricePerCredit: 0.67,
    discount: 33,
    popular: true,
    lemonsqueezyVariantId: 'xxx',
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 50,
    price: 24.99,
    pricePerCredit: 0.5,
    discount: 50,
    popular: false,
    lemonsqueezyVariantId: 'xxx',
  },
  {
    id: 'business',
    name: 'Business Pack',
    credits: 200,
    price: 79.99,
    pricePerCredit: 0.4,
    discount: 60,
    popular: false,
    lemonsqueezyVariantId: 'xxx',
  },
];
```

---

## 8. API 설계

### 8.1 API 엔드포인트

```
/api/
├── prd/
│   ├── generate/
│   │   └── route.ts          # POST: PRD 생성
│   ├── [id]/
│   │   └── route.ts          # GET: PRD 조회, DELETE: PRD 삭제
│   └── list/
│       └── route.ts          # GET: PRD 목록
│
├── user/
│   ├── credits/
│   │   └── route.ts          # GET: 크레딧 조회
│   └── profile/
│       └── route.ts          # GET: 프로필 조회
│
├── export/
│   └── pdf/
│       └── route.ts          # POST: PDF 생성 (1 크레딧)
│
└── webhooks/
    └── lemonsqueezy/
        └── route.ts          # POST: 결제 완료 webhook
```

> **Note:** 인증은 Supabase Auth를 사용하므로 별도 auth API 불필요.
> 미들웨어에서 세션 검증 처리.

### 8.2 API 상세 스펙

#### POST /api/prd/generate

PRD 생성 요청

**Request:**

```typescript
interface GeneratePRDRequest {
  idea: string; // 1-500자
  template: PRDTemplate; // 'saas' | 'mobile' | ...
  type: PRDType; // 'basic' | 'detailed'
}
```

**Response:**

```typescript
interface GeneratePRDResponse {
  success: boolean;
  prd: PRD | null;
  creditsRemaining: number;
  error?: string;
}
```

**비즈니스 로직:**

1. 사용자 인증 확인
2. 크레딧 확인 (detailed인 경우 1 크레딧 필요)
3. Claude API 호출
4. PRD 저장
5. 크레딧 차감
6. 사용 로그 기록

#### GET /api/prd/list

사용자의 PRD 목록 조회

**Query Parameters:**

```typescript
interface ListPRDParams {
  limit?: number; // default: 20, max: 100
  cursor?: string; // 페이지네이션용
}
```

**Response:**

```typescript
interface ListPRDResponse {
  prds: PRD[];
  nextCursor: string | null;
}
```

#### POST /api/webhooks/lemonsqueezy

Lemon Squeezy 결제 완료 webhook

**Request (from Lemon Squeezy):**

```typescript
interface LemonSqueezyWebhook {
  meta: {
    event_name: 'order_created' | 'order_refunded';
    custom_data: {
      uid: string;
    };
  };
  data: {
    attributes: {
      user_email: string;
      first_order_item: {
        product_name: string;
        price: number;
      };
      order_number: string;
    };
  };
}
```

**처리 로직:**

1. Webhook 서명 검증
2. order_created: 크레딧 추가, purchase 기록
3. order_refunded: 크레딧 차감, status 변경

---

## 9. 프로젝트 구조

```
ideatoprd/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── callback/
│   │   │   └── route.ts           # Supabase OAuth 콜백
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx           # PRD 목록
│   │   ├── generate/
│   │   │   └── page.tsx           # PRD 생성
│   │   ├── prd/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # PRD 상세
│   │   ├── credits/
│   │   │   └── page.tsx           # 크레딧 구매
│   │   └── layout.tsx             # 대시보드 레이아웃
│   │
│   ├── (marketing)/
│   │   ├── page.tsx               # 랜딩 페이지
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   ├── prd/
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── list/
│   │   │       └── route.ts
│   │   ├── user/
│   │   │   ├── credits/
│   │   │   │   └── route.ts
│   │   │   └── profile/
│   │   │       └── route.ts
│   │   ├── export/
│   │   │   └── pdf/
│   │   │       └── route.ts
│   │   └── webhooks/
│   │       └── lemonsqueezy/
│   │           └── route.ts
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                        # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── mobile-nav.tsx
│   │
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── google-button.tsx
│   │   └── auth-guard.tsx
│   │
│   ├── prd/
│   │   ├── idea-input.tsx
│   │   ├── template-selector.tsx
│   │   ├── type-selector.tsx
│   │   ├── generate-button.tsx
│   │   ├── prd-viewer.tsx
│   │   ├── prd-card.tsx
│   │   └── prd-list.tsx
│   │
│   ├── credits/
│   │   ├── credit-badge.tsx
│   │   ├── credit-packages.tsx
│   │   ├── purchase-dialog.tsx
│   │   └── insufficient-credits-dialog.tsx
│   │
│   └── landing/
│       ├── hero.tsx
│       ├── features.tsx
│       ├── pricing-table.tsx
│       ├── testimonials.tsx
│       └── cta.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Supabase 브라우저 클라이언트
│   │   ├── server.ts              # Supabase 서버 클라이언트
│   │   ├── middleware.ts          # Auth 미들웨어 헬퍼
│   │   └── types.ts               # Database 타입 re-export
│   │
│   ├── ai/
│   │   ├── claude.ts              # Claude API 클라이언트
│   │   └── prompts/
│   │       ├── base.ts            # 기본 시스템 프롬프트
│   │       ├── saas.ts            # SaaS 템플릿 프롬프트
│   │       ├── mobile.ts          # Mobile 템플릿 프롬프트
│   │       └── ...
│   │
│   ├── lemonsqueezy/
│   │   ├── client.ts              # Lemon Squeezy SDK
│   │   └── webhook.ts             # Webhook 검증
│   │
│   ├── utils/
│   │   ├── cn.ts                  # className 유틸
│   │   ├── date.ts                # 날짜 포맷
│   │   └── markdown.ts            # Markdown 처리
│   │
│   └── constants/
│       ├── credits.ts             # 크레딧 패키지 정의
│       └── templates.ts           # PRD 템플릿 정의
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-credits.ts
│   ├── use-prd.ts
│   └── use-generate-prd.ts
│
├── stores/
│   └── ui-store.ts                # Zustand UI 상태
│
├── types/
│   ├── user.ts
│   ├── prd.ts
│   ├── purchase.ts
│   └── api.ts
│
├── public/
│   ├── logo.svg
│   ├── og-image.png
│   └── ...
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 10. 환경 변수

```bash
# .env.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=xxx
LEMONSQUEEZY_STORE_ID=xxx
LEMONSQUEEZY_WEBHOOK_SECRET=xxx
```

---

## 11. MVP 개발 일정

### Week 1: 기반 구축 + 핵심 기능

| Day | 작업               | 상세                                                 |
| --- | ------------------ | ---------------------------------------------------- |
| 1   | 프로젝트 초기 설정 | Next.js 15, Tailwind, shadcn/ui 설치, 폴더 구조 생성 |
| 2   | Supabase 연동      | 프로젝트 생성, DB 스키마, RLS 설정, 환경변수 구성    |
| 3   | 인증 구현          | Supabase Auth + Google OAuth + 미들웨어 설정         |
| 4   | PRD 생성 API       | Claude API 연동, 프롬프트 작성, /api/prd/generate    |
| 5   | PRD 생성 UI        | 아이디어 입력, 템플릿 선택, 생성 버튼, 로딩 상태     |
| 6   | PRD 뷰어           | Markdown 렌더링, 복사 기능                           |
| 7   | PRD 히스토리       | 목록 조회, 상세 보기                                 |

### Week 2: 결제 + 마무리

| Day | 작업               | 상세                            |
| --- | ------------------ | ------------------------------- |
| 8   | 크레딧 시스템      | 크레딧 조회, 차감 로직, UI 표시 |
| 9   | Lemon Squeezy 연동 | 상품 등록, Checkout 연동        |
| 10  | Webhook 처리       | 결제 완료 시 크레딧 추가        |
| 11  | 랜딩 페이지        | Hero, Features, Pricing, CTA    |
| 12  | SEO + OG 이미지    | 메타태그, sitemap, robots.txt   |
| 13  | 테스트 + 버그 수정 | E2E 시나리오 테스트             |
| 14  | 배포 + 런칭        | Vercel 배포, 도메인 연결        |

---

## 12. 비용 분석

### 12.1 고정 비용 (월)

| 항목     | 비용       | 비고                                |
| -------- | ---------- | ----------------------------------- |
| Vercel   | $0         | Hobby 플랜 (초기)                   |
| Supabase | $0         | Free 플랜 (초기, 500MB DB, 50K MAU) |
| 도메인   | ~$1        | 연 $12                              |
| **합계** | **~$1/월** |                                     |

### 12.2 변동 비용

| 항목          | 단가          | 비고                      |
| ------------- | ------------- | ------------------------- |
| Claude API    | ~$0.01/PRD    | 3K input + 4K output 기준 |
| Lemon Squeezy | 5% + $0.50/건 | 결제 수수료               |

### 12.3 손익 분석

**PRD 1개당:**

- 판매가 (평균): $0.67 (Basic Pack 기준)
- API 비용: $0.01
- **순이익: $0.66 (98% 마진)**

**월간 시뮬레이션 (3개월 후):**
| 항목 | 수량/금액 |
|-----|----------|
| 가입자 | 3,000명 |
| 유료 전환 | 7% = 210명 |
| 평균 구매액 | $12 |
| 총 매출 | $2,520 |
| API 비용 | ~$50 |
| 결제 수수료 | ~$230 |
| **순이익** | **~$2,240** |

---

## 13. 리스크 및 대응

| 리스크               | 가능성 | 영향도 | 대응 방안                 |
| -------------------- | ------ | ------ | ------------------------- |
| Claude API 장애      | 낮음   | 높음   | 재시도 로직, 에러 핸들링  |
| Claude API 비용 급증 | 중간   | 중간   | 응답 길이 제한, 캐싱      |
| 경쟁 서비스 등장     | 높음   | 중간   | 빠른 실행, 기능 차별화    |
| 낮은 전환율          | 중간   | 높음   | A/B 테스트, 온보딩 개선   |
| Lemon Squeezy 장애   | 낮음   | 중간   | 수동 크레딧 부여 프로세스 |

---

## 14. 성공 지표 (KPI)

### 런칭 후 1개월

| 지표        | 목표    |
| ----------- | ------- |
| 가입자 수   | 500명   |
| PRD 생성 수 | 1,000개 |
| 유료 전환율 | 5%      |
| MRR         | $250    |
| NPS         | 40+     |

### 3개월

| 지표        | 목표     |
| ----------- | -------- |
| 가입자 수   | 5,000명  |
| PRD 생성 수 | 15,000개 |
| 유료 전환율 | 7%       |
| MRR         | $2,000   |
| NPS         | 50+      |

### 6개월

| 지표        | 목표      |
| ----------- | --------- |
| 가입자 수   | 25,000명  |
| PRD 생성 수 | 100,000개 |
| 유료 전환율 | 10%       |
| MRR         | $10,000   |
| NPS         | 60+       |

---

## 15. 마케팅 계획

### 15.1 런칭 채널

| 채널         | 방법                      | 예상 효과           |
| ------------ | ------------------------- | ------------------- |
| Product Hunt | 런칭 포스팅               | 초기 트래픽 폭발    |
| Hacker News  | Show HN 포스팅            | 개발자 유입         |
| Reddit       | r/SideProject, r/startups | 타겟 유저 직접 도달 |
| Twitter/X    | #buildinpublic 해시태그   | 바이럴 가능성       |
| 디스코드     | 인디해커 커뮤니티         | 초기 피드백         |

### 15.2 콘텐츠 마케팅

| 콘텐츠                    | 채널           | 목적        |
| ------------------------- | -------------- | ----------- |
| "바이브 코딩 시대의 기획" | 블로그         | SEO         |
| PRD 작성법 가이드         | 블로그         | SEO         |
| 사용자 성공 사례          | Twitter/블로그 | 신뢰도      |
| 주간 업데이트             | Twitter        | 팔로워 유지 |

### 15.3 SEO 키워드

| 키워드                        | 검색량 (추정) | 경쟁도 |
| ----------------------------- | ------------- | ------ |
| PRD template                  | 높음          | 중간   |
| product requirements document | 높음          | 높음   |
| PRD generator                 | 낮음          | 낮음   |
| AI PRD                        | 낮음          | 낮음   |
| vibe coding                   | 급상승        | 낮음   |

---

## 부록: Claude 프롬프트 예시

### 시스템 프롬프트 (SaaS 템플릿)

```
You are an expert product manager and startup advisor. Your task is to generate a comprehensive PRD (Product Requirements Document) based on a user's product idea.

## Output Format
Generate a PRD in Markdown format with the following sections:
1. Overview (one-liner, problem, success metrics)
2. Target Users (primary, secondary, anti-persona)
3. Competitive Analysis (table format)
4. Core Features (MVP P0, Phase 2 P1, Phase 3 P2)
5. User Flows (onboarding, core loop, conversion)
6. Tech Stack Recommendations (with reasoning)
7. Data Model (entities and relationships)
8. MVP Timeline (2-week plan)
9. Revenue Model (pricing tiers, projections)
10. Risks and Mitigations
11. Success Metrics (1mo, 3mo, 6mo)

## Guidelines
- Be specific and actionable, not generic
- Provide concrete examples and numbers
- Consider the solo developer / small team context
- Recommend modern, cost-effective tech stack
- Focus on rapid validation and iteration
- Write in English

## Template: SaaS
This is a web-based SaaS product. Consider:
- Subscription pricing models
- User onboarding optimization
- Churn reduction strategies
- B2B vs B2C positioning
```

### 유저 프롬프트 예시

```
Product Idea: A service that helps PT trainers manage their clients' weight tracking and progress

Please generate a detailed PRD for this idea.
```

---

**문서 버전:** 1.0  
**최종 수정:** 2026-01-14  
**작성자:** Claude
