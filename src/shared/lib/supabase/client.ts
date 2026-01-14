import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/src/shared/types/database";

/**
 * Supabase client for browser/client components
 * Uses singleton pattern to reuse the same client instance
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
