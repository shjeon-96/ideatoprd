'use server';

import { createClient } from '@/src/shared/lib/supabase/server';
import type { Workspace, WorkspaceRole } from '@/src/entities';

export interface WorkspaceWithRole extends Workspace {
  role: WorkspaceRole;
  member_count: number;
}

/**
 * Get all workspaces the current user belongs to.
 */
export async function getWorkspaces(): Promise<WorkspaceWithRole[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase.rpc('get_user_workspaces', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }

  return (data ?? []) as WorkspaceWithRole[];
}

/**
 * Get a single workspace by slug with user's role.
 */
export async function getWorkspaceBySlug(
  slug: string
): Promise<WorkspaceWithRole | null> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select('*')
    .eq('slug', slug)
    .single();

  if (workspaceError || !workspace) {
    console.error('Error fetching workspace:', workspaceError);
    return null;
  }

  // Get user's role in this workspace
  const { data: membership, error: memberError } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspace.id)
    .eq('user_id', user.id)
    .single();

  if (memberError || !membership) {
    console.error('Error fetching membership:', memberError);
    return null;
  }

  // Get member count
  const { count } = await supabase
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id);

  return {
    ...workspace,
    role: membership.role as WorkspaceRole,
    member_count: count ?? 0,
  };
}

interface WorkspaceDetailsResult {
  workspace: Workspace;
  role: WorkspaceRole;
  members: Array<{
    user_id: string;
    profiles: {
      email: string;
      display_name: string | null;
    } | null;
    role: WorkspaceRole;
    joined_at: string;
  }>;
  invitations: Array<{
    id: string;
    email: string;
    role: WorkspaceRole;
    created_at: string;
  }>;
}

/**
 * Get workspace details including members and current user's role.
 * Takes slug instead of workspaceId for consistency.
 */
export async function getWorkspaceDetails(
  slug: string
): Promise<WorkspaceDetailsResult | null> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select('*')
    .eq('slug', slug)
    .single();

  if (workspaceError || !workspace) {
    return null;
  }

  // Get current user's role
  const { data: membership, error: memberError } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspace.id)
    .eq('user_id', user.id)
    .single();

  if (memberError || !membership) {
    return null; // User is not a member
  }

  // Get all members with profile info
  const { data: members } = await supabase
    .from('workspace_members')
    .select(`
      user_id,
      role,
      joined_at,
      profiles:user_id (
        email,
        display_name
      )
    `)
    .eq('workspace_id', workspace.id)
    .order('joined_at', { ascending: true });

  // Get pending invitations (only for owners)
  let invitations: WorkspaceDetailsResult['invitations'] = [];
  if (membership.role === 'owner') {
    const { data: inviteData } = await supabase
      .from('workspace_invitations')
      .select('id, email, role, created_at')
      .eq('workspace_id', workspace.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    invitations = (inviteData ?? []) as WorkspaceDetailsResult['invitations'];
  }

  return {
    workspace,
    role: membership.role as WorkspaceRole,
    members: (members ?? []) as WorkspaceDetailsResult['members'],
    invitations,
  };
}
