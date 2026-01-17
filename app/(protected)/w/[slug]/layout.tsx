'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspace, getWorkspaceBySlug } from '@/src/features/workspace';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for workspace routes
 * Loads workspace data and sets it in context
 */
export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const { setCurrentWorkspace, setWorkspaces, workspaces } = useWorkspace();
  const slug = params.slug as string;

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const workspace = await getWorkspaceBySlug(slug);

        if (!workspace) {
          // Workspace not found or no access
          router.push('/dashboard');
          return;
        }

        // Set the workspace in context
        setCurrentWorkspace(
          {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            credit_balance: workspace.credit_balance,
            owner_id: workspace.owner_id,
            subscription_id: workspace.subscription_id,
            settings: workspace.settings ?? {},
            created_at: workspace.created_at,
            updated_at: workspace.updated_at,
          },
          workspace.role
        );

        // Update workspaces list if not already present
        if (!workspaces.find((w) => w.id === workspace.id)) {
          setWorkspaces([
            ...workspaces,
            {
              id: workspace.id,
              name: workspace.name,
              slug: workspace.slug,
              credit_balance: workspace.credit_balance,
              role: workspace.role,
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to load workspace:', error);
        router.push('/dashboard');
      }
    }

    loadWorkspace();
  }, [slug, router, setCurrentWorkspace, setWorkspaces, workspaces]);

  return <>{children}</>;
}
