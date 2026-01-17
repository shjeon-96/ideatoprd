import type { CreditPackage } from '@/src/entities';

/**
 * Credit package configuration type.
 */
export interface CreditPackageConfig {
  nameKey: string; // i18n key for package name
  descriptionKey: string; // i18n key for description
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
    nameKey: 'packages.starter.name',
    descriptionKey: 'packages.starter.description',
    credits: 5,
    priceUsd: 2.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_STARTER || '',
  },
  basic: {
    nameKey: 'packages.basic.name',
    descriptionKey: 'packages.basic.description',
    credits: 15,
    priceUsd: 6.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_BASIC || '',
    popular: true,
  },
  pro: {
    nameKey: 'packages.pro.name',
    descriptionKey: 'packages.pro.description',
    credits: 50,
    priceUsd: 17.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PRO || '',
  },
  business: {
    nameKey: 'packages.business.name',
    descriptionKey: 'packages.business.description',
    credits: 150,
    priceUsd: 39.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_BUSINESS || '',
  },
};
