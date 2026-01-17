'use client';

import { useTranslations } from 'next-intl';
import { Shield, CreditCard, Clock, RefreshCw } from 'lucide-react';

interface TrustBadge {
  icon: typeof Shield;
  labelKey: string;
}

const TRUST_BADGES: TrustBadge[] = [
  { icon: Shield, labelKey: 'secure' },
  { icon: CreditCard, labelKey: 'payment' },
  { icon: Clock, labelKey: 'cancel' },
  { icon: RefreshCw, labelKey: 'refund' },
];

/**
 * Trust badges for pricing page - builds confidence in purchase
 */
export function TrustBadges() {
  const t = useTranslations('pricing.trust');

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {TRUST_BADGES.map(({ icon: Icon, labelKey }) => (
        <div
          key={labelKey}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Icon className="size-4 text-green-600" />
          <span>{t(labelKey)}</span>
        </div>
      ))}
    </div>
  );
}
