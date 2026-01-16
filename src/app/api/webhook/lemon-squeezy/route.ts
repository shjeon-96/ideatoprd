import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/src/shared/lib/lemon-squeezy/verify-signature';
import { getPackageByVariantId } from '@/src/features/purchase/model/variant-mapping';
import type { LemonSqueezyWebhookEvent } from '@/src/features/purchase/model/webhook-types';
import type { Database } from '@/src/shared/types/database';

// crypto module requires Node.js runtime
export const runtime = 'nodejs';

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
  let event: LemonSqueezyWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = event.meta.event_name;
  console.log(`Received webhook: ${eventName}`);

  // 4. Only process order_created events
  if (eventName !== 'order_created') {
    return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
  }

  const orderId = event.data.id;
  const userId = event.meta.custom_data?.user_id;
  const status = event.data.attributes.status;
  const testMode = event.data.attributes.test_mode;

  // 5. Validate required data
  if (!userId) {
    console.error('Missing user_id in custom_data');
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  if (status !== 'paid') {
    console.log(`Order ${orderId} status is ${status}, skipping`);
    return NextResponse.json({ message: 'Order not paid' }, { status: 200 });
  }

  // 6. Skip test orders in production
  if (testMode && process.env.NODE_ENV === 'production') {
    console.log(`Test order ${orderId} ignored in production`);
    return NextResponse.json({ message: 'Test order ignored' }, { status: 200 });
  }

  // 7. Get package info from variant ID
  const variantId = event.data.attributes.first_order_item.variant_id;
  const packageInfo = getPackageByVariantId(variantId);

  if (!packageInfo) {
    console.error(`Unknown variant ID: ${variantId}`);
    return NextResponse.json({ error: 'Unknown variant' }, { status: 400 });
  }

  // 8. Create Supabase client with service role (bypass RLS)
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 9. Insert purchase record (idempotency via UNIQUE constraint)
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
    // 23505 = unique_violation (already processed)
    if (insertError.code === '23505') {
      console.log(`Order ${orderId} already processed`);
      return NextResponse.json({ message: 'Already processed' }, { status: 200 });
    }

    console.error('Failed to insert purchase:', insertError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // 10. Add credits using existing RPC function
  const { error: creditError } = await supabase.rpc('add_credit', {
    p_user_id: userId,
    p_amount: packageInfo.config.credits,
    p_usage_type: 'credit_purchase',
    p_description: `Credit purchase: ${packageInfo.config.name} package (order ${orderId})`,
  });

  if (creditError) {
    console.error('Failed to add credits:', creditError);
    // Purchase recorded but credits failed - needs manual intervention
    return NextResponse.json({ error: 'Credit addition failed' }, { status: 500 });
  }

  console.log(`Successfully processed order ${orderId}: +${packageInfo.config.credits} credits for user ${userId}`);

  return NextResponse.json({ success: true }, { status: 200 });
}
