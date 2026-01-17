'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Pencil, Check, Loader2, AlertCircle, Coins } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { Textarea } from '@/src/shared/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/src/shared/ui/card';
import { cn } from '@/src/shared/lib/utils';

// Section definitions with i18n keys
const PRD_SECTIONS = [
  { key: 'executive_summary', i18nKey: 'executiveSummary' },
  { key: 'problem_statement', i18nKey: 'problem' },
  { key: 'target_users', i18nKey: 'targetUsers' },
  { key: 'requirements', i18nKey: 'requirements' },
  { key: 'user_stories', i18nKey: 'userStories' },
  { key: 'success_metrics', i18nKey: 'successMetrics' },
  { key: 'technical_considerations', i18nKey: 'technicalConsiderations' },
  { key: 'timeline', i18nKey: 'timeline' },
  { key: 'risks', i18nKey: 'risks' },
  // Research-specific sections
  { key: 'market_analysis', i18nKey: 'marketAnalysis' },
  { key: 'competitive_landscape', i18nKey: 'competitiveLandscape' },
  { key: 'tech_stack', i18nKey: 'techStack' },
  { key: 'gtm_strategy', i18nKey: 'gtmStrategy' },
];

interface RevisionPanelProps {
  prdId: string;
  isResearchVersion?: boolean;
}

export function RevisionPanel({ prdId, isResearchVersion = false }: RevisionPanelProps) {
  const router = useRouter();
  const t = useTranslations('prd');
  const tCommon = useTranslations('common');
  useLocale(); // Ensure locale is loaded for translations
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter sections based on PRD version
  const availableSections = isResearchVersion
    ? PRD_SECTIONS
    : PRD_SECTIONS.filter(s => !['market_analysis', 'competitive_landscape', 'tech_stack', 'gtm_strategy'].includes(s.key));

  const toggleSection = useCallback((key: string) => {
    setSelectedSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }, []);

  const handleSubmit = async () => {
    // Validation is enforced by button disabled state
    // This function is only called when conditions are met
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/revise-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prdId,
          feedback,
          sections: selectedSections,
          language: 'ko', // Default to Korean
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('revisionFailed'));
      }

      // Stream the response - redirect to dashboard to see the new version
      // In a more complex implementation, we could show the streaming content
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('revisionFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsExpanded(true)}
        className="gap-2"
      >
        <Pencil className="h-4 w-4" />
        {t('revise')}
      </Button>
    );
  }

  return (
    <Card className="border-amber-200 dark:border-amber-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pencil className="h-5 w-5 text-amber-500" />
          {t('revisionTitle')}
        </CardTitle>
        <CardDescription>
          {t('revisionDescription')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Section selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t('selectSections')}
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSections.map((section) => (
              <button
                key={section.key}
                onClick={() => toggleSection(section.key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  'border',
                  selectedSections.includes(section.key)
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-background border-input hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950'
                )}
              >
                {selectedSections.includes(section.key) && (
                  <Check className="inline h-3 w-3 mr-1" />
                )}
                {t(`sections.${section.i18nKey}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback input */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t('revisionFeedback')}
          </label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t('revisionPlaceholder')}
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t('charactersEntered', { count: feedback.length })}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            setIsExpanded(false);
            setSelectedSections([]);
            setFeedback('');
            setError(null);
          }}
          disabled={isSubmitting}
        >
          {tCommon('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedSections.length === 0 || feedback.trim().length < 10}
          className="gap-2 bg-amber-500 hover:bg-amber-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('revising')}
            </>
          ) : (
            <>
              <Coins className="h-4 w-4" />
              {t('reviseWithCredit')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
