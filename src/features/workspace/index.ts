/**
 * Workspace Feature
 *
 * Provides workspace/team collaboration functionality for Business plan subscribers.
 * Includes shared credit pool, member management, and workspace-scoped PRDs.
 */

// API
export {
  getWorkspaces,
  getWorkspaceBySlug,
  getWorkspaceDetails,
  type WorkspaceWithRole,
} from './api/get-workspaces';

export {
  createWorkspace,
  inviteMember,
  acceptInvitation,
  updateMemberRole,
  removeMember,
  leaveWorkspace,
  updateWorkspace,
  transferCreditsToWorkspace,
} from './api/workspace-actions';

// UI
export {
  WorkspaceProvider,
  useWorkspace,
  useCredits,
  WorkspaceSwitcher,
} from './ui';
