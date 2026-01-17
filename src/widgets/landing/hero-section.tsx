'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/src/shared/ui';
import { FileText, ArrowRight, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const t = useTranslations('landing.hero');
  const sections = t.raw('previewSections') as string[];

  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-background">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />

      {/* Gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/5 blur-[100px]" />
      </div>

      <div className="container relative mx-auto flex min-h-[100vh] items-center px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className="animate-fade-up mb-8 opacity-0"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <span className="badge-minimal">
              <span className="status-dot" />
              <span>{t('badge')}</span>
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="animate-fade-up mb-6 opacity-0"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <span className="heading-1 block text-foreground">
              {t('title1')}
            </span>
            <span className="heading-1 mt-2 block">
              <span className="text-gradient">{t('title2')}</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-up mx-auto mb-10 max-w-xl text-xl leading-relaxed text-muted-foreground opacity-0"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {t('subtitle', { minutes: 5 })}
            <br />
            {t('subtitleDetail')}
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-up flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="btn-primary group h-12 gap-2 rounded-lg px-8 text-base font-medium"
              >
                {t('ctaPrimary')}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="btn-ghost h-12 rounded-lg px-8 text-base font-medium"
              >
                {t('ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="animate-fade-up mt-12 flex flex-wrap items-center justify-center gap-8 opacity-0"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-brand-primary" />
              <span>{t('trustFreeCredits')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-brand-primary" />
              <span>{t('trustFastGeneration')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card - Floating on right side for larger screens */}
      <div
        className="animate-fade-up pointer-events-none absolute bottom-20 right-8 hidden opacity-0 xl:block"
        style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
      >
        <div className="w-[320px] rounded-xl border border-border bg-card p-6 shadow-lg">
          {/* Card header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand-primary text-white">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="font-medium text-foreground">{t('previewTitle')}</div>
              <div className="text-xs text-muted-foreground">
                {t('previewTime')}
              </div>
            </div>
          </div>

          {/* Generated sections */}
          <div className="space-y-2">
            {sections.map((section, i) => (
              <div
                key={section}
                className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
              >
                <span className="badge-number">{i + 1}</span>
                <span className="text-sm text-foreground">{section}</span>
                <span className="ml-auto text-xs text-brand-primary">
                  {t('previewComplete')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
