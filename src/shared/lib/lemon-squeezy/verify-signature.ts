import crypto from 'node:crypto';

/**
 * Verify Lemon Squeezy webhook signature using timing-safe comparison.
 * Prevents timing attacks by using constant-time comparison.
 *
 * @param rawBody - Raw request body string
 * @param signature - X-Signature header value
 * @param secret - Webhook secret from environment
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !rawBody || !secret) return false;

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmac, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch {
    // Buffer length mismatch
    return false;
  }
}
