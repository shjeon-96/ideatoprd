-- 결제 상태 타입
create type public.purchase_status as enum (
  'pending',
  'completed',
  'failed',
  'refunded'
);

-- 크레딧 패키지 타입
create type public.credit_package as enum (
  'starter',   -- 10 credits
  'basic',     -- 30 credits
  'pro',       -- 100 credits
  'business'   -- 300 credits
);

-- purchases 테이블
create table public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,

  -- 결제 정보
  package public.credit_package not null,
  credits_amount integer not null,
  amount_cents integer not null,  -- 금액 (센트 단위)
  currency text not null default 'USD',

  -- Lemon Squeezy 정보
  lemon_squeezy_order_id text unique,
  lemon_squeezy_product_id text,
  lemon_squeezy_variant_id text,

  -- 상태
  status public.purchase_status not null default 'pending',

  -- 타임스탬프
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

-- RLS 활성화
alter table public.purchases enable row level security;

-- RLS 정책: 자신의 구매 내역만 조회 가능
create policy "Users can view own purchases"
on public.purchases for select
to authenticated
using ( (select auth.uid()) = user_id );

-- INSERT는 서버에서만 (service_role 사용)
-- 클라이언트에서 직접 구매 생성 불가

-- 성능 인덱스
create index idx_purchases_user_id on public.purchases using btree (user_id);
create index idx_purchases_status on public.purchases using btree (status);
create index idx_purchases_lemon_squeezy_order_id on public.purchases using btree (lemon_squeezy_order_id);
