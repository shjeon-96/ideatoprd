/**
 * Subscription Feature
 *
 * Handles subscription management for monthly/yearly plans.
 * Works alongside one-time credit purchases.
 */

// API
export { createSubscriptionCheckout, getActiveSubscription } from './api';

// Model
export {
  SUBSCRIPTION_PLANS,
  getPlanPrice,
  getMonthlyEquivalent,
  getYearlySavings,
  getVariantId,
  getSubscriptionByVariantId,
  isSubscriptionVariant,
  type SubscriptionPlanConfig,
  type SubscriptionVariantInfo,
  type ActiveSubscription,
  type SubscriptionCheckoutRequest,
  type SubscriptionAction,
} from './model';

// UI
export {
  BillingIntervalToggle,
  SubscriptionPlans,
  SubscriptionBadge,
  SubscriptionStatus,
  TrustBadges,
  SocialProof,
  PricingFAQ,
} from './ui';
