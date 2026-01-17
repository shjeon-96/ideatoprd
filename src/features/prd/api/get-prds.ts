import { cache } from 'react';
import { createClient } from '@/src/shared/lib/supabase/server';
import type { PRD } from '@/src/entities';

/**
 * PRD list item - subset of fields for list view
 */
export interface PrdListItem {
  id: string;
  title: string | null;
  idea: string;
  template: PRD['template'];
  version: PRD['version'];
  created_at: string;
  workspace_id: string | null;
}

/**
 * Fetches PRDs for the current authenticated user
 * Uses RLS policy to automatically filter by user_id
 * Wrapped with React.cache() for per-request deduplication
 *
 * @param workspaceId - If provided, fetches PRDs for that workspace.
 *                      If null/undefined, fetches personal PRDs (no workspace).
 * @returns List of PRDs ordered by creation date (newest first)
 */
export const getPrds = cache(async (workspaceId?: string | null): Promise<PrdListItem[]> => {
  const supabase = await createClient();

  let query = supabase
    .from('prds')
    .select('id, title, idea, template, version, created_at, workspace_id');

  // Filter by workspace or personal (null workspace_id)
  if (workspaceId) {
    query = query.eq('workspace_id', workspaceId);
  } else {
    query = query.is('workspace_id', null);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    // Let the error propagate for proper error handling
    throw new Error(`Failed to fetch PRDs: ${error.message}`);
  }

  return data ?? [];
});
