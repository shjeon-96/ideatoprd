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
  REVISION_LANGUAGE_INSTRUCTIONS,
} from '../revision';

describe('PRD Revision Prompt System', () => {
  describe('PRD_SECTIONS', () => {
    it('should have matching keys for ko and en languages', () => {
      const koKeys = PRD_SECTIONS.ko.map((s) => s.key);
      const enKeys = PRD_SECTIONS.en.map((s) => s.key);

      expect(koKeys).toEqual(enKeys);
    });

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

      const koKeys = PRD_SECTIONS.ko.map((s) => s.key);

      requiredSections.forEach((section) => {
        expect(koKeys).toContain(section);
      });
    });

    it('should include research-specific sections', () => {
      const researchSections = [
        'market_analysis',
        'competitive_landscape',
        'tech_stack',
        'gtm_strategy',
      ];

      const koKeys = PRD_SECTIONS.ko.map((s) => s.key);

      researchSections.forEach((section) => {
        expect(koKeys).toContain(section);
      });
    });

    it('should have non-empty labels for all sections', () => {
      PRD_SECTIONS.ko.forEach((section) => {
        expect(section.label).toBeTruthy();
        expect(section.label.length).toBeGreaterThan(0);
      });

      PRD_SECTIONS.en.forEach((section) => {
        expect(section.label).toBeTruthy();
        expect(section.label.length).toBeGreaterThan(0);
      });
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
  });

  describe('REVISION_LANGUAGE_INSTRUCTIONS', () => {
    it('should have instructions for ko language', () => {
      expect(REVISION_LANGUAGE_INSTRUCTIONS.ko).toBeTruthy();
      expect(REVISION_LANGUAGE_INSTRUCTIONS.ko).toContain('한국어');
    });

    it('should have instructions for en language', () => {
      expect(REVISION_LANGUAGE_INSTRUCTIONS.en).toBeTruthy();
      expect(REVISION_LANGUAGE_INSTRUCTIONS.en).toContain('English');
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
        language: 'ko',
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
        language: 'ko',
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
        language: 'ko',
      });

      expect(result.user).toContain(feedback);
    });

    it('should include selected section labels in user prompt', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['executive_summary', 'problem_statement'],
        language: 'ko',
      });

      // Should contain Korean labels
      expect(result.user).toContain('요약');
      expect(result.user).toContain('문제 정의');
    });

    it('should include language-specific instructions in system prompt', () => {
      const koResult = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['executive_summary'],
        language: 'ko',
      });

      const enResult = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['executive_summary'],
        language: 'en',
      });

      expect(koResult.system).toContain('한국어');
      expect(enResult.system).toContain('English');
    });

    it('should handle unknown section keys gracefully', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['unknown_section', 'executive_summary'],
        language: 'ko',
      });

      // Should include the unknown key as-is
      expect(result.user).toContain('unknown_section');
      // Should still include the known section label
      expect(result.user).toContain('요약');
    });

    it('should handle empty sections array', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: [],
        language: 'ko',
      });

      expect(result.system).toBeTruthy();
      expect(result.user).toBeTruthy();
    });

    it('should use English labels when language is en', () => {
      const result = buildRevisionPrompt({
        originalPrd: mockOriginalPrd,
        feedback: 'Test',
        sections: ['executive_summary', 'target_users'],
        language: 'en',
      });

      expect(result.user).toContain('Executive Summary');
      expect(result.user).toContain('Target Users');
    });
  });
});
