'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';
import {
  SUBSCRIPTION_PLANS,
  getPlanPrice,
  getMonthlyEquivalent,
  getYearlySavings,
  type SubscriptionPlanConfig,
} from '../model/subscription-plans';
import { createSubscriptionCheckout } from '../api/create-subscription-checkout';
import { BillingIntervalToggle } from './BillingIntervalToggle';
import type { SubscriptionPlan, BillingInterval } from '@/src/entities';

interface SubscriptionPlansProps {
  currentPlan?: SubscriptionPlan | null;
  disabled?: boolean;
}

export function SubscriptionPlans({
  currentPlan = null,
  disabled = false,
}: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    setError(null);

    const result = await createSubscriptionCheckout(selectedPlan, interval);

    if (result.success) {
      // Open Lemon Squeezy checkout
      window.LemonSqueezy?.Url?.Open?.(result.checkoutUrl);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Billing interval toggle */}
      <BillingIntervalToggle
        value={interval}
        onChange={setInterval}
        disabled={disabled || isLoading}
      />

      {/* Plans grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {(Object.entries(SUBSCRIPTION_PLANS) as [SubscriptionPlan, SubscriptionPlanConfig][]).map(
          ([key, plan]) => {
            const isCurrentPlan = currentPlan === key;
            const isSelected = selectedPlan === key;
            const price = getPlanPrice(key, interval);
            const monthlyEquivalent = getMonthlyEquivalent(key, interval);
            const savings = getYearlySavings(key);

            return (
              <button
                key={key}
                onClick={() => !isCurrentPlan && setSelectedPlan(key)}
                disabled={disabled || isLoading || isCurrentPlan}
                className={cn(
                  'relative flex flex-col rounded-xl border-2 p-6 text-left transition-all',
                  'hover:border-primary/50 hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : isCurrentPlan
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : 'border-border bg-card'
                )}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    인기
                  </span>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                    현재 플랜
                  </span>
                )}

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-3 top-3 rounded-full bg-primary p-1">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}

                {/* Plan name & description */}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

                {/* Price */}
                <div className="mt-6">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-muted-foreground">
                    /{interval === 'monthly' ? '월' : '년'}
                  </span>
                </div>

                {/* Monthly equivalent for yearly */}
                {interval === 'yearly' && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    월 ${monthlyEquivalent} (연 {savings}% 절약)
                  </p>
                )}

                {/* Credits info */}
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium">
                    월 <span className="text-lg font-bold text-primary">{plan.monthlyCredits}</span> 크레딧
                  </p>
                  <p className="text-xs text-muted-foreground">
                    최대 {plan.creditCap} 크레딧까지 누적 가능
                  </p>
                </div>

                {/* Features */}
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          }
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}

      {/* Subscribe button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubscribe}
          disabled={!selectedPlan || isLoading || disabled}
          className={cn(
            'rounded-lg px-8 py-3 text-lg font-semibold transition-all',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 inline-block h-5 w-5 animate-spin" />
              처리 중...
            </>
          ) : selectedPlan ? (
            `${SUBSCRIPTION_PLANS[selectedPlan].name} 플랜 구독하기`
          ) : (
            '플랜을 선택하세요'
          )}
        </button>
      </div>
    </div>
  );
}
