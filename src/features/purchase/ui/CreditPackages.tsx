'use client';

import { useTranslations } from 'next-intl';
import { CREDIT_PACKAGES, type CreditPackageConfig } from '../model/credit-packages';
import type { CreditPackage } from '@/src/entities';
import { cn } from '@/src/shared/lib/utils';
import { Check } from 'lucide-react';

interface CreditPackagesProps {
  selectedPackage: CreditPackage | null;
  onSelect: (packageKey: CreditPackage) => void;
  disabled?: boolean;
}

export function CreditPackages({
  selectedPackage,
  onSelect,
  disabled = false,
}: CreditPackagesProps) {
  const t = useTranslations('purchase');
  const tCommon = useTranslations('common');

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(Object.entries(CREDIT_PACKAGES) as [CreditPackage, CreditPackageConfig][]).map(
        ([key, pkg]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            disabled={disabled}
            className={cn(
              'relative flex flex-col rounded-xl border-2 p-6 text-left transition-all',
              'hover:border-primary/50 hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              selectedPackage === key
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            )}
          >
            {/* Popular badge */}
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                {t('popular')}
              </span>
            )}

            {/* Selected indicator */}
            {selectedPackage === key && (
              <div className="absolute right-3 top-3 rounded-full bg-primary p-1">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}

            {/* Package name */}
            <h3 className="text-lg font-semibold">{t(pkg.nameKey)}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t(pkg.descriptionKey)}</p>

            {/* Credits */}
            <div className="mt-4">
              <span className="text-3xl font-bold">{pkg.credits}</span>
              <span className="ml-1 text-muted-foreground">{tCommon('credits')}</span>
            </div>

            {/* Price */}
            <div className="mt-2">
              <span className="text-2xl font-semibold">${pkg.priceUsd}</span>
              <span className="ml-1 text-sm text-muted-foreground">USD</span>
            </div>

            {/* Price per credit */}
            <p className="mt-2 text-xs text-muted-foreground">
              {t('perCredit', { price: (pkg.priceUsd / pkg.credits).toFixed(2) })}
            </p>
          </button>
        )
      )}
    </div>
  );
}
