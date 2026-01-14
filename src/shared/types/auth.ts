/**
 * Authentication types for Supabase Auth
 *
 * Re-exports common Supabase Auth types for convenience
 * and defines app-specific auth interfaces.
 */

import type { User, Session, AuthError, AuthResponse } from "@supabase/supabase-js";

// Re-export Supabase Auth types
export type { User, Session, AuthError, AuthResponse };

/**
 * Authentication state for the application
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
}

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * OAuth provider types supported by the application
 */
export type OAuthProvider = "google" | "github";

/**
 * User profile data stored in the application
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
