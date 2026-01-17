import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { FileText, Plus } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { getPrds } from '../api/get-prds';

interface PrdListProps {
  workspaceId?: string | null;
  workspaceSlug?: string;
}

/**
 * Server Component that displays a grid of PRD cards
 * Fetches data directly using the getPrds function
 *
 * @param workspaceId - If provided, shows workspace PRDs. Otherwise shows personal PRDs.
 * @param workspaceSlug - If in workspace mode, used for link generation.
 */
export async function PrdList({ workspaceId, workspaceSlug }: PrdListProps = {}) {
  const t = await getTranslations('dashboard');
  const tPrd = await getTranslations('prd');
  const locale = await getLocale();
  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US';
  const prds = await getPrds(workspaceId);

  if (prds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('noPrds')}</h3>
        <p className="text-muted-foreground mb-6">
          {t('createFirst')}
        </p>
        <Button asChild>
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            {t('createPrd')}
          </Link>
        </Button>
      </div>
    );
  }

  // Generate correct link based on workspace context
  const basePath = workspaceSlug ? `/w/${workspaceSlug}/dashboard` : '/dashboard';

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
      {prds.map((prd) => (
        <Link key={prd.id} href={`${basePath}/prds/${prd.id}`}>
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="line-clamp-1">{prd.title ?? tPrd('untitled')}</CardTitle>
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
  );
}
