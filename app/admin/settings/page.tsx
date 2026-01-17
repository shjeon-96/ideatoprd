import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/shared/ui/card';
import { Badge } from '@/src/shared/ui/badge';
import { ADMIN_EMAILS } from '@/src/features/admin/config';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage admin panel configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            Users with admin access. To add new admins, update the ADMIN_EMAILS array in
            src/features/admin/config.ts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ADMIN_EMAILS.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="text-sm">{email}</span>
                <Badge variant="secondary">Admin</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>Current application environment settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node Environment</span>
              <Badge variant="outline">{process.env.NODE_ENV}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vercel Environment</span>
              <Badge variant="outline">{process.env.VERCEL_ENV || 'local'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>External service dashboards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <p className="font-medium">Supabase Dashboard</p>
              <p className="text-sm text-muted-foreground">Database & Auth</p>
            </a>
            <a
              href="https://app.lemonsqueezy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <p className="font-medium">Lemon Squeezy</p>
              <p className="text-sm text-muted-foreground">Payments & Subscriptions</p>
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <p className="font-medium">Vercel Dashboard</p>
              <p className="text-sm text-muted-foreground">Deployment & Logs</p>
            </a>
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <p className="font-medium">Anthropic Console</p>
              <p className="text-sm text-muted-foreground">AI API Usage</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
