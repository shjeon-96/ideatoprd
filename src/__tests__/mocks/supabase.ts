/**
 * Supabase client mock utilities for testing
 *
 * Provides mock implementations of Supabase client methods
 * for unit testing without actual database connections.
 */

import { vi } from 'vitest';

// Mock user data
export const mockUser = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00Z',
};

// Mock PRD data
export const mockPrd = {
  id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  user_id: mockUser.id,
  title: 'Test PRD Title',
  idea: 'Test idea for PRD',
  template: 'saas' as const,
  version: 'basic' as const,
  content: {
    markdown: '# Test PRD\n\n## Executive Summary\n\nThis is a test.',
    raw: '# Test PRD\n\n## Executive Summary\n\nThis is a test.',
  },
  credits_used: 2,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  parent_id: null,
  version_number: 1,
  revision_feedback: null,
  revised_sections: null,
};

// Mock PRD version data
export const mockPrdVersions = [
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    version_number: 2,
    title: 'Test PRD Title v2',
    revision_feedback: 'Improve the summary',
    revised_sections: ['executive_summary'],
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    version_number: 1,
    title: 'Test PRD Title',
    revision_feedback: null,
    revised_sections: null,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Create chainable mock for Supabase query builder
export function createQueryBuilderMock(data: unknown = null, error: unknown = null) {
  const mock = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    then: vi.fn().mockImplementation((resolve) => resolve({ data, error })),
  };

  // Make it thenable for async/await
  Object.defineProperty(mock, 'then', {
    value: (resolve: (value: { data: unknown; error: unknown }) => void) => {
      return Promise.resolve({ data, error }).then(resolve);
    },
  });

  return mock;
}

// Create mock Supabase client
export function createSupabaseMock(options: {
  user?: typeof mockUser | null;
  authError?: Error | null;
  queryData?: unknown;
  queryError?: unknown;
  rpcData?: unknown;
  rpcError?: unknown;
} = {}) {
  const {
    user = mockUser,
    authError = null,
    queryData = null,
    queryError = null,
    rpcData = true,
    rpcError = null,
  } = options;

  const queryBuilder = createQueryBuilderMock(queryData, queryError);

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: authError,
      }),
    },
    from: vi.fn().mockReturnValue(queryBuilder),
    rpc: vi.fn().mockResolvedValue({ data: rpcData, error: rpcError }),
  };
}

// Mock createClient function
export const mockCreateClient = vi.fn();

// Helper to setup Supabase mock for tests
export function setupSupabaseMock(mock: ReturnType<typeof createSupabaseMock>) {
  mockCreateClient.mockResolvedValue(mock);
  return mock;
}
