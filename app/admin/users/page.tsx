'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  CreditCard,
  Calendar,
  Plus,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import { Badge } from '@/src/shared/ui/badge';

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  credits: number;
  subscription_plan: string | null;
  subscription_status: string | null;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [creditAdjust, setCreditAdjust] = useState(0);
  const [adjusting, setAdjusting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleAdjustCredits = async (action: 'add' | 'subtract') => {
    if (!selectedUser || creditAdjust <= 0) return;

    setAdjusting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          credits: creditAdjust,
          action,
        }),
      });

      if (!res.ok) throw new Error('Failed to adjust credits');

      const data = await res.json();

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, credits: data.newCredits } : u
        )
      );
      setSelectedUser((prev) =>
        prev ? { ...prev, credits: data.newCredits } : null
      );
      setCreditAdjust(0);
    } catch (err) {
      console.error(err);
      alert('Failed to adjust credits');
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View and manage users</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* User List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Users {pagination && `(${pagination.total.toLocaleString()})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="size-6 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No users found
              </p>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                      selectedUser?.id === user.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                          <User className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.display_name || 'No name'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            user.subscription_status === 'active'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {user.subscription_plan || 'Free'}
                        </Badge>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {user.credits} credits
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
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

        {/* User Details Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">User Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">
                      {selectedUser.display_name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Plan:</span>
                    <Badge
                      variant={
                        selectedUser.subscription_status === 'active'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {selectedUser.subscription_plan || 'Free'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="font-medium">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Credits Section */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="mb-3 text-sm font-medium">Credits</p>
                  <p className="mb-4 text-3xl font-bold">
                    {selectedUser.credits}
                  </p>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={creditAdjust || ''}
                        onChange={(e) =>
                          setCreditAdjust(parseInt(e.target.value) || 0)
                        }
                        placeholder="Amount"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAdjustCredits('add')}
                        disabled={adjusting || creditAdjust <= 0}
                      >
                        {adjusting ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAdjustCredits('subtract')}
                        disabled={adjusting || creditAdjust <= 0}
                      >
                        {adjusting ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Minus className="size-4" />
                        )}
                        Subtract
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  User ID: {selectedUser.id}
                </p>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Select a user to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
