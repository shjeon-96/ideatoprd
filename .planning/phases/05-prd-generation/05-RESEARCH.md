# Phase 5: PRD Generation - Research

**Researched:** 2026-01-15
**Domain:** Anthropic Claude API + Streaming + Prompt Engineering
**Confidence:** HIGH

<research_summary>
## Summary

Claude API를 활용한 PRD 자동 생성 시스템에 대해 리서치했습니다. 핵심은 **Vercel AI SDK + @ai-sdk/anthropic** 조합으로 Next.js App Router에서 스트리밍 응답을 구현하는 것입니다. 프롬프트 엔지니어링은 **XML 태그 구조화**와 **few-shot examples**가 표준 패턴입니다.

비용 최적화를 위해 Claude 3.5 Haiku ($0.25/$1.25 per MTok)를 기본으로 사용하고, 복잡한 PRD에만 Sonnet ($3/$15 per MTok)을 사용하는 전략이 효과적입니다. **Prompt Caching**으로 반복되는 시스템 프롬프트의 캐시 읽기 비용을 90% 절감할 수 있습니다.

**Primary recommendation:** Vercel AI SDK (`ai` + `@ai-sdk/anthropic`)로 Route Handler에서 스트리밍 구현. Claude 3.5 Haiku를 기본 모델로 사용하고, 프롬프트 캐싱 활성화.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| ai | 4.x | Vercel AI SDK 코어 | 스트리밍, UI 훅, 표준화된 인터페이스 |
| @ai-sdk/anthropic | latest | Claude 프로바이더 | Vercel AI SDK 공식 지원 |
| @ai-sdk/react | latest | React 훅 (useChat) | 클라이언트 상태 관리 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @anthropic-ai/sdk | latest | 공식 Anthropic SDK | 고급 기능 (tool use, batch API) 필요 시 |
| zod | latest | 스키마 검증 | 구조화된 출력 검증 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vercel AI SDK | 직접 Anthropic SDK | AI SDK가 스트리밍 + React 통합 더 편함 |
| Route Handler | Server Actions | Server Actions는 스트리밍에 부적합 |
| Claude | GPT-4 | Claude가 긴 문서 생성에 더 강점 |

**Installation:**
```bash
npm install ai @ai-sdk/anthropic @ai-sdk/react
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── api/
│       └── generate-prd/
│           └── route.ts        # PRD 생성 스트리밍 API
├── features/
│   └── prd-generation/
│       ├── api/
│       │   └── generate-prd.ts # API 클라이언트
│       ├── ui/
│       │   ├── prd-form.tsx    # 입력 폼
│       │   └── prd-viewer.tsx  # 스트리밍 뷰어
│       ├── lib/
│       │   ├── prompts/        # 프롬프트 템플릿
│       │   │   ├── system.ts
│       │   │   └── templates/
│       │   │       ├── saas.ts
│       │   │       ├── mobile.ts
│       │   │       └── marketplace.ts
│       │   └── schemas/        # Zod 스키마
│       └── model/
│           └── types.ts        # PRD 타입 정의
└── shared/
    └── lib/
        └── ai/
            └── anthropic.ts    # Claude 클라이언트 설정
```

### Pattern 1: Route Handler + streamText
**What:** Next.js Route Handler에서 AI SDK로 스트리밍 응답
**When to use:** 모든 AI 텍스트 생성
**Example:**
```typescript
// src/app/api/generate-prd/route.ts
// Source: Vercel AI SDK docs
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

export const runtime = 'edge'; // 레이턴시 최소화

export async function POST(req: Request) {
  const { messages, templateType } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-haiku-latest'),
    system: getSystemPrompt(templateType),
    messages: await convertToModelMessages(messages),
    maxTokens: 4096,
    temperature: 0.7,
    onError({ error }) {
      console.error('Stream error:', error);
    },
  });

  return result.toUIMessageStreamResponse();
}
```

