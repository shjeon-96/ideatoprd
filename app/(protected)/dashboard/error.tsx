'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for Dashboard page
 * Displays user-friendly error message with retry option
 */
export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto">
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        role="alert"
      >
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-medium mb-2">
          PRD 목록을 불러오는 데 실패했습니다
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
      </div>
    </div>
  );
}
