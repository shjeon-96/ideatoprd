import { createClient } from "@/src/shared/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Email confirmation route handler
 *
 * Handles:
 * - Email signup confirmation (type: 'signup')
 * - Password reset confirmation (type: 'recovery')
 * - Email change confirmation (type: 'email_change', 'email')
 *
 * Supabase sends users to this route with token_hash and type params.
 * On success, redirects to 'next' param or '/'.
 * On error, redirects to '/auth/error'.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      // Successful verification - redirect to intended destination
      return NextResponse.redirect(new URL(next, request.url));
    }

    // Verification failed - redirect with error details
    const errorUrl = new URL("/auth/error", request.url);
    errorUrl.searchParams.set("error", error.code || "verification_failed");
    errorUrl.searchParams.set(
      "error_description",
      encodeURIComponent(error.message)
    );
    return NextResponse.redirect(errorUrl);
  }

  // Missing params - redirect to error page
  const errorUrl = new URL("/auth/error", request.url);
  errorUrl.searchParams.set("error", "missing_params");
  errorUrl.searchParams.set(
    "error_description",
    encodeURIComponent("token_hash 또는 type 파라미터가 누락되었습니다.")
  );
  return NextResponse.redirect(errorUrl);
}
