'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { History, GitBranch, MessageSquare, ChevronRight } from 'lucide-react';
import { Badge } from '@/src/shared/ui/badge';
import { cn } from '@/src/shared/lib/utils';
import type { PrdVersionItem } from '../api/get-prd';

interface VersionHistoryProps {
  versions: PrdVersionItem[];
  currentVersionId: string;
}

export function VersionHistory({ versions, currentVersionId }: VersionHistoryProps) {
  const t = useTranslations('prd');
  const locale = useLocale();
  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US';

  if (versions.length <= 1) {
    return null; // Don't show history if there's only one version
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <History className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">{t('versionHistory')}</h3>
        <Badge variant="secondary" className="text-xs">
          {t('versionsCount', { count: versions.length })}
        </Badge>
      </div>

      <div className="space-y-2">
        {versions.map((version) => {
          const isCurrentVersion = version.id === currentVersionId;
          const isOriginal = version.version_number === 1;
          const formattedDate = new Date(version.created_at).toLocaleDateString(dateLocale, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <Link
              key={version.id}
              href={`/dashboard/prds/${version.id}`}
              className={cn(
                'block p-3 rounded-md transition-colors',
                isCurrentVersion
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted/50 border border-transparent'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                    isCurrentVersion
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {version.version_number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-sm font-medium',
                        isCurrentVersion && 'text-primary'
                      )}>
                        {isOriginal ? t('original') : t('revision', { version: version.version_number })}
                      </span>
                      {isCurrentVersion && (
                        <Badge variant="outline" className="text-xs">
                          {t('current')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                {!isCurrentVersion && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Show revision info for non-original versions */}
              {!isOriginal && version.revision_feedback && (
                <div className="mt-2 pl-8 space-y-1">
                  {version.revised_sections && version.revised_sections.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <GitBranch className="h-3 w-3 text-muted-foreground" />
                      {version.revised_sections.slice(0, 3).map((section) => (
                        <Badge key={section} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {section}
                        </Badge>
                      ))}
                      {version.revised_sections.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{version.revised_sections.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-start gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{version.revision_feedback}</span>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
