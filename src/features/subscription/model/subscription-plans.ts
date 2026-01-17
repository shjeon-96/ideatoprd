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
    monthlyCredits: 25,
    creditCap: 50, // 2 months
    monthlyPrice: 15,
    yearlyPrice: 144, // $12/month
    features: [
      '월 25 크레딧',
      '최대 50 크레딧 누적',
      '기본 PRD 템플릿',
      '이메일 지원',
    ],
    variantIdMonthly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_MONTHLY || '',
    variantIdYearly: process.env.NEXT_PUBLIC_LS_VARIANT_SUB_BASIC_YEARLY || '',
  },
  pro: {
    name: 'Pro',
    description: '전문가를 위한 프로 플랜',
    monthlyCredits: 80,
    creditCap: 160, // 2 months
    monthlyPrice: 35,
    yearlyPrice: 336, // $28/month
    features: [
      '월 80 크레딧',
      '최대 160 크레딧 누적',
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
    monthlyCredits: 200,
    creditCap: 400, // 2 months
    monthlyPrice: 69,
    yearlyPrice: 662, // ~$55/month
    features: [
      '월 200 크레딧',
      '최대 400 크레딧 누적',
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
