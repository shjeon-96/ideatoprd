import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Users, UserPlus, Crown, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { getWorkspaceDetails } from '@/src/features/workspace';

export const metadata: Metadata = {
  title: 'Workspace Members | IdeaToPRD',
  description: 'Manage your workspace members',
};

interface WorkspaceMembersPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Workspace members page
 * Shows members list and allows inviting new members (owners only)
 */
export default async function WorkspaceMembersPage({
  params,
}: WorkspaceMembersPageProps) {
  const { slug } = await params;

  const workspaceData = await getWorkspaceDetails(slug);

  if (!workspaceData) {
    notFound();
  }

  const { workspace, role, members, invitations } = workspaceData;
  const isOwner = role === 'owner';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Users className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-editorial font-medium tracking-tight">
              Members
            </h1>
            <p className="text-muted-foreground">{workspace.name}</p>
          </div>
        </div>
        {isOwner && (
          <Button>
            <UserPlus className="size-4" />
            Invite Member
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              {members.length} member(s) in this workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      {member.role === 'owner' ? (
                        <Crown className="size-5 text-primary" />
                      ) : (
                        <User className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {member.profiles?.display_name ?? 'Unknown User'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.profiles?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        member.role === 'owner'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}

              {members.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No members yet. Invite team members to collaborate.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {isOwner && invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                {invitations.length} pending invitation(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-dashed"
                  >
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invited as {invitation.role} •{' '}
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
