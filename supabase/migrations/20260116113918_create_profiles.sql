-- profiles 테이블: auth.users와 1:1 관계
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  display_name text,
  avatar_url text,
  credits integer default 3 not null check (credits >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS 활성화 (필수!)
alter table public.profiles enable row level security;

-- RLS 정책: 자신의 프로필만 조회/수정
create policy "Users can view own profile"
on public.profiles for select
to authenticated
using ( (select auth.uid()) = id );

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using ( (select auth.uid()) = id )
with check ( (select auth.uid()) = id );

-- 성능 인덱스 (id는 PK라 자동 인덱스)
create index idx_profiles_email on public.profiles using btree (email);

-- 자동 프로필 생성 트리거
create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at 자동 갱신 트리거
create or replace function public.handle_updated_at()
returns trigger
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
