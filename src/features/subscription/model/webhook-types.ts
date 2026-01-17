/**
 * Lemon Squeezy Subscription Webhook Types
 *
 * Type definitions for subscription-related webhook payloads.
 * Based on Lemon Squeezy API documentation.
 */

export type SubscriptionEventName =
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_resumed'
  | 'subscription_expired'
  | 'subscription_paused'
  | 'subscription_unpaused'
  | 'subscription_payment_success'
  | 'subscription_payment_failed'
  | 'subscription_payment_recovered';

export interface LemonSqueezySubscriptionMeta {
  event_name: SubscriptionEventName;
  custom_data?: {
    user_id?: string;
  };
  webhook_id: string;
}

export type SubscriptionStatus =
  | 'on_trial'
  | 'active'
  | 'paused'
  | 'past_due'
  | 'unpaid'
  | 'cancelled'
  | 'expired';

export interface LemonSqueezySubscriptionAttributes {
  store_id: number;
  customer_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  user_name: string;
  user_email: string;
  status: SubscriptionStatus;
  status_formatted: string;
  card_brand: string | null;
  card_last_four: string | null;
  pause: {
    mode: string | null;
    resumes_at: string | null;
  } | null;
  cancelled: boolean;
  trial_ends_at: string | null;
  billing_anchor: number;
  first_subscription_item: {
    id: number;
    subscription_id: number;
    price_id: number;
    quantity: number;
    is_usage_based: boolean;
    created_at: string;
    updated_at: string;
  };
  urls: {
    update_payment_method: string;
    customer_portal: string;
    customer_portal_update_subscription: string;
  };
  renews_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
}

export interface LemonSqueezySubscriptionWebhookEvent {
  meta: LemonSqueezySubscriptionMeta;
  data: {
    type: 'subscriptions';
    id: string;
    attributes: LemonSqueezySubscriptionAttributes;
  };
}

/**
 * Subscription invoice/payment related attributes.
 * Used for subscription_payment_success events.
 */
export interface LemonSqueezySubscriptionInvoiceAttributes {
  store_id: number;
  subscription_id: number;
  customer_id: number;
  user_name: string;
  user_email: string;
  billing_reason: 'initial' | 'renewal' | 'updated';
  card_brand: string | null;
  card_last_four: string | null;
  currency: string;
  currency_rate: string;
  subtotal: number;
  discount_total: number;
  tax: number;
  total: number;
  subtotal_usd: number;
  discount_total_usd: number;
  tax_usd: number;
  total_usd: number;
  status: 'pending' | 'paid' | 'void' | 'refunded';
  status_formatted: string;
  refunded: boolean;
  refunded_at: string | null;
  urls: {
    invoice_url: string;
  };
  created_at: string;
  updated_at: string;
  test_mode: boolean;
}

export interface LemonSqueezySubscriptionInvoiceWebhookEvent {
  meta: LemonSqueezySubscriptionMeta;
  data: {
    type: 'subscription-invoices';
    id: string;
    attributes: LemonSqueezySubscriptionInvoiceAttributes;
    relationships: {
      store: { data: { type: 'stores'; id: string } };
      subscription: { data: { type: 'subscriptions'; id: string } };
      customer: { data: { type: 'customers'; id: string } };
    };
  };
}
