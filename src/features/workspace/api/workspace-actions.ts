'use server';

import { createClient } from '@/src/shared/lib/supabase/server';
import type { WorkspaceRole } from '@/src/entities';

// Generate a URL-friendly slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

/**
 * Create a new workspace (Business plan required).
 */
export async function createWorkspace(name: string): Promise<{
  success: boolean;
  workspaceId?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Generate unique slug
  let slug = generateSlug(name);
  let suffix = 0;

  // Check for slug uniqueness with max attempts to prevent infinite loop
  const MAX_SLUG_ATTEMPTS = 100;
  while (suffix < MAX_SLUG_ATTEMPTS) {
    const checkSlug = suffix > 0 ? `${slug}-${suffix}` : slug;
    const { data: existing } = await supabase
      .from('workspaces')
      .select('id')
      .eq('slug', checkSlug)
      .single();

    if (!existing) {
      slug = checkSlug;
      break;
    }
    suffix++;
  }

  // Fallback to timestamp if max attempts reached
  if (suffix >= MAX_SLUG_ATTEMPTS) {
    slug = `${slug}-${Date.now()}`;
  }

  // Create workspace using the server function
  const { data, error } = await supabase.rpc('create_workspace', {
    p_name: name,
    p_slug: slug,
    p_owner_id: user.id,
  });

  if (error) {
    console.error('Error creating workspace:', error);
    return {
      success: false,
      error: error.message.includes('Business subscription')
        ? 'Business subscription required to create workspaces'
        : 'Failed to create workspace',
    };
  }

  return { success: true, workspaceId: data };
}

/**
 * Invite a member to workspace.
 */
export async function inviteMember(
  workspaceId: string,
  email: string,
  role: WorkspaceRole = 'member'
): Promise<{
  success: boolean;
  invitationId?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // The RLS will check if user is owner
  const { data, error } = await supabase
    .from('workspace_invitations')
    .insert({
      workspace_id: workspaceId,
      email,
      role,
      invited_by: user.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error inviting member:', error);
    if (error.code === '23505') {
      return { success: false, error: 'This email has already been invited' };
    }
    return { success: false, error: 'Failed to send invitation' };
  }

  // TODO: Send invitation email

  return { success: true, invitationId: data.id };
}

/**
 * Accept a workspace invitation.
 */
export async function acceptInvitation(token: string): Promise<{
  success: boolean;
  workspaceId?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase.rpc('accept_workspace_invitation', {
    p_token: token,
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error accepting invitation:', error);
    return { success: false, error: error.message };
  }

  return { success: true, workspaceId: data };
}

/**
 * Update a member's role in the workspace.
 */
export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  newRole: WorkspaceRole
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Can't change own role
  if (memberId === user.id) {
    return { success: false, error: 'Cannot change your own role' };
  }

  // Can't assign owner role
  if (newRole === 'owner') {
    return { success: false, error: 'Cannot assign owner role' };
  }

  // Check if target is owner (prevent demoting owner)
  const { data: targetMember } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', memberId)
    .single();

  if (targetMember?.role === 'owner') {
    return { success: false, error: 'Cannot change owner role' };
  }

  const { error } = await supabase
    .from('workspace_members')
    .update({ role: newRole })
    .eq('workspace_id', workspaceId)
    .eq('user_id', memberId);

  if (error) {
    console.error('Error updating member role:', error);
    return { success: false, error: 'Failed to update role' };
  }

  return { success: true };
}

/**
 * Remove a member from workspace.
 */
export async function removeMember(
  workspaceId: string,
  memberId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  // Check if target is owner (cannot remove owner)
  const { data: targetMember } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', memberId)
    .single();

  if (targetMember?.role === 'owner') {
    return { success: false, error: 'Cannot remove workspace owner' };
  }

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', memberId);

  if (error) {
    console.error('Error removing member:', error);
    return { success: false, error: 'Failed to remove member' };
  }

  return { success: true };
}

/**
 * Leave a workspace (as a non-owner member).
 */
export async function leaveWorkspace(workspaceId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Check if user is owner (owner cannot leave)
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (membership?.role === 'owner') {
    return { success: false, error: 'Owner cannot leave workspace. Transfer ownership or delete the workspace instead.' };
  }

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error leaving workspace:', error);
    return { success: false, error: 'Failed to leave workspace' };
  }

  return { success: true };
}

/**
 * Update workspace settings.
 */
export async function updateWorkspace(
  workspaceId: string,
  updates: { name?: string }
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('workspaces')
    .update(updates)
    .eq('id', workspaceId);

  if (error) {
    console.error('Error updating workspace:', error);
    return { success: false, error: 'Failed to update workspace' };
  }

  return { success: true };
}

/**
 * Transfer credits from personal account to workspace.
 */
export async function transferCreditsToWorkspace(
  workspaceId: string,
  amount: number
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase.rpc('transfer_credit_to_workspace', {
    p_user_id: user.id,
    p_workspace_id: workspaceId,
    p_amount: amount,
  });

  if (error) {
    console.error('Error transferring credits:', error);
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: 'Insufficient credits' };
  }

  return { success: true };
}
