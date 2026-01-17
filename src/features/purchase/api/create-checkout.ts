'use server';

import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@/src/shared/lib/supabase/server';
import { ErrorCodes } from '@/src/shared/lib/errors';
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
    return { success: false, error: ErrorCodes.PACKAGE_INVALID };
  }

  if (!packageConfig.variantId) {
    return { success: false, error: ErrorCodes.PACKAGE_NOT_CONFIGURED };
  }

  // 2. Get authenticated user
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: ErrorCodes.AUTH_REQUIRED };
  }

  // 3. Initialize Lemon Squeezy SDK
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey || !storeId) {
    console.error('Lemon Squeezy configuration missing');
    return { success: false, error: ErrorCodes.PAYMENT_SYSTEM_ERROR };
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
      return { success: false, error: ErrorCodes.PAYMENT_CHECKOUT_FAILED };
    }

    return { success: true, checkoutUrl: data.data.attributes.url };
  } catch (err) {
    console.error('Checkout error:', err);
    return { success: false, error: ErrorCodes.PAYMENT_PROCESSING_ERROR };
  }
}
