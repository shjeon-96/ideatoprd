/**
 * Unit tests for PRD revision prompt system
 *
 * Tests the buildRevisionPrompt function and PRD_SECTIONS constants
 * following TDD principles.
 */

import { describe, it, expect } from 'vitest';
import {
  buildRevisionPrompt,
  PRD_SECTIONS,
  REVISION_SYSTEM_PROMPT,
} from '../revision';

describe('PRD Revision Prompt System', () => {
  describe('PRD_SECTIONS', () => {
    it('should include all required base sections', () => {
      const requiredSections = [
        'executive_summary',
        'problem_statement',
        'target_users',
        'requirements',
        'user_stories',
        'success_metrics',
        'technical_considerations',
        'timeline',
        'risks',
      ];

      const sectionKeys = PRD_SECTIONS.map((s) => s.key);

      requiredSections.forEach((section) => {
        expect(sectionKeys).toContain(section);
      });
    });

    it('should include research-specific sections', () => {
      const researchSections = [
        'market_analysis',
        'competitive_landscape',
        'tech_stack',
        'gtm_strategy',
      ];

      const sectionKeys = PRD_SECTIONS.map((s) => s.key);

      researchSections.forEach((section) => {
        expect(sectionKeys).toContain(section);
      });
    });

    it('should have non-empty labels for all sections', () => {
      PRD_SECTIONS.forEach((section) => {
        expect(section.label).toBeTruthy();
        expect(section.label.length).toBeGreaterThan(0);
      });
    });

    it('should have unique keys', () => {
      const keys = PRD_SECTIONS.map((s) => s.key);
      const uniqueKeys = [...new Set(keys)];
      expect(keys.length).toBe(uniqueKeys.length);
    });
  });

  describe('REVISION_SYSTEM_PROMPT', () => {
    it('should contain revision guidelines', () => {
      expect(REVISION_SYSTEM_PROMPT).toContain('revision_guidelines');
    });

    it('should contain output format instructions', () => {
      expect(REVISION_SYSTEM_PROMPT).toContain('output_format');
    });

    it('should instruct to return complete PRD', () => {
      expect(REVISION_SYSTEM_PROMPT).toContain('COMPLETE PRD');
    });

    it('should contain English language instructions', () => {
      expect(REVISION_SYSTEM_PROMPT).toContain('English');
    });
  });

  describe('buildRevisionPrompt', () => {
    const mockOriginalPrd = `# Test PRD
## Executive Summary
This is a test PRD.
## Problem Statement
Test problem.`;

    it('should return system and user prompts', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Please improve the executive summary.',
        sections: ['executive_summary'],
      });

      expect(result).toHaveProperty('system');
      expect(result).toHaveProperty('user');
      expect(typeof result.system).toBe('string');
      expect(typeof result.user).toBe('string');
    });

    it('should include original PRD in user prompt', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test feedback',
        sections: ['executive_summary'],
      });

      expect(result.user).toContain(mockOriginalPrd);
      expect(result.user).toContain('original_prd');
    });

    it('should include feedback in user prompt', () => {
      const feedback = 'Please make the summary more concise';
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback,
        sections: ['executive_summary'],
      });

      expect(result.user).toContain(feedback);
    });

    it('should include selected section labels in user prompt', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['executive_summary', 'problem_statement'],
      });

      expect(result.user).toContain('Executive Summary');
      expect(result.user).toContain('Problem Statement');
    });

    it('should handle unknown section keys gracefully', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['unknown_section', 'executive_summary'],
      });

      // Should include the unknown key as-is
      expect(result.user).toContain('unknown_section');
      // Should still include the known section label
      expect(result.user).toContain('Executive Summary');
    });

    it('should handle empty sections array', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: [],
      });

      expect(result.system).toBeTruthy();
      expect(result.user).toBeTruthy();
    });

    it('should include revision request tag in user prompt', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['executive_summary'],
      });

      expect(result.user).toContain('revision_request');
    });

    it('should use REVISION_SYSTEM_PROMPT as system prompt', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['executive_summary'],
      });

      expect(result.system).toBe(REVISION_SYSTEM_PROMPT);
    });
  });
});
