import { cache } from 'react';
import { createClient } from '@/src/shared/lib/supabase/server';
import type { PRD } from '@/src/entities';

/**
 * PRD content structure stored in JSONB
 * Supports both new (markdown) and legacy (raw) content structure
 */
export interface PrdContent {
  markdown?: string;
  raw?: string;  // Legacy field for backward compatibility
  [key: string]: unknown;
}

/**
 * PRD detail item with all fields including versioning
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
  // Versioning fields
  parent_id: string | null;
  version_number: number;
  revision_feedback: string | null;
  revised_sections: string[] | null;
  // Rating fields
  rating: number | null;
  rating_feedback: string | null;
  rated_at: string | null;
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
    .select('id, title, idea, template, version, content, created_at, updated_at, parent_id, version_number, revision_feedback, revised_sections, rating, rating_feedback, rated_at')
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

/**
 * PRD version item for version history
 */
export interface PrdVersionItem {
  id: string;
  version_number: number;
  title: string | null;
  revision_feedback: string | null;
  revised_sections: string[] | null;
  created_at: string;
}

/**
 * Fetches all versions of a PRD (original + revisions)
 * Uses the get_prd_versions SQL function
 *
 * @param prdId - Any PRD UUID in the version chain
 * @returns Array of version items sorted by version_number desc
 */
export const getPrdVersions = cache(async (prdId: string): Promise<PrdVersionItem[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_prd_versions', {
    p_prd_id: prdId,
  });

  if (error) {
    console.error('Failed to fetch PRD versions:', error);
    return [];
  }

  return (data ?? []) as PrdVersionItem[];
});
