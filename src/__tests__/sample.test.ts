/**
 * Sample test to verify TDD workflow
 *
 * This test validates that Vitest + Testing Library setup works correctly.
 * Will be replaced with actual business logic tests as the project develops.
 */
import { describe, it, expect } from 'vitest';

// Simple utility function for testing
function formatPrdTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ');
}

describe('TDD Workflow Verification', () => {
  describe('formatPrdTitle', () => {
    it('should trim whitespace from title', () => {
      const result = formatPrdTitle('  My PRD Title  ');
      expect(result).toBe('My PRD Title');
    });

    it('should normalize multiple spaces to single space', () => {
      const result = formatPrdTitle('My   PRD    Title');
      expect(result).toBe('My PRD Title');
    });

    it('should handle empty string', () => {
      const result = formatPrdTitle('');
      expect(result).toBe('');
    });
  });
});
