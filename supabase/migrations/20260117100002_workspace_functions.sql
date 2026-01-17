-- Workspace Credit Functions
-- Functions for managing workspace credit pool and PRD generation

-- =====================================================
-- WORKSPACE CREDIT MANAGEMENT
-- =====================================================

-- Deduct credit from workspace pool
CREATE OR REPLACE FUNCTION public.deduct_workspace_credit(
  p_workspace_id uuid,
  p_user_id uuid,
  p_amount integer,
  p_prd_id uuid DEFAULT NULL,
  p_description text DEFAULT 'Workspace PRD generation'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_credits integer;
  v_user_role public.workspace_role;
BEGIN
  -- Check user permission
  SELECT role INTO v_user_role
  FROM public.workspace_members
  WHERE workspace_id = p_workspace_id AND user_id = p_user_id;

  IF v_user_role IS NULL OR v_user_role = 'viewer' THEN
    RAISE EXCEPTION 'User does not have permission to use workspace credits';
  END IF;

  -- Get current workspace credits with lock
  SELECT credit_balance INTO v_current_credits
  FROM public.workspaces
  WHERE id = p_workspace_id
  FOR UPDATE;

  -- Check insufficient credits
  IF v_current_credits IS NULL OR v_current_credits < p_amount THEN
    RETURN false;
  END IF;

  -- Deduct credits
  UPDATE public.workspaces
  SET credit_balance = credit_balance - p_amount,
      updated_at = now()
  WHERE id = p_workspace_id;

  -- Log usage
  INSERT INTO public.usage_logs (
    user_id, usage_type, credits_delta,
    credits_before, credits_after,
    related_prd_id, description, metadata
  ) VALUES (
    p_user_id, 'workspace_prd_generation', -p_amount,
    v_current_credits, v_current_credits - p_amount,
    p_prd_id, p_description,
    jsonb_build_object('workspace_id', p_workspace_id)
  );

  RETURN true;
END;
$$;

-- Add credit to workspace pool (from subscription or purchase)
CREATE OR REPLACE FUNCTION public.add_workspace_credit(
  p_workspace_id uuid,
  p_amount integer,
  p_subscription_id uuid DEFAULT NULL,
  p_credit_cap integer DEFAULT NULL,
  p_description text DEFAULT 'Workspace credit addition'
)
RETURNS integer -- Returns actual credits added (may be less due to cap)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_credits integer;
  v_credits_to_add integer;
  v_new_credits integer;
  v_owner_id uuid;
BEGIN
  -- Get current credits with lock
  SELECT credit_balance, owner_id INTO v_current_credits, v_owner_id
  FROM public.workspaces
  WHERE id = p_workspace_id
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    RETURN 0;
  END IF;

  -- Apply cap if specified
  IF p_credit_cap IS NOT NULL AND v_current_credits >= p_credit_cap THEN
    RETURN 0;
  END IF;

  IF p_credit_cap IS NOT NULL THEN
    v_credits_to_add := LEAST(p_amount, p_credit_cap - v_current_credits);
  ELSE
    v_credits_to_add := p_amount;
  END IF;

  v_new_credits := v_current_credits + v_credits_to_add;

  -- Update credits
  UPDATE public.workspaces
  SET credit_balance = v_new_credits,
      updated_at = now()
  WHERE id = p_workspace_id;

  -- Log the addition
  INSERT INTO public.usage_logs (
    user_id, usage_type, credits_delta,
    credits_before, credits_after,
    description, metadata
  ) VALUES (
    v_owner_id, 'subscription_credit', v_credits_to_add,
    v_current_credits, v_new_credits,
    p_description,
    jsonb_build_object(
      'workspace_id', p_workspace_id,
      'subscription_id', p_subscription_id,
      'requested_amount', p_amount,
      'cap', p_credit_cap,
      'capped', v_credits_to_add < p_amount
    )
  );

  RETURN v_credits_to_add;
END;
$$;

-- Transfer credits from personal account to workspace
CREATE OR REPLACE FUNCTION public.transfer_credit_to_workspace(
  p_user_id uuid,
  p_workspace_id uuid,
  p_amount integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_credits integer;
  v_workspace_credits integer;
  v_user_role public.workspace_role;
BEGIN
  -- Check user is owner
  SELECT role INTO v_user_role
  FROM public.workspace_members
  WHERE workspace_id = p_workspace_id AND user_id = p_user_id;

  IF v_user_role != 'owner' THEN
    RAISE EXCEPTION 'Only workspace owner can transfer credits';
  END IF;

  -- Lock user profile
  SELECT credits INTO v_user_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_user_credits IS NULL OR v_user_credits < p_amount THEN
    RETURN false;
  END IF;

  -- Lock workspace
  SELECT credit_balance INTO v_workspace_credits
  FROM public.workspaces
  WHERE id = p_workspace_id
  FOR UPDATE;

  -- Deduct from user
  UPDATE public.profiles
  SET credits = credits - p_amount,
      updated_at = now()
  WHERE id = p_user_id;

  -- Add to workspace
  UPDATE public.workspaces
  SET credit_balance = credit_balance + p_amount,
      updated_at = now()
  WHERE id = p_workspace_id;

  -- Log user side
  INSERT INTO public.usage_logs (
    user_id, usage_type, credits_delta,
    credits_before, credits_after,
    description, metadata
  ) VALUES (
    p_user_id, 'workspace_credit_transfer', -p_amount,
    v_user_credits, v_user_credits - p_amount,
    'Transfer to workspace',
    jsonb_build_object('workspace_id', p_workspace_id)
  );

  RETURN true;
END;
$$;

-- =====================================================
-- WORKSPACE MANAGEMENT FUNCTIONS
-- =====================================================

-- Create workspace (auto-adds owner as member)
CREATE OR REPLACE FUNCTION public.create_workspace(
  p_name text,
  p_slug text,
  p_owner_id uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_workspace_id uuid;
  v_is_business boolean;
BEGIN
  -- Check if user has Business subscription
  SELECT subscription_plan = 'business' AND subscription_status = 'active'
  INTO v_is_business
  FROM public.profiles
  WHERE id = p_owner_id;

  IF NOT COALESCE(v_is_business, false) THEN
    RAISE EXCEPTION 'Business subscription required to create workspaces';
  END IF;

  -- Create workspace
  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (p_name, p_slug, p_owner_id)
  RETURNING id INTO v_workspace_id;

  -- Add owner as member
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_workspace_id, p_owner_id, 'owner');

  -- Set as default workspace
  UPDATE public.profiles
  SET default_workspace_id = v_workspace_id
  WHERE id = p_owner_id
    AND default_workspace_id IS NULL;

  RETURN v_workspace_id;
END;
$$;

-- Accept invitation and join workspace
CREATE OR REPLACE FUNCTION public.accept_workspace_invitation(
  p_token text,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS uuid -- Returns workspace_id
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_invitation record;
  v_user_email text;
BEGIN
  -- Get user email
  SELECT email INTO v_user_email
  FROM public.profiles
  WHERE id = p_user_id;

  -- Find and validate invitation
  SELECT * INTO v_invitation
  FROM public.workspace_invitations
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > now()
  FOR UPDATE;

  IF v_invitation IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;

  IF v_invitation.email != v_user_email THEN
    RAISE EXCEPTION 'Invitation email does not match your account';
  END IF;

  -- Update invitation status
  UPDATE public.workspace_invitations
  SET status = 'accepted',
      responded_at = now()
  WHERE id = v_invitation.id;

  -- Add user to workspace
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_invitation.workspace_id, p_user_id, v_invitation.role)
  ON CONFLICT (workspace_id, user_id) DO NOTHING;

  RETURN v_invitation.workspace_id;
END;
$$;

-- Get user's workspaces with role info
CREATE OR REPLACE FUNCTION public.get_user_workspaces(p_user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  role public.workspace_role,
  credit_balance integer,
  member_count bigint,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.name,
    w.slug,
    wm.role,
    w.credit_balance,
    (SELECT count(*) FROM public.workspace_members WHERE workspace_id = w.id),
    w.created_at
  FROM public.workspaces w
  INNER JOIN public.workspace_members wm ON w.id = wm.workspace_id
  WHERE wm.user_id = p_user_id
  ORDER BY w.created_at DESC;
END;
$$;

-- Get workspace details with members
CREATE OR REPLACE FUNCTION public.get_workspace_details(p_workspace_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  credit_balance integer,
  owner_id uuid,
  member_id uuid,
  member_email text,
  member_name text,
  member_role public.workspace_role,
  member_joined_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check user has access
  IF NOT public.is_workspace_member(p_workspace_id, auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    w.id,
    w.name,
    w.slug,
    w.credit_balance,
    w.owner_id,
    wm.user_id as member_id,
    p.email as member_email,
    p.display_name as member_name,
    wm.role as member_role,
    wm.joined_at as member_joined_at
  FROM public.workspaces w
  INNER JOIN public.workspace_members wm ON w.id = wm.workspace_id
  INNER JOIN public.profiles p ON wm.user_id = p.id
  WHERE w.id = p_workspace_id
  ORDER BY
    CASE wm.role WHEN 'owner' THEN 1 WHEN 'member' THEN 2 ELSE 3 END,
    wm.joined_at;
END;
$$;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION public.deduct_workspace_credit(uuid, uuid, integer, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_workspace_credit(uuid, uuid, integer, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_workspace_credit(uuid, integer, uuid, integer, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.transfer_credit_to_workspace(uuid, uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_workspace_invitation(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_workspaces(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_workspace_details(uuid) TO authenticated;
