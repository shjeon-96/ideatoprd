/**
 * Purchase Feature (FSD)
 *
 * Credit purchase and payment integration with Lemon Squeezy.
 *
 * Exports:
 * - model: Credit packages, variant mapping, webhook types
 * - api: Checkout actions (to be added in 06-02)
 * - ui: Purchase UI components (to be added in 06-02)
 */

export { CREDIT_PACKAGES, type CreditPackageConfig } from './model';
export { getPackageByVariantId } from './model';
// UI exports will be added in 06-02
