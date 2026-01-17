'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PRDForm, PRDViewer, GenerationProgress, GenerationComplete, CREDITS_PER_VERSION, type PRDLanguage } from '@/src/features/prd-generation';
import type { PRDTemplate, PRDVersion } from '@/src/entities';
import { useUser } from '@/src/features/auth/hooks/use-user';
import { useWorkspace } from '@/src/features/workspace';
import { InsufficientCreditsModal } from '@/src/features/purchase/ui/InsufficientCreditsModal';
import { CreditBalance } from '@/src/features/purchase/ui/CreditBalance';
import { processUIMessageStream, type PRDSaveResult } from '@/src/shared/lib/stream';
import { Sparkles, Wand2 } from 'lucide-react';

export default function GeneratePage() {
  const t = useTranslations();
  const { profile, isLoading: isUserLoading, refetch } = useUser();
  const { currentWorkspace, isWorkspaceMode } = useWorkspace();
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPrdId, setSavedPrdId] = useState<string | null>(null);

  // Prefill idea from onboarding
  const [prefillIdea, setPrefillIdea] = useState<string>('');

  // Credit modal state
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState(0);

  // Check for prefilled idea from onboarding
  useEffect(() => {
    const savedIdea = localStorage.getItem('prefillIdea');
    if (savedIdea) {
      setPrefillIdea(savedIdea);
      localStorage.removeItem('prefillIdea');
    }
  }, []);

  // Handle PRD save result from stream
  const handleSaveResult = useCallback(
    (result: PRDSaveResult) => {
      switch (result.type) {
        case 'prd_saved':
          if (result.prdId) {
            setSavedPrdId(result.prdId);
            // Auto-redirect is now handled by GenerationComplete component
          }
          break;
        case 'prd_save_failed':
          setError(result.message || t('generate.saveError'));
          break;
        case 'credits_refunded':
          // Credits were refunded due to save failure - refresh profile
          refetch();
          break;
      }
    },
    [refetch, t]
  );

  // Reset form for generating another PRD
  const handleGenerateAnother = useCallback(() => {
    setContent('');
    setSavedPrdId(null);
    setError(null);
    setPrefillIdea('');
  }, []);

  const handleGenerate = useCallback(
    async (data: {
      idea: string;
      template: PRDTemplate;
      version: PRDVersion;
      language: PRDLanguage;
    }) => {
      // Check credits before generating (skip in development)
      const isDev = process.env.NODE_ENV === 'development';
      const creditsNeeded = CREDITS_PER_VERSION[data.version];
      // Use workspace credits in workspace mode, otherwise personal credits
      const currentCredits = isWorkspaceMode
        ? (currentWorkspace?.credit_balance ?? 0)
        : (profile?.credits ?? 0);

      if (!isDev && currentCredits < creditsNeeded) {
        setRequiredCredits(creditsNeeded);
        setShowCreditModal(true);
        return;
      }

      setIsGenerating(true);
      setContent('');
      setError(null);
      setSavedPrdId(null);

      try {
        const response = await fetch('/api/generate-prd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            workspace_id: isWorkspaceMode ? currentWorkspace?.id : undefined,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();

          // Handle insufficient credits (402)
          if (response.status === 402) {
            setRequiredCredits(creditsNeeded);
            setShowCreditModal(true);
            setIsGenerating(false);
            return;
          }

          throw new Error(errorData.error || t('generate.generateError'));
        }

        // Process streaming response with save status handling
        await processUIMessageStream(
          response,
          (text) => setContent((prev) => prev + text),
          handleSaveResult,
          (errorMsg) => setError(errorMsg)
        );

        // Refresh user profile to update credits (with timeout)
        try {
          await Promise.race([
            refetch(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Refetch timeout')), 3000)
            ),
          ]);
        } catch {
          // Ignore refetch errors - PRD was generated successfully
          console.warn('Profile refetch failed or timed out');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t('generate.generalError')
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [profile?.credits, currentWorkspace, isWorkspaceMode, refetch, t, handleSaveResult]
  );

  // Show loading only briefly, then default to 0 credits if profile not loaded
  if (isUserLoading && !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-12 rounded-full border-4 border-brand-secondary" />
            <div
              className="absolute inset-0 size-12 motion-safe:animate-spin rounded-full border-4 border-brand-primary border-t-transparent"
              role="status"
              aria-label={t('common.loading')}
            />
          </div>
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="glow-brand flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-lg">
            <Wand2 className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('generate.title')}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {t('generate.description')}
            </p>
          </div>
        </div>
        <CreditBalance
          credits={profile?.credits ?? 0}
          workspaceCredits={currentWorkspace?.credit_balance}
          isWorkspaceMode={isWorkspaceMode}
          size="lg"
        />
      </div>

      {/* Success - PRD Saved with CTAs */}
      {savedPrdId && (
        <div className="mb-8">
          <GenerationComplete
            prdId={savedPrdId}
            onGenerateAnother={handleGenerateAnother}
          />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mb-8 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/20">
            <span className="text-sm font-bold">!</span>
          </div>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Form Card */}
        <div className="card-3d rounded-2xl border border-border/50 bg-card p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-secondary">
              <Sparkles className="size-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{t('generate.ideaInput')}</h2>
              <p className="text-sm text-muted-foreground">{t('generate.ideaInputDesc')}</p>
            </div>
          </div>
          <PRDForm
            onSubmit={handleGenerate}
            isLoading={isGenerating}
            userCredits={profile?.credits ?? 0}
            initialIdea={prefillIdea}
          />
        </div>

        {/* Right: Viewer Card */}
        <div className="space-y-4">
          {/* Progress Indicator */}
          {(isGenerating || content) && (
            <GenerationProgress content={content} isStreaming={isGenerating} />
          )}

          <div className="card-3d rounded-2xl border border-border/50 bg-card shadow-sm" aria-live="polite" aria-atomic="false">
            <PRDViewer content={content} isStreaming={isGenerating} />
          </div>
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
