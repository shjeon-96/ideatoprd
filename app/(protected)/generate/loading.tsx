/**
 * Loading UI for Generate PRD page
 * Shows skeleton for the form while page is loading
 */
export default function GenerateLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6" role="status" aria-label="페이지 로딩 중">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted motion-safe:animate-pulse rounded" />
          <div className="h-5 w-96 bg-muted motion-safe:animate-pulse rounded" />
        </div>

        {/* Form card skeleton */}
        <div className="rounded-lg border p-6 space-y-6">
          {/* Textarea skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-24 bg-muted motion-safe:animate-pulse rounded" />
            <div className="h-32 w-full bg-muted motion-safe:animate-pulse rounded" />
          </div>

          {/* Template selector skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-20 bg-muted motion-safe:animate-pulse rounded" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted motion-safe:animate-pulse rounded-lg" />
              ))}
            </div>
          </div>

          {/* Version selector skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-16 bg-muted motion-safe:animate-pulse rounded" />
            <div className="flex gap-4">
              <div className="h-24 flex-1 bg-muted motion-safe:animate-pulse rounded-lg" />
              <div className="h-24 flex-1 bg-muted motion-safe:animate-pulse rounded-lg" />
            </div>
          </div>

          {/* Submit button skeleton */}
          <div className="h-12 w-full bg-muted motion-safe:animate-pulse rounded" />
        </div>
      </div>
    </main>
  );
}
