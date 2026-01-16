import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { PrdList } from '@/src/features/prd';

export const metadata: Metadata = {
  title: 'Dashboard | IdeaToPRD',
  description: 'Manage your PRD documents',
};

/**
 * Dashboard home page - displays user's PRD list
 */
export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
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

      <PrdList />
    </div>
  );
}
