import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { PrdListClient } from '@/src/features/prd';
import { getWorkspaceBySlug } from '@/src/features/workspace';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Workspace Dashboard | IdeaToPRD',
  description: 'Manage your workspace PRD documents',
};

interface WorkspaceDashboardPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Workspace dashboard page - displays workspace PRD list
 */
export default async function WorkspaceDashboardPage({
  params,
}: WorkspaceDashboardPageProps) {
  const { slug } = await params;

  // Fetch workspace to get ID and verify access
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-editorial font-medium tracking-tight mb-1">
            {workspace.name}
          </h1>
          <p className="text-muted-foreground">
            Workspace PRDs • {workspace.credit_balance} credits
          </p>
        </div>
        <Button asChild>
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            New PRD
          </Link>
        </Button>
      </div>

      <PrdListClient workspaceId={workspace.id} workspaceSlug={slug} />
    </div>
  );
}
