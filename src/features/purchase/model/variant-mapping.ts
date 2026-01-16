import { CREDIT_PACKAGES, type CreditPackageConfig } from './credit-packages';
import type { CreditPackage } from '@/src/entities';

/**
 * Find credit package by Lemon Squeezy variant ID.
 * Used in webhook handler to determine credits to add.
 *
 * @param variantId - Variant ID from Lemon Squeezy (number or string)
 * @returns Package key and config, or null if not found
 */
export function getPackageByVariantId(variantId: number | string): {
  key: CreditPackage;
  config: CreditPackageConfig;
} | null {
  const variantIdStr = String(variantId);

  for (const [key, config] of Object.entries(CREDIT_PACKAGES)) {
    if (config.variantId === variantIdStr) {
      return { key: key as CreditPackage, config };
    }
  }
  return null;
}
