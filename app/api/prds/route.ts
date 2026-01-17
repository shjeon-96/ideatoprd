import { NextRequest } from 'next/server';
import { createClient } from '@/src/shared/lib/supabase/server';
import { ErrorCodes } from '@/src/shared/lib/errors';

// Default page size
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE), 10))
    );
    const workspaceId = searchParams.get('workspaceId');

    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: ErrorCodes.AUTH_REQUIRED }, { status: 401 });
    }

    // Verify workspace membership if workspaceId is provided
    if (workspaceId) {
      const { data: membership, error: membershipError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();

      if (membershipError || !membership) {
        return Response.json({ error: ErrorCodes.WORKSPACE_ACCESS_DENIED }, { status: 403 });
      }
    }

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from('prds')
      .select('id, title, idea, template, version, created_at, workspace_id', {
        count: 'exact',
      });

    // Filter by workspace or personal (user's own PRDs only)
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    } else {
      // Personal mode: only show user's own PRDs without workspace
      query = query.is('workspace_id', null).eq('user_id', user.id);
    }

    // Apply pagination and ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Failed to fetch PRDs:', error);
      return Response.json({ error: ErrorCodes.PRD_LIST_FAILED }, { status: 500 });
    }

    const totalPages = Math.ceil((count ?? 0) / pageSize);

    return Response.json({
      data: data ?? [],
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('PRD list API error:', error);
    return Response.json({ error: ErrorCodes.PRD_LIST_FAILED }, { status: 500 });
  }
}
