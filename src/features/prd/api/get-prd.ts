import { cache } from 'react';
import { createClient } from '@/src/shared/lib/supabase/server';
import type { PRD } from '@/src/entities';

/**
 * PRD content structure stored in JSONB
 */
export interface PrdContent {
  markdown?: string;
  [key: string]: unknown;
}

/**
 * PRD detail item with all fields
 */
export interface PrdDetailItem {
  id: string;
  title: string | null;
  idea: string;
  template: PRD['template'];
  version: PRD['version'];
  content: PrdContent | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches a single PRD by ID for the current authenticated user
 * Uses RLS policy to automatically verify ownership (user_id = auth.uid())
 * Wrapped with React.cache() for per-request deduplication
 *
 * @param id - PRD UUID
 * @returns PRD detail or null if not found/not owned
 */
export const getPrd = cache(async (id: string): Promise<PrdDetailItem | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('prds')
    .select('id, title, idea, template, version, content, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) {
    // PGRST116: No rows returned (not found or not owned)
    if (error.code === 'PGRST116') {
      return null;
    }
    // Other errors should propagate
    throw new Error(`Failed to fetch PRD: ${error.message}`);
  }

  return data as PrdDetailItem;
});
