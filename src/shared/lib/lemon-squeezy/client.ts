import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

/**
 * Initialize Lemon Squeezy SDK with API key from environment.
 * Must be called before using any Lemon Squeezy API methods.
 *
 * @throws Error if LEMONSQUEEZY_API_KEY is not configured
 */
export function initLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error('LEMONSQUEEZY_API_KEY is not configured');
  }
  lemonSqueezySetup({ apiKey });
}
