'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { FileText, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { usePrds, usePrefetchNextPage } from '../hooks/use-prds';

interface PrdListClientProps {
  workspaceId?: string | null;
  workspaceSlug?: string;
  initialPage?: number;
}

/**
 * Client Component that displays a paginated grid of PRD cards
 * Uses React Query for data fetching with caching
 */
export function PrdListClient({
  workspaceId,
  workspaceSlug,
  initialPage = 1,
}: PrdListClientProps) {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US';
  const [page, setPage] = useState(initialPage);
  const pageSize = 12;

  const { data, isLoading, isError, error, isFetching } = usePrds({
    page,
    pageSize,
    workspaceId,
  });

  const prefetchNextPage = usePrefetchNextPage({ page, pageSize, workspaceId });

  // Prefetch next page when current page loads
  useEffect(() => {
    if (data?.pagination.hasNextPage) {
      prefetchNextPage();
    }
  }, [data?.pagination.hasNextPage, prefetchNextPage]);

  // Generate correct link based on workspace context
  const basePath = workspaceSlug ? `/w/${workspaceSlug}/dashboard` : '/dashboard';

  if (isLoading) {
    return <PrdListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-destructive mb-4">
          {error instanceof Error ? error.message : t('dashboard.loadError')}
        </p>
        <Button onClick={() => setPage(1)} variant="outline">
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  const prds = data?.data ?? [];
  const pagination = data?.pagination;

  if (prds.length === 0 && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('dashboard.noPrds')}</h3>
        <p className="text-muted-foreground mb-6">{t('dashboard.createFirst')}</p>
        <Button asChild>
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            {t('dashboard.createPrd')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PRD Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prds.map((prd) => (
          <Link key={prd.id} href={`${basePath}/prds/${prd.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {prd.title ?? t('prd.untitled')}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {prd.idea}
                </CardDescription>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <span className="capitalize">{prd.template}</span>
                  <span>-</span>
                  <span>
                    {new Date(prd.created_at).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrevPage || isFetching}
          >
            <ChevronLeft className="h-4 w-4" />
            {t('common.prev')}
          </Button>

          <div className="flex items-center gap-1 px-4 text-sm text-muted-foreground">
            {isFetching && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            <span>
              {page} / {pagination.totalPages}
            </span>
            <span className="text-xs">({pagination.total} {t('common.items')})</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage || isFetching}
          >
            {t('common.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function PrdListSkeleton() {
  // Note: This skeleton doesn't have access to translations
  // Using a simple static label for accessibility
  return (
    <div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-busy="true"
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
