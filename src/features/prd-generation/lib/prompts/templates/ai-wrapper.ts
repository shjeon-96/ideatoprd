export const AI_WRAPPER_TEMPLATE = `
<template_context>
This is an AI-Wrapper product built on top of LLMs (GPT, Claude, etc.).
Focus on: prompt engineering, cost optimization, rate limiting, differentiation.
</template_context>

<additional_sections>
- AI Model Selection & Fallback Strategy
- Cost per Request Analysis
- Prompt Engineering Strategy
- Differentiation from Raw API Access
- Content Moderation & Safety
</additional_sections>

<example>
<idea>AI 블로그 글 작성 도우미</idea>
<prd_excerpt>
## AI Strategy
- Primary: Claude 3.5 Haiku (속도, 비용)
- Fallback: GPT-4o-mini (가용성)
- Cost: ~$0.002/요청 (1000 토큰 기준)

## Differentiation
- 한국어 최적화 프롬프트
- SEO 키워드 자동 삽입
- 톤앤매너 커스터마이징
</prd_excerpt>
</example>
`;
