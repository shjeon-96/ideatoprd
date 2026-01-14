import { createClient } from "@/src/shared/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * OAuth callback route handler
 *
 * Handles:
 * - Google OAuth redirect
 * - Magic link email authentication
 * - Any OAuth provider callback
 *
 * The 'code' parameter is exchanged for a session.
 * On success, redirects to 'next' param or '/'.
 * On error, redirects to '/auth/error'.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful authentication - redirect to intended destination
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Missing code or exchange failed - redirect to error page
  return NextResponse.redirect(new URL("/auth/error", request.url));
}
