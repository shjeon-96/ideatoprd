import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/src/shared/lib/supabase/server';
import { isAdminEmail } from '@/src/features/admin/config';
import type { Database } from '@/src/shared/types/database';

type PrdTemplate = Database['public']['Enums']['prd_template'];
type PrdVersion = Database['public']['Enums']['prd_version'];

const VALID_TEMPLATES: PrdTemplate[] = ['saas', 'mobile', 'marketplace', 'extension', 'ai_wrapper'];
const VALID_VERSIONS: PrdVersion[] = ['basic', 'detailed', 'research'];

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const search = searchParams.get('search') || '';
  const templateParam = searchParams.get('template') || '';
  const versionParam = searchParams.get('version') || '';

  // Validate and cast to proper types
  const template = VALID_TEMPLATES.includes(templateParam as PrdTemplate)
    ? (templateParam as PrdTemplate)
    : null;
  const version = VALID_VERSIONS.includes(versionParam as PrdVersion)
    ? (versionParam as PrdVersion)
    : null;

  try {
    let query = supabase
      .from('prds')
      .select(`
        id,
        title,
        idea,
        template,
        version,
        credits_used,
        created_at,
        user_id,
        profiles:user_id (
          email,
          display_name
        )
      `, { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,idea.ilike.%${search}%`);
    }

    // Apply template filter
    if (template) {
      query = query.eq('template', template);
    }

    // Apply version filter
    if (version) {
      query = query.eq('version', version);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Get PRD stats
    const [templateStats, versionStats] = await Promise.all([
      supabase
        .from('prds')
        .select('template')
        .then(({ data }) => {
          const counts: Record<string, number> = {};
          data?.forEach((prd) => {
            counts[prd.template] = (counts[prd.template] || 0) + 1;
          });
          return counts;
        }),
      supabase
        .from('prds')
        .select('version')
        .then(({ data }) => {
          const counts: Record<string, number> = {};
          data?.forEach((prd) => {
            counts[prd.version] = (counts[prd.version] || 0) + 1;
          });
          return counts;
        }),
    ]);

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
      stats: {
        byTemplate: templateStats,
        byVersion: versionStats,
      },
    });
  } catch (error) {
    console.error('Admin PRDs error:', error);
    return NextResponse.json({ error: 'Failed to fetch PRDs' }, { status: 500 });
  }
}
