import { TEMPLATE_MAP } from './templates';
import type { PRDTemplate, PRDVersion } from '@/src/entities';
import type { PRDLanguage } from '../../model/types';

// Base prompt without language section
const PRD_BASE_PROMPT = `
You are a professional product manager with 10+ years of experience.
Your task is to generate a comprehensive PRD (Product Requirements Document).

<output_format>
Generate the PRD in Markdown format with the following sections:
1. Executive Summary
2. Problem Statement
3. Target Users & Personas
4. Requirements (Functional & Non-Functional)
5. User Stories
6. Success Metrics (KPIs)
7. Technical Considerations
8. Timeline & Milestones
9. Risks & Mitigation
</output_format>

<guidelines>
- Be specific and actionable
- Include measurable success criteria
- Consider edge cases and error scenarios
- Prioritize features using MoSCoW method (Must/Should/Could/Won't)
- Use concrete examples where helpful
</guidelines>
`;

// Research version extends base with market analysis sections
const PRD_RESEARCH_PROMPT = `
You are a professional product manager with 10+ years of experience AND market research expertise.
Your task is to generate a comprehensive PRD (Product Requirements Document) enriched with real-time market insights.

<output_format>
Generate the PRD in Markdown format with the following sections:
1. Executive Summary
2. **Market Analysis** (NEW - based on provided research)
   - Market Size & Growth Trends
   - Industry Dynamics
3. **Competitive Landscape** (NEW - based on provided research)
   - Key Competitors
   - Differentiation Strategy
   - Competitive Advantages
4. Problem Statement
5. Target Users & Personas
6. Requirements (Functional & Non-Functional)
7. User Stories
8. Success Metrics (KPIs)
9. **Technical Stack Recommendations** (NEW - based on current tech trends)
   - Recommended Technologies
   - Architecture Considerations
   - Scalability Strategy
10. Timeline & Milestones
11. Risks & Mitigation
12. **Go-to-Market Strategy** (NEW)
    - Launch Strategy
    - Marketing Channels
    - Pricing Considerations
</output_format>

<guidelines>
- Be specific and actionable with real data from the research
- Include measurable success criteria based on market benchmarks
- Reference competitor features and differentiation points
- Recommend technology stack based on current best practices
- Prioritize features using MoSCoW method (Must/Should/Could/Won't)
- Cite sources where helpful using [Source Title](URL) format
</guidelines>
`;

// Language-specific instructions
const LANGUAGE_INSTRUCTIONS: Record<PRDLanguage, string> = {
  ko: `<language>
- Write the PRD in Korean (한국어)
- Use technical terms in English where appropriate
</language>`,
  en: `<language>
- Write the PRD in English
- Use professional technical terminology
- Keep the tone professional and clear
</language>`,
};

// Version label mapping
export const VERSION_LABELS: Record<PRDLanguage, Record<PRDVersion, string>> = {
  ko: {
    basic: '기본 (Basic)',
    detailed: '상세 (Detailed)',
    research: '리서치 (Research)',
  },
  en: {
    basic: 'Basic',
    detailed: 'Detailed',
    research: 'Research',
  },
};

// Version hints
export const VERSION_HINTS: Record<PRDLanguage, Record<PRDVersion, string>> = {
  ko: {
    basic: '핵심 섹션만 간략하게 작성해주세요.',
    detailed: '모든 섹션을 상세하게 작성해주세요.',
    research: '제공된 시장 리서치를 바탕으로 모든 섹션을 상세하게 작성해주세요. 특히 시장 분석, 경쟁사 분석, 기술 트렌드 섹션에 주의를 기울여주세요.',
  },
  en: {
    basic: 'Write only the core sections briefly.',
    detailed: 'Write all sections in detail.',
    research: 'Write all sections in detail based on the provided market research. Pay special attention to market analysis, competitive landscape, and technology trends sections.',
  },
};

// User prompt templates by language
export const USER_PROMPT_TEMPLATES: Record<PRDLanguage, { label: string; versionLabel: (v: PRDVersion) => string; instruction: string; getHint: (v: PRDVersion) => string }> = {
  ko: {
    label: '아이디어',
    versionLabel: (v) => VERSION_LABELS.ko[v],
    instruction: '위 아이디어에 대한 PRD를 생성해주세요.',
    getHint: (v) => VERSION_HINTS.ko[v],
  },
  en: {
    label: 'Idea',
    versionLabel: (v) => VERSION_LABELS.en[v],
    instruction: 'Please generate a PRD for the above idea.',
    getHint: (v) => VERSION_HINTS.en[v],
  },
};

// Legacy export for backwards compatibility (defaults to Korean)
export const PRD_SYSTEM_PROMPT = `${PRD_BASE_PROMPT}\n${LANGUAGE_INSTRUCTIONS.ko}`;

export const getSystemPrompt = (
  templateType: PRDTemplate,
  language: PRDLanguage = 'ko',
  version: PRDVersion = 'basic'
): string => {
  const templatePrompt = TEMPLATE_MAP[templateType] || '';
  const langInstruction = LANGUAGE_INSTRUCTIONS[language];

  // Use research prompt for research version
  const basePrompt = version === 'research' ? PRD_RESEARCH_PROMPT : PRD_BASE_PROMPT;

  return `${basePrompt}\n${langInstruction}\n\n${templatePrompt}`;
};
