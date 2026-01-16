/**
 * Purchase Feature (FSD)
 *
 * Credit purchase and payment integration with Lemon Squeezy.
 *
 * Exports:
 * - model: Credit packages, variant mapping, webhook types
 * - api: Checkout actions, purchase history
 * - ui: Purchase UI components
 */

export { CREDIT_PACKAGES, type CreditPackageConfig } from './model';
export { getPackageByVariantId } from './model';
export {
  CreditPackages,
  PurchaseButton,
  CreditBalance,
  InsufficientCreditsModal,
  PurchaseHistory,
} from './ui';
// Server actions: import directly from ./api/* in server contexts
// - ./api/create-checkout for checkout
// - ./api/get-purchases for purchase history
export type { PurchaseWithDetails } from './api/get-purchases';
