-- Fix ambiguous column reference in get_prd_versions function
-- The return table has an 'id' column which conflicts with prds.id

create or replace function public.get_prd_versions(p_prd_id uuid)
returns table (
  id uuid,
  version_number integer,
  title text,
  revision_feedback text,
  revised_sections text[],
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_root_id uuid;
begin
  -- Find the root PRD (use table-qualified column to avoid ambiguity)
  select coalesce(prds.parent_id, p_prd_id) into v_root_id
  from public.prds
  where prds.id = p_prd_id;

  return query
  select p.id, p.version_number, p.title, p.revision_feedback, p.revised_sections, p.created_at
  from public.prds p
  where p.id = v_root_id or p.parent_id = v_root_id
  order by p.version_number desc;
end;
$$;

-- Also fix get_latest_prd_version for consistency
create or replace function public.get_latest_prd_version(p_prd_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_root_id uuid;
  v_latest_id uuid;
begin
  -- Find the root PRD (original) - use table-qualified columns
  select coalesce(prds.parent_id, prds.id) into v_root_id
  from public.prds
  where prds.id = p_prd_id;

  -- Get the latest version
  select prds.id into v_latest_id
  from public.prds
  where (prds.id = v_root_id or prds.parent_id = v_root_id)
  order by prds.version_number desc
  limit 1;

  return v_latest_id;
end;
$$;
