import type { CreditPackage } from '@/src/entities';

/**
 * Credit package configuration type.
 */
export interface CreditPackageConfig {
  name: string;
  description: string;
  credits: number;
  priceUsd: number;
  variantId: string;
  popular?: boolean;
}

/**
 * Credit package definitions for Lemon Squeezy products.
 * Variant IDs are loaded from environment variables.
 */
export const CREDIT_PACKAGES: Record<CreditPackage, CreditPackageConfig> = {
  starter: {
    name: 'Starter',
    description: '가볍게 시작하기',
    credits: 10,
    priceUsd: 9,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_STARTER || '',
  },
  basic: {
    name: 'Basic',
    description: '인기 패키지',
    credits: 30,
    priceUsd: 19,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_BASIC || '',
    popular: true,
  },
  pro: {
    name: 'Pro',
    description: '전문가용',
    credits: 100,
    priceUsd: 49,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PRO || '',
  },
  business: {
    name: 'Business',
    description: '팀/기업용',
    credits: 300,
    priceUsd: 99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_BUSINESS || '',
  },
};
