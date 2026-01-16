-- 사용 유형 타입
create type public.usage_type as enum (
  'prd_generation',    -- PRD 생성
  'credit_purchase',   -- 크레딧 구매
  'credit_refund',     -- 크레딧 환불
  'signup_bonus'       -- 가입 보너스
);

-- usage_logs 테이블 (감사 추적)
create table public.usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,

  -- 사용 정보
  usage_type public.usage_type not null,
  credits_delta integer not null,  -- 양수: 충전, 음수: 차감
  credits_before integer not null,
  credits_after integer not null,

  -- 관련 리소스
  related_prd_id uuid references public.prds(id) on delete set null,
  related_purchase_id uuid references public.purchases(id) on delete set null,

  -- 메타데이터
  description text,
  metadata jsonb,

  -- 타임스탬프
  created_at timestamptz default now() not null
);

-- RLS 활성화
alter table public.usage_logs enable row level security;

-- RLS 정책: 자신의 사용 로그만 조회
create policy "Users can view own usage logs"
on public.usage_logs for select
to authenticated
using ( (select auth.uid()) = user_id );

-- INSERT는 서버에서만 (DB function 또는 service_role)

-- 성능 인덱스
create index idx_usage_logs_user_id on public.usage_logs using btree (user_id);
create index idx_usage_logs_created_at on public.usage_logs using btree (created_at desc);
create index idx_usage_logs_usage_type on public.usage_logs using btree (usage_type);
