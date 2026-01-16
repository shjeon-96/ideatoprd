import { anthropic } from '@ai-sdk/anthropic';

// Default model (cost-effective)
export const defaultModel = anthropic('claude-3-5-haiku-latest');

// Advanced model (higher quality PRD)
export const advancedModel = anthropic('claude-sonnet-4-20250514');

// Model configuration
export const AI_CONFIG = {
  maxTokens: 8192, // PRD is long document
  temperature: 0.7, // Balance creativity/consistency
  topP: 0.95,
} as const;
