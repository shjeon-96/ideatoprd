'use server';

import { createClient } from '@/src/shared/lib/supabase/server';
import type { ActiveSubscription } from '../model/types';

type GetSubscriptionResult =
  | {
      success: true;
      subscription: ActiveSubscription | null;
    }
  | {
      success: false;
      error: string;
    };

export async function getActiveSubscription(): Promise<GetSubscriptionResult> {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  // 2. Call RPC function to get active subscription
  const { data, error } = await supabase.rpc('get_active_subscription', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Failed to get subscription:', error);
    return { success: false, error: '구독 정보 조회에 실패했습니다.' };
  }

  // 3. Return null if no active subscription
  if (!data || data.length === 0) {
    return { success: true, subscription: null };
  }

  // 4. Transform to ActiveSubscription type
  const sub = data[0];
  const subscription: ActiveSubscription = {
    id: sub.id,
    plan: sub.plan,
    status: sub.status,
    billingInterval: sub.billing_interval,
    monthlyCredits: sub.monthly_credits,
    creditCap: sub.credit_cap,
    currentPeriodEnd: new Date(sub.current_period_end),
    cancelledAt: sub.cancelled_at ? new Date(sub.cancelled_at) : null,
    endsAt: sub.ends_at ? new Date(sub.ends_at) : null,
  };

  return { success: true, subscription };
}