### Pattern 2: useChat Hook 클라이언트
**What:** React 훅으로 채팅 상태 및 스트리밍 관리
**When to use:** 클라이언트에서 AI 응답 표시
**Example:**
```typescript
// src/features/prd-generation/ui/prd-form.tsx
// Source: Vercel AI SDK docs
'use client';

import { useChat } from '@ai-sdk/react';

export function PRDForm() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/generate-prd',
    body: { templateType: 'saas' },
  });

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder="아이디어를 한 줄로 입력하세요..."
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'PRD 생성 중...' : 'PRD 생성'}
      </button>

      {/* 스트리밍 응답 표시 */}
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.parts.map((part, i) =>
            part.type === 'text' ? <p key={i}>{part.text}</p> : null
          )}
        </div>
      ))}
    </form>
  );
}
```

### Pattern 3: XML 태그 구조화 프롬프트
**What:** XML 태그로 프롬프트 구조화
**When to use:** 복잡한 지시사항, 구조화된 출력
**Example:**
```typescript
// src/features/prd-generation/lib/prompts/system.ts
// Source: Anthropic Courses
export const systemPrompt = `
You are a professional product manager with 10+ years of experience.
Your task is to generate a comprehensive PRD (Product Requirements Document).

<output_format>
Generate the PRD in Markdown format with the following sections:
1. Executive Summary
2. Problem Statement
3. User Personas
4. Requirements (Functional & Non-Functional)
5. User Stories
6. Success Metrics
7. Technical Considerations
8. Timeline & Milestones
</output_format>

<guidelines>
- Be specific and actionable
- Include measurable success criteria
- Consider edge cases
- Prioritize features using MoSCoW method
</guidelines>

<thinking_process>
Before generating the PRD, analyze the idea in <thinking> tags:
1. What problem does this solve?
2. Who is the target user?
3. What are the core features?
4. What are potential risks?
</thinking_process>
`;
```

### Pattern 4: Few-Shot Examples
**What:** 예제를 통한 출력 형식 학습
**When to use:** 일관된 형식의 출력이 필요할 때
**Example:**
```typescript
// Source: Anthropic Cookbook
const fewShotExamples = `
<examples>
<example>
<idea>AI 기반 이력서 분석 서비스</idea>
<prd>
# PRD: AI Resume Analyzer

## Executive Summary
이력서를 업로드하면 AI가 분석하여 개선점을 제안하는 SaaS 서비스.

## Problem Statement
구직자들은 자신의 이력서가 ATS(지원자 추적 시스템)를
통과할 수 있는지, 어떤 부분을 개선해야 하는지 모름.
...
</prd>
</example>
</examples>
`;
```

### Anti-Patterns to Avoid
- **Server Actions로 스트리밍:** Server Actions는 streaming에 부적합, Route Handler 사용
- **동기 API 호출:** `generateText` 대신 `streamText`로 UX 개선
- **하드코딩된 프롬프트:** 프롬프트는 별도 파일로 분리하여 관리
- **에러 무시:** `onError` 콜백으로 반드시 에러 핸들링
- **토큰 제한 무시:** `maxTokens` 설정으로 비용 제어
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 스트리밍 파서 | 수동 SSE 파싱 | AI SDK `streamText` | 이벤트 타입별 처리 완비 |
| 토큰 카운터 | 수동 토큰 계산 | Anthropic API 응답 `usage` | 정확한 토큰 수 제공 |
| 채팅 상태 관리 | useState 수동 관리 | `useChat` hook | 메시지 상태, 에러, 로딩 자동 관리 |
| 재시도 로직 | 수동 retry 구현 | AI SDK 내장 retry | 지수 백오프, 레이트 리밋 핸들링 |
| 프롬프트 캐싱 | 수동 캐시 구현 | Anthropic API `cache_control` | 90% 비용 절감, 5분/1시간 TTL |

**Key insight:** Vercel AI SDK는 스트리밍, 에러 핸들링, React 통합을 모두 추상화함. 직접 Anthropic SDK를 사용하면 이 모든 것을 수동으로 구현해야 함.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Server Actions로 스트리밍 시도
**What goes wrong:** 스트리밍이 작동하지 않거나 전체 응답 후 한번에 표시
**Why it happens:** Server Actions는 streaming response에 최적화되어 있지 않음
**How to avoid:** Route Handler (`app/api/*/route.ts`)에서 `streamText` 사용
**Warning signs:** 긴 로딩 후 전체 텍스트가 한번에 나타남

