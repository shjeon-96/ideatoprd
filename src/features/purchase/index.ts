/**
 * Purchase Feature (FSD)
 *
 * Credit purchase and payment integration with Lemon Squeezy.
 *
 * Exports:
 * - model: Credit packages, variant mapping, webhook types
 * - api: Checkout actions
 * - ui: Purchase UI components
 */

export { CREDIT_PACKAGES, type CreditPackageConfig } from './model';
export { getPackageByVariantId } from './model';
export { CreditPackages, PurchaseButton, CreditBalance } from './ui';
// Server action: import directly from ./api/create-checkout in server contexts
