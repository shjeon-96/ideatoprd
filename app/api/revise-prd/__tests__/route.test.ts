/**
 * Integration tests for PRD revision API route
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  mockUser,
  mockPrd,
  createSupabaseMock,
  createQueryBuilderMock,
} from '@/src/__tests__/mocks/supabase';

// Mock dependencies
vi.mock('@/src/shared/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('ai', () => ({
  streamText: vi.fn(),
}));

vi.mock('@/src/shared/lib/ai/anthropic', () => ({
  advancedModel: 'claude-3-opus-20240229',
  AI_CONFIG: {
    maxTokens: 8000,
    temperature: 0.7,
  },
}));

// Import after mocking
import { createClient } from '@/src/shared/lib/supabase/server';
import { streamText } from 'ai';
import { POST } from '../route';

describe('POST /api/revise-prd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createValidRequest = (body: object) => {
    return new Request('http://localhost:3000/api/revise-prd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  describe('Input Validation', () => {
    it('should return 400 when prdId is missing', async () => {
      const req = createValidRequest({
        feedback: 'Please improve this section',
        sections: ['executive_summary'],
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('필수 입력값');
    });

    it('should return 400 when feedback is missing', async () => {
      const req = createValidRequest({
        prdId: 'prd-id-123',
        sections: ['executive_summary'],
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('필수 입력값');
    });

    it('should return 400 when sections array is empty', async () => {
      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Please improve this section',
        sections: [],
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('필수 입력값');
    });

    it('should return 400 when feedback is too short', async () => {
      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Short',
        sections: ['executive_summary'],
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('10자');
    });
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const mockSupabase = createSupabaseMock({
        user: null,
        authError: { name: 'AuthError', message: 'Not authenticated' },
      });
      (createClient as Mock).mockResolvedValue(mockSupabase);

      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Please improve this section with more details',
        sections: ['executive_summary'],
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('로그인');
    });
  });

  describe('PRD Fetching', () => {
    it('should return 404 when PRD is not found', async () => {
      const queryBuilder = createQueryBuilderMock(null, {
        code: 'PGRST116',
        message: 'Not found',
      });

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue(queryBuilder),
        rpc: vi.fn(),
      };
      (createClient as Mock).mockResolvedValue(mockSupabase);

      const req = createValidRequest({
        prdId: 'non-existent-id',
        feedback: 'Please improve this section with more details',
        sections: ['executive_summary'],
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('찾을 수 없습니다');
    });

    it('should return 400 when PRD has no content', async () => {
      const prdWithoutContent = { ...mockPrd, content: null };
      const queryBuilder = createQueryBuilderMock(prdWithoutContent, null);

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue(queryBuilder),
        rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
      };
      (createClient as Mock).mockResolvedValue(mockSupabase);

      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Please improve this section with more details',
        sections: ['executive_summary'],
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('내용을 읽을 수 없습니다');
    });
  });

  describe('Credit Deduction', () => {
    it('should return 402 when user has insufficient credits', async () => {
      // Create a query builder for PRD fetch
      const prdQueryBuilder = createQueryBuilderMock(mockPrd, null);

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue(prdQueryBuilder),
        rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
      };
      (createClient as Mock).mockResolvedValue(mockSupabase);

      // Set NODE_ENV to production to enable credit check
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Please improve this section with more details',
        sections: ['executive_summary'],
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(402);
      expect(data.error).toContain('크레딧');

      // Restore env
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Successful Revision', () => {
    it('should call streamText with correct parameters', async () => {
      // Setup version query
      const versionsQueryBuilder = {
        ...createQueryBuilderMock([{ version_number: 1 }], null),
        then: undefined,
      };
      Object.defineProperty(versionsQueryBuilder, 'then', {
        value: (resolve: (value: unknown) => void) =>
          Promise.resolve({ data: [{ version_number: 1 }], error: null }).then(resolve),
      });

      const prdQueryBuilder = createQueryBuilderMock(mockPrd, null);

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn((table: string) => {
          if (table === 'prds') {
            // Check call count to differentiate between PRD fetch and version fetch
            const callCount = mockSupabase.from.mock.calls.filter(
              (c: string[]) => c[0] === 'prds'
            ).length;
            if (callCount === 1) {
              return prdQueryBuilder;
            }
            return versionsQueryBuilder;
          }
          return prdQueryBuilder;
        }),
        rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
      };
      (createClient as Mock).mockResolvedValue(mockSupabase);

      // Mock streamText to return a mock response
      const mockStreamResponse = {
        toTextStreamResponse: vi.fn().mockReturnValue(
          new Response('Streamed content', {
            headers: { 'Content-Type': 'text/plain' },
          })
        ),
      };
      (streamText as Mock).mockReturnValue(mockStreamResponse);

      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Please improve this section with more details',
        sections: ['executive_summary'],
        language: 'ko',
      });

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(streamText).toHaveBeenCalled();

      // Verify the call arguments contain expected content
      const callArgs = (streamText as Mock).mock.calls[0][0];
      expect(callArgs.model).toBeDefined();
      expect(callArgs.system).toContain('revision');
      expect(callArgs.prompt).toContain('Executive Summary');
    });

    it('should save revised PRD in onFinish callback', async () => {
      const versionsQueryBuilder = {
        ...createQueryBuilderMock([{ version_number: 1 }], null),
        then: undefined,
      };
      Object.defineProperty(versionsQueryBuilder, 'then', {
        value: (resolve: (value: unknown) => void) =>
          Promise.resolve({ data: [{ version_number: 1 }], error: null }).then(resolve),
      });

      const prdQueryBuilder = createQueryBuilderMock(mockPrd, null);
      const insertQueryBuilder = createQueryBuilderMock(null, null);

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn((table: string) => {
          if (table === 'prds') {
            const callCount = mockSupabase.from.mock.calls.filter(
              (c: string[]) => c[0] === 'prds'
            ).length;
            if (callCount === 1) {
              return prdQueryBuilder;
            }
            if (callCount === 2) {
              return versionsQueryBuilder;
            }
            return insertQueryBuilder;
          }
          return prdQueryBuilder;
        }),
        rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
      };
      (createClient as Mock).mockResolvedValue(mockSupabase);

      // Capture the onFinish callback
      let capturedOnFinish: (() => Promise<void>) | null = null;

      const mockStreamResponse = {
        toTextStreamResponse: vi.fn().mockReturnValue(
          new Response('Streamed content', {
            headers: { 'Content-Type': 'text/plain' },
          })
        ),
      };

      (streamText as Mock).mockImplementation((options) => {
        // Simulate onChunk being called with content
        if (options.onChunk) {
          options.onChunk({ chunk: { type: 'text-delta', text: '# Revised PRD' } });
        }
        // Capture onFinish for later execution
        capturedOnFinish = options.onFinish;
        return mockStreamResponse;
      });

      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Please improve this section with more details',
        sections: ['executive_summary'],
        language: 'ko',
      });

      await POST(req);

      // Execute the onFinish callback
      expect(capturedOnFinish).toBeDefined();
      if (capturedOnFinish) {
        await capturedOnFinish();
      }

      // Verify insert was called
      expect(mockSupabase.from).toHaveBeenCalledWith('prds');
    });

    it('should attempt refund if PRD save fails', async () => {
      const versionsQueryBuilder = {
        ...createQueryBuilderMock([{ version_number: 1 }], null),
        then: undefined,
      };
      Object.defineProperty(versionsQueryBuilder, 'then', {
        value: (resolve: (value: unknown) => void) =>
          Promise.resolve({ data: [{ version_number: 1 }], error: null }).then(resolve),
      });

      const prdQueryBuilder = createQueryBuilderMock(mockPrd, null);
      const insertQueryBuilder = createQueryBuilderMock(null, {
        code: 'ERROR',
        message: 'Insert failed',
      });

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn((table: string) => {
          if (table === 'prds') {
            const callCount = mockSupabase.from.mock.calls.filter(
              (c: string[]) => c[0] === 'prds'
            ).length;
            if (callCount === 1) {
              return prdQueryBuilder;
            }
            if (callCount === 2) {
              return versionsQueryBuilder;
            }
            return insertQueryBuilder;
          }
          return prdQueryBuilder;
        }),
        rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
      };
      (createClient as Mock).mockResolvedValue(mockSupabase);

      let capturedOnFinish: (() => Promise<void>) | null = null;

      const mockStreamResponse = {
        toTextStreamResponse: vi.fn().mockReturnValue(
          new Response('Streamed content', {
            headers: { 'Content-Type': 'text/plain' },
          })
        ),
      };

      (streamText as Mock).mockImplementation((options) => {
        if (options.onChunk) {
          options.onChunk({ chunk: { type: 'text-delta', text: '# Revised PRD' } });
        }
        capturedOnFinish = options.onFinish;
        return mockStreamResponse;
      });

      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Please improve this section with more details',
        sections: ['executive_summary'],
        language: 'ko',
      });

      await POST(req);

      // Execute the onFinish callback - this should trigger refund attempt
      if (capturedOnFinish) {
        await capturedOnFinish();
      }

      // Verify refund was attempted (add_credit rpc call)
      const rpcCalls = mockSupabase.rpc.mock.calls;
      const addCreditCall = rpcCalls.find(
        (call: unknown[]) => call[0] === 'add_credit'
      );
      expect(addCreditCall).toBeDefined();
    });

    it('should catch exceptions thrown during PRD save', async () => {
      const versionsQueryBuilder = {
        ...createQueryBuilderMock([{ version_number: 1 }], null),
        then: undefined,
      };
      Object.defineProperty(versionsQueryBuilder, 'then', {
        value: (resolve: (value: unknown) => void) =>
          Promise.resolve({ data: [{ version_number: 1 }], error: null }).then(resolve),
      });

      const prdQueryBuilder = createQueryBuilderMock(mockPrd, null);

      // Create an insert query builder that throws an exception
      const insertQueryBuilder = {
        insert: vi.fn().mockImplementation(() => {
          throw new Error('Database connection lost');
        }),
      };

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn((table: string) => {
          if (table === 'prds') {
            const callCount = mockSupabase.from.mock.calls.filter(
              (c: string[]) => c[0] === 'prds'
            ).length;
            if (callCount === 1) {
              return prdQueryBuilder;
            }
            if (callCount === 2) {
              return versionsQueryBuilder;
            }
            return insertQueryBuilder;
          }
          return prdQueryBuilder;
        }),
        rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
      };
      (createClient as Mock).mockResolvedValue(mockSupabase);

      let capturedOnFinish: (() => Promise<void>) | null = null;
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockStreamResponse = {
        toTextStreamResponse: vi.fn().mockReturnValue(
          new Response('Streamed content', {
            headers: { 'Content-Type': 'text/plain' },
          })
        ),
      };

      (streamText as Mock).mockImplementation((options) => {
        if (options.onChunk) {
          options.onChunk({ chunk: { type: 'text-delta', text: '# Revised PRD' } });
        }
        capturedOnFinish = options.onFinish;
        return mockStreamResponse;
      });

      const req = createValidRequest({
        prdId: 'prd-id-123',
        feedback: 'Please improve this section with more details',
        sections: ['executive_summary'],
        language: 'ko',
      });

      await POST(req);

      // Execute the onFinish callback - should catch the exception
      if (capturedOnFinish) {
        await capturedOnFinish();
      }

      // Verify error was logged (catch block was executed)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[CRITICAL] Failed to save revised PRD:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when request body parsing fails', async () => {
      const req = new Request('http://localhost:3000/api/revise-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json{',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('오류');
    });
  });
});
