import { NextResponse } from 'next/server';
import { createClient } from '@/src/shared/lib/supabase/server';
import { isAdminEmail } from '@/src/features/admin/config';

export async function GET() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();

    // Fetch all stats in parallel
    const [
      totalUsersResult,
      newUsersWeekResult,
      newUsersMonthResult,
      totalPrdsResult,
      prdsWeekResult,
      prdsTodayResult,
      activeSubscriptionsResult,
      totalRevenueResult,
      creditPurchasesResult,
      avgCreditsResult,
    ] = await Promise.all([
      // Total users
      supabase.from('profiles').select('id', { count: 'exact', head: true }),

      // New users this week
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo),

      // New users this month
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', monthAgo),

      // Total PRDs
      supabase.from('prds').select('id', { count: 'exact', head: true }),

      // PRDs this week
      supabase
        .from('prds')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo),

      // PRDs today
      supabase
        .from('prds')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', today),

      // Active subscriptions by plan
      supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('status', 'active'),

      // Total revenue from subscriptions
      supabase
        .from('subscriptions')
        .select('amount_cents')
        .eq('status', 'active'),

      // Credit purchases (completed)
      supabase
        .from('purchases')
        .select('amount_cents, credits_amount')
        .eq('status', 'completed'),

      // Average credits per user
      supabase
        .from('profiles')
        .select('credits'),
    ]);

    // Calculate subscription breakdown
    const subscriptionBreakdown = {
      basic: 0,
      pro: 0,
      business: 0,
    };

    activeSubscriptionsResult.data?.forEach((sub) => {
      const plan = sub.plan as keyof typeof subscriptionBreakdown;
      if (plan in subscriptionBreakdown) {
        subscriptionBreakdown[plan]++;
      }
    });

    // Calculate total MRR (Monthly Recurring Revenue)
    const mrr = (totalRevenueResult.data?.reduce((sum, sub) => sum + (sub.amount_cents || 0), 0) || 0) / 100;

    // Calculate total credit purchase revenue
    const creditRevenue = (creditPurchasesResult.data?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0) / 100;
    const totalCreditsSold = creditPurchasesResult.data?.reduce((sum, p) => sum + (p.credits_amount || 0), 0) || 0;

    // Calculate average credits per user
    const avgCredits = avgCreditsResult.data?.length
      ? Math.round(avgCreditsResult.data.reduce((sum, p) => sum + (p.credits || 0), 0) / avgCreditsResult.data.length)
      : 0;

    return NextResponse.json({
      users: {
        total: totalUsersResult.count || 0,
        newThisWeek: newUsersWeekResult.count || 0,
        newThisMonth: newUsersMonthResult.count || 0,
        avgCredits,
      },
      prds: {
        total: totalPrdsResult.count || 0,
        thisWeek: prdsWeekResult.count || 0,
        today: prdsTodayResult.count || 0,
      },
      subscriptions: {
        total: activeSubscriptionsResult.data?.length || 0,
        breakdown: subscriptionBreakdown,
        mrr,
      },
      revenue: {
        mrr,
        creditPurchases: creditRevenue,
        totalCreditsSold,
        total: mrr + creditRevenue,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
