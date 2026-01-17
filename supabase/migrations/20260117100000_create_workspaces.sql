-- Workspace System Migration
-- Enables team collaboration for Business plan subscribers

-- 1. Create workspace role enum
CREATE TYPE workspace_role AS ENUM ('owner', 'member', 'viewer');

-- 2. Create workspace invitation status enum
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- 3. Extend usage_type enum with workspace-related types
ALTER TYPE usage_type ADD VALUE 'workspace_prd_generation';
ALTER TYPE usage_type ADD VALUE 'workspace_credit_transfer';

-- 4. Create workspaces table
CREATE TABLE public.workspaces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Credit pool for the workspace
  credit_balance integer DEFAULT 0 NOT NULL CHECK (credit_balance >= 0),

  -- Subscription link (Business plan only)
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,

  -- Settings
  settings jsonb DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Create workspace_members table (join table)
CREATE TABLE public.workspace_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role workspace_role NOT NULL DEFAULT 'member',

  -- Timestamps
  joined_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  -- Unique constraint: one user per workspace
  UNIQUE(workspace_id, user_id)
);

-- 6. Create workspace_invitations table
CREATE TABLE public.workspace_invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email text NOT NULL,
  role workspace_role NOT NULL DEFAULT 'member',
  status invitation_status NOT NULL DEFAULT 'pending',

  -- Invitation metadata
  invited_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),

  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '7 days') NOT NULL,
  responded_at timestamptz
);

-- Partial unique index: one pending invitation per email per workspace
CREATE UNIQUE INDEX idx_workspace_invitations_pending_unique
  ON public.workspace_invitations(workspace_id, email)
  WHERE (status = 'pending');

-- 7. Extend prds table with workspace support
ALTER TABLE public.prds
  ADD COLUMN workspace_id uuid REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- 8. Extend profiles table with default workspace
ALTER TABLE public.profiles
  ADD COLUMN default_workspace_id uuid REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- 9. Create indexes for performance
CREATE INDEX idx_workspaces_owner_id ON public.workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON public.workspaces(slug);
CREATE INDEX idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON public.workspace_members(user_id);
CREATE INDEX idx_workspace_invitations_workspace_id ON public.workspace_invitations(workspace_id);
CREATE INDEX idx_workspace_invitations_email ON public.workspace_invitations(email);
CREATE INDEX idx_workspace_invitations_token ON public.workspace_invitations(token);
CREATE INDEX idx_prds_workspace_id ON public.prds(workspace_id) WHERE workspace_id IS NOT NULL;

-- 10. Enable RLS on new tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

-- 11. Updated_at triggers
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workspace_members_updated_at
  BEFORE UPDATE ON public.workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Helper function: Check if user is workspace member
CREATE OR REPLACE FUNCTION public.is_workspace_member(
  p_workspace_id uuid,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = p_workspace_id AND user_id = p_user_id
  );
$$;

-- 13. Helper function: Get user's role in workspace
CREATE OR REPLACE FUNCTION public.get_workspace_role(
  p_workspace_id uuid,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS workspace_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.workspace_members
  WHERE workspace_id = p_workspace_id AND user_id = p_user_id;
$$;

-- 14. Helper function: Check if user can manage workspace
CREATE OR REPLACE FUNCTION public.can_manage_workspace(
  p_workspace_id uuid,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id = p_user_id
      AND role = 'owner'
  );
$$;

-- 15. Helper function: Check if user can create PRDs in workspace
CREATE OR REPLACE FUNCTION public.can_create_in_workspace(
  p_workspace_id uuid,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id = p_user_id
      AND role IN ('owner', 'member')
  );
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_workspace_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_workspace_role(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_workspace(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_create_in_workspace(uuid, uuid) TO authenticated;
