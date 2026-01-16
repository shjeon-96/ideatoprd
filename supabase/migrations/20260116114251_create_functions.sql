-- Credit management functions for IdeaToPRD
-- These functions handle atomic credit transactions with row-level locking

-- 크레딧 차감 함수 (PRD 생성 시 사용)
create or replace function public.deduct_credit(
  p_user_id uuid,
  p_amount integer,
  p_prd_id uuid default null,
  p_description text default 'PRD generation'
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

  -- 크레딧 부족 시 실패
  if v_current_credits is null or v_current_credits < p_amount then
    return false;
  end if;

  -- 크레딧 차감
  update public.profiles
  set credits = credits - p_amount,
      updated_at = now()
  where id = p_user_id;

  -- 사용 로그 기록
  insert into public.usage_logs (
    user_id, usage_type, credits_delta,
    credits_before, credits_after,
    related_prd_id, description
  ) values (
    p_user_id, 'prd_generation', -p_amount,
    v_current_credits, v_current_credits - p_amount,
    p_prd_id, p_description
  );

  return true;
end;
$$;

-- 크레딧 충전 함수 (구매 완료 시 사용)
create or replace function public.add_credit(
  p_user_id uuid,
  p_amount integer,
  p_purchase_id uuid default null,
  p_usage_type public.usage_type default 'credit_purchase',
  p_description text default 'Credit purchase'
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_credits integer;
begin
  -- 현재 크레딧 조회
  select credits into v_current_credits
  from public.profiles
  where id = p_user_id
  for update;

  if v_current_credits is null then
    return false;
  end if;

  -- 크레딧 충전
  update public.profiles
  set credits = credits + p_amount,
      updated_at = now()
  where id = p_user_id;

  -- 사용 로그 기록
  insert into public.usage_logs (
    user_id, usage_type, credits_delta,
    credits_before, credits_after,
    related_purchase_id, description
  ) values (
    p_user_id, p_usage_type, p_amount,
    v_current_credits, v_current_credits + p_amount,
    p_purchase_id, p_description
  );

  return true;
end;
$$;

-- 사용자 크레딧 조회 함수 (RPC)
create or replace function public.get_user_credits(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_credits integer;
begin
  select credits into v_credits
  from public.profiles
  where id = p_user_id;

  return coalesce(v_credits, 0);
end;
$$;
