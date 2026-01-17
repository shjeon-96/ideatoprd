import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { PrdList } from '@/src/features/prd';
import { Card, CardHeader } from '@/src/shared/ui/card';

export const metadata: Metadata = {
  title: 'Dashboard | IdeaToPRD',
  description: 'Manage your PRD documents',
};

/**
 * Skeleton loader for PRD list cards
 */
function PrdListSkeleton() {
  return (
    <div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="PRD 목록 로딩 중"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader>
            <div className="h-6 w-3/4 bg-muted motion-safe:animate-pulse rounded" />
            <div className="space-y-2 mt-2">
              <div className="h-4 w-full bg-muted motion-safe:animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-muted motion-safe:animate-pulse rounded" />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="h-3 w-16 bg-muted motion-safe:animate-pulse rounded" />
              <div className="h-3 w-20 bg-muted motion-safe:animate-pulse rounded" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

/**
 * Dashboard home page - displays user's PRD list
 * Uses Suspense for streaming the async PrdList component
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

      <Suspense fallback={<PrdListSkeleton />}>
        <PrdList />
      </Suspense>
    </div>
  );
}
