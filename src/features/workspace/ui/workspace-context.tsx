'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { Workspace, WorkspaceRole } from '@/src/entities';

interface WorkspaceContextValue {
  // Current workspace (null = personal mode)
  currentWorkspace: Workspace | null;
  currentRole: WorkspaceRole | null;

  // All user's workspaces
  workspaces: WorkspaceWithRoleSimple[];

  // Actions
  setCurrentWorkspace: (workspace: Workspace | null, role?: WorkspaceRole) => void;
  setWorkspaces: (workspaces: WorkspaceWithRoleSimple[]) => void;

  // Computed
  isWorkspaceMode: boolean;
  canCreatePRD: boolean;
  canManageWorkspace: boolean;
}

interface WorkspaceWithRoleSimple {
  id: string;
  name: string;
  slug: string;
  credit_balance: number;
  role: WorkspaceRole;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: React.ReactNode;
  initialWorkspace?: Workspace | null;
  initialRole?: WorkspaceRole | null;
  initialWorkspaces?: WorkspaceWithRoleSimple[];
}

export function WorkspaceProvider({
  children,
  initialWorkspace = null,
  initialRole = null,
  initialWorkspaces = [],
}: WorkspaceProviderProps) {
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(
    initialWorkspace
  );
  const [currentRole, setCurrentRole] = useState<WorkspaceRole | null>(
    initialRole
  );
  const [workspaces, setWorkspaces] = useState<WorkspaceWithRoleSimple[]>(
    initialWorkspaces
  );

  const setCurrentWorkspace = useCallback(
    (workspace: Workspace | null, role?: WorkspaceRole) => {
      setCurrentWorkspaceState(workspace);
      setCurrentRole(role ?? null);

      // Persist to localStorage for session persistence
      if (workspace) {
        localStorage.setItem('current_workspace_id', workspace.id);
      } else {
        localStorage.removeItem('current_workspace_id');
      }
    },
    []
  );

  const isWorkspaceMode = currentWorkspace !== null;

  const canCreatePRD = useMemo(() => {
    if (!isWorkspaceMode) return true; // Personal mode
    return currentRole === 'owner' || currentRole === 'member';
  }, [isWorkspaceMode, currentRole]);

  const canManageWorkspace = useMemo(() => {
    return currentRole === 'owner';
  }, [currentRole]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      currentWorkspace,
      currentRole,
      workspaces,
      setCurrentWorkspace,
      setWorkspaces,
      isWorkspaceMode,
      canCreatePRD,
      canManageWorkspace,
    }),
    [
      currentWorkspace,
      currentRole,
      workspaces,
      setCurrentWorkspace,
      isWorkspaceMode,
      canCreatePRD,
      canManageWorkspace,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

/**
 * Hook to get current credit source (personal or workspace).
 * Returns the appropriate credit balance and deduction function.
 */
export function useCredits() {
  const { currentWorkspace, isWorkspaceMode } = useWorkspace();

  return {
    isWorkspaceMode,
    workspaceId: currentWorkspace?.id ?? null,
    workspaceCredits: currentWorkspace?.credit_balance ?? 0,
  };
}
