import { createClient } from '@/src/shared/lib/supabase/server';
import type { Purchase } from '@/src/entities';

export interface PurchaseWithDetails extends Purchase {
  packageName: string;
}

export async function getUserPurchases(): Promise<PurchaseWithDetails[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch purchases:', error);
    return [];
  }

  // Map package enum to display name
  const packageNames: Record<string, string> = {
    starter: 'Starter',
    basic: 'Basic',
    pro: 'Pro',
    business: 'Business',
  };

  return (data ?? []).map((purchase) => ({
    ...purchase,
    packageName: packageNames[purchase.package] || purchase.package,
  }));
}