### Pitfall 2: 토큰 비용 폭발
**What goes wrong:** 예상보다 10배 높은 API 비용
**Why it happens:**
- 매 요청마다 긴 시스템 프롬프트 전송
- 고비용 모델(Opus) 불필요하게 사용
- maxTokens 미설정
**How to avoid:**
- Prompt Caching 활성화 (90% 비용 절감)
- Claude 3.5 Haiku를 기본 모델로 사용
- `maxTokens: 4096` 등 제한 설정
**Warning signs:** 일일 API 비용이 예산 초과

### Pitfall 3: 레이트 리밋 미처리
**What goes wrong:** 429 에러로 서비스 중단
**Why it happens:** Anthropic API 레이트 리밋 (5 req/min 등)
**How to avoid:**
- `onError` 콜백에서 429 에러 처리
- 사용자에게 재시도 안내 표시
- 크레딧 시스템으로 사용량 제한
**Warning signs:** 동시 사용자 증가 시 에러 급증

### Pitfall 4: 프롬프트 인젝션
**What goes wrong:** 사용자가 시스템 프롬프트 우회
**Why it happens:** 사용자 입력을 검증 없이 프롬프트에 삽입
**How to avoid:**
- 사용자 입력을 `<user_input>` 태그로 감싸기
- 입력 길이 제한
- 민감한 지시사항은 시스템 프롬프트에만 포함
**Warning signs:** 예상치 못한 응답 형식

### Pitfall 5: 긴 컨텍스트 추가 비용
**What goes wrong:** 200K+ 토큰 요청 시 2배 비용
**Why it happens:** Anthropic의 long context pricing (200K 초과 시 프리미엄)
**How to avoid:**
- PRD 생성에는 보통 200K 미만이면 충분
- 필요시 문서를 청크로 분할
**Warning signs:** 입력 토큰이 200K 근처일 때

### Pitfall 6: Edge Runtime 제한
**What goes wrong:** 특정 Node.js API 사용 불가
**Why it happens:** Edge Runtime은 제한된 API만 지원
**How to avoid:**
- `runtime = 'edge'` 사용 시 호환성 확인
- 복잡한 로직은 별도 API route로 분리
**Warning signs:** "X is not defined" 에러
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Claude 클라이언트 설정
```typescript
// src/shared/lib/ai/anthropic.ts
// Source: AI SDK docs
import { anthropic } from '@ai-sdk/anthropic';

// 기본 모델 (비용 효율적)
export const defaultModel = anthropic('claude-3-5-haiku-latest');

// 고급 모델 (복잡한 PRD용)
export const advancedModel = anthropic('claude-3-5-sonnet-latest');

// 환경 변수: ANTHROPIC_API_KEY 필요
```

### 프롬프트 캐싱 활성화
```typescript
// Source: Anthropic docs
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

const result = streamText({
  model: anthropic('claude-3-5-haiku-latest'),
  messages: [
    {
      role: 'system',
      content: systemPrompt,
      // 프롬프트 캐싱 활성화 (5분 TTL)
      experimental_providerMetadata: {
        anthropic: { cacheControl: { type: 'ephemeral' } },
      },
    },
    ...userMessages,
  ],
});
```

### 구조화된 출력 with Zod
```typescript
// Source: AI SDK docs
import { streamText, Output } from 'ai';
import { z } from 'zod';

const prdSchema = z.object({
  title: z.string(),
  summary: z.string(),
  problem: z.string(),
  features: z.array(z.object({
    name: z.string(),
    priority: z.enum(['must', 'should', 'could', 'wont']),
    description: z.string(),
  })),
});

const result = streamText({
  model: anthropic('claude-3-5-sonnet-latest'),
  output: Output.object({ schema: prdSchema }),
  prompt: `Generate a PRD for: ${idea}`,
});

// 타입 안전한 결과
const prd = await result.object; // z.infer<typeof prdSchema>
```

### 에러 핸들링 with 재시도 안내
```typescript
// Source: AI SDK docs
export async function POST(req: Request) {
  try {
    const result = streamText({
      model: anthropic('claude-3-5-haiku-latest'),
      // ...
      onError({ error }) {
        console.error('Generation error:', error);
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        if (error.message.includes('rate_limit')) {
          return 'API 사용량 한도에 도달했습니다. 잠시 후 다시 시도해주세요.';
        }
        return '생성 중 오류가 발생했습니다. 다시 시도해주세요.';
      },
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

### 토큰 사용량 추적
```typescript
// Source: Anthropic SDK docs
const result = await streamText({
  model: anthropic('claude-3-5-haiku-latest'),
  prompt: userPrompt,
});

