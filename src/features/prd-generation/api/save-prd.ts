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
  workspaceId?: string;
}

export class PRDSaveError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'PRDSaveError';
  }
}

export async function savePRD(params: SavePRDParams): Promise<PRD> {
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
      workspace_id: params.workspaceId ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new PRDSaveError(
      'PRD 저장에 실패했습니다.',
      error.code,
      error
    );
  }

  if (!data) {
    throw new PRDSaveError('PRD 저장 결과가 없습니다.', 'NO_DATA');
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
    markdown: content,  // Primary field for reading
    raw: content,       // Legacy compatibility
    generatedAt: new Date().toISOString(),
  };
}
