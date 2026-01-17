"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/src/shared/lib/supabase/client";
import type { Profile } from "@/src/entities";

interface UserContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

/**
 * Provider that manages global user state
 * All components using useUser will share this state
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initializedRef = useRef(false);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }, []);

  const refetch = useCallback(async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  }, [user, fetchProfile]);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // Fetch initial user state
    const initializeUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!isMounted) return;
        if (error) throw error;

        setUser(user);

        // Fetch profile if user exists
        if (user) {
          const profileData = await fetchProfile(user.id);
          if (isMounted) {
            setProfile(profileData);
          }
        }

        initializedRef.current = true;
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch user"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeUser();

    // Subscribe to auth state changes (only after initial load)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Skip if not yet initialized (initial event)
      if (!initializedRef.current) return;

      setUser(session?.user ?? null);

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const value: UserContextValue = {
    user,
    profile,
    loading,
    isLoading: loading,
    error,
    isAuthenticated: !!user,
    refetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Hook to access user context
 * Must be used within UserProvider
 */
export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
