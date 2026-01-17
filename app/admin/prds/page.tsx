'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import { Badge } from '@/src/shared/ui/badge';

interface Prd {
  id: string;
  title: string | null;
  idea: string;
  template: string;
  version: string;
  credits_used: number;
  created_at: string;
  user_id: string;
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

interface Stats {
  byTemplate: Record<string, number>;
  byVersion: Record<string, number>;
}

const TEMPLATES = ['saas', 'mobile', 'marketplace', 'extension', 'ai_wrapper'];
const VERSIONS = ['basic', 'detailed', 'research'];

export default function AdminPrdsPage() {
  const [prds, setPrds] = useState<Prd[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [template, setTemplate] = useState('');
  const [version, setVersion] = useState('');
  const [page, setPage] = useState(1);

  const fetchPrds = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        ...(search && { search }),
        ...(template && { template }),
        ...(version && { version }),
      });
      const res = await fetch(`/api/admin/prds?${params}`);
      if (!res.ok) throw new Error('Failed to fetch PRDs');
      const data = await res.json();
      setPrds(data.data);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, template, version]);

  useEffect(() => {
    fetchPrds();
  }, [fetchPrds]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPrds();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">PRD Monitoring</h1>
        <p className="text-muted-foreground">View all generated PRDs</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">By Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <Badge
                    key={t}
                    variant={template === t ? 'default' : 'secondary'}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      setTemplate(template === t ? '' : t);
                      setPage(1);
                    }}
                  >
                    {t}: {stats.byTemplate[t] || 0}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">By Version</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {VERSIONS.map((v) => (
                  <Badge
                    key={v}
                    variant={version === v ? 'default' : 'secondary'}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      setVersion(version === v ? '' : v);
                      setPage(1);
                    }}
                  >
                    {v}: {stats.byVersion[v] || 0}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or idea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        {(template || version) && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setTemplate('');
              setVersion('');
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        )}
      </form>

      {/* PRD List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            PRDs {pagination && `(${pagination.total.toLocaleString()})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : prds.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No PRDs found</p>
          ) : (
            <div className="space-y-3">
              {prds.map((prd) => (
                <div
                  key={prd.id}
                  className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground shrink-0" />
                        <h3 className="font-medium truncate">
                          {prd.title || 'Untitled PRD'}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {prd.idea}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {prd.template}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {prd.version}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {prd.credits_used} credits
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {prd.profiles?.email || 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(prd.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/prds/${prd.id}`}
                      target="_blank"
                      className="shrink-0"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
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
    </div>
  );
}
