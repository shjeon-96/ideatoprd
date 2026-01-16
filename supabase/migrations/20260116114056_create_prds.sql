-- PRD 템플릿 타입
create type public.prd_template as enum (
  'saas',
  'mobile',
  'marketplace',
  'extension',
  'ai_wrapper'
);

-- PRD 버전 타입
create type public.prd_version as enum (
  'basic',
  'detailed'
);

-- prds 테이블
create table public.prds (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,

  -- 입력
  idea text not null,
  template public.prd_template not null default 'saas',
  version public.prd_version not null default 'basic',

  -- 출력
  title text,
  content jsonb,  -- PRD 구조화된 컨텐츠

  -- 메타데이터
  credits_used integer not null default 1,
  generation_time_ms integer,  -- 생성 소요 시간

  -- 타임스탬프
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS 활성화
alter table public.prds enable row level security;

-- RLS 정책
create policy "Users can view own PRDs"
on public.prds for select
to authenticated
using ( (select auth.uid()) = user_id );

create policy "Users can create own PRDs"
on public.prds for insert
to authenticated
with check ( (select auth.uid()) = user_id );

create policy "Users can update own PRDs"
on public.prds for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

create policy "Users can delete own PRDs"
on public.prds for delete
to authenticated
using ( (select auth.uid()) = user_id );

-- 성능 인덱스
create index idx_prds_user_id on public.prds using btree (user_id);
create index idx_prds_created_at on public.prds using btree (created_at desc);

-- updated_at 트리거
create trigger on_prds_updated
  before update on public.prds
  for each row execute procedure public.handle_updated_at();
