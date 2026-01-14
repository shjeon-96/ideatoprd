import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/src/shared/types/database";

/**
 * Update user session in middleware
 * This should be called from the root middleware.ts file
 *
 * Handles:
 * - Refreshing expired sessions
 * - Passing session to Server Components via cookies
 *
 * @example
 * // middleware.ts (root)
 * import { updateSession } from "@/shared/lib/supabase/middleware";
 *
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Refreshes session if expired - required for Server Components
  await supabase.auth.getUser();

  return supabaseResponse;
}
