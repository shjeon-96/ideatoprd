/**
 * Component tests for VersionHistory
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionHistory } from '../version-history';
import type { PrdVersionItem } from '../../api/get-prd';

// Mock next/link - preserve className
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

const mockVersions: PrdVersionItem[] = [
  {
    id: 'prd-v2',
    version_number: 2,
    title: 'Test PRD v2',
    revision_feedback: 'Improved the summary section',
    revised_sections: ['executive_summary', 'requirements'],
    created_at: '2024-01-02T10:00:00Z',
  },
  {
    id: 'prd-v1',
    version_number: 1,
    title: 'Test PRD',
    revision_feedback: null,
    revised_sections: null,
    created_at: '2024-01-01T10:00:00Z',
  },
];

describe('VersionHistory', () => {
  describe('Rendering', () => {
    it('should not render when there is only one version', () => {
      const { container } = render(
        <VersionHistory versions={[mockVersions[1]]} currentVersionId="prd-v1" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render version count badge', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v2" />
      );

      expect(screen.getByText('2개 버전')).toBeInTheDocument();
    });

    it('should render all versions', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v2" />
      );

      expect(screen.getByText('원본')).toBeInTheDocument();
      expect(screen.getByText('수정 v2')).toBeInTheDocument();
    });

    it('should show "현재" badge for current version', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v2" />
      );

      expect(screen.getByText('현재')).toBeInTheDocument();
    });

    it('should display revision feedback for non-original versions', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v1" />
      );

      expect(screen.getByText('Improved the summary section')).toBeInTheDocument();
    });

    it('should display revised sections as badges', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v1" />
      );

      expect(screen.getByText('executive_summary')).toBeInTheDocument();
      expect(screen.getByText('requirements')).toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('should render links to each version', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v2" />
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);

      expect(links[0]).toHaveAttribute('href', '/dashboard/prds/prd-v2');
      expect(links[1]).toHaveAttribute('href', '/dashboard/prds/prd-v1');
    });
  });

  describe('Date Formatting', () => {
    it('should format dates in Korean locale', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v2" />
      );

      // Should contain formatted date (month/day format)
      // The exact format depends on the locale and may vary
      // Use getAllByText since there are multiple dates
      const dateElements = screen.getAllByText(/1월/i);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe('Section Truncation', () => {
    it('should truncate sections when more than 3', () => {
      const versionsWithManySections: PrdVersionItem[] = [
        {
          id: 'prd-v2',
          version_number: 2,
          title: 'Test PRD v2',
          revision_feedback: 'Major revision',
          revised_sections: [
            'executive_summary',
            'requirements',
            'user_stories',
            'timeline',
            'risks',
          ],
          created_at: '2024-01-02T10:00:00Z',
        },
        mockVersions[1],
      ];

      render(
        <VersionHistory
          versions={versionsWithManySections}
          currentVersionId="prd-v1"
        />
      );

      // Should show first 3 sections
      expect(screen.getByText('executive_summary')).toBeInTheDocument();
      expect(screen.getByText('requirements')).toBeInTheDocument();
      expect(screen.getByText('user_stories')).toBeInTheDocument();

      // Should show +2 indicator
      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should highlight current version with different styling', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v2" />
      );

      const currentVersionLink = screen.getByRole('link', {
        name: /수정 v2/i,
      });

      // Current version should have primary/highlight styling in classname
      expect(currentVersionLink.className).toMatch(/primary|border/);
    });

    it('should not highlight non-current versions', () => {
      render(
        <VersionHistory versions={mockVersions} currentVersionId="prd-v2" />
      );

      const originalVersionLink = screen.getByRole('link', {
        name: /원본/i,
      });

      // Non-current version should not have the primary bg class
      expect(originalVersionLink.className).not.toContain('bg-primary');
    });
  });

  describe('Empty States', () => {
    it('should not render for empty versions array', () => {
      const { container } = render(
        <VersionHistory versions={[]} currentVersionId="prd-v1" />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
