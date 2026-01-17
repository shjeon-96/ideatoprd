'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SubscriptionPlans } from '@/src/features/subscription/ui/SubscriptionPlans';
import { SubscriptionStatus } from '@/src/features/subscription/ui/SubscriptionStatus';
import { getActiveSubscription, type ActiveSubscription } from '@/src/features/subscription';
import { CreditBalance } from '@/src/features/purchase/ui/CreditBalance';
import { useUser } from '@/src/features/auth/hooks/use-user';

export default function SubscribePage() {
  const router = useRouter();
  const { profile, isLoading: isUserLoading } = useUser();
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      const result = await getActiveSubscription();
      if (result.success) {
        setSubscription(result.subscription);
      }
      setIsLoadingSubscription(false);
    }
    loadSubscription();
  }, []);

  const isLoading = isUserLoading || isLoadingSubscription;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-8 w-8 motion-safe:animate-spin rounded-full border-4 border-primary border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  // User has active subscription - show status
  if (subscription && (subscription.status === 'active' || subscription.status === 'cancelled')) {
    return (
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">내 구독</h1>
          <p className="mt-2 text-muted-foreground">
            현재 구독 상태와 혜택을 확인하세요.
          </p>
        </div>

        {/* Current subscription status */}
        <SubscriptionStatus subscription={subscription} className="mb-8" />

        {/* Current credits */}
        <div className="mb-8 flex items-center justify-between rounded-lg border bg-card p-4">
          <div>
            <h3 className="font-medium">현재 크레딧</h3>
            <p className="text-sm text-muted-foreground">
              크레딧은 PRD 생성에 사용됩니다.
            </p>
          </div>
          <CreditBalance credits={profile?.credits ?? 0} size="lg" />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            대시보드로 이동
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-muted"
          >
            <Sparkles className="h-4 w-4" />
            PRD 생성하기
          </Link>
        </div>

        {/* One-time purchase link */}
        <div className="mt-8 rounded-lg border bg-muted/30 p-4">
          <h3 className="font-medium">추가 크레딧이 필요하신가요?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            구독 크레딧 외에도 일회성 크레딧 패키지를 구매할 수 있습니다.
          </p>
          <Link
            href="/purchase"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            크레딧 구매하기
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  // No subscription - show plans
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">구독 플랜 선택</h1>
        <p className="mt-2 text-muted-foreground">
          매월 크레딧을 자동으로 충전받고, 더 저렴한 가격에 PRD를 생성하세요.
        </p>
      </div>

      {/* Current credits */}
      <div className="mb-8 flex justify-center">
        <CreditBalance credits={profile?.credits ?? 0} size="lg" />
      </div>

      {/* Subscription plans */}
      <SubscriptionPlans />

      {/* One-time purchase link */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          구독 없이 필요할 때만 구매하고 싶으신가요?
        </p>
        <Link
          href="/purchase"
          className="mt-2 inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          일회성 크레딧 패키지 보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Benefits comparison */}
      <div className="mt-12 rounded-lg border bg-muted/30 p-6">
        <h3 className="text-lg font-semibold">왜 구독이 더 좋은가요?</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="font-medium text-primary">✓ 더 저렴한 크레딧 단가</h4>
            <p className="text-sm text-muted-foreground">
              일회성 구매 대비 최대 40% 저렴한 크레딧 단가
            </p>
          </div>
          <div>
            <h4 className="font-medium text-primary">✓ 매월 자동 충전</h4>
            <p className="text-sm text-muted-foreground">
              매월 정해진 크레딧이 자동으로 충전됩니다
            </p>
          </div>
          <div>
            <h4 className="font-medium text-primary">✓ 크레딧 누적 가능</h4>
            <p className="text-sm text-muted-foreground">
              사용하지 않은 크레딧은 2개월치까지 누적됩니다
            </p>
          </div>
          <div>
            <h4 className="font-medium text-primary">✓ 연간 결제 시 20% 할인</h4>
            <p className="text-sm text-muted-foreground">
              연간 결제를 선택하면 추가 20% 할인을 받을 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
