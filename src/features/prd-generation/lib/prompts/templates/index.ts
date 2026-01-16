export { SAAS_TEMPLATE } from './saas';
export { MOBILE_TEMPLATE } from './mobile';
export { MARKETPLACE_TEMPLATE } from './marketplace';
export { EXTENSION_TEMPLATE } from './extension';
export { AI_WRAPPER_TEMPLATE } from './ai-wrapper';

import { SAAS_TEMPLATE } from './saas';
import { MOBILE_TEMPLATE } from './mobile';
import { MARKETPLACE_TEMPLATE } from './marketplace';
import { EXTENSION_TEMPLATE } from './extension';
import { AI_WRAPPER_TEMPLATE } from './ai-wrapper';
import type { PRDTemplate } from '@/src/entities';

export const TEMPLATE_MAP: Record<PRDTemplate, string> = {
  saas: SAAS_TEMPLATE,
  mobile: MOBILE_TEMPLATE,
  marketplace: MARKETPLACE_TEMPLATE,
  extension: EXTENSION_TEMPLATE,
  ai_wrapper: AI_WRAPPER_TEMPLATE,
};
