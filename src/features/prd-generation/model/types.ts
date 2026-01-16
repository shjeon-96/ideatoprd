import type { PRDTemplate, PRDVersion } from '@/src/entities';

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
};

// Validation
export const MAX_IDEA_LENGTH = 500;
export const MIN_IDEA_LENGTH = 10;

export function validateIdea(idea: string): { valid: boolean; error?: string } {
  if (!idea || idea.trim().length < MIN_IDEA_LENGTH) {
    return {
      valid: false,
      error: `아이디어는 최소 ${MIN_IDEA_LENGTH}자 이상이어야 합니다.`,
    };
  }
  if (idea.length > MAX_IDEA_LENGTH) {
    return {
      valid: false,
      error: `아이디어는 ${MAX_IDEA_LENGTH}자를 초과할 수 없습니다.`,
    };
  }
  return { valid: true };
}
