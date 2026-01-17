-- PRD Versioning Support
-- Allows users to revise PRDs while keeping version history

-- Add versioning columns to prds table
alter table public.prds
  add column parent_id uuid references public.prds(id) on delete set null,
  add column version_number integer not null default 1,
  add column revision_feedback text,
  add column revised_sections text[];

-- Index for efficient version queries
create index idx_prds_parent_id on public.prds using btree (parent_id);
create index idx_prds_version on public.prds using btree (parent_id, version_number desc);

-- Function to get the latest version of a PRD
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
  -- Find the root PRD (original)
  select coalesce(parent_id, id) into v_root_id
  from public.prds
  where id = p_prd_id;

  -- Get the latest version
  select id into v_latest_id
  from public.prds
  where (id = v_root_id or parent_id = v_root_id)
  order by version_number desc
  limit 1;

  return v_latest_id;
end;
$$;

-- Function to get all versions of a PRD
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
  -- Find the root PRD
  select coalesce(parent_id, p_prd_id) into v_root_id
  from public.prds
  where id = p_prd_id;

  return query
  select p.id, p.version_number, p.title, p.revision_feedback, p.revised_sections, p.created_at
  from public.prds p
  where p.id = v_root_id or p.parent_id = v_root_id
  order by p.version_number desc;
end;
$$;

-- Comment for documentation
comment on column public.prds.parent_id is 'Reference to the original PRD (null for original, parent id for revisions)';
comment on column public.prds.version_number is 'Version number starting from 1 (original)';
comment on column public.prds.revision_feedback is 'User feedback that prompted this revision';
comment on column public.prds.revised_sections is 'List of section names that were revised';
