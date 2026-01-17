'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/src/features/auth/hooks/use-user';
import { usePrds } from '@/src/features/prd/hooks/use-prds';
import { OnboardingChecklist } from './onboarding-checklist';

/**
 * Dashboard checklist wrapper component
 * Fetches necessary data and renders OnboardingChecklist
 */
export function DashboardChecklist() {
  const { user, profile } = useUser();
  const { data, isLoading } = usePrds({ page: 1, pageSize: 1 });
  const [hasExportedPrd, setHasExportedPrd] = useState(false);

  // Check localStorage for export status
  useEffect(() => {
    const exported = localStorage.getItem('hasExportedPrd');
    if (exported === 'true') {
      requestAnimationFrame(() => setHasExportedPrd(true));
    }
  }, []);

  // Don't render while loading
  if (isLoading || !user) {
    return null;
  }

  const hasPrds = (data?.pagination.total ?? 0) > 0;
  const hasSubscription = !!(profile?.subscription_plan && profile.subscription_status === 'active');

  // Don't show checklist if all items are complete
  const allComplete = hasPrds && hasExportedPrd && hasSubscription;
  if (allComplete) {
    return null;
  }

  return (
    <OnboardingChecklist
      isAccountCreated={true}
      hasPrds={hasPrds}
      hasExportedPrd={hasExportedPrd}
      hasSubscription={hasSubscription}
    />
  );
}
