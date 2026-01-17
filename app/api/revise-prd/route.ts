import { streamText } from 'ai';
import { advancedModel, AI_CONFIG } from '@/src/shared/lib/ai/anthropic';
import { buildRevisionPrompt } from '@/src/features/prd-generation/lib/prompts/revision';
import {
  extractPRDTitle,
  parsePRDContent,
} from '@/src/features/prd-generation/api/save-prd';
import { revisePRDSchema, validateRequest } from '@/src/shared/lib/validation';
import { ErrorCodes } from '@/src/shared/lib/errors';
import type { Json } from '@/src/shared/types/database';
import { createClient } from '@/src/shared/lib/supabase/server';
import { revisionLogger } from '@/src/shared/lib/logger';
import {
  checkRateLimit,
  rateLimitResponse,
} from '@/src/shared/lib/rate-limit';

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
    // 1. Validate input with Zod schema
    const body = await req.json();
    const validation = validateRequest(revisePRDSchema, body);
    if (!validation.success) {
      return jsonResponse({ error: validation.error }, 400);
    }

    const { prdId, feedback, sections } = validation.data;

    // 2. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: ErrorCodes.AUTH_REQUIRED }, 401);
    }
    userId = user.id;

    // 3. Check rate limit
    const rateLimitResult = await checkRateLimit(userId, 'prdRevision');
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // 4. Fetch original PRD
    const { data: originalPrd, error: prdError } = await supabase
      .from('prds')
      .select('*')
      .eq('id', prdId)
      .eq('user_id', userId)
      .single();

    if (prdError || !originalPrd) {
      return jsonResponse({ error: ErrorCodes.PRD_NOT_FOUND }, 404);
    }

    // Get the PRD content (markdown)
    const prdContent = originalPrd.content as { markdown?: string; raw?: string } | null;
    const originalMarkdown = prdContent?.markdown || prdContent?.raw || '';

    if (!originalMarkdown) {
      return jsonResponse({ error: ErrorCodes.PRD_CONTENT_UNREADABLE }, 400);
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
        return jsonResponse({ error: ErrorCodes.CREDITS_INSUFFICIENT }, 402);
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
    });

    // 7. Stream the revised PRD with Anthropic prompt caching
    const result = streamText({
      model: advancedModel,
      messages: [
        {
          role: 'system',
          content: system,
          providerOptions: {
            anthropic: { cacheControl: { type: 'ephemeral' } },
          },
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
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
              revisionLogger.error('Failed to save revised PRD - attempting refund', {
                userId,
                prdId: rootId,
                error: insertError,
              });
              // Attempt refund and check result
              const { data: refundResult, error: refundError } = await supabase.rpc('add_credit', {
                p_user_id: userId,
                p_amount: REVISION_CREDIT_COST,
                p_usage_type: 'credit_refund',
                p_description: 'refund:prd_save_failed',
              });

              if (refundError || !refundResult) {
                revisionLogger.error('[CRITICAL] Refund failed after save error - MANUAL INTERVENTION REQUIRED', {
                  userId,
                  prdId: rootId,
                  credits: REVISION_CREDIT_COST,
                  refundError,
                });
              }
            }
          } catch (saveError) {
            revisionLogger.error('Unexpected error saving revised PRD', {
              userId,
              prdId: rootId,
              error: saveError,
            });
          }
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    revisionLogger.error('Unexpected error during PRD revision', {
      userId,
      error,
    });
    return jsonResponse({ error: ErrorCodes.UNKNOWN_ERROR }, 500);
  }
}
