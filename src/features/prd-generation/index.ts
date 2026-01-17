export { PRD_SYSTEM_PROMPT, getSystemPrompt } from './lib/prompts/system';
export { TEMPLATE_MAP } from './lib/prompts/templates';
export type { GeneratePRDRequest, PRDGenerationContext, PRDLanguage } from './model/types';
export {
  CREDITS_PER_VERSION,
  validateIdea,
  MAX_IDEA_LENGTH,
  MIN_IDEA_LENGTH,
} from './model/types';
export { PRDForm, PRDViewer, TemplateSelector } from './ui';
// Server-only exports: import directly from ./api/save-prd in server components/route handlers
// export { savePRD, extractPRDTitle, parsePRDContent } from './api/save-prd';
