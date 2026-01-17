'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/src/shared/ui';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';
import Link from 'next/link';

interface PlanConfig {
  price: string;
  credits: number;
  popular?: boolean;
}

const planConfigs: PlanConfig[] = [
  { price: '$2.99', credits: 3 },
  { price: '$7.99', credits: 10 },
  { price: '$14.99', credits: 25, popular: true },
  { price: '$49.99', credits: 100 },
];

export function PricingSection() {
  const t = useTranslations('landing.pricing');
  const plans = t.raw('plans') as Array<{
    name: string;
    description: string;
    badge?: string;
    features: string[];
  }>;

  return (
    <section id="pricing" className="relative bg-background py-24 lg:py-32">
      <div className="container relative mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="overline mb-4 block">{t('overline')}</span>
          <h2 className="heading-2 mb-4">{t('title')}</h2>
          <p className="body-large">
            {t('subtitle')}
            <br />
            {t('subtitleDetail')}
          </p>
        </div>

        {/* Pricing grid */}
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => {
            const config = planConfigs[index];
            return (
              <article
                key={plan.name}
                className={cn(
                  'relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-200',
                  config.popular
                    ? 'border-foreground shadow-lg'
                    : 'border-border hover:border-foreground/20 hover:shadow-md'
                )}
              >
                {/* Badge */}
                {(config.popular || plan.badge) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={cn(
                        'inline-block rounded-full px-3 py-1 text-xs font-semibold',
                        config.popular
                          ? 'bg-foreground text-background'
                          : 'bg-brand-primary text-white'
                      )}
                    >
                      {config.popular ? t('mostPopular') : plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-4 pt-2">
                  <p className="mb-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <h3 className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      {config.price}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {config.credits} {t('creditsUnit')}
                  </p>
                </div>

                {/* Features */}
                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/signup">
                  <Button
                    className={cn(
                      'w-full transition-all',
                      config.popular ? 'btn-primary' : 'btn-ghost'
                    )}
                    variant={config.popular ? 'default' : 'outline'}
                  >
                    {t('ctaButton')}
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            {t('trust.securePayment')}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            {t('trust.lemonSqueezy')}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            {t('trust.refundable')}
          </span>
        </div>
      </div>
    </section>
  );
}
