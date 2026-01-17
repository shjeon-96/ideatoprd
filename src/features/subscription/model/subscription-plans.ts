import type { SubscriptionPlan, BillingInterval } from '@/src/entities';

/**
 * Subscription plan configuration type.
 */
export interface SubscriptionPlanConfig {
  nameKey: string; // i18n key for plan name
  descriptionKey: string; // i18n key for description
  monthlyCredits: number;
  creditCap: number; // 2 months worth of credits
  monthlyPrice: number;
  yearlyPrice: number; // 20% discount
  featureKeys: string[]; // i18n keys for features
  popular?: boolean;
  variantIdMonthly: string;
  variantIdYearly: string;
}

/**
 * Subscription plan definitions for Lemon Squeezy products.
 * Variant IDs are loaded from environment variables.
 */
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionPlanConfig> = {
  basic: {
    nameKey: 'plans.basic.name',
    descriptionKey: 'plans.basic.description',
    monthlyCredits: 20,
    creditCap: 40, // 2 months
    monthlyPrice: 9.99,
    yearlyPrice: 99, // ~$8.25/month
    featureKeys: [
      'plans.basic.features.credits',
      'plans.basic.features.cap',
      'plans.basic.features.templates',
      'plans.basic.features.support',
    ],
    variantIdMonthly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_MONTHLY || '',
    variantIdYearly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_YEARLY || '',
  },
  pro: {
    nameKey: 'plans.pro.name',
    descriptionKey: 'plans.pro.description',
    monthlyCredits: 60,
    creditCap: 120, // 2 months
    monthlyPrice: 24.99,
    yearlyPrice: 249, // ~$20.75/month
    featureKeys: [
      'plans.pro.features.credits',
      'plans.pro.features.cap',
      'plans.pro.features.templates',
      'plans.pro.features.research',
      'plans.pro.features.support',
    ],
    popular: true,
    variantIdMonthly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_PRO_MONTHLY || '',
    variantIdYearly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_PRO_YEARLY || '',
  },
  business: {
    nameKey: 'plans.business.name',
    descriptionKey: 'plans.business.description',
    monthlyCredits: 150,
    creditCap: 300, // 2 months
    monthlyPrice: 49.99,
    yearlyPrice: 499, // ~$41.58/month
    featureKeys: [
      'plans.business.features.credits',
      'plans.business.features.cap',
      'plans.business.features.templates',
      'plans.business.features.research',
      'plans.business.features.support',
      'plans.business.features.api',
    ],
    variantIdMonthly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_BUSINESS_MONTHLY || '',
    variantIdYearly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_BUSINESS_YEARLY || '',
  },
};

/**
 * Get price for a plan based on billing interval.
 */
export function getPlanPrice(plan: SubscriptionPlan, interval: BillingInterval): number {
  const config = SUBSCRIPTION_PLANS[plan];
  return interval === 'monthly' ? config.monthlyPrice : config.yearlyPrice;
}

/**
 * Get monthly equivalent price (for displaying savings).
 */
export function getMonthlyEquivalent(plan: SubscriptionPlan, interval: BillingInterval): number {
  const config = SUBSCRIPTION_PLANS[plan];
  return interval === 'monthly' ? config.monthlyPrice : Math.round(config.yearlyPrice / 12);
}

/**
 * Calculate yearly savings percentage.
 */
export function getYearlySavings(plan: SubscriptionPlan): number {
  const config = SUBSCRIPTION_PLANS[plan];
  const yearlyWithoutDiscount = config.monthlyPrice * 12;
  return Math.round(((yearlyWithoutDiscount - config.yearlyPrice) / yearlyWithoutDiscount) * 100);
}

/**
 * Get variant ID for a plan and interval.
 */
export function getVariantId(plan: SubscriptionPlan, interval: BillingInterval): string {
  const config = SUBSCRIPTION_PLANS[plan];
  return interval === 'monthly' ? config.variantIdMonthly : config.variantIdYearly;
}

/**
 * Get cost per credit for a plan (value anchoring).
 */
export function getCostPerCredit(plan: SubscriptionPlan, interval: BillingInterval): string {
  const config = SUBSCRIPTION_PLANS[plan];
  const price = interval === 'monthly' ? config.monthlyPrice : config.yearlyPrice / 12;
  const costPerCredit = price / config.monthlyCredits;
  return costPerCredit.toFixed(2);
}

/**
 * Get yearly savings amount in dollars.
 */
export function getYearlySavingsAmount(plan: SubscriptionPlan): number {
  const config = SUBSCRIPTION_PLANS[plan];
  const yearlyWithoutDiscount = config.monthlyPrice * 12;
  return Math.round(yearlyWithoutDiscount - config.yearlyPrice);
}
