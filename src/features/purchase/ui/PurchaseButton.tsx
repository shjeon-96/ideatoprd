'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { Button } from '@/src/shared/ui/button';
import { createCreditCheckout } from '../api/create-checkout';
import type { CreditPackage } from '@/src/entities';
import type { LemonSqueezyEvent } from '@/src/shared/lib/lemon-squeezy/lemon-types';

interface PurchaseButtonProps {
  packageKey: CreditPackage | null;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function PurchaseButton({
  packageKey,
  onSuccess,
  onError,
  disabled = false,
}: PurchaseButtonProps) {
  const t = useTranslations('purchase');
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Setup event handler when script loads
  useEffect(() => {
    if (!scriptLoaded || typeof window === 'undefined') return;

    // Initialize Lemon Squeezy with event handler
    window.LemonSqueezy?.Setup({
      eventHandler: (event: LemonSqueezyEvent) => {
        if (event.event === 'Checkout.Success') {
          onSuccess?.();
        }
      },
    });
  }, [scriptLoaded, onSuccess]);

  async function handlePurchase() {
    if (!packageKey) {
      onError?.(t('errors.selectPackage'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await createCreditCheckout(packageKey);

      if (!result.success) {
        onError?.(result.error);
        return;
      }

      // Open Lemon Squeezy checkout overlay
      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(result.checkoutUrl);
      } else {
        // Fallback: open in new tab
        window.open(result.checkoutUrl, '_blank');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      onError?.(t('errors.paymentError'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.createLemonSqueezy?.();
          setScriptLoaded(true);
        }}
      />
      <Button
        onClick={handlePurchase}
        disabled={disabled || !packageKey || isLoading}
        size="lg"
        className="w-full sm:w-auto"
      >
        {isLoading ? t('processing') : t('buyCredits')}
      </Button>
    </>
  );
}
