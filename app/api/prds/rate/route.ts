import { createClient } from '@/src/shared/lib/supabase/server';
import { z } from 'zod';

const ratingSchema = z.object({
  prdId: z.string().uuid(),
  rating: z.union([z.literal(1), z.literal(2)]),
  feedback: z.string().max(1000).nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ratingSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { prdId, rating, feedback } = parsed.data;

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user owns this PRD
    const { data: prd, error: prdError } = await supabase
      .from('prds')
      .select('user_id')
      .eq('id', prdId)
      .single();

    if (prdError || !prd) {
      return Response.json(
        { error: 'PRD not found' },
        { status: 404 }
      );
    }

    if (prd.user_id !== user.id) {
      return Response.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update rating
    const { error: updateError } = await supabase
      .from('prds')
      .update({
        rating,
        rating_feedback: feedback ?? null,
        rated_at: new Date().toISOString(),
      })
      .eq('id', prdId);

    if (updateError) {
      console.error('Failed to update rating:', updateError);
      return Response.json(
        { error: 'Failed to save rating' },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Rating API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
