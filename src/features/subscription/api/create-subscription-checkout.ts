'use server';

import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@/src/shared/lib/supabase/server';
import { SUBSCRIPTION_PLANS, getVariantId } from '../model/subscription-plans';
import type { SubscriptionPlan, BillingInterval } from '@/src/entities';

type CreateCheckoutResult =
  | {
      success: true;
      checkoutUrl: string;
    }
  | {
      success: false;
      error: string;
    };

export async function createSubscriptionCheckout(
  plan: SubscriptionPlan,
  interval: BillingInterval
): Promise<CreateCheckoutResult> {
  // 1. Validate plan exists
  const planConfig = SUBSCRIPTION_PLANS[plan];
  if (!planConfig) {
    return { success: false, error: '유효하지 않은 플랜입니다.' };
  }

  const variantId = getVariantId(plan, interval);
  if (!variantId) {
    return { success: false, error: '플랜 설정이 완료되지 않았습니다.' };
  }

  // 2. Get authenticated user
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  // 3. Check if user already has an active subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_status === 'active') {
    return { success: false, error: '이미 활성화된 구독이 있습니다. 설정에서 플랜을 변경하세요.' };
  }

  // 4. Initialize Lemon Squeezy SDK
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey || !storeId) {
    console.error('Lemon Squeezy configuration missing');
    return { success: false, error: '결제 시스템 설정 오류입니다.' };
  }

  lemonSqueezySetup({ apiKey });

  // 5. Create checkout for subscription
  try {
    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutOptions: {
        embed: true,
        media: false,
        desc: true,
      },
      checkoutData: {
        email: user.email ?? undefined,
        custom: {
          user_id: user.id,
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
        receiptButtonText: '대시보드로 이동',
        receiptLinkUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) {
      console.error('Subscription checkout creation failed:', error);
      return { success: false, error: '결제 페이지 생성에 실패했습니다.' };
    }

    return { success: true, checkoutUrl: data.data.attributes.url };
  } catch (err) {
    console.error('Subscription checkout error:', err);
    return { success: false, error: '결제 처리 중 오류가 발생했습니다.' };
  }
}
