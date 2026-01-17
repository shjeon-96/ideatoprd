'use client';

import { useTranslations } from 'next-intl';
import { Star, Users } from 'lucide-react';

/**
 * Social proof section for pricing page
 * Shows user count and ratings to build trust
 */
export function SocialProof() {
  const t = useTranslations('pricing.social');

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
      {/* User count */}
      <div className="flex items-center gap-2">
        <Users className="size-5 text-brand-primary" />
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">500+</span> {t('users')}
        </span>
      </div>

      {/* Divider */}
      <div className="hidden h-4 w-px bg-border md:block" />

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="size-4 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">4.9</span>/5 {t('rating')}
        </span>
      </div>

      {/* Divider */}
      <div className="hidden h-4 w-px bg-border md:block" />

      {/* PRDs generated */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">10,000+</span> {t('prds')}
        </span>
      </div>
    </div>
  );
}
