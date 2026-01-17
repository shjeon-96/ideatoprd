import { getTranslations } from 'next-intl/server';
import { Card, CardHeader, CardContent } from '@/src/shared/ui/card';

/**
 * Loading UI for Purchase page
 * Shows skeleton for credit packages while page is loading
 */
export default async function PurchaseLoading() {
  const t = await getTranslations('common');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8" role="status" aria-label={t('loading')}>
        {/* Header skeleton */}
        <div className="text-center space-y-2">
          <div className="h-9 w-48 bg-muted motion-safe:animate-pulse rounded mx-auto" />
          <div className="h-5 w-64 bg-muted motion-safe:animate-pulse rounded mx-auto" />
        </div>

        {/* Current balance skeleton */}
        <div className="flex justify-center">
          <div className="h-10 w-40 bg-muted motion-safe:animate-pulse rounded-full" />
        </div>

        {/* Credit packages skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <div className="h-6 w-24 bg-muted motion-safe:animate-pulse rounded" />
                <div className="h-8 w-20 bg-muted motion-safe:animate-pulse rounded mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted motion-safe:animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted motion-safe:animate-pulse rounded" />
                </div>
                <div className="h-10 w-full bg-muted motion-safe:animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
