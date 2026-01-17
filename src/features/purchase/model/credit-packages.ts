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
    description: '체험용',
    credits: 5,
    priceUsd: 2.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_STARTER || '',
  },
  basic: {
    name: 'Basic',
    description: '개인용',
    credits: 15,
    priceUsd: 6.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_BASIC || '',
    popular: true,
  },
  pro: {
    name: 'Pro',
    description: '프리랜서용',
    credits: 50,
    priceUsd: 17.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PRO || '',
  },
  business: {
    name: 'Business',
    description: '팀/기업용',
    credits: 150,
    priceUsd: 39.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_BUSINESS || '',
  },
};
