import { streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import {
  defaultModel,
  advancedModel,
  AI_CONFIG,
} from '@/src/shared/lib/ai/anthropic';
import {
  getSystemPrompt,
  validateIdea,
  CREDITS_PER_VERSION,
  type PRDLanguage,
} from '@/src/features/prd-generation';
import { USER_PROMPT_TEMPLATES } from '@/src/features/prd-generation/lib/prompts/system';
import {
  savePRD,
  extractPRDTitle,
  parsePRDContent,
  PRDSaveError,
} from '@/src/features/prd-generation/api/save-prd';
import {
  researchTrends,
  formatResearchForPrompt,
} from '@/src/shared/lib/tavily';
import type { PRDTemplate, PRDVersion } from '@/src/entities';
import { createClient } from '@/src/shared/lib/supabase/server';
import {
  checkRateLimit,
  rateLimitResponse,
} from '@/src/shared/lib/rate-limit';
import { ErrorCodes } from '@/src/shared/lib/errors';

// Deduct workspace credits
async function deductWorkspaceCredits(
  workspaceId: string,
  userId: string,
  amount: number,
  description: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('deduct_workspace_credit', {
      p_workspace_id: workspaceId,
      p_user_id: userId,
      p_amount: amount,
      p_description: description,
    });

    if (error) {
      console.error('Workspace credit deduction failed:', error);
      return false;
    }
    return data === true;
  } catch (err) {
    console.error('Workspace credit deduction exception:', err);
    return false;
  }
}

// Refund workspace credits on failure (userId kept for logging but not used in RPC)
async function refundWorkspaceCredits(
  workspaceId: string,
  _userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    // add_workspace_credit returns the amount actually added (integer)
    const { data, error } = await supabase.rpc('add_workspace_credit', {
      p_workspace_id: workspaceId,
      p_amount: amount,
      p_description: `환불: ${reason}`,
    });

    if (error) {
      console.error('[CRITICAL] Workspace credit refund failed:', error);
      return false;
    }
    // Returns true if any credits were added
    return typeof data === 'number' && data > 0;
  } catch (err) {
    console.error('[CRITICAL] Workspace credit refund exception:', err);
    return false;
  }
}

// Use nodejs runtime for Tavily API compatibility
export const runtime = 'nodejs';

// HTTP response helper for consistent error responses
function jsonResponse(data: object, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Refund credits on failure
async function refundCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('add_credit', {
      p_user_id: userId,
      p_amount: amount,
      p_usage_type: 'credit_refund',
      p_description: `환불: ${reason}`,
    });

    if (error) {
      console.error('[CRITICAL] Credit refund failed:', error);
      return false;
    }
    return data === true;
  } catch (err) {
    console.error('[CRITICAL] Credit refund exception:', err);
    return false;
  }
}

