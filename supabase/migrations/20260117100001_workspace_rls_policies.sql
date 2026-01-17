-- Workspace RLS Policies
-- Implements role-based access control for workspaces

-- =====================================================
-- WORKSPACES TABLE POLICIES
-- =====================================================

-- View: Members can see their workspaces
CREATE POLICY "Users can view workspaces they belong to"
  ON public.workspaces
  FOR SELECT
  TO authenticated
  USING (
    public.is_workspace_member(id, auth.uid())
  );

-- Insert: Only Business subscribers can create workspaces
CREATE POLICY "Business subscribers can create workspaces"
  ON public.workspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND subscription_plan = 'business'
        AND subscription_status = 'active'
    )
  );

-- Update: Only owners can update workspace settings
CREATE POLICY "Owners can update workspaces"
  ON public.workspaces
  FOR UPDATE
  TO authenticated
  USING (public.can_manage_workspace(id, auth.uid()))
  WITH CHECK (public.can_manage_workspace(id, auth.uid()));

-- Delete: Only owners can delete workspaces
CREATE POLICY "Owners can delete workspaces"
  ON public.workspaces
  FOR DELETE
  TO authenticated
  USING (public.can_manage_workspace(id, auth.uid()));

-- Service role full access
CREATE POLICY "Service role can manage workspaces"
  ON public.workspaces
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- WORKSPACE_MEMBERS TABLE POLICIES
-- =====================================================

-- View: Members can see other members of their workspaces
CREATE POLICY "Members can view workspace members"
  ON public.workspace_members
  FOR SELECT
  TO authenticated
  USING (
    public.is_workspace_member(workspace_id, auth.uid())
  );

-- Insert: Only owners can add members
CREATE POLICY "Owners can add members"
  ON public.workspace_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.can_manage_workspace(workspace_id, auth.uid())
  );

-- Update: Only owners can update member roles
CREATE POLICY "Owners can update member roles"
  ON public.workspace_members
  FOR UPDATE
  TO authenticated
  USING (public.can_manage_workspace(workspace_id, auth.uid()))
  WITH CHECK (public.can_manage_workspace(workspace_id, auth.uid()));

-- Delete: Owners can remove members, members can leave
CREATE POLICY "Owners can remove members or self-leave"
  ON public.workspace_members
  FOR DELETE
  TO authenticated
  USING (
    public.can_manage_workspace(workspace_id, auth.uid())
    OR (user_id = auth.uid() AND role != 'owner')
  );

-- Service role full access
CREATE POLICY "Service role can manage workspace members"
  ON public.workspace_members
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- WORKSPACE_INVITATIONS TABLE POLICIES
-- =====================================================

-- View: Owners can see all invitations, invitees can see their own
CREATE POLICY "View workspace invitations"
  ON public.workspace_invitations
  FOR SELECT
  TO authenticated
  USING (
    public.can_manage_workspace(workspace_id, auth.uid())
    OR email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

-- Insert: Only owners can create invitations
CREATE POLICY "Owners can create invitations"
  ON public.workspace_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.can_manage_workspace(workspace_id, auth.uid())
  );

-- Update: Invitees can accept/decline, owners can modify
CREATE POLICY "Update invitations"
  ON public.workspace_invitations
  FOR UPDATE
  TO authenticated
  USING (
    public.can_manage_workspace(workspace_id, auth.uid())
    OR email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    public.can_manage_workspace(workspace_id, auth.uid())
    OR email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

-- Delete: Only owners can delete invitations
CREATE POLICY "Owners can delete invitations"
  ON public.workspace_invitations
  FOR DELETE
  TO authenticated
  USING (
    public.can_manage_workspace(workspace_id, auth.uid())
  );

-- Service role full access
CREATE POLICY "Service role can manage invitations"
  ON public.workspace_invitations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- UPDATED PRD POLICIES FOR WORKSPACE SUPPORT
-- =====================================================

-- Drop existing PRD policies
DROP POLICY IF EXISTS "Users can view own PRDs" ON public.prds;
DROP POLICY IF EXISTS "Users can create own PRDs" ON public.prds;
DROP POLICY IF EXISTS "Users can update own PRDs" ON public.prds;
DROP POLICY IF EXISTS "Users can delete own PRDs" ON public.prds;

-- View: Users can see their own PRDs OR workspace PRDs they have access to
CREATE POLICY "Users can view PRDs"
  ON public.prds
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (
      workspace_id IS NOT NULL
      AND public.is_workspace_member(workspace_id, auth.uid())
    )
  );

-- Insert: Users can create personal PRDs OR workspace PRDs if they have permission
CREATE POLICY "Users can create PRDs"
  ON public.prds
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      workspace_id IS NULL
      OR public.can_create_in_workspace(workspace_id, auth.uid())
    )
  );

-- Update: Users can update their own PRDs OR workspace PRDs (owner/member)
CREATE POLICY "Users can update PRDs"
  ON public.prds
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (
      workspace_id IS NOT NULL
      AND public.can_create_in_workspace(workspace_id, auth.uid())
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR (
      workspace_id IS NOT NULL
      AND public.can_create_in_workspace(workspace_id, auth.uid())
    )
  );

-- Delete: Users can delete their own PRDs OR workspace PRDs (owner/member)
CREATE POLICY "Users can delete PRDs"
  ON public.prds
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (
      workspace_id IS NOT NULL
      AND public.can_create_in_workspace(workspace_id, auth.uid())
    )
  );
