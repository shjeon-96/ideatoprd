'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CreditPackages } from '@/src/features/purchase/ui/CreditPackages';
import { PurchaseButton } from '@/src/features/purchase/ui/PurchaseButton';
import { CreditBalance } from '@/src/features/purchase/ui/CreditBalance';
import { useUser } from '@/src/features/auth/hooks/use-user';
import type { CreditPackage } from '@/src/entities';

export default function PurchasePage() {
  const router = useRouter();
  const { profile, isLoading: isUserLoading, refetch } = useUser();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = useCallback(async () => {
    // Refresh user profile to get updated credits
    await refetch();
    // Redirect to dashboard with success message
    router.push('/dashboard?purchase=success');
  }, [refetch, router]);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  if (isUserLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-8 w-8 motion-safe:animate-spin rounded-full border-4 border-primary border-t-transparent"
          role="status"
          aria-label="로딩 중"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">크레딧 구매</h1>
          <p className="mt-2 text-muted-foreground">
            PRD 생성에 필요한 크레딧을 구매하세요.
          </p>
        </div>
        <CreditBalance credits={profile?.credits ?? 0} size="lg" />
      </div>

      {/* Error message */}
      {error ? (
        <div role="alert" className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-sm underline">
            닫기
          </button>
        </div>
      ) : null}

      {/* Package selection */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">패키지 선택</h2>
        <CreditPackages selectedPackage={selectedPackage} onSelect={setSelectedPackage} />
      </div>

      {/* Credit usage info */}
      <div className="mb-8 rounded-lg border bg-muted/30 p-4">
        <h3 className="font-medium">크레딧 사용 안내</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>- 기본 PRD 생성: 1 크레딧</li>
          <li>- 상세 PRD 생성: 3 크레딧</li>
          <li>- 크레딧은 유효기간 없이 영구 사용 가능합니다.</li>
        </ul>
      </div>

      {/* Purchase button */}
      <div className="flex justify-center">
        <PurchaseButton
          packageKey={selectedPackage}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>

      {/* Footer note */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        결제는 Lemon Squeezy를 통해 안전하게 처리됩니다.
        <br />
        문의사항은 support@ideatoprd.com으로 연락해주세요.
      </p>
    </div>
  );
}
