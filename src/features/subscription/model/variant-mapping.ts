import type { SubscriptionPlan, BillingInterval } from '@/src/entities';
import { SUBSCRIPTION_PLANS, type SubscriptionPlanConfig } from './subscription-plans';

export interface SubscriptionVariantInfo {
  key: SubscriptionPlan;
  config: SubscriptionPlanConfig;
  interval: BillingInterval;
}

/**
 * Build a map of variant IDs to subscription info.
 * This is dynamically generated from environment variables.
 */
function buildVariantMap(): Map<string, SubscriptionVariantInfo> {
  const map = new Map<string, SubscriptionVariantInfo>();

  for (const [key, config] of Object.entries(SUBSCRIPTION_PLANS)) {
    const plan = key as SubscriptionPlan;

    // Monthly variant
    if (config.variantIdMonthly) {
      map.set(config.variantIdMonthly, {
        key: plan,
        config,
        interval: 'monthly',
      });
    }

    // Yearly variant
    if (config.variantIdYearly) {
      map.set(config.variantIdYearly, {
        key: plan,
        config,
        interval: 'yearly',
      });
    }
  }

  return map;
}

// Lazy initialization to ensure env vars are loaded
let variantMap: Map<string, SubscriptionVariantInfo> | null = null;

function getVariantMap(): Map<string, SubscriptionVariantInfo> {
  if (!variantMap) {
    variantMap = buildVariantMap();
  }
  return variantMap;
}

/**
 * Get subscription plan info from variant ID.
 * Returns undefined if variant ID is not recognized.
 */
export function getSubscriptionByVariantId(variantId: number | string): SubscriptionVariantInfo | undefined {
  return getVariantMap().get(String(variantId));
}

/**
 * Check if a variant ID is a subscription product.
 */
export function isSubscriptionVariant(variantId: number | string): boolean {
  return getVariantMap().has(String(variantId));
}
