import { streamText } from 'ai';
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

  try {
    const { idea, template, version, language = 'ko' } = (await req.json()) as {
      idea: string;
      template: PRDTemplate;
      version: PRDVersion;
      language?: PRDLanguage;
    };
    creditsDeducted = CREDITS_PER_VERSION[version];

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
      return jsonResponse({ error: '로그인이 필요합니다.' }, 401);
    }
    userId = user.id;

    // 3. Deduct credits (atomic with FOR UPDATE lock)
    const creditsRequired = CREDITS_PER_VERSION[version];
    const isDev = process.env.NODE_ENV === 'development';

    // Skip credit deduction in development mode
    if (!isDev) {
      const { data: deductResult, error: deductError } = await supabase.rpc(
        'deduct_credit',
        {
          p_user_id: userId,
          p_amount: creditsRequired,
          p_description: `PRD 생성: ${idea.slice(0, 50)}...`,
        }
      );

      if (deductError || !deductResult) {
        return jsonResponse({ error: '크레딧이 부족합니다.' }, 402);
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

    // 7. Stream response with content accumulation
    const maxTokens = version === 'basic' ? 4096 : AI_CONFIG.maxTokens;
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
      onFinish: async () => {
        // Save PRD to database with refund on failure
        if (userId && fullContent) {
          try {
            await savePRD({
              userId,
              idea,
              template,
              version,
              title: extractPRDTitle(fullContent),
              content: parsePRDContent(fullContent),
              creditsUsed: creditsRequired,
            });
          } catch (saveError) {
            // Refund credits on save failure (PRD was generated but not saved)
            const refunded = await refundCredits(
              userId,
              creditsRequired,
              saveError instanceof PRDSaveError
                ? `PRD 저장 실패 (${saveError.code})`
                : 'PRD 저장 실패'
            );

            if (!refunded) {
              // Critical: credit refund failed - log for manual intervention
              console.error('[CRITICAL] Both PRD save and refund failed:', {
                userId,
                credits: creditsRequired,
                error: saveError,
              });
            }
          }
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    // If credit was deducted but generation failed, attempt refund
    if (userId && creditsDeducted > 0) {
      await refundCredits(userId, creditsDeducted, 'PRD 생성 중 오류');
    }

    return jsonResponse({ error: 'PRD 생성 중 오류가 발생했습니다.' }, 500);
  }
}
