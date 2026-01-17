'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2, CreditCard, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Badge } from '@/src/shared/ui/badge';

interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  billing_interval: string;
  amount_cents: number;
  currency: string;
  monthly_credits: number;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  profiles: {
    email: string | null;
    display_name: string | null;
  } | null;
}

interface Purchase {
  id: string;
  user_id: string;
  package: string;
  status: string;
  amount_cents: number;
  currency: string;
  credits_amount: number;
  created_at: string;
  completed_at: string | null;
  profiles: {
    email: string | null;
    display_name: string | null;
  } | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

type TabType = 'subscriptions' | 'purchases';

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subsPagination, setSubsPagination] = useState<Pagination | null>(null);
  const [purchasesPagination, setPurchasesPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: activeTab,
        page: page.toString(),
        pageSize: '20',
      });
      const res = await fetch(`/api/admin/payments?${params}`);
      if (!res.ok) throw new Error('Failed to fetch payments');
      const data = await res.json();

      if (activeTab === 'subscriptions') {
        setSubscriptions(data.subscriptions || []);
        setSubsPagination(data.subscriptionsPagination);
      } else {
        setPurchases(data.purchases || []);
        setPurchasesPagination(data.purchasesPagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const pagination = activeTab === 'subscriptions' ? subsPagination : purchasesPagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments & Revenue</h1>
        <p className="text-muted-foreground">View subscriptions and credit purchases</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'subscriptions'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CreditCard className="size-4" />
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'purchases'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Receipt className="size-4" />
          Credit Purchases
        </button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {activeTab === 'subscriptions' ? 'Subscriptions' : 'Credit Purchases'}
            {pagination && ` (${pagination.total.toLocaleString()})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : activeTab === 'subscriptions' ? (
            <SubscriptionsList subscriptions={subscriptions} />
          ) : (
            <PurchasesList purchases={purchases} />
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SubscriptionsList({ subscriptions }: { subscriptions: Subscription[] }) {
  if (subscriptions.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No subscriptions found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium">User</th>
            <th className="pb-3 font-medium">Plan</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Billing</th>
            <th className="pb-3 font-medium">Amount</th>
            <th className="pb-3 font-medium">Period End</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="border-b">
              <td className="py-3">
                <div>
                  <p className="font-medium">{sub.profiles?.display_name || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{sub.profiles?.email}</p>
                </div>
              </td>
              <td className="py-3">
                <Badge variant="outline" className="capitalize">
                  {sub.plan}
                </Badge>
              </td>
              <td className="py-3">
                <Badge
                  variant={sub.status === 'active' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {sub.status}
                </Badge>
              </td>
              <td className="py-3 capitalize">{sub.billing_interval}</td>
              <td className="py-3">
                ${(sub.amount_cents / 100).toFixed(2)} {sub.currency.toUpperCase()}
              </td>
              <td className="py-3">
                {new Date(sub.current_period_end).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PurchasesList({ purchases }: { purchases: Purchase[] }) {
  if (purchases.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No purchases found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium">User</th>
            <th className="pb-3 font-medium">Package</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Credits</th>
            <th className="pb-3 font-medium">Amount</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="border-b">
              <td className="py-3">
                <div>
                  <p className="font-medium">{purchase.profiles?.display_name || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{purchase.profiles?.email}</p>
                </div>
              </td>
              <td className="py-3">
                <Badge variant="outline" className="capitalize">
                  {purchase.package}
                </Badge>
              </td>
              <td className="py-3">
                <Badge
                  variant={purchase.status === 'completed' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {purchase.status}
                </Badge>
              </td>
              <td className="py-3">{purchase.credits_amount}</td>
              <td className="py-3">
                ${(purchase.amount_cents / 100).toFixed(2)} {purchase.currency.toUpperCase()}
              </td>
              <td className="py-3">
                {new Date(purchase.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
