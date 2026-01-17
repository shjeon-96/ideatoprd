'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/src/shared/ui/button';
import { TemplateSelector } from './template-selector';
import { MAX_IDEA_LENGTH, MIN_IDEA_LENGTH } from '../model/types';
import type { PRDTemplate, PRDVersion } from '@/src/entities';
import { Loader2, FileText, Zap, AlertCircle, Search } from 'lucide-react';
import { CREDITS_PER_VERSION } from '../model/types';

interface PRDFormProps {
  onSubmit: (data: {
    idea: string;
    template: PRDTemplate;
    version: PRDVersion;
  }) => void;
  isLoading: boolean;
  userCredits: number;
  initialIdea?: string;
}

export function PRDForm({ onSubmit, isLoading, userCredits, initialIdea = '' }: PRDFormProps) {
  const t = useTranslations('generate');
  const [idea, setIdea] = useState(initialIdea);
  const [template, setTemplate] = useState<PRDTemplate>('saas');
  const [version, setVersion] = useState<PRDVersion>('basic');

  const isDev = process.env.NODE_ENV === 'development';
  const creditsRequired = CREDITS_PER_VERSION[version];
  const hasEnoughCredits = isDev || userCredits >= creditsRequired;
  const isValidIdea = idea.trim().length >= MIN_IDEA_LENGTH;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIdea || !hasEnoughCredits || isLoading) return;
    onSubmit({ idea: idea.trim(), template, version });
  };

  const characterProgress = (idea.length / MAX_IDEA_LENGTH) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Idea Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="idea" className="text-sm font-medium text-foreground">
            {t('ideaLabel')}
          </label>
          <span className="text-xs text-muted-foreground">
            {idea.length}/{MAX_IDEA_LENGTH}
          </span>
        </div>
        <div className="relative">
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
            placeholder={t('ideaPlaceholder')}
            rows={4}
            disabled={isLoading}
            className="input-enhanced w-full rounded-xl border border-input bg-background px-4 py-3 text-base placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
          />
          {/* Character progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl bg-muted/50">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
              style={{ width: `${characterProgress}%` }}
            />
          </div>
        </div>
        {idea.length > 0 && idea.length < MIN_IDEA_LENGTH && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-3.5" />
            {t('minLengthError', { minLength: MIN_IDEA_LENGTH })}
          </p>
        )}
      </div>

      {/* Template Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">{t('templateSelect')}</label>
        <TemplateSelector
          value={template}
          onChange={setTemplate}
          disabled={isLoading}
        />
      </div>

      {/* Version Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">{t('versionSelect')}</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Basic Version */}
          <button
            type="button"
            onClick={() => setVersion('basic')}
            disabled={isLoading}
            className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
              version === 'basic'
                ? 'border-brand-primary bg-brand-secondary/30'
                : 'border-border hover:border-brand-primary/30 hover:bg-muted/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                  version === 'basic'
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted/50 text-muted-foreground group-hover:bg-foreground/5'
                }`}
              >
                <FileText className="size-5" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-foreground">{t('versionBasic')}</span>
                <span className="ml-2 text-sm text-muted-foreground">1 {t('credit')}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('versionBasicDesc')}
            </p>
            {version === 'basic' && (
              <div className="absolute right-3 top-3 size-2 rounded-full bg-brand-primary" />
            )}
          </button>

          {/* Detailed Version */}
          <button
            type="button"
            onClick={() => setVersion('detailed')}
            disabled={isLoading}
            className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
              version === 'detailed'
                ? 'border-brand-primary bg-brand-secondary/30'
                : 'border-border hover:border-brand-primary/30 hover:bg-muted/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                  version === 'detailed'
                    ? 'bg-gradient-to-br from-brand-primary to-brand-accent text-white'
                    : 'bg-muted/50 text-muted-foreground group-hover:bg-foreground/5'
                }`}
              >
                <Zap className="size-5" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-foreground">{t('versionDetailed')}</span>
                <span className="ml-2 text-sm text-muted-foreground">2 {t('credit')}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('versionDetailedDesc')}
            </p>
            {version === 'detailed' && (
              <div className="absolute right-3 top-3 size-2 rounded-full bg-brand-primary" />
            )}
          </button>

          {/* Research Version - NEW */}
          <button
            type="button"
            onClick={() => setVersion('research')}
            disabled={isLoading}
            className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
              version === 'research'
                ? 'border-violet-500 bg-violet-500/10'
                : 'border-border hover:border-violet-500/30 hover:bg-violet-500/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                  version === 'research'
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                    : 'bg-muted/50 text-muted-foreground group-hover:bg-violet-500/10'
                }`}
              >
                <Search className="size-5" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-foreground">{t('versionResearch')}</span>
                <span className="ml-2 text-sm text-muted-foreground">3 {t('credit')}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('versionResearchDesc')}
            </p>
            {version === 'research' && (
              <div className="absolute right-3 top-3 size-2 rounded-full bg-violet-500" />
            )}
            {/* NEW badge */}
            <div className="absolute -right-6 top-3 rotate-45 bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-0.5 text-[10px] font-semibold text-white">
              NEW
            </div>
          </button>
        </div>
      </div>

      {/* Credit Warning */}
      {!hasEnoughCredits && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/20">
            <AlertCircle className="size-4 text-destructive" />
          </div>
          <div className="text-sm text-destructive">
            <span className="font-medium">{t('insufficientCredits')}</span>
            <span className="ml-1 text-destructive/80">
              {t('creditsStatus', { current: userCredits, required: creditsRequired })}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="btn-magnetic group relative h-14 w-full overflow-hidden bg-gradient-to-r from-brand-primary to-brand-accent text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
        disabled={!isValidIdea || !hasEnoughCredits || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-5 motion-safe:animate-spin" />
            {t('generating')}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {t('generateButton')}
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-sm">
              {creditsRequired} {t('credit')}
            </span>
          </span>
        )}
        {/* Shine effect */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Button>
    </form>
  );
}
