# Phase 4: Database - Research

**Researched:** 2026-01-15
**Domain:** Supabase PostgreSQL + Row Level Security + TypeScript Types
**Confidence:** HIGH

<research_summary>
## Summary

Supabase PostgreSQL 데이터베이스 스키마 설계, Row Level Security (RLS) 정책, TypeScript 타입 자동 생성에 대해 리서치했습니다. 핵심은 RLS를 **모든 테이블에 반드시 활성화**하고, 성능 최적화를 위해 `(select auth.uid())` 패턴과 인덱스를 사용하는 것입니다.

2025년 CVE-2025-48757로 170+ 앱에서 RLS 누락으로 데이터 노출 사고가 발생했습니다. RLS는 opt-in이므로 의도적으로 활성화해야 합니다. Views는 기본적으로 RLS를 우회하며, INSERT 작업에도 SELECT 정책이 필요합니다.

**Primary recommendation:** 모든 테이블에 RLS 활성화 + `user_id` 컬럼 인덱스 + `(select auth.uid())` 패턴 사용. TypeScript 타입은 `supabase gen types`로 자동 생성.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | 2.58.0 | Supabase 클라이언트 | 공식 라이브러리, 타입 지원 |
| @supabase/ssr | latest | SSR 프레임워크 지원 | Next.js App Router 통합 |
| supabase CLI | latest | 마이그레이션, 타입 생성 | 공식 개발 도구 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| pg | latest | PostgreSQL 드라이버 | Edge Functions에서 직접 쿼리 시 |
| postgres.js | latest | Modern PostgreSQL 클라이언트 | 복잡한 트랜잭션 필요 시 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Supabase RLS | Custom middleware auth | RLS가 DB 레벨 보안으로 더 안전 |
| supabase gen types | Manual types | 자동 생성이 스키마 동기화 보장 |
| SQL migrations | GUI changes | migrations가 버전 관리 가능 |

**Installation:**
```bash
# 이미 Phase 3에서 설치됨
npm install @supabase/supabase-js @supabase/ssr

# CLI (전역 설치)
npm install -g supabase
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── shared/
│   └── lib/
│       └── supabase/
│           ├── client.ts         # 브라우저 클라이언트
│           ├── server.ts         # 서버 클라이언트
│           └── admin.ts          # Service Role 클라이언트 (신중히)
├── entities/
│   └── database.types.ts         # 자동 생성된 타입
supabase/
├── migrations/                   # SQL 마이그레이션 파일
│   ├── 20260115000000_create_profiles.sql
│   ├── 20260115000001_create_prds.sql
│   └── ...
├── seed.sql                      # 개발용 시드 데이터
└── config.toml                   # 로컬 개발 설정
```

### Pattern 1: Profiles 테이블 with 자동 생성 트리거
**What:** auth.users 회원가입 시 profiles 자동 생성
**When to use:** 모든 사용자 프로필이 필요한 SaaS
**Example:**
```sql
-- Source: Supabase official docs
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  credits integer default 0 not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- 자동 프로필 생성 트리거
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Pattern 2: RLS 정책 with 성능 최적화
**What:** SELECT로 함수 감싸서 캐싱 + 인덱스
**When to use:** 모든 RLS 정책
**Example:**
```sql
-- Source: Supabase docs - RLS Performance
-- 1. 정책 생성 (SELECT로 함수 감싸기)
create policy "Users can view own profile"
on profiles for select
to authenticated
using ( (select auth.uid()) = id );

create policy "Users can update own profile"
on profiles for update
to authenticated
using ( (select auth.uid()) = id )
with check ( (select auth.uid()) = id );

