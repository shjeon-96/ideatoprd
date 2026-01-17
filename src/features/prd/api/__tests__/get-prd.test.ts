/**
 * Unit tests for getPrd and getPrdVersions API functions
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  mockPrd,
  mockPrdVersions,
  createSupabaseMock,
} from '@/src/__tests__/mocks/supabase';

// Mock the createClient module
vi.mock('@/src/shared/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Import after mocking
import { createClient } from '@/src/shared/lib/supabase/server';
import { getPrd, getPrdVersions } from '../get-prd';

describe('PRD API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPrd', () => {
    it('should fetch a PRD by ID successfully', async () => {
      const mockSupabase = createSupabaseMock({ queryData: mockPrd });
      (createClient as Mock).mockResolvedValue(mockSupabase);

      const result = await getPrd('prd-id-123');

      expect(result).toEqual(mockPrd);
      expect(mockSupabase.from).toHaveBeenCalledWith('prds');
    });

    it('should return null when PRD is not found (PGRST116)', async () => {
      const mockSupabase = createSupabaseMock({
        queryData: null,
        queryError: { code: 'PGRST116', message: 'No rows returned' },
      });
      (createClient as Mock).mockResolvedValue(mockSupabase);

      const result = await getPrd('non-existent-id');

      expect(result).toBeNull();
    });

    it('should throw error for other database errors', async () => {
      const mockSupabase = createSupabaseMock({
        queryData: null,
        queryError: { code: 'OTHER_ERROR', message: 'Database error' },
      });
      (createClient as Mock).mockResolvedValue(mockSupabase);

      await expect(getPrd('some-id')).rejects.toThrow('Failed to fetch PRD');
    });

    it('should include versioning fields in select query', async () => {
      const mockSupabase = createSupabaseMock({ queryData: mockPrd });
      (createClient as Mock).mockResolvedValue(mockSupabase);

      await getPrd('prd-id-123');

      const fromMock = mockSupabase.from('prds');
      expect(fromMock.select).toHaveBeenCalled();

      // Verify the select includes versioning fields
      const selectCall = fromMock.select.mock.calls[0]?.[0] || '';
      expect(selectCall).toContain('parent_id');
      expect(selectCall).toContain('version_number');
      expect(selectCall).toContain('revision_feedback');
      expect(selectCall).toContain('revised_sections');
    });
  });

  describe('getPrdVersions', () => {
    it('should fetch all versions of a PRD', async () => {
      const mockSupabase = createSupabaseMock({ rpcData: mockPrdVersions });
      (createClient as Mock).mockResolvedValue(mockSupabase);

      const result = await getPrdVersions('prd-id-123');

      expect(result).toEqual(mockPrdVersions);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_prd_versions', {
        p_prd_id: 'prd-id-123',
      });
    });

    it('should return empty array on error', async () => {
      const mockSupabase = createSupabaseMock({
        rpcData: null,
        rpcError: { message: 'RPC error' },
      });
      (createClient as Mock).mockResolvedValue(mockSupabase);

      const result = await getPrdVersions('prd-id-123');

      expect(result).toEqual([]);
    });

    it('should return empty array when data is null', async () => {
      const mockSupabase = createSupabaseMock({ rpcData: null });
      (createClient as Mock).mockResolvedValue(mockSupabase);

      const result = await getPrdVersions('prd-id-123');

      expect(result).toEqual([]);
    });
  });
});
