import { Badge } from '@/src/shared/ui/badge';
import { Button } from '@/src/shared/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Loading UI for PRD Detail page
 * Displays skeleton content while PRD data is loading
 */
export default function PrdDetailLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="PRD 상세 로딩 중">
      {/* Back navigation skeleton */}
      <Button variant="ghost" size="sm" className="gap-2" disabled>
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted motion-safe:animate-pulse rounded" />
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-muted motion-safe:animate-pulse w-16 h-5" />
            <Badge variant="outline" className="bg-muted motion-safe:animate-pulse w-12 h-5" />
            <div className="h-4 w-24 bg-muted motion-safe:animate-pulse rounded" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted motion-safe:animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted motion-safe:animate-pulse rounded" />
        </div>
      </div>

      {/* Original idea skeleton */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="h-4 w-24 bg-muted motion-safe:animate-pulse rounded mb-2" />
        <div className="h-4 w-full bg-muted motion-safe:animate-pulse rounded" />
      </div>

      {/* PRD Content skeleton */}
      <div className="rounded-lg border p-6 space-y-4">
        <div className="h-6 w-48 bg-muted motion-safe:animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted motion-safe:animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted motion-safe:animate-pulse rounded" />
          <div className="h-4 w-4/5 bg-muted motion-safe:animate-pulse rounded" />
        </div>
        <div className="h-6 w-40 bg-muted motion-safe:animate-pulse rounded mt-6" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted motion-safe:animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted motion-safe:animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
