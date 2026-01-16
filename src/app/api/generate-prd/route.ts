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
} from '@/src/features/prd-generation';
import {
  savePRD,
  extractPRDTitle,
  parsePRDContent,
} from '@/src/features/prd-generation/api/save-prd';
import type { PRDTemplate, PRDVersion } from '@/src/entities';
import { createClient } from '@/src/shared/lib/supabase/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  let userId: string | null = null;
  let fullContent = '';

  try {
    const { idea, template, version } = (await req.json()) as {
      idea: string;
      template: PRDTemplate;
      version: PRDVersion;
    };

    // 1. Validate input
    const validation = validateIdea(idea);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    userId = user.id;

    // 3. Deduct credits (atomic with FOR UPDATE lock)
    const creditsRequired = CREDITS_PER_VERSION[version];
    const { data: deductResult, error: deductError } = await supabase.rpc(
      'deduct_credit',
      {
        p_user_id: userId,
        p_amount: creditsRequired,
        p_description: `PRD 생성: ${idea.slice(0, 50)}...`,
      }
    );

    if (deductError || !deductResult) {
      console.error('Credit deduction failed:', deductError);
      return new Response(
        JSON.stringify({ error: '크레딧이 부족합니다.' }),
        {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Select model based on version
    const model = version === 'detailed' ? advancedModel : defaultModel;

    // 5. Build prompt
    const systemPrompt = getSystemPrompt(template);
    const userPrompt = `
<user_input>
아이디어: ${idea}
버전: ${version === 'detailed' ? '상세 (Detailed)' : '기본 (Basic)'}
</user_input>

위 아이디어에 대한 PRD를 생성해주세요.
${version === 'basic' ? '핵심 섹션만 간략하게 작성해주세요.' : '모든 섹션을 상세하게 작성해주세요.'}
`;

    // 6. Stream response with content accumulation
    const result = streamText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      maxOutputTokens: version === 'detailed' ? AI_CONFIG.maxTokens : 4096,
      temperature: AI_CONFIG.temperature,
      onChunk: ({ chunk }) => {
        if (chunk.type === 'text-delta') {
          fullContent += chunk.text;
        }
      },
      onFinish: async ({ usage }) => {
        // Save PRD to database
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
            console.log('PRD saved successfully. Tokens:', usage);
          } catch (saveError) {
            console.error('Failed to save PRD:', saveError);
            // Note: Credit already deducted, PRD was generated
            // Consider refund logic for production
          }
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('PRD generation error:', error);

    // If credit was deducted but generation failed, consider refund
    // For MVP, log the error and notify user
    return new Response(
      JSON.stringify({ error: 'PRD 생성 중 오류가 발생했습니다.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
