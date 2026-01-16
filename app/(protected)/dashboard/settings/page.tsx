import Link from 'next/link';
import { Coins, User, Mail, Calendar } from 'lucide-react';
import { createClient } from '@/src/shared/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';

export const metadata = {
  title: 'Settings | IdeaToPRD',
  description: 'Manage your account settings and view profile information',
};

export default async function SettingsPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please sign in to view settings.</p>
      </div>
    );
  }

  // Get profile from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, display_name, avatar_url, credits, created_at')
    .eq('id', user.id)
    .single();

  const userEmail = profile?.email ?? user.email ?? 'Unknown';
  const displayName = profile?.display_name ?? userEmail.split('@')[0];
  const userInitial = displayName.charAt(0).toUpperCase();
  const credits = profile?.credits ?? 0;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-semibold">
                  {userInitial}
                </div>
              )}
              <div>
                <p className="font-semibold">{displayName}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {/* Profile details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Display Name</p>
                  <p className="font-medium">{displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{memberSince}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Credits</CardTitle>
            <CardDescription>Your PRD generation credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Coins className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{credits}</p>
                <p className="text-sm text-muted-foreground">
                  Available credits
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Each PRD generation uses 1 credit. Purchase more credits to
              continue generating PRDs.
            </p>

            <Link href="/purchase">
              <Button className="w-full">Purchase Credits</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
