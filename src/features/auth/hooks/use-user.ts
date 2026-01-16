"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/src/shared/lib/supabase/client";
import type { Profile } from "@/src/entities";

interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

/**
 * Client-side hook for reactive user state
 * Subscribes to auth state changes and updates automatically
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch profile:", error);
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

    // Fetch initial user state
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);

        // Fetch profile if user exists
        if (user) {
          const profileData = await fetchProfile(user.id);
          setProfile(profileData);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      // Update profile on auth state change
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return {
    user,
    profile,
    loading,
    isLoading: loading,
    error,
    isAuthenticated: !!user,
    refetch,
  };
}
