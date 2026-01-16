import { createClient } from '@/src/shared/lib/supabase/server';
import type { PRDInsert, PRD } from '@/src/entities';
import type { Json } from '@/src/shared/types/database';

interface SavePRDParams {
  userId: string;
  idea: string;
  template: PRDInsert['template'];
  version: PRDInsert['version'];
  title: string;
  content: Json;
  creditsUsed: number;
}

export async function savePRD(params: SavePRDParams): Promise<PRD | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('prds')
    .insert({
      user_id: params.userId,
      idea: params.idea,
      template: params.template,
      version: params.version,
      title: params.title,
      content: params.content,
      credits_used: params.creditsUsed,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save PRD:', error);
    return null;
  }

  return data;
}

// Extract title from PRD content (first H1 heading)
export function extractPRDTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1] || '새 PRD';
}

// Parse PRD sections for structured storage
export function parsePRDContent(content: string): Json {
  return {
    raw: content,
    generatedAt: new Date().toISOString(),
  };
}
