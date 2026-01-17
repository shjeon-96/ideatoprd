/**
 * Component tests for RevisionPanel
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RevisionPanel } from '../revision-panel';

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('RevisionPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('Initial State', () => {
    it('should render collapsed state with expand button', () => {
      render(<RevisionPanel prdId="prd-123" />);

      expect(screen.getByRole('button', { name: /PRD 수정하기/i })).toBeInTheDocument();
    });

    it('should expand when clicking the expand button', async () => {
      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      expect(screen.getByText(/수정할 섹션 선택/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/어떤 부분을/i)).toBeInTheDocument();
    });
  });

  describe('Section Selection', () => {
    it('should allow selecting sections', async () => {
      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      // Expand
      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      // Select a section
      const summaryButton = screen.getByRole('button', { name: /요약/i });
      await user.click(summaryButton);

      // Should have selected state
      expect(summaryButton).toHaveClass('bg-amber-500');
    });

    it('should toggle section selection', async () => {
      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      const summaryButton = screen.getByRole('button', { name: /요약/i });

      // Select
      await user.click(summaryButton);
      expect(summaryButton).toHaveClass('bg-amber-500');

      // Deselect
      await user.click(summaryButton);
      expect(summaryButton).not.toHaveClass('bg-amber-500');
    });

    it('should show research sections when isResearchVersion is true', async () => {
      render(<RevisionPanel prdId="prd-123" isResearchVersion={true} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      expect(screen.getByRole('button', { name: /시장 분석/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /경쟁 분석/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /GTM 전략/i })).toBeInTheDocument();
    });

    it('should hide research sections when isResearchVersion is false', async () => {
      render(<RevisionPanel prdId="prd-123" isResearchVersion={false} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      expect(screen.queryByRole('button', { name: /시장 분석/i })).not.toBeInTheDocument();
    });
  });

  describe('Feedback Input', () => {
    it('should track character count', async () => {
      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      const textarea = screen.getByPlaceholderText(/어떤 부분을/i);
      await user.type(textarea, 'Test feedback');

      expect(screen.getByText(/13자 입력됨/i)).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show error when no sections selected', async () => {
      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      // Type valid feedback
      const textarea = screen.getByPlaceholderText(/어떤 부분을/i);
      await user.type(textarea, 'This is valid feedback with more than 10 characters');

      // Try to submit without selecting sections
      const submitButton = screen.getByRole('button', { name: /크레딧으로 수정하기/i });

      // Button should be disabled
      expect(submitButton).toBeDisabled();
    });

    it('should show error when feedback is too short', async () => {
      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      // Select a section
      await user.click(screen.getByRole('button', { name: /요약/i }));

      // Type short feedback
      const textarea = screen.getByPlaceholderText(/어떤 부분을/i);
      await user.type(textarea, 'Short');

      // Submit button should be disabled
      const submitButton = screen.getByRole('button', { name: /크레딧으로 수정하기/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Submit', () => {
    it('should call API with correct data on submit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));

      // Select section
      await user.click(screen.getByRole('button', { name: /요약/i }));

      // Type feedback
      const textarea = screen.getByPlaceholderText(/어떤 부분을/i);
      await user.type(textarea, 'Please improve the executive summary with more details');

      // Submit
      const submitButton = screen.getByRole('button', { name: /크레딧으로 수정하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/revise-prd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('executive_summary'),
        });
      });
    });

    it('should show error message on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: '크레딧이 부족합니다.' }),
      });

      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));
      await user.click(screen.getByRole('button', { name: /요약/i }));

      const textarea = screen.getByPlaceholderText(/어떤 부분을/i);
      await user.type(textarea, 'Please improve the executive summary with more details');

      const submitButton = screen.getByRole('button', { name: /크레딧으로 수정하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/크레딧이 부족합니다/i)).toBeInTheDocument();
      });
    });

    it('should redirect to dashboard on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));
      await user.click(screen.getByRole('button', { name: /요약/i }));

      const textarea = screen.getByPlaceholderText(/어떤 부분을/i);
      await user.type(textarea, 'Please improve the executive summary with more details');

      const submitButton = screen.getByRole('button', { name: /크레딧으로 수정하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
        expect(mockRefresh).toHaveBeenCalled();
      });
    });
  });

  describe('Cancel', () => {
    it('should collapse and reset state on cancel', async () => {
      render(<RevisionPanel prdId="prd-123" />);
      const user = userEvent.setup();

      // Expand and fill form
      await user.click(screen.getByRole('button', { name: /PRD 수정하기/i }));
      await user.click(screen.getByRole('button', { name: /요약/i }));

      const textarea = screen.getByPlaceholderText(/어떤 부분을/i);
      await user.type(textarea, 'Some feedback');

      // Cancel
      const cancelButton = screen.getByRole('button', { name: /취소/i });
      await user.click(cancelButton);

      // Should be collapsed
      expect(screen.getByRole('button', { name: /PRD 수정하기/i })).toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/어떤 부분을/i)).not.toBeInTheDocument();
    });
  });
});