-- 2. 인덱스 생성 (user_id 컬럼이 있는 테이블)
create index idx_prds_user_id on prds using btree (user_id);
```

### Pattern 3: Credits 트랜잭션 패턴
**What:** 크레딧 차감/충전을 원자적으로 처리
**When to use:** 결제, 크레딧 시스템
**Example:**
```sql
-- Source: PostgreSQL transaction pattern
create or replace function public.deduct_credit(
  p_user_id uuid,
  p_amount integer,
  p_reason text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_credits integer;
begin
  -- 현재 크레딧 조회 (FOR UPDATE로 락)
  select credits into v_current_credits
  from public.profiles
  where id = p_user_id
  for update;

  if v_current_credits < p_amount then
    return false;
  end if;

  -- 크레딧 차감
  update public.profiles
  set credits = credits - p_amount,
      updated_at = now()
  where id = p_user_id;

  -- 사용 로그 기록
  insert into public.usage_logs (user_id, amount, reason)
  values (p_user_id, -p_amount, p_reason);

  return true;
end;
$$;
```

### Anti-Patterns to Avoid
- **RLS 없이 테이블 생성:** 모든 테이블에 RLS 활성화 필수
- **service_role 키 클라이언트 노출:** 서버 사이드에서만 사용
- **user_metadata JWT claim 사용:** 사용자가 수정 가능하므로 RLS에 사용 금지
- **Views 기본 사용:** Postgres 15+에서 `security_invoker = true` 필요
- **INSERT만 정책 생성:** INSERT 시에도 SELECT 정책 필요 (반환값 조회용)
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 타입 정의 | 수동 타입 작성 | `supabase gen types` | 스키마 변경 시 자동 동기화 |
| 인증 체크 | 커스텀 auth 미들웨어 | RLS 정책 | DB 레벨 보안이 더 안전 |
| 프로필 생성 | API 엔드포인트 | 트리거 함수 | 회원가입 직후 자동 실행 보장 |
| 크레딧 차감 | 개별 UPDATE 쿼리 | Database function | 트랜잭션 + 락으로 동시성 문제 해결 |
| 마이그레이션 | GUI로 수동 변경 | SQL 파일 + supabase CLI | 버전 관리, 롤백 가능 |

**Key insight:** Supabase는 PostgreSQL의 강력한 기능(트리거, 함수, RLS)을 활용하도록 설계됨. 애플리케이션 레벨에서 처리하면 보안 구멍이 생기고 동시성 문제 발생.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: RLS 누락 (CVE-2025-48757)
**What goes wrong:** 170+ 앱에서 데이터 노출 사고
**Why it happens:** RLS가 opt-in이고, 개발 중 비활성화 후 잊음
**How to avoid:**
- 테이블 생성 즉시 `alter table X enable row level security` 실행
- Supabase Dashboard Security Advisor 정기 확인
**Warning signs:** API로 다른 사용자 데이터 조회 가능

### Pitfall 2: INSERT 시 SELECT 정책 누락
**What goes wrong:** "new row violates policy" 에러
**Why it happens:** PostgreSQL이 INSERT 후 반환값 조회 시 SELECT 정책 필요
**How to avoid:** INSERT 정책 생성 시 SELECT 정책도 함께 생성
**Warning signs:** INSERT는 되는데 반환값이 안 오는 경우

### Pitfall 3: Views가 RLS 우회
**What goes wrong:** View 통해 모든 데이터 노출
**Why it happens:** Views는 postgres 사용자로 생성되어 security definer 적용
**How to avoid:**
```sql
-- Postgres 15+ 에서만 가능
create view my_view with (security_invoker = true) as ...
```
**Warning signs:** View 쿼리 결과가 예상보다 많은 행 반환

### Pitfall 4: user_metadata JWT claim 사용
**What goes wrong:** 사용자가 자신의 권한 조작 가능
**Why it happens:** user_metadata는 클라이언트에서 수정 가능
**How to avoid:** RLS에서 `auth.uid()`만 사용, role/permission은 별도 테이블
**Warning signs:** 비정상적인 권한 상승 요청

### Pitfall 5: RLS 성능 저하
**What goes wrong:** 쿼리가 매우 느려짐
**Why it happens:** `auth.uid()`가 행마다 호출, 인덱스 없음
**How to avoid:**
- `(select auth.uid()) = user_id` 패턴 사용
- `user_id` 컬럼에 B-tree 인덱스
**Warning signs:** EXPLAIN ANALYZE에서 Seq Scan, 높은 rows 수

### Pitfall 6: UPDATE 정책 불완전
**What goes wrong:** UPDATE가 실패하거나 잘못된 데이터 허용
**Why it happens:** USING만 있고 WITH CHECK 없음
**How to avoid:** UPDATE 정책에 USING + WITH CHECK 둘 다 사용
```sql
create policy "Users can update own data"
on table_name for update
using ( (select auth.uid()) = user_id )      -- 기존 행 소유권
with check ( (select auth.uid()) = user_id ); -- 변경 후 유효성
```
**Warning signs:** user_id 변경으로 데이터 탈취 시도 가능
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### TypeScript 타입 생성 및 사용
```bash
# Source: Supabase CLI docs
supabase gen types typescript --linked > src/entities/database.types.ts
```

```typescript
// Source: Supabase docs
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/entities/database.types'

// 타입 안전한 클라이언트
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Row 타입 추출
type Profile = Database['public']['Tables']['profiles']['Row']
type PRD = Database['public']['Tables']['prds']['Row']

// 타입 안전한 쿼리
const { data, error } = await supabase
  .from('profiles')
  .select('id, email, credits')
  .single()
// data는 자동으로 { id: string, email: string, credits: number } | null
```

### 마이그레이션 생성 및 적용
```bash
# Source: Supabase CLI docs
# 새 마이그레이션 생성
supabase migration new create_profiles_table

# 로컬 DB에 적용
supabase migration up

# 원격 DB에서 스키마 가져오기
supabase db pull

# 타입 재생성
supabase gen types typescript --linked > src/entities/database.types.ts
```

### RLS 정책 템플릿 (profiles)
```sql
-- Source: Supabase docs - RLS
-- SELECT: 자신의 프로필만 조회
create policy "Users can view own profile"
on profiles for select
to authenticated
using ( (select auth.uid()) = id );

-- INSERT: 불필요 (트리거가 자동 생성)

-- UPDATE: 자신의 프로필만 수정
create policy "Users can update own profile"
on profiles for update
to authenticated
using ( (select auth.uid()) = id )
with check ( (select auth.uid()) = id );

-- DELETE: 비허용 (auth.users 삭제 시 cascade)
```

### RLS 정책 템플릿 (prds)
```sql
-- Source: Supabase docs - RLS
-- SELECT: 자신의 PRD만 조회
create policy "Users can view own PRDs"
on prds for select
to authenticated
using ( (select auth.uid()) = user_id );

-- INSERT: 자신의 PRD만 생성
create policy "Users can create own PRDs"
on prds for insert
to authenticated
with check ( (select auth.uid()) = user_id );

-- UPDATE: 자신의 PRD만 수정
create policy "Users can update own PRDs"
on prds for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

-- DELETE: 자신의 PRD만 삭제
create policy "Users can delete own PRDs"
on prds for delete
to authenticated
using ( (select auth.uid()) = user_id );

-- 인덱스
create index idx_prds_user_id on prds using btree (user_id);
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual type definitions | `supabase gen types` | 2023+ | 스키마 동기화 자동화 |
| Views default behavior | `security_invoker = true` | Postgres 15 | Views도 RLS 적용 가능 |
| Direct auth.uid() calls | `(select auth.uid())` | 2024+ | 함수 결과 캐싱으로 성능 향상 |
| GUI 스키마 변경 | SQL migrations | Best practice | 버전 관리, 협업 가능 |

**New tools/patterns to consider:**
- **Supabase Dashboard Security Advisor:** RLS 누락 자동 감지
- **Supabase Dashboard Performance Advisor:** 인덱스 누락 감지
- **pgTap:** PostgreSQL 테스트 프레임워크 (RLS 정책 테스트)

**Deprecated/outdated:**
- **service_role 클라이언트 사이드 사용:** 절대 금지 (god mode 우회)
- **user_metadata 기반 RLS:** 보안 취약점 (사용자 수정 가능)
</sota_updates>

<open_questions>
## Open Questions

1. **크레딧 음수 방지**
   - What we know: PostgreSQL CHECK constraint 또는 함수 내 검증
   - What's unclear: 동시 요청 시 race condition 완전 방지 여부
   - Recommendation: `FOR UPDATE` 락 + CHECK constraint 병행

2. **PRD 데이터 구조**
   - What we know: JSONB로 유연한 스키마 가능
   - What's unclear: 템플릿별 PRD 구조가 다를 때 타입 안전성
   - Recommendation: JSONB + TypeScript discriminated union 타입
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [/websites/supabase](https://supabase.com/docs) - RLS, 타입 생성, 스키마 설계
- [/supabase/cli](https://github.com/supabase/cli) - 마이그레이션, 타입 생성 CLI
- [/supabase/supabase-js](https://github.com/supabase/supabase-js) - 클라이언트 라이브러리
- [/razikus/supabase-nextjs-template](https://github.com/razikus/supabase-nextjs-template) - SaaS RLS 패턴

### Secondary (MEDIUM confidence)
- [Supabase Best Practices](https://www.leanware.co/insights/supabase-best-practices) - 보안, 스케일링 가이드
- [RLS Misconfigurations](https://prosperasoft.com/blog/database/supabase/supabase-rls-issues/) - 일반적인 RLS 실수
- [CVE-2025-48757](https://byteiota.com/supabase-security-flaw-170-apps-exposed-by-missing-rls/) - 170+ 앱 RLS 누락 사고

### Tertiary (LOW confidence - needs validation)
- None - 모든 주요 발견 사항 검증됨
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Supabase PostgreSQL, Row Level Security
- Ecosystem: supabase-js, supabase CLI, @supabase/ssr
- Patterns: RLS 정책, 트리거, 마이그레이션, 타입 생성
- Pitfalls: RLS 누락, 성능, Views 우회, JWT claim 오용

**Confidence breakdown:**
- Standard stack: HIGH - Context7 공식 문서 확인
- Architecture: HIGH - Supabase 공식 예제 기반
- Pitfalls: HIGH - CVE 및 공식 문서 경고 확인
- Code examples: HIGH - Context7/공식 문서 출처

**Research date:** 2026-01-15
**Valid until:** 2026-02-15 (30 days - Supabase 안정적)
</metadata>

---

*Phase: 04-database*
*Research completed: 2026-01-15*
*Ready for planning: yes*
