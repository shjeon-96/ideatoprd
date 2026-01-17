import type { PRDLanguage } from '../../model/types';

// Revision system prompt
export const REVISION_SYSTEM_PROMPT = `
You are a professional product manager with expertise in refining and improving PRD documents.
Your task is to revise specific sections of an existing PRD based on user feedback.

<revision_guidelines>
- Only modify the sections specified by the user
- Maintain consistency with the rest of the document
- Keep the same formatting and structure
- Address the feedback precisely and thoroughly
- Preserve any good parts that don't need changes
- If revising technical sections, ensure accuracy and feasibility
</revision_guidelines>

<output_format>
Return the COMPLETE PRD with the revisions incorporated.
Do not return only the changed sections - return the full document.
Mark revised sections with a subtle indicator if helpful.
</output_format>
`;

// Language-specific revision instructions
export const REVISION_LANGUAGE_INSTRUCTIONS: Record<PRDLanguage, string> = {
  ko: `<language>
- 한국어로 수정된 PRD를 작성해주세요
- 기술 용어는 영어를 사용해도 됩니다
- 원본의 어조와 스타일을 유지하세요
</language>`,
  en: `<language>
- Write the revised PRD in English
- Maintain the same professional tone as the original
- Keep technical terminology consistent
</language>`,
};

// Section names for UI
export const PRD_SECTIONS = {
  ko: [
    { key: 'executive_summary', label: 'Executive Summary (요약)' },
    { key: 'problem_statement', label: 'Problem Statement (문제 정의)' },
    { key: 'target_users', label: 'Target Users (타겟 사용자)' },
    { key: 'requirements', label: 'Requirements (요구사항)' },
    { key: 'user_stories', label: 'User Stories (사용자 스토리)' },
    { key: 'success_metrics', label: 'Success Metrics (성공 지표)' },
    { key: 'technical_considerations', label: 'Technical Considerations (기술 고려사항)' },
    { key: 'timeline', label: 'Timeline & Milestones (일정)' },
    { key: 'risks', label: 'Risks & Mitigation (리스크)' },
    // Research-specific sections
    { key: 'market_analysis', label: 'Market Analysis (시장 분석)' },
    { key: 'competitive_landscape', label: 'Competitive Landscape (경쟁 분석)' },
    { key: 'tech_stack', label: 'Tech Stack Recommendations (기술 스택)' },
    { key: 'gtm_strategy', label: 'Go-to-Market Strategy (GTM 전략)' },
  ],
  en: [
    { key: 'executive_summary', label: 'Executive Summary' },
    { key: 'problem_statement', label: 'Problem Statement' },
    { key: 'target_users', label: 'Target Users & Personas' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'user_stories', label: 'User Stories' },
    { key: 'success_metrics', label: 'Success Metrics (KPIs)' },
    { key: 'technical_considerations', label: 'Technical Considerations' },
    { key: 'timeline', label: 'Timeline & Milestones' },
    { key: 'risks', label: 'Risks & Mitigation' },
    // Research-specific sections
    { key: 'market_analysis', label: 'Market Analysis' },
    { key: 'competitive_landscape', label: 'Competitive Landscape' },
    { key: 'tech_stack', label: 'Tech Stack Recommendations' },
    { key: 'gtm_strategy', label: 'Go-to-Market Strategy' },
  ],
};

// Build revision prompt
export function buildRevisionPrompt(params: {
  originalPrd: string;
  feedback: string;
  sections: string[];
  language: PRDLanguage;
}): { system: string; user: string } {
  const { originalPrd, feedback, sections, language } = params;

  const sectionLabels = PRD_SECTIONS[language];
  const selectedSectionNames = sections
    .map((key) => sectionLabels.find((s) => s.key === key)?.label || key)
    .join(', ');

  const system = `${REVISION_SYSTEM_PROMPT}\n${REVISION_LANGUAGE_INSTRUCTIONS[language]}`;

  const userPrompt = `
<original_prd>
${originalPrd}
</original_prd>

<revision_request>
수정할 섹션: ${selectedSectionNames}

사용자 피드백:
${feedback}
</revision_request>

위 피드백을 바탕으로 지정된 섹션을 수정하고, 전체 PRD를 반환해주세요.
`;

  return { system, user: userPrompt };
}
