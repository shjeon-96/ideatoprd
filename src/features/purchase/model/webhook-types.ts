/**
 * Lemon Squeezy Webhook Types
 *
 * Type definitions for Lemon Squeezy webhook payloads.
 * Based on Lemon Squeezy API documentation.
 */

export interface LemonSqueezyWebhookMeta {
  event_name:
    | 'order_created'
    | 'order_refunded'
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_cancelled';
  custom_data?: {
    user_id?: string;
  };
  webhook_id: string;
}

export interface LemonSqueezyOrderAttributes {
  store_id: number;
  customer_id: number;
  identifier: string;
  order_number: number;
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
  tax_name: string | null;
  status: 'pending' | 'failed' | 'paid' | 'refunded';
  status_formatted: string;
  refunded: boolean;
  refunded_at: string | null;
  first_order_item: {
    id: number;
    order_id: number;
    product_id: number;
    variant_id: number;
    product_name: string;
    variant_name: string;
    price: number;
    quantity: number;
    created_at: string;
    updated_at: string;
  };
  test_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface LemonSqueezyWebhookEvent {
  meta: LemonSqueezyWebhookMeta;
  data: {
    type: 'orders';
    id: string;
    attributes: LemonSqueezyOrderAttributes;
  };
}
