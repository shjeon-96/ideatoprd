'use client';

import { useState, useCallback } from 'react';
import { PRDForm, PRDViewer, CREDITS_PER_VERSION } from '@/src/features/prd-generation';
import type { PRDTemplate, PRDVersion } from '@/src/entities';
import { useUser } from '@/src/features/auth/hooks/use-user';
import { InsufficientCreditsModal } from '@/src/features/purchase/ui/InsufficientCreditsModal';
import { CreditBalance } from '@/src/features/purchase/ui/CreditBalance';

export default function GeneratePage() {
  const { profile, isLoading: isUserLoading, refetch } = useUser();
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Credit modal state
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState(0);

  const handleGenerate = useCallback(
    async (data: {
      idea: string;
      template: PRDTemplate;
      version: PRDVersion;
    }) => {
      // Check credits before generating (skip in development)
      const isDev = process.env.NODE_ENV === 'development';
      const creditsNeeded = CREDITS_PER_VERSION[data.version];
      const currentCredits = profile?.credits ?? 0;

      if (!isDev && currentCredits < creditsNeeded) {
        setRequiredCredits(creditsNeeded);
        setShowCreditModal(true);
        return;
      }

      setIsGenerating(true);
      setContent('');
      setError(null);

      try {
        const response = await fetch('/api/generate-prd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();

          // Handle insufficient credits (402)
          if (response.status === 402) {
            setRequiredCredits(creditsNeeded);
            setShowCreditModal(true);
            return;
          }

          throw new Error(errorData.error || 'PRD 생성에 실패했습니다.');
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('스트리밍을 시작할 수 없습니다.');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          setContent((prev) => prev + chunk);
        }

        // Refresh user profile to update credits
        await refetch();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'PRD 생성 중 오류가 발생했습니다.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [profile?.credits, refetch]
  );

  // Show loading only briefly, then default to 0 credits if profile not loaded
  if (isUserLoading && !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-8 w-8 motion-safe:animate-spin rounded-full border-4 border-primary border-t-transparent"
          role="status"
          aria-label="로딩 중"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PRD 생성</h1>
          <p className="mt-2 text-muted-foreground">
            아이디어를 입력하면 AI가 PRD를 자동으로 생성합니다.
          </p>
        </div>
        <CreditBalance credits={profile?.credits ?? 0} size="lg" />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive"
        >
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Form */}
        <div>
          <PRDForm
            onSubmit={handleGenerate}
            isLoading={isGenerating}
            userCredits={profile?.credits ?? 0}
          />
        </div>

        {/* Right: Viewer */}
        <div aria-live="polite" aria-atomic="false">
          <PRDViewer content={content} isStreaming={isGenerating} />
        </div>
      </div>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        open={showCreditModal}
        onOpenChange={setShowCreditModal}
        currentCredits={profile?.credits ?? 0}
        requiredCredits={requiredCredits}
      />
    </div>
  );
}
