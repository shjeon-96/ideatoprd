import { Card, CardHeader } from '@/src/shared/ui/card';

/**
 * Loading UI for Dashboard page
 * Displays skeleton cards while PRD list is loading
 */
export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-9 w-32 bg-muted motion-safe:animate-pulse rounded" />
          <div className="h-5 w-64 bg-muted motion-safe:animate-pulse rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-muted motion-safe:animate-pulse rounded" />
      </div>

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
    </div>
  );
}
