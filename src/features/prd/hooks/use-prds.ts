'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PrdListItem } from '../api/get-prds';

interface PaginatedPrdsResponse {
  data: PrdListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UsePrdsOptions {
  page?: number;
  pageSize?: number;
  workspaceId?: string | null;
}

// Query key factory for PRDs
export const prdKeys = {
  all: ['prds'] as const,
  lists: () => [...prdKeys.all, 'list'] as const,
  list: (filters: { page: number; pageSize: number; workspaceId?: string | null }) =>
    [...prdKeys.lists(), filters] as const,
  details: () => [...prdKeys.all, 'detail'] as const,
  detail: (id: string) => [...prdKeys.details(), id] as const,
};

async function fetchPrds({
  page = 1,
  pageSize = 12,
  workspaceId,
}: UsePrdsOptions): Promise<PaginatedPrdsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (workspaceId) {
    params.set('workspaceId', workspaceId);
  }

  const response = await fetch(`/api/prds?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch PRDs');
  }

  return response.json();
}

/**
 * Hook for fetching paginated PRDs
 */
export function usePrds(options: UsePrdsOptions = {}) {
  const { page = 1, pageSize = 12, workspaceId } = options;

  return useQuery({
    queryKey: prdKeys.list({ page, pageSize, workspaceId }),
    queryFn: () => fetchPrds({ page, pageSize, workspaceId }),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for prefetching the next page of PRDs
 */
export function usePrefetchNextPage(options: UsePrdsOptions = {}) {
  const queryClient = useQueryClient();
  const { page = 1, pageSize = 12, workspaceId } = options;

  return () => {
    queryClient.prefetchQuery({
      queryKey: prdKeys.list({ page: page + 1, pageSize, workspaceId }),
      queryFn: () => fetchPrds({ page: page + 1, pageSize, workspaceId }),
    });
  };
}

/**
 * Hook for invalidating PRD list cache
 */
export function useInvalidatePrds() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: prdKeys.lists() });
  };
}
