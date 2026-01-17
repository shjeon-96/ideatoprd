import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/src/shared/lib/lemon-squeezy/verify-signature';
import { getPackageByVariantId } from '@/src/features/purchase/model/variant-mapping';
import {
  getSubscriptionByVariantId,
  isSubscriptionVariant,
} from '@/src/features/subscription/model/variant-mapping';
import type { LemonSqueezyWebhookEvent } from '@/src/features/purchase/model/webhook-types';
import type {
  LemonSqueezySubscriptionWebhookEvent,
  LemonSqueezySubscriptionInvoiceWebhookEvent,
  SubscriptionEventName,
} from '@/src/features/subscription/model/webhook-types';
import type { Database } from '@/src/shared/types/database';

// crypto module requires Node.js runtime
export const runtime = 'nodejs';

// Combined event types
type WebhookEventName =
  | 'order_created'
  | 'order_refunded'
  | SubscriptionEventName;

interface WebhookMeta {
  event_name: WebhookEventName;
  custom_data?: {
    user_id?: string;
  };
  webhook_id: string;
}

interface GenericWebhookEvent {
  meta: WebhookMeta;
  data: {
    type: string;
    id: string;
    attributes: Record<string, unknown>;
    relationships?: Record<string, unknown>;
  };
}

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    console.error('LEMONSQUEEZY_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // 1. Read raw body (must be done before any parsing)
  const rawBody = await request.text();

  // 2. Verify signature
  const signature = request.headers.get('X-Signature') ?? '';

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    console.error('Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // 3. Parse event
  let event: GenericWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = event.meta.event_name;

  // 4. Create Supabase client with service role (bypass RLS)
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 5. Route to appropriate handler
  switch (eventName) {
    case 'order_created':
      return handleOrderCreated(event as unknown as LemonSqueezyWebhookEvent, supabase);

    case 'subscription_created':
      return handleSubscriptionCreated(
        event as unknown as LemonSqueezySubscriptionWebhookEvent,
        supabase
      );

    case 'subscription_payment_success':
      return handleSubscriptionPaymentSuccess(
        event as unknown as LemonSqueezySubscriptionInvoiceWebhookEvent,
        supabase
      );

    case 'subscription_cancelled':
      return handleSubscriptionCancelled(
        event as unknown as LemonSqueezySubscriptionWebhookEvent,
        supabase
      );

    case 'subscription_expired':
      return handleSubscriptionExpired(
        event as unknown as LemonSqueezySubscriptionWebhookEvent,
        supabase
      );

    case 'subscription_resumed':
      return handleSubscriptionResumed(
        event as unknown as LemonSqueezySubscriptionWebhookEvent,
        supabase
      );

    default:
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
  }
}

// ============================================================================
// Order Handlers (existing functionality)
// ============================================================================

async function handleOrderCreated(
  event: LemonSqueezyWebhookEvent,
  supabase: ReturnType<typeof createClient<Database>>
) {
  const orderId = event.data.id;
  const userId = event.meta.custom_data?.user_id;
  const status = event.data.attributes.status;
  const testMode = event.data.attributes.test_mode;
  const variantId = event.data.attributes.first_order_item.variant_id;

  // Skip if this is a subscription variant (handled by subscription_created)
  if (isSubscriptionVariant(variantId)) {
    return NextResponse.json({ message: 'Subscription order, handled separately' }, { status: 200 });
  }

  // Validate required data
  if (!userId) {
    console.error('Missing user_id in custom_data');
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  if (status !== 'paid') {
    return NextResponse.json({ message: 'Order not paid' }, { status: 200 });
  }

  // Skip test orders in production
  if (testMode && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Test order ignored' }, { status: 200 });
  }

  // Get package info from variant ID
  const packageInfo = getPackageByVariantId(variantId);

  if (!packageInfo) {
    console.error(`Unknown variant ID: ${variantId}`);
    return NextResponse.json({ error: 'Unknown variant' }, { status: 400 });
  }

  // Insert purchase record (idempotency via UNIQUE constraint)
  const { error: insertError } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      package: packageInfo.key,
      credits_amount: packageInfo.config.credits,
      amount_cents: event.data.attributes.total,
      currency: event.data.attributes.currency,
      lemon_squeezy_order_id: orderId,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

  if (insertError) {
    // 23505 = unique_violation (already processed - idempotent)
    if (insertError.code === '23505') {
      return NextResponse.json({ message: 'Already processed' }, { status: 200 });
    }

    console.error('[CRITICAL] Failed to insert purchase:', insertError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Add credits using existing RPC function
  const { error: creditError } = await supabase.rpc('add_credit', {
    p_user_id: userId,
    p_amount: packageInfo.config.credits,
    p_usage_type: 'credit_purchase',
    p_description: `Credit purchase: ${packageInfo.config.name} package (order ${orderId})`,
  });

  if (creditError) {
    // Rollback: delete the purchase record since credits couldn't be added
    const { error: rollbackError } = await supabase
      .from('purchases')
      .delete()
      .eq('lemon_squeezy_order_id', orderId);

    if (rollbackError) {
      console.error('[CRITICAL] Failed to rollback purchase after credit failure:', {
        orderId,
        userId,
        creditError,
        rollbackError,
      });
    }

    return NextResponse.json({ error: 'Credit addition failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

// ============================================================================
// Subscription Handlers
// ============================================================================

async function handleSubscriptionCreated(
  event: LemonSqueezySubscriptionWebhookEvent,
  supabase: ReturnType<typeof createClient<Database>>
) {
  const subscriptionId = event.data.id;
  const userId = event.meta.custom_data?.user_id;
  const attrs = event.data.attributes;
  const testMode = attrs.test_mode;

  // Validate required data
  if (!userId) {
    console.error('Missing user_id in custom_data for subscription');
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  // Skip test in production
  if (testMode && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Test subscription ignored' }, { status: 200 });
  }

  // Get subscription plan info from variant ID
  const planInfo = getSubscriptionByVariantId(attrs.variant_id);

  if (!planInfo) {
    console.error(`Unknown subscription variant ID: ${attrs.variant_id}`);
    return NextResponse.json({ error: 'Unknown subscription variant' }, { status: 400 });
  }

  // Calculate billing period
  const now = new Date();
  const periodEnd = attrs.renews_at ? new Date(attrs.renews_at) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Insert subscription record
  const { data: subscription, error: insertError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan: planInfo.key,
      status: 'active',
      billing_interval: planInfo.interval,
      lemon_squeezy_subscription_id: subscriptionId,
      lemon_squeezy_customer_id: String(attrs.customer_id),
      lemon_squeezy_variant_id: String(attrs.variant_id),
      monthly_credits: planInfo.config.monthlyCredits,
      credit_cap: planInfo.config.creditCap,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      amount_cents: planInfo.interval === 'monthly'
        ? planInfo.config.monthlyPrice * 100
        : planInfo.config.yearlyPrice * 100,
      currency: 'USD',
    })
    .select('id')
    .single();

  if (insertError) {
    // Idempotency check
    if (insertError.code === '23505') {
      return NextResponse.json({ message: 'Subscription already exists' }, { status: 200 });
    }

    console.error('[CRITICAL] Failed to insert subscription:', insertError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Update profile with subscription info
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      subscription_plan: planInfo.key,
      subscription_status: 'active',
      subscription_renews_at: periodEnd.toISOString(),
    })
    .eq('id', userId);

  if (profileError) {
    console.error('Failed to update profile with subscription:', profileError);
    // Continue - subscription record is already created
  }

  // Grant initial credits
  const { error: creditError } = await supabase.rpc('grant_subscription_credits', {
    p_user_id: userId,
    p_amount: planInfo.config.monthlyCredits,
    p_credit_cap: planInfo.config.creditCap,
    p_subscription_id: subscription.id,
    p_description: `Initial subscription credit: ${planInfo.config.name} plan`,
  });

  if (creditError) {
    console.error('Failed to grant initial subscription credits:', creditError);
    // Don't fail the webhook - subscription is created, credits can be manually added
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

async function handleSubscriptionPaymentSuccess(
  event: LemonSqueezySubscriptionInvoiceWebhookEvent,
  supabase: ReturnType<typeof createClient<Database>>
) {
  const attrs = event.data.attributes;
  const subscriptionLsId = String(event.data.relationships.subscription.data.id);
  const billingReason = attrs.billing_reason;
  const testMode = attrs.test_mode;

  // Skip initial payment (already handled in subscription_created)
  if (billingReason === 'initial') {
    return NextResponse.json({ message: 'Initial payment, credits already granted' }, { status: 200 });
  }

  // Skip test in production
  if (testMode && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Test payment ignored' }, { status: 200 });
  }

  // Get subscription from database
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('lemon_squeezy_subscription_id', subscriptionLsId)
    .single();

  if (subError || !subscription) {
    console.error('Subscription not found for payment:', subscriptionLsId);
    return NextResponse.json({ error: 'Subscription not found' }, { status: 400 });
  }

  // Calculate new period
  const now = new Date();
  const periodEnd = new Date(now);
  if (subscription.billing_interval === 'monthly') {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  // Update subscription period
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
    })
    .eq('id', subscription.id);

  if (updateError) {
    console.error('Failed to update subscription period:', updateError);
  }

  // Update profile renewal date
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_renews_at: periodEnd.toISOString(),
    })
    .eq('id', subscription.user_id);

  // Grant monthly credits (with cap)
  const { data: creditsGranted, error: creditError } = await supabase.rpc('grant_subscription_credits', {
    p_user_id: subscription.user_id,
    p_amount: subscription.monthly_credits,
    p_credit_cap: subscription.credit_cap,
    p_subscription_id: subscription.id,
    p_description: `Monthly subscription credit renewal: ${subscription.plan} plan`,
  });

  if (creditError) {
    console.error('Failed to grant renewal credits:', creditError);
    // Don't fail webhook - payment processed, credits can be manually added
  }

  console.log(`Subscription renewal: ${subscription.plan} plan, granted ${creditsGranted} credits`);

  return NextResponse.json({ success: true }, { status: 200 });
}

async function handleSubscriptionCancelled(
  event: LemonSqueezySubscriptionWebhookEvent,
  supabase: ReturnType<typeof createClient<Database>>
) {
  const subscriptionLsId = event.data.id;
  const attrs = event.data.attributes;

  // Get subscription from database
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .eq('lemon_squeezy_subscription_id', subscriptionLsId)
    .single();

  if (subError || !subscription) {
    console.error('Subscription not found for cancellation:', subscriptionLsId);
    return NextResponse.json({ error: 'Subscription not found' }, { status: 400 });
  }

  // Update subscription status
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      ends_at: attrs.ends_at || null,
    })
    .eq('id', subscription.id);

  if (updateError) {
    console.error('Failed to update subscription cancellation:', updateError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Update profile - subscription remains active until ends_at
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      subscription_renews_at: attrs.ends_at || null,
    })
    .eq('id', subscription.user_id);

  return NextResponse.json({ success: true }, { status: 200 });
}

async function handleSubscriptionExpired(
  event: LemonSqueezySubscriptionWebhookEvent,
  supabase: ReturnType<typeof createClient<Database>>
) {
  const subscriptionLsId = event.data.id;

  // Get subscription from database
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .eq('lemon_squeezy_subscription_id', subscriptionLsId)
    .single();

  if (subError || !subscription) {
    console.error('Subscription not found for expiration:', subscriptionLsId);
    return NextResponse.json({ error: 'Subscription not found' }, { status: 400 });
  }

  // Update subscription status
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'expired',
    })
    .eq('id', subscription.id);

  if (updateError) {
    console.error('Failed to update subscription expiration:', updateError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Remove subscription info from profile
  await supabase
    .from('profiles')
    .update({
      subscription_plan: null,
      subscription_status: null,
      subscription_renews_at: null,
    })
    .eq('id', subscription.user_id);

  return NextResponse.json({ success: true }, { status: 200 });
}

async function handleSubscriptionResumed(
  event: LemonSqueezySubscriptionWebhookEvent,
  supabase: ReturnType<typeof createClient<Database>>
) {
  const subscriptionLsId = event.data.id;
  const attrs = event.data.attributes;

  // Get subscription from database
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan')
    .eq('lemon_squeezy_subscription_id', subscriptionLsId)
    .single();

  if (subError || !subscription) {
    console.error('Subscription not found for resume:', subscriptionLsId);
    return NextResponse.json({ error: 'Subscription not found' }, { status: 400 });
  }

  // Update subscription status
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      cancelled_at: null,
      ends_at: null,
    })
    .eq('id', subscription.id);

  if (updateError) {
    console.error('Failed to update subscription resume:', updateError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Update profile
  await supabase
    .from('profiles')
    .update({
      subscription_plan: subscription.plan,
      subscription_status: 'active',
      subscription_renews_at: attrs.renews_at || null,
    })
    .eq('id', subscription.user_id);

  return NextResponse.json({ success: true }, { status: 200 });
}
