'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Loader2,
  DollarSign,
  Activity,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';

interface Stats {
  users: {
    total: number;
    newThisWeek: number;
    newThisMonth: number;
    avgCredits: number;
  };
  prds: {
    total: number;
    thisWeek: number;
    today: number;
  };
  subscriptions: {
    total: number;
    breakdown: {
      basic: number;
      pro: number;
      business: number;
    };
    mrr: number;
  };
  revenue: {
    mrr: number;
    creditPurchases: number;
    totalCreditsSold: number;
    total: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
        {error || 'Failed to load stats'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your SaaS metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.users.total.toLocaleString()}
          subtitle={`+${stats.users.newThisWeek} this week`}
          icon={Users}
          trend={stats.users.newThisWeek > 0 ? 'up' : 'neutral'}
        />
        <StatCard
          title="Total PRDs"
          value={stats.prds.total.toLocaleString()}
          subtitle={`${stats.prds.today} today, ${stats.prds.thisWeek} this week`}
          icon={FileText}
          trend={stats.prds.today > 0 ? 'up' : 'neutral'}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.subscriptions.total.toLocaleString()}
          subtitle={`B:${stats.subscriptions.breakdown.basic} P:${stats.subscriptions.breakdown.pro} E:${stats.subscriptions.breakdown.business}`}
          icon={CreditCard}
        />
        <StatCard
          title="MRR"
          value={`$${stats.revenue.mrr.toLocaleString()}`}
          subtitle={`Total: $${stats.revenue.total.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          highlight
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Activity className="size-4 text-muted-foreground" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">New users (week)</span>
                <span className="font-medium">{stats.users.newThisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">New users (month)</span>
                <span className="font-medium">{stats.users.newThisMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg credits/user</span>
                <span className="font-medium">{stats.users.avgCredits}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Zap className="size-4 text-muted-foreground" />
              PRD Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total PRDs</span>
                <span className="font-medium">{stats.prds.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This week</span>
                <span className="font-medium">{stats.prds.thisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="font-medium">{stats.prds.today}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="size-4 text-muted-foreground" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">MRR</span>
                <span className="font-medium">${stats.revenue.mrr.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Credit purchases</span>
                <span className="font-medium">${stats.revenue.creditPurchases.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Credits sold</span>
                <span className="font-medium">{stats.revenue.totalCreditsSold}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Basic</span>
                <span className="text-sm text-muted-foreground">
                  {stats.subscriptions.breakdown.basic} users
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: `${stats.subscriptions.total ? (stats.subscriptions.breakdown.basic / stats.subscriptions.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Pro</span>
                <span className="text-sm text-muted-foreground">
                  {stats.subscriptions.breakdown.pro} users
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{
                    width: `${stats.subscriptions.total ? (stats.subscriptions.breakdown.pro / stats.subscriptions.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Business</span>
                <span className="text-sm text-muted-foreground">
                  {stats.subscriptions.breakdown.business} users
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-amber-500"
                  style={{
                    width: `${stats.subscriptions.total ? (stats.subscriptions.breakdown.business / stats.subscriptions.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, highlight }: StatCardProps) {
  return (
    <Card className={highlight ? 'border-brand-primary/50 bg-brand-secondary/20' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`size-4 ${highlight ? 'text-brand-primary' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-muted-foreground'}`}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}
