import type { PRDTemplate, PRDVersion } from '@/src/entities';

// PRD generation language (English only)
export type PRDLanguage = 'en';

// API Request
export interface GeneratePRDRequest {
  idea: string;
  template: PRDTemplate;
  version: PRDVersion;
}

// For internal use
export interface PRDGenerationContext {
  userId: string;
  idea: string;
  template: PRDTemplate;
  version: PRDVersion;
  creditsRequired: number;
}

// Credits required per version
export const CREDITS_PER_VERSION: Record<PRDVersion, number> = {
  basic: 1,
  detailed: 2,
  research: 3,
};

// Validation
export const MAX_IDEA_LENGTH = 500;
export const MIN_IDEA_LENGTH = 10;

export function validateIdea(idea: string): { valid: boolean; error?: string } {
  if (!idea || idea.trim().length < MIN_IDEA_LENGTH) {
    return {
      valid: false,
      error: `Idea must be at least ${MIN_IDEA_LENGTH} characters.`,
    };
  }
  if (idea.length > MAX_IDEA_LENGTH) {
    return {
      valid: false,
      error: `Idea cannot exceed ${MAX_IDEA_LENGTH} characters.`,
    };
  }
  return { valid: true };
}
