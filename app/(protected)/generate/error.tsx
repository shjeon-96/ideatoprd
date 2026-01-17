'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

interface GenerateErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for Generate PRD page
 * Displays user-friendly error message with retry option
 */
export default function GenerateError({ error, reset }: GenerateErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Generate page error:', error);
  }, [error]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          role="alert"
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-medium mb-2">
            페이지를 불러오는 데 실패했습니다
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          <div className="flex gap-3">
            <Button onClick={reset} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                대시보드로 이동
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
