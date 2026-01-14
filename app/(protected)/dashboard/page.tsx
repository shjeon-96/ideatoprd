import type { Metadata } from "next";
import { createClient } from "@/src/shared/lib/supabase/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | IdeaToPRD",
  description: "Manage your PRD projects",
};

/**
 * Dashboard page - main hub for authenticated users
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-editorial font-medium tracking-tight mb-2">
        Dashboard
      </h1>
      <p className="text-muted-foreground mb-8">
        Welcome back, {user?.email ?? "User"}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick action card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-medium mb-2">Create New PRD</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Transform your idea into a comprehensive Product Requirements
            Document with AI assistance.
          </p>
          <Link
            href="/generate"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create PRD
          </Link>
        </div>

        {/* Recent history placeholder */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-medium mb-2">Recent PRDs</h2>
          <p className="text-sm text-muted-foreground">
            Your recent PRD documents will appear here.
          </p>
          <div className="mt-4 text-sm text-muted-foreground/60">
            No PRDs created yet.
          </div>
        </div>
      </div>
    </div>
  );
}
