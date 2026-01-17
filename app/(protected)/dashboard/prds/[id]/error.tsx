'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

interface PrdDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for PRD Detail page
 * Displays user-friendly error message with retry and back options
 */
export default function PrdDetailError({ error, reset }: PrdDetailErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('PRD detail error:', error);
  }, [error]);

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        role="alert"
      >
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-medium mb-2">
          PRD를 불러오는 데 실패했습니다
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          요청하신 PRD를 찾을 수 없거나, 일시적인 오류가 발생했습니다.
        </p>
        <div className="flex gap-3">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
          <Button asChild>
            <Link href="/dashboard">대시보드로 이동</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
