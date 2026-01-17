import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, GitBranch } from 'lucide-react';
import {
  getPrd,
  getPrdVersions,
  PrdViewer,
  CopyMarkdownButton,
  PrdPdfDownload,
  RevisionPanel,
  VersionHistory,
  PrdRating,
} from '@/src/features/prd';
import { Badge } from '@/src/shared/ui/badge';
import { Button } from '@/src/shared/ui/button';

interface PrdDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrdDetailPage({ params }: PrdDetailPageProps) {
  const { id } = await params;
  const [prd, versions] = await Promise.all([
    getPrd(id),
    getPrdVersions(id),
  ]);

  if (!prd) {
    notFound();
  }

  // Support both new (markdown) and legacy (raw) content structure
  const markdown = prd.content?.markdown ?? prd.content?.raw ?? '';
  const formattedDate = new Date(prd.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const isResearchVersion = prd.version === 'research';
  const hasMultipleVersions = versions.length > 1;

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {prd.title ?? 'Untitled PRD'}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary">{prd.template}</Badge>
            <Badge variant="outline">{prd.version}</Badge>
            {hasMultipleVersions && (
              <Badge variant="outline" className="gap-1">
                <GitBranch className="h-3 w-3" />
                v{prd.version_number}
              </Badge>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {markdown && <CopyMarkdownButton markdown={markdown} />}
          <PrdPdfDownload
            prd={{
              id: prd.id,
              title: prd.title ?? '',
              content: prd.content ?? undefined,
            }}
          />
        </div>
      </div>

      {/* Original idea */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          Original Idea
        </p>
        <p className="text-sm">{prd.idea}</p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* PRD Content */}
        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            {markdown ? (
              <PrdViewer content={markdown} />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No content available for this PRD.
              </p>
            )}
          </div>

          {/* Rating */}
          <PrdRating
            prdId={prd.id}
            initialRating={prd.rating}
            initialFeedback={prd.rating_feedback}
          />

          {/* Revision Panel */}
          <RevisionPanel prdId={prd.id} isResearchVersion={isResearchVersion} />
        </div>

        {/* Sidebar - Version History */}
        <aside className="space-y-4">
          <VersionHistory versions={versions} currentVersionId={prd.id} />
        </aside>
      </div>
    </div>
  );
}
