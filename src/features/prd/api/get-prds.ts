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
}

/**
 * Fetches PRDs for the current authenticated user
 * Uses RLS policy to automatically filter by user_id
 * Wrapped with React.cache() for per-request deduplication
 *
 * @returns List of PRDs ordered by creation date (newest first)
 */
export const getPrds = cache(async (): Promise<PrdListItem[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('prds')
    .select('id, title, idea, template, version, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    // Let the error propagate for proper error handling
    throw new Error(`Failed to fetch PRDs: ${error.message}`);
  }

  return data ?? [];
});
