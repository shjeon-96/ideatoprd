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
    <div className="max-w-6xl mx-auto">
      {/* Welcome modal for new users */}
      <DashboardOnboarding />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-editorial font-medium tracking-tight mb-1">
            My PRDs
          </h1>
          <p className="text-muted-foreground">Manage your generated PRD documents</p>
        </div>
        <Button asChild>
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            New PRD
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main content - PRD list */}
        <PrdListClient />

        {/* Sidebar - Onboarding checklist */}
        <aside className="order-first lg:order-last">
          <DashboardChecklist />
        </aside>
      </div>
    </div>
  );
}
