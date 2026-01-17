import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Settings, Building2, CreditCard, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/shared/ui/card';
import { getWorkspaceBySlug } from '@/src/features/workspace';

export const metadata: Metadata = {
  title: 'Workspace Settings | IdeaToPRD',
  description: 'Manage your workspace settings',
};

interface WorkspaceSettingsPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Workspace settings page
 * Only accessible by workspace owners
 */
export default async function WorkspaceSettingsPage({
  params,
}: WorkspaceSettingsPageProps) {
  const { slug } = await params;

  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace) {
    notFound();
  }

  // Only owners can access settings
  if (workspace.role !== 'owner') {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-editorial font-medium tracking-tight">
            Workspace Settings
          </h1>
          <p className="text-muted-foreground">{workspace.name}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* General Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-muted-foreground" />
              <CardTitle>General</CardTitle>
            </div>
            <CardDescription>Basic workspace information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Workspace Name</label>
              <p className="text-muted-foreground">{workspace.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Slug</label>
              <p className="text-muted-foreground">{workspace.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Created</label>
              <p className="text-muted-foreground">
                {new Date(workspace.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-muted-foreground" />
              <CardTitle>Credits</CardTitle>
            </div>
            <CardDescription>Workspace credit balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {workspace.credit_balance.toLocaleString()}
              </span>
              <span className="text-muted-foreground">credits available</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Transfer credits from your personal account to add more.
            </p>
          </CardContent>
        </Card>

        {/* Members Link */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-muted-foreground" />
              <CardTitle>Members</CardTitle>
            </div>
            <CardDescription>
              Manage workspace members and invitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={`/w/${slug}/members`}
              className="text-primary hover:underline"
            >
              Manage members →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
