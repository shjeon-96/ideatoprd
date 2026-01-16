'use server';

import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@/src/shared/lib/supabase/server';
import { CREDIT_PACKAGES } from '../model/credit-packages';
import type { CreditPackage } from '@/src/entities';

type CreateCheckoutResult =
  | {
      success: true;
      checkoutUrl: string;
    }
  | {
      success: false;
      error: string;
    };

export async function createCreditCheckout(
  packageKey: CreditPackage
): Promise<CreateCheckoutResult> {
  // 1. Validate package exists
  const packageConfig = CREDIT_PACKAGES[packageKey];
  if (!packageConfig) {
    return { success: false, error: '유효하지 않은 패키지입니다.' };
  }

  if (!packageConfig.variantId) {
    return { success: false, error: '패키지 설정이 완료되지 않았습니다.' };
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

  // 3. Initialize Lemon Squeezy SDK
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey || !storeId) {
    console.error('Lemon Squeezy configuration missing');
    return { success: false, error: '결제 시스템 설정 오류입니다.' };
  }

  lemonSqueezySetup({ apiKey });

  // 4. Create checkout
  try {
    const { data, error } = await createCheckout(storeId, packageConfig.variantId, {
      checkoutOptions: {
        embed: true, // Enable overlay mode
        media: false, // Hide product media
        desc: true, // Show description
      },
      checkoutData: {
        email: user.email ?? undefined,
        custom: {
          user_id: user.id, // Pass user ID for webhook
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchase=success`,
        receiptButtonText: '대시보드로 이동',
        receiptLinkUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) {
      console.error('Checkout creation failed:', error);
      return { success: false, error: '결제 페이지 생성에 실패했습니다.' };
    }

    return { success: true, checkoutUrl: data.data.attributes.url };
  } catch (err) {
    console.error('Checkout error:', err);
    return { success: false, error: '결제 처리 중 오류가 발생했습니다.' };
  }
}
