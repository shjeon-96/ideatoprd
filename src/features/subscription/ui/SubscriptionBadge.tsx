'use client';

import { Crown } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';
import { SUBSCRIPTION_PLANS } from '../model/subscription-plans';
import type { SubscriptionPlan, SubscriptionStatus } from '@/src/entities';

interface SubscriptionBadgeProps {
  plan: SubscriptionPlan | null;
  status: SubscriptionStatus | null;
  className?: string;
}

export function SubscriptionBadge({ plan, status, className }: SubscriptionBadgeProps) {
  if (!plan || !status) {
    return null;
  }

  const planConfig = SUBSCRIPTION_PLANS[plan];
  const isActive = status === 'active';
  const isCancelled = status === 'cancelled';

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        isActive && 'bg-primary/10 text-primary',
        isCancelled && 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
        !isActive && !isCancelled && 'bg-muted text-muted-foreground',
        className
      )}
    >
      <Crown className="h-3 w-3" />
      <span>{planConfig.name}</span>
      {isCancelled && (
        <span className="text-[10px] opacity-70">(취소됨)</span>
      )}
    </div>
  );
}