const finalMessage = await result.response;
const usage = finalMessage.usage;

// DB에 사용량 기록
await recordUsage({
  userId,
  inputTokens: usage.promptTokens,
  outputTokens: usage.completionTokens,
  model: 'claude-3-5-haiku',
});
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 직접 fetch + SSE 파싱 | Vercel AI SDK `streamText` | 2024+ | 스트리밍 구현 대폭 간소화 |
| Claude 3 Opus | Claude 3.5 Sonnet/Haiku | 2025 | 동등 성능에 비용 67% 절감 |
| 수동 프롬프트 관리 | Prompt Caching | 2024+ | 반복 프롬프트 비용 90% 절감 |
| Pages Router API | App Router Route Handler | 2023+ | Edge Runtime, 스트리밍 지원 |

**New tools/patterns to consider:**
- **Extended Thinking:** Claude 4의 reasoning tokens로 복잡한 문서 품질 향상
- **Batch API:** 대량 PRD 생성 시 50% 할인 (비동기 처리)
- **Claude 4 Sonnet:** 최신 모델로 PRD 품질 향상 가능

**Deprecated/outdated:**
- **Claude 2.x:** 더 이상 권장하지 않음
- **OpenAI 호환 API:** Anthropic 네이티브 API가 더 많은 기능 제공
</sota_updates>

<open_questions>
## Open Questions

1. **PRD 템플릿별 최적 모델**
   - What we know: Haiku는 빠르고 저렴, Sonnet은 품질 높음
   - What's unclear: 템플릿 복잡도에 따른 최적 모델 매핑
   - Recommendation: A/B 테스트로 품질/비용 최적점 찾기

2. **긴 PRD 분할 생성**
   - What we know: 4K 토큰 제한 시 완전한 PRD 생성 어려움
   - What's unclear: 섹션별 분할 생성 vs 높은 토큰 한번 생성
   - Recommendation: 8K-16K 토큰으로 한번에 생성, 필요시 섹션별 보강

3. **크레딧 소비 계산**
   - What we know: 입력/출력 토큰 별도 과금
   - What's unclear: 사용자에게 보여줄 크레딧 단위 (1크레딧 = ? 토큰)
   - Recommendation: 1크레딧 = 1 PRD 생성으로 단순화
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [/anthropics/anthropic-sdk-typescript](https://github.com/anthropics/anthropic-sdk-typescript) - 공식 TypeScript SDK
- [/websites/ai-sdk_dev](https://ai-sdk.dev) - Vercel AI SDK 공식 문서
- [/anthropics/courses](https://github.com/anthropics/courses) - 프롬프트 엔지니어링 교육
- [/anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) - 실용 코드 가이드

### Secondary (MEDIUM confidence)
- [Anthropic API Pricing](https://www.finout.io/blog/anthropic-api-pricing) - 비용 최적화 가이드
- [Next.js App Router Best Practices](https://www.anshgupta.in/blog/nextjs-app-router-best-practices-2025) - 스트리밍 패턴
- [Claude Pricing Official](https://platform.claude.com/docs/en/about-claude/pricing) - 공식 가격표

### Tertiary (LOW confidence - needs validation)
- None - 모든 주요 발견 사항 검증됨
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Anthropic Claude API, Vercel AI SDK
- Ecosystem: @ai-sdk/anthropic, @ai-sdk/react, Route Handlers
- Patterns: 스트리밍, 프롬프트 엔지니어링, 캐싱
- Pitfalls: 비용, 레이트 리밋, 프롬프트 인젝션

**Confidence breakdown:**
- Standard stack: HIGH - Vercel AI SDK 공식 문서 확인
- Architecture: HIGH - Context7 코드 예제 기반
- Pitfalls: HIGH - 공식 문서 경고 + 커뮤니티 경험
- Code examples: HIGH - Context7/공식 문서 출처

**Research date:** 2026-01-15
**Valid until:** 2026-02-15 (30 days - API 안정적이나 가격 변동 가능)
</metadata>

---

*Phase: 05-prd-generation*
*Research completed: 2026-01-15*
*Ready for planning: yes*
