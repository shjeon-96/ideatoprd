'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  SubscriptionPlans,
  SubscriptionStatus,
  TrustBadges,
  SocialProof,
  PricingFAQ,
  getActiveSubscription,
  type ActiveSubscription,
} from '@/src/features/subscription';
import { CreditBalance } from '@/src/features/purchase/ui/CreditBalance';
import { useUser } from '@/src/features/auth/hooks/use-user';

export default function SubscribePage() {
  const { profile, isLoading: isUserLoading } = useUser();
  const t = useTranslations('subscribe');
  const tCommon = useTranslations('common');
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      const result = await getActiveSubscription();
      if (result.success) {
        setSubscription(result.subscription);
      }
      setIsLoadingSubscription(false);
    }
    loadSubscription();
  }, []);

  const isLoading = isUserLoading || isLoadingSubscription;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-8 w-8 motion-safe:animate-spin rounded-full border-4 border-primary border-t-transparent"
          role="status"
          aria-label={tCommon('loading')}
        />
      </div>
    );
  }

  // User has active subscription - show status
  if (subscription && (subscription.status === 'active' || subscription.status === 'cancelled')) {
    return (
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('mySubscription')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Current subscription status */}
        <SubscriptionStatus subscription={subscription} className="mb-8" />

        {/* Current credits */}
        <div className="mb-8 flex items-center justify-between rounded-lg border bg-card p-4">
          <div>
            <h3 className="font-medium">{t('currentCredits')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('creditsInfo')}
            </p>
          </div>
          <CreditBalance credits={profile?.credits ?? 0} size="lg" />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('goToDashboard')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-muted"
          >
            <Sparkles className="h-4 w-4" />
            {t('generatePrd')}
          </Link>
        </div>

        {/* One-time purchase link */}
        <div className="mt-8 rounded-lg border bg-muted/30 p-4">
          <h3 className="font-medium">{t('needMoreCredits')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('oneTimeCreditsInfo')}
          </p>
          <Link
            href="/purchase"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t('buyCredits')}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  // No subscription - show plans
  return (
    <div className="mx-auto max-w-5xl space-y-12">
      {/* Header with value proposition */}
      <div className="text-center">
        <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-brand-secondary px-3 py-1 text-xs font-medium text-brand-primary">
          <Sparkles className="size-3" />
          {t('launchOffer')}
        </span>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {t('selectPlan')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {t('planDescription')}
        </p>
      </div>

      {/* Social proof */}
      <SocialProof />

      {/* Current credits */}
      <div className="flex justify-center">
        <CreditBalance credits={profile?.credits ?? 0} size="lg" />
      </div>

      {/* Subscription plans */}
      <SubscriptionPlans />

      {/* Trust badges */}
      <TrustBadges />

      {/* One-time purchase link */}
      <div className="text-center">
        <p className="text-muted-foreground">
          {t('oneTimeQuestion')}
        </p>
        <Link
          href="/purchase"
          className="mt-2 inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          {t('viewPackages')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* FAQ */}
      <PricingFAQ />

      {/* Benefits comparison */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-muted/30 to-muted/50 p-6 md:p-8">
        <h3 className="text-xl font-semibold">{t('whySubscribe')}</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <h4 className="font-medium text-primary">{t('benefits.cheaper.title')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('benefits.cheaper.description')}
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-primary">{t('benefits.autoRefill.title')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('benefits.autoRefill.description')}
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-primary">{t('benefits.accumulate.title')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('benefits.accumulate.description')}
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-primary">{t('benefits.yearlyDiscount.title')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('benefits.yearlyDiscount.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
