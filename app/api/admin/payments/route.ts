import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/src/shared/lib/supabase/server';
import { isAdminEmail } from '@/src/features/admin/config';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'all'; // 'subscriptions', 'purchases', 'all'
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  try {
    const results: {
      subscriptions?: unknown[];
      purchases?: unknown[];
      subscriptionsPagination?: unknown;
      purchasesPagination?: unknown;
    } = {};

    if (type === 'subscriptions' || type === 'all') {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles:user_id (
            email,
            display_name
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      results.subscriptions = data || [];
      results.subscriptionsPagination = {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    }

    if (type === 'purchases' || type === 'all') {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('purchases')
        .select(`
          *,
          profiles:user_id (
            email,
            display_name
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      results.purchases = data || [];
      results.purchasesPagination = {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Admin payments error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
