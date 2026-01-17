'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';

const FAQ_KEYS = [
  'credits',
  'cancel',
  'refund',
  'switch',
  'unused',
  'payment',
] as const;

/**
 * FAQ accordion for pricing page
 * Addresses common objections to reduce purchase hesitation
 */
export function PricingFAQ() {
  const t = useTranslations('pricing.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card">
      <h3 className="border-b border-border px-6 py-4 text-lg font-semibold">
        {t('title')}
      </h3>
      <div className="divide-y divide-border">
        {FAQ_KEYS.map((key, index) => (
          <div key={key} className="px-6">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="font-medium">{t(`items.${key}.question`)}</span>
              <ChevronDown
                className={cn(
                  'size-5 text-muted-foreground transition-transform',
                  openIndex === index && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                openIndex === index ? 'max-h-40 pb-4' : 'max-h-0'
              )}
            >
              <p className="text-sm text-muted-foreground">
                {t(`items.${key}.answer`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
