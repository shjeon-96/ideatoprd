import { streamText } from 'ai';
import { advancedModel, AI_CONFIG } from '@/src/shared/lib/ai/anthropic';
import { buildRevisionPrompt } from '@/src/features/prd-generation/lib/prompts/revision';
import {
  extractPRDTitle,
  parsePRDContent,
} from '@/src/features/prd-generation/api/save-prd';
import type { PRDLanguage } from '@/src/features/prd-generation';
import type { Json } from '@/src/shared/types/database';
import { createClient } from '@/src/shared/lib/supabase/server';

export const runtime = 'nodejs';

// Revision cost is fixed at 1 credit
const REVISION_CREDIT_COST = 1;

// HTTP response helper
function jsonResponse(data: object, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request) {
  let userId: string | null = null;
  let fullContent = '';

  try {
    const { prdId, feedback, sections, language = 'ko' } = (await req.json()) as {
      prdId: string;
      feedback: string;
      sections: string[];
      language?: PRDLanguage;
    };

    // 1. Validate input
    if (!prdId || !feedback || !sections?.length) {
      return jsonResponse(
        { error: '필수 입력값이 누락되었습니다.' },
        400
      );
    }

    if (feedback.trim().length < 10) {
      return jsonResponse(
        { error: '피드백은 최소 10자 이상이어야 합니다.' },
        400
      );
    }

    // 2. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: '로그인이 필요합니다.' }, 401);
    }
    userId = user.id;

    // 3. Fetch original PRD
    const { data: originalPrd, error: prdError } = await supabase
      .from('prds')
      .select('*')
      .eq('id', prdId)
      .eq('user_id', userId)
      .single();

    if (prdError || !originalPrd) {
      return jsonResponse({ error: 'PRD를 찾을 수 없습니다.' }, 404);
    }

    // Get the PRD content (markdown)
    const prdContent = originalPrd.content as { markdown?: string; raw?: string } | null;
    const originalMarkdown = prdContent?.markdown || prdContent?.raw || '';

    if (!originalMarkdown) {
      return jsonResponse({ error: 'PRD 내용을 읽을 수 없습니다.' }, 400);
    }

    // 4. Deduct credits
    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev) {
      const { data: deductResult, error: deductError } = await supabase.rpc(
        'deduct_credit',
        {
          p_user_id: userId,
          p_amount: REVISION_CREDIT_COST,
          p_description: `PRD 수정: ${originalPrd.title?.slice(0, 30) || 'Untitled'}...`,
        }
      );

      if (deductError || !deductResult) {
        return jsonResponse({ error: '크레딧이 부족합니다.' }, 402);
      }
    }

    // 5. Calculate new version number
    const rootId = originalPrd.parent_id || originalPrd.id;
    const { data: versions } = await supabase
      .from('prds')
      .select('version_number')
      .or(`id.eq.${rootId},parent_id.eq.${rootId}`)
      .order('version_number', { ascending: false })
      .limit(1);

    const newVersionNumber = (versions?.[0]?.version_number || 1) + 1;

    // 6. Build revision prompt
    const { system, user: userPrompt } = buildRevisionPrompt({
      originalPrd: originalMarkdown,
      feedback,
      sections,
      language,
    });

    // 7. Stream the revised PRD
    const result = streamText({
      model: advancedModel,
      system,
      prompt: userPrompt,
      maxOutputTokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      onChunk: ({ chunk }) => {
        if (chunk.type === 'text-delta') {
          fullContent += chunk.text;
        }
      },
      onFinish: async () => {
        // Save revised PRD as new version
        if (userId && fullContent) {
          try {
            const { error: insertError } = await supabase.from('prds').insert({
              user_id: userId,
              idea: originalPrd.idea,
              template: originalPrd.template,
              version: originalPrd.version,
              title: extractPRDTitle(fullContent),
              content: parsePRDContent(fullContent) as Json,
              credits_used: REVISION_CREDIT_COST,
              parent_id: rootId,
              version_number: newVersionNumber,
              revision_feedback: feedback,
              revised_sections: sections,
            });

            if (insertError) {
              console.error('[CRITICAL] Failed to save revised PRD:', insertError);
              // Attempt refund
              await supabase.rpc('add_credit', {
                p_user_id: userId,
                p_amount: REVISION_CREDIT_COST,
                p_usage_type: 'credit_refund',
                p_description: '환불: PRD 수정 저장 실패',
              });
            }
          } catch (saveError) {
            console.error('[CRITICAL] Failed to save revised PRD:', saveError);
          }
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('PRD revision error:', error);
    return jsonResponse({ error: 'PRD 수정 중 오류가 발생했습니다.' }, 500);
  }
}
