import { createClient } from "@/src/shared/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Validate redirect URL to prevent open redirect attacks
 * Only allows redirects to the same origin
 */
function isValidRedirect(url: string, baseUrl: string): boolean {
  // Only allow relative paths or same-origin URLs
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true;
  }

  try {
    const parsed = new URL(url, baseUrl);
    const base = new URL(baseUrl);
    return parsed.origin === base.origin;
  } catch {
    return false;
  }
}

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
  const next = searchParams.get("next") ?? "/dashboard";

  // Validate redirect URL to prevent open redirect attacks
  const safeNext = isValidRedirect(next, request.url) ? next : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful authentication - redirect to intended destination
      return NextResponse.redirect(new URL(safeNext, request.url));
    }

    // Log the error for debugging
    console.error("[AUTH_CALLBACK] Code exchange failed:", {
      errorCode: error.code,
      errorMessage: error.message,
    });

    // Redirect with error details
    const errorUrl = new URL("/auth/error", request.url);
    errorUrl.searchParams.set("error", error.code || "exchange_failed");
    errorUrl.searchParams.set("error_description", error.message);
    return NextResponse.redirect(errorUrl);
  }

  // Missing code parameter
  console.warn("[AUTH_CALLBACK] Missing code parameter in OAuth callback");
  const errorUrl = new URL("/auth/error", request.url);
  errorUrl.searchParams.set("error", "missing_code");
  errorUrl.searchParams.set("error_description", "Authentication code is missing");
  return NextResponse.redirect(errorUrl);
}
