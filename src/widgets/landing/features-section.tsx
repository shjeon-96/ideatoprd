'use client';

import { useTranslations } from 'next-intl';
import {
  Zap,
  LayoutTemplate,
  Brain,
  Download,
  History,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';

const featureIcons: LucideIcon[] = [
  Zap,
  LayoutTemplate,
  Brain,
  Download,
  History,
  CreditCard,
];

export function FeaturesSection() {
  const t = useTranslations('landing.features');
  const items = t.raw('items') as Array<{ title: string; description: string }>;

  return (
    <section id="features" className="relative bg-muted/30 py-24 lg:py-32">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />

      <div className="container relative mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="overline mb-4 block">{t('overline')}</span>
          <h2 className="heading-2 mb-4">
            {t.rich('title', {
              brand: (chunks) => <span className="text-gradient">{chunks}</span>,
            })}
          </h2>
          <p className="body-large">
            {t('subtitle')}
            <br />
            {t('subtitleDetail')}
          </p>
        </div>

        {/* Features grid */}
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <article
                key={feature.title}
                className="card-feature group"
              >
                {/* Icon */}
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-secondary transition-colors group-hover:bg-brand-primary/10">
                  <Icon className="size-6 text-brand-primary" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
