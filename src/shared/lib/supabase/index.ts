/**
 * Supabase client utilities for Next.js App Router
 *
 * @module @/shared/lib/supabase
 */

// Browser client for 'use client' components
export { createClient as createBrowserClient } from "./client";

// Server client for Server Components, Server Actions, Route Handlers
export { createClient as createServerClient } from "./server";

// Middleware utilities for session management
export { updateSession } from "./middleware";
