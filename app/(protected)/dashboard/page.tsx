import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { PrdListClient } from '@/src/features/prd';
import { DashboardOnboarding, DashboardChecklist } from '@/src/features/onboarding';

export const metadata: Metadata = {
  title: 'Dashboard | IdeaToPRD',
  description: 'Manage your PRD documents',
};

/**
 * Dashboard home page - displays user's PRD list
 * Uses React Query for client-side data fetching with caching
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome modal for new users */}
      <DashboardOnboarding />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My PRDs
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">Manage your generated PRD documents</p>
        </div>
        <Button asChild size="sm" className="w-fit">
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            New PRD
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
        {/* Main content - PRD list */}
        <PrdListClient />

        {/* Sidebar - Onboarding checklist */}
        <aside className="order-first xl:order-last">
          <DashboardChecklist />
        </aside>
      </div>
    </div>
  );
}
