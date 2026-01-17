'use client';

import { Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';
import { SUBSCRIPTION_PLANS } from '../model/subscription-plans';
import type { ActiveSubscription } from '../model/types';

interface SubscriptionStatusProps {
  subscription: ActiveSubscription;
  className?: string;
}

export function SubscriptionStatus({ subscription, className }: SubscriptionStatusProps) {
  const planConfig = SUBSCRIPTION_PLANS[subscription.plan];
  const isActive = subscription.status === 'active';
  const isCancelled = subscription.status === 'cancelled';

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{planConfig.name} 플랜</h3>
          <p className="text-sm text-muted-foreground">{planConfig.description}</p>
        </div>
        <div
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium',
            isActive && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            isCancelled && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            !isActive && !isCancelled && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isActive ? '활성' : isCancelled ? '취소됨' : subscription.status}
        </div>
      </div>

      {/* Cancellation warning */}
      {isCancelled && subscription.endsAt && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div className="text-sm">
            <p className="font-medium text-yellow-700 dark:text-yellow-300">
              구독이 취소되었습니다
            </p>
            <p className="text-yellow-600 dark:text-yellow-400">
              {formatDate(subscription.endsAt)}까지 서비스를 이용할 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* Details grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {/* Credits */}
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">월간 크레딧</p>
          <p className="mt-1 text-2xl font-bold">{subscription.monthlyCredits}</p>
          <p className="text-xs text-muted-foreground">
            최대 {subscription.creditCap}까지 누적
          </p>
        </div>

        {/* Billing */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>결제 주기</span>
          </div>
          <p className="mt-1 text-xl font-semibold">
            {subscription.billingInterval === 'monthly' ? '월간' : '연간'}
          </p>
        </div>

        {/* Next billing */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{isCancelled ? '종료일' : '다음 결제일'}</span>
          </div>
          <p className="mt-1 text-xl font-semibold">
            {formatDate(isCancelled && subscription.endsAt
              ? subscription.endsAt
              : subscription.currentPeriodEnd)}
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-muted-foreground">포함된 기능</h4>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {planConfig.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
