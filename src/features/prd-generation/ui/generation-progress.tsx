'use client';

import { useMemo, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Loader2 } from 'lucide-react';

// Expected PRD sections in order (H2 headers)
const PRD_SECTIONS = [
  { key: 'executiveSummary', pattern: /^##\s*(Executive Summary|요약)/im },
  { key: 'problem', pattern: /^##\s*(Problem|문제\s*정의)/im },
  { key: 'targetUsers', pattern: /^##\s*(Target|타겟\s*사용자)/im },
  { key: 'requirements', pattern: /^##\s*(Requirements|요구사항)/im },
  { key: 'coreFeatures', pattern: /^##\s*(Core Features|핵심\s*기능)/im },
  { key: 'userStories', pattern: /^##\s*(User Stories|사용자\s*스토리)/im },
  { key: 'techStack', pattern: /^##\s*(Tech|기술\s*스택)/im },
  { key: 'successMetrics', pattern: /^##\s*(Success Metrics|성공\s*지표)/im },
];

interface GenerationProgressProps {
  content: string;
  isStreaming: boolean;
}

export function GenerationProgress({ content, isStreaming }: GenerationProgressProps) {
  const t = useTranslations('prd.sections');
  const tGenerate = useTranslations('generate');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Track elapsed time during streaming
  useEffect(() => {
    if (!isStreaming) return;

    const startTime = Date.now();

    // Initial update deferred via requestAnimationFrame
    requestAnimationFrame(() => setElapsedTime(0));

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Detect which sections are complete based on content
  const sectionStatus = useMemo(() => {
    return PRD_SECTIONS.map((section) => ({
      key: section.key,
      isComplete: section.pattern.test(content),
    }));
  }, [content]);

  // Calculate progress percentage
  const completedSections = sectionStatus.filter((s) => s.isComplete).length;
  const progressPercent = Math.min(
    ((completedSections / PRD_SECTIONS.length) * 100) + (isStreaming ? 5 : 0),
    100
  );

  // Current section being generated
  const currentSectionIndex = completedSections;
  const currentSection = isStreaming && currentSectionIndex < PRD_SECTIONS.length
    ? PRD_SECTIONS[currentSectionIndex]
    : null;

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (!isStreaming && content.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
      {/* Header with time */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
              <span className="text-sm font-medium text-foreground">
                {t(currentSection?.key ?? 'executiveSummary')}
              </span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-foreground">
                {tGenerate('viewer.complete')}
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatTime(elapsedTime)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-muted overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
        {isStreaming && (
          <div
            className="absolute inset-y-0 bg-white/30 w-20 rounded-full animate-shimmer"
            style={{ left: `${progressPercent - 10}%` }}
          />
        )}
      </div>

      {/* Section indicators */}
      <div className="flex gap-1">
        {sectionStatus.map((section, index) => (
          <div
            key={section.key}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              section.isComplete
                ? 'bg-brand-primary'
                : index === currentSectionIndex && isStreaming
                ? 'bg-brand-primary/50 animate-pulse'
                : 'bg-muted'
            }`}
            title={t(section.key)}
          />
        ))}
      </div>
    </div>
  );
}
