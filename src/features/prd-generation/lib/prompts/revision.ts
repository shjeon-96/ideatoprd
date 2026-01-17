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

<language>
- Write the revised PRD in English
- Maintain the same professional tone as the original
- Keep technical terminology consistent
</language>
`;

// Section names for UI (English only)
export const PRD_SECTIONS = [
  { key: 'executive_summary', label: 'Executive Summary' },
  { key: 'market_analysis', label: 'Market Analysis' },
  { key: 'competitive_landscape', label: 'Competitive Landscape' },
  { key: 'problem_statement', label: 'Problem Statement' },
  { key: 'target_users', label: 'Target Users & Personas' },
  { key: 'requirements', label: 'Requirements' },
  { key: 'user_stories', label: 'User Stories' },
  { key: 'success_metrics', label: 'Success Metrics (KPIs)' },
  { key: 'technical_considerations', label: 'Technical Considerations' },
  { key: 'timeline', label: 'Timeline & Milestones' },
  { key: 'risks', label: 'Risks & Mitigation' },
  { key: 'tech_stack', label: 'Tech Stack Recommendations' },
  { key: 'gtm_strategy', label: 'Go-to-Market Strategy' },
];

// Build revision prompt
export function buildRevisionPrompt(params: {
  originalPrd: string;
  feedback: string;
  sections: string[];
}): { system: string; user: string } {
  const { originalPrd, feedback, sections } = params;

  const selectedSectionNames = sections
    .map((key) => PRD_SECTIONS.find((s) => s.key === key)?.label || key)
    .join(', ');

  const userPrompt = `
<original_prd>
${originalPrd}
</original_prd>

<revision_request>
Sections to revise: ${selectedSectionNames}

User feedback:
${feedback}
</revision_request>

Please revise the specified sections based on the feedback above and return the complete PRD.
`;

  return { system: REVISION_SYSTEM_PROMPT, user: userPrompt };
}
