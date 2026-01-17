'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Check, Circle, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

interface OnboardingChecklistProps {
  isAccountCreated: boolean;
  hasPrds: boolean;
  hasExportedPrd: boolean;
  hasSubscription: boolean;
}

interface ChecklistItem {
  key: string;
  completed: boolean;
  href?: string;
  action?: string;
}

export function OnboardingChecklist({
  isAccountCreated,
  hasPrds,
  hasExportedPrd,
  hasSubscription,
}: OnboardingChecklistProps) {
  const t = useTranslations('onboarding.checklist');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  const items: ChecklistItem[] = useMemo(
    () => [
      {
        key: 'accountCreated',
        completed: isAccountCreated,
      },
      {
        key: 'firstPrd',
        completed: hasPrds,
        href: '/generate',
        action: 'generate',
      },
      {
        key: 'exportPrd',
        completed: hasExportedPrd,
        action: 'export',
      },
      {
        key: 'subscribe',
        completed: hasSubscription,
        href: '/subscribe',
        action: 'subscribe',
      },
    ],
    [isAccountCreated, hasPrds, hasExportedPrd, hasSubscription]
  );

  const completedCount = items.filter((item) => item.completed).length;
  const progressPercent = (completedCount / items.length) * 100;
  const allCompleted = completedCount === items.length;

  // Check localStorage for dismissed state
  useEffect(() => {
    const dismissed = localStorage.getItem('onboardingChecklistDismissed');
    if (dismissed === 'true') {
      requestAnimationFrame(() => setIsDismissed(true));
    }
  }, []);

  // Auto-dismiss after all completed
  useEffect(() => {
    if (allCompleted && !isDismissed) {
      const timeout = setTimeout(() => {
        localStorage.setItem('onboardingChecklistDismissed', 'true');
        setIsDismissed(true);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [allCompleted, isDismissed]);

  // Don't render if dismissed
  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem('onboardingChecklistDismissed', 'true');
    setIsDismissed(true);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-secondary">
            <Sparkles className="size-4 text-brand-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold">{t('title')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('progress', { completed: completedCount, total: items.length })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allCompleted && (
            <span className="text-xs text-green-600 font-medium">{t('complete')}</span>
          )}
          {isExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist items */}
      {isExpanded && (
        <div className="p-4 pt-3 space-y-2">
          {items.map((item) => (
            <div
              key={item.key}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                item.completed ? 'opacity-60' : 'hover:bg-muted/50'
              }`}
            >
              <div
                className={`flex size-5 items-center justify-center rounded-full border-2 ${
                  item.completed
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-muted-foreground/30'
                }`}
              >
                {item.completed ? (
                  <Check className="size-3" />
                ) : (
                  <Circle className="size-3 opacity-0" />
                )}
              </div>
              <span
                className={`flex-1 text-sm ${
                  item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}
              >
                {t(`items.${item.key}`)}
              </span>
              {!item.completed && item.href && (
                <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  <Link href={item.href}>{t(`actions.${item.action}`)}</Link>
                </Button>
              )}
            </div>
          ))}

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="w-full mt-2 pt-2 border-t border-border flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3" />
            {t('dismiss')}
          </button>
        </div>
      )}
    </div>
  );
}
