'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/src/shared/ui';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  const t = useTranslations('landing.cta');

  return (
    <section className="relative overflow-hidden bg-foreground py-24 lg:py-32">
      {/* Subtle pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div
          className="grid-pattern h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          }}
        />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Headline */}
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-background md:text-4xl lg:text-5xl">
            {t('title')}
            <br />
            {t('titleLine2')}
          </h2>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-background/70">
            {t.rich('subtitle', {
              credits: (chunks) => (
                <span className="font-semibold text-background">{chunks}</span>
              ),
            })}
            <br />
            {t('subtitleDetail')}
          </p>

          {/* CTA Button */}
          <Link href="/signup">
            <Button
              size="lg"
              className="group h-12 gap-2 rounded-lg bg-background px-8 text-base font-medium text-foreground transition-all hover:bg-background/90"
            >
              {t('button')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-background/50">
            <span>✓ {t('trust.quickSignup')}</span>
            <span>✓ {t('trust.securePayment')}</span>
            <span>✓ {t('trust.instantGeneration')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
