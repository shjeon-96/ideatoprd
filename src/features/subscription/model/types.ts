import type { SubscriptionPlan, SubscriptionStatus, BillingInterval } from '@/src/entities';

/**
 * Active subscription info returned from RPC.
 */
export interface ActiveSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  monthlyCredits: number;
  creditCap: number;
  currentPeriodEnd: Date;
  cancelledAt: Date | null;
  endsAt: Date | null;
}

/**
 * Subscription checkout request.
 */
export interface SubscriptionCheckoutRequest {
  plan: SubscriptionPlan;
  interval: BillingInterval;
  userId: string;
}

/**
 * Subscription management actions.
 */
export type SubscriptionAction =
  | 'cancel'
  | 'resume'
  | 'change_plan'
  | 'change_interval';
