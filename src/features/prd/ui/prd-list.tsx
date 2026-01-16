import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { getPrds } from '../api/get-prds';

/**
 * Server Component that displays a grid of PRD cards
 * Fetches data directly using the getPrds function
 */
export async function PrdList() {
  const prds = await getPrds();

  if (prds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">No PRDs yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first PRD to get started
        </p>
        <Button asChild>
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            Create PRD
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prds.map((prd) => (
        <Link key={prd.id} href={`/dashboard/prds/${prd.id}`}>
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="line-clamp-1">{prd.title ?? 'Untitled PRD'}</CardTitle>
              <CardDescription className="line-clamp-2">
                {prd.idea}
              </CardDescription>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <span className="capitalize">{prd.template}</span>
                <span>-</span>
                <span>
                  {new Date(prd.created_at).toLocaleDateString('ko-KR', {
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
