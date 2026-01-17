import type { SubscriptionPlan, BillingInterval } from '@/src/entities';

/**
 * Subscription plan configuration type.
 */
export interface SubscriptionPlanConfig {
  name: string;
  description: string;
  monthlyCredits: number;
  creditCap: number; // 2 months worth of credits
  monthlyPrice: number;
  yearlyPrice: number; // 20% discount
  features: string[];
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
    name: 'Basic',
    description: '개인 사용자를 위한 기본 플랜',
    monthlyCredits: 20,
    creditCap: 40, // 2 months
    monthlyPrice: 9.99,
    yearlyPrice: 99, // ~$8.25/month
    features: [
      '월 20 크레딧',
      '최대 40 크레딧 누적',
      '기본 PRD 템플릿',
      '이메일 지원',
    ],
    variantIdMonthly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_MONTHLY || '',
    variantIdYearly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_YEARLY || '',
  },
  pro: {
    name: 'Pro',
    description: '전문가를 위한 프로 플랜',
    monthlyCredits: 60,
    creditCap: 120, // 2 months
    monthlyPrice: 24.99,
    yearlyPrice: 249, // ~$20.75/month
    features: [
      '월 60 크레딧',
      '최대 120 크레딧 누적',
      '모든 PRD 템플릿',
      'Research 버전 포함',
      '우선 지원',
    ],
    popular: true,
    variantIdMonthly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_PRO_MONTHLY || '',
    variantIdYearly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_PRO_YEARLY || '',
  },
  business: {
    name: 'Business',
    description: '팀과 기업을 위한 비즈니스 플랜',
    monthlyCredits: 150,
    creditCap: 300, // 2 months
    monthlyPrice: 49.99,
    yearlyPrice: 499, // ~$41.58/month
    features: [
      '월 150 크레딧',
      '최대 300 크레딧 누적',
      '모든 PRD 템플릿',
      'Research 버전 포함',
      '전용 지원',
      'API 액세스 (예정)',
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
