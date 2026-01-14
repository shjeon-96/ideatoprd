import { updateSession } from "@/src/shared/lib/supabase/middleware";
import { type NextRequest } from "next/server";

/**
 * Authentication middleware for session management
 *
 * This middleware:
 * - Refreshes expired sessions on every request
 * - Passes updated session cookies to Server Components
 *
 * NOTE: This does NOT handle route protection.
 * Route protection should be implemented in individual pages/layouts.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Common image file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
