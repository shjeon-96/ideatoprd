'use client';

import { useUser } from '@/src/features/auth/hooks/use-user';
import { usePrds } from '@/src/features/prd/hooks/use-prds';
import { WelcomeModal } from './welcome-modal';

/**
 * Dashboard onboarding component
 * Shows welcome modal for new users without PRDs
 */
export function DashboardOnboarding() {
  const { user } = useUser();
  const { data, isLoading } = usePrds({ page: 1, pageSize: 1 });

  // Wait for data to load before showing modal
  if (isLoading || !user) {
    return null;
  }

  // Check if user is new (created within last 7 days)
  const userCreatedAt = new Date(user.created_at);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isNewUser = userCreatedAt > sevenDaysAgo;

  // Check if user has any PRDs
  const hasPrds = (data?.pagination.total ?? 0) > 0;

  return <WelcomeModal isNewUser={isNewUser} hasPrds={hasPrds} />;
}