export async function POST(req: Request) {
  let userId: string | null = null;
  let fullContent = '';
  let creditsDeducted = 0;
  let workspaceId: string | null = null;

  try {
    const { idea, template, version, language = 'ko', workspace_id } = (await req.json()) as {
      idea: string;
      template: PRDTemplate;
      version: PRDVersion;
      language?: PRDLanguage;
      workspace_id?: string;
    };
    creditsDeducted = CREDITS_PER_VERSION[version];
    workspaceId = workspace_id ?? null;

    // 1. Validate input
    const validation = validateIdea(idea);
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400);
    }

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
    const rateLimitResult = await checkRateLimit(userId, 'prdGeneration');
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // 4. Deduct credits (atomic with FOR UPDATE lock)
    const creditsRequired = CREDITS_PER_VERSION[version];
    const isDev = process.env.NODE_ENV === 'development';

    // Skip credit deduction in development mode
    if (!isDev) {
      if (workspaceId) {
        // Workspace mode: deduct from workspace credits
        const success = await deductWorkspaceCredits(
          workspaceId,
          userId,
          creditsRequired,
          `PRD 생성: ${idea.slice(0, 50)}...`
        );
        if (!success) {
          return jsonResponse({ error: ErrorCodes.WORKSPACE_CREDITS_INSUFFICIENT }, 402);
        }
      } else {
        // Personal mode: deduct from user credits
        const { data: deductResult, error: deductError } = await supabase.rpc(
          'deduct_credit',
          {
            p_user_id: userId,
            p_amount: creditsRequired,
            p_description: `PRD 생성: ${idea.slice(0, 50)}...`,
          }
        );

        if (deductError || !deductResult) {
          return jsonResponse({ error: ErrorCodes.CREDITS_INSUFFICIENT }, 402);
        }
      }
    }

    // 4. Select model based on version (research uses advanced model)
    const model = version === 'basic' ? defaultModel : advancedModel;

    // 5. Perform trend research for research version
    let researchContext = '';
    if (version === 'research') {
      try {
        const trendResearch = await researchTrends(idea);
        researchContext = formatResearchForPrompt(trendResearch);
      } catch (researchError) {
        // Log but continue without research data
        console.error('Trend research failed:', researchError);
        researchContext = '\n<trend_research>\nResearch data unavailable. Please generate PRD based on your knowledge.\n</trend_research>\n';
      }
    }

    // 6. Build prompt with language support and research context
    const systemPrompt = getSystemPrompt(template, language, version);
    const promptTemplate = USER_PROMPT_TEMPLATES[language];
    const userPrompt = `
<user_input>
${promptTemplate.label}: ${idea}
Version: ${promptTemplate.versionLabel(version)}
</user_input>
${researchContext}
${promptTemplate.instruction}
${promptTemplate.getHint(version)}
`;

    // 7. Stream response with UIMessageStream for both text and save result
    const maxTokens = version === 'basic' ? 4096 : AI_CONFIG.maxTokens;

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const result = streamText({
          model,
          system: systemPrompt,
          prompt: userPrompt,
          maxOutputTokens: maxTokens,
          temperature: AI_CONFIG.temperature,
          onChunk: ({ chunk }) => {
            if (chunk.type === 'text-delta') {
              fullContent += chunk.text;
            }
          },
        });

        // Forward text stream chunks to UIMessage stream
        const textStream = result.toUIMessageStream();
        for await (const chunk of textStream) {
          writer.write(chunk);
        }

        // Save PRD to database and send result to client
        if (userId && fullContent) {
          try {
            const savedPrd = await savePRD({
              userId,
              idea,
              template,
              version,
              title: extractPRDTitle(fullContent),
              content: parsePRDContent(fullContent),
              creditsUsed: creditsRequired,
              workspaceId: workspaceId ?? undefined,
            });

            // Send save success to client
            writer.write({
              type: 'data-prd-result',
              data: {
                type: 'prd_saved',
                prdId: savedPrd.id,
                status: 'success',
              },
            });
          } catch (saveError) {
            // Refund credits on save failure (PRD was generated but not saved)
            const refundReason = saveError instanceof PRDSaveError
              ? `PRD 저장 실패 (${saveError.code})`
              : 'PRD 저장 실패';

            let refunded: boolean;
            if (workspaceId) {
              // Workspace mode: refund to workspace
              refunded = await refundWorkspaceCredits(
                workspaceId,
                userId,
                creditsRequired,
                refundReason
              );
            } else {
              // Personal mode: refund to user
              refunded = await refundCredits(
                userId,
                creditsRequired,
                refundReason
              );
            }

            // Send failure status to client
            writer.write({
              type: 'data-prd-result',
              data: {
                type: 'prd_save_failed',
                status: 'error',
                message: refundReason,
                refunded,
              },
            });

            if (!refunded) {
              // Critical: credit refund failed - log for manual intervention
              console.error('[CRITICAL] Both PRD save and refund failed:', {
                userId,
                workspaceId,
                credits: creditsRequired,
                error: saveError,
              });
            }
          }
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error('[PRD_GENERATION] Unexpected error:', {
      userId,
      workspaceId,
      creditsDeducted,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    });

    // If credit was deducted but generation failed, attempt refund
    if (userId && creditsDeducted > 0) {
      let refundSuccess = false;
      if (workspaceId) {
        refundSuccess = await refundWorkspaceCredits(workspaceId, userId, creditsDeducted, 'PRD 생성 중 오류');
      } else {
        refundSuccess = await refundCredits(userId, creditsDeducted, 'PRD 생성 중 오류');
      }

      if (!refundSuccess) {
        console.error('[CRITICAL] Refund failed after generation error - MANUAL INTERVENTION REQUIRED:', {
          userId,
          workspaceId,
          creditsDeducted,
        });
      }
    }

    return jsonResponse({ error: ErrorCodes.PRD_GENERATION_FAILED }, 500);
  }
}
