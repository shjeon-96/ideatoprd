'use client';

import { useState, useTransition, useCallback, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale, locales, type Locale } from '@/src/i18n/config';

// Storage key for locale
const LOCALE_STORAGE_KEY = 'locale';

/**
 * Get locale from localStorage (client-side only)
 */
function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
  return stored && locales.includes(stored) ? stored : defaultLocale;
}

/**
 * Subscribe to localStorage changes for locale
 */
function subscribeToLocale(callback: () => void): () => void {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOCALE_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

/**
 * Server snapshot - always returns defaultLocale for hydration safety
 */
function getServerSnapshot(): Locale {
  return defaultLocale;
}

/**
 * Check if component is mounted (client-side)
 */
function subscribeMounted(callback: () => void): () => void {
  // Already mounted when this runs on client
  callback();
  return () => {};
}

function getMountedSnapshot(): boolean {
  return true;
}

function getMountedServerSnapshot(): boolean {
  return false;
}

/**
 * Hook for managing locale state
 * Persists to localStorage and cookie for SSR support
 *
 * Uses useSyncExternalStore for React Compiler compatibility
 * and proper hydration handling.
 */
export function useLocale() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Use useSyncExternalStore for localStorage sync (React Compiler compatible)
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getStoredLocale,
    getServerSnapshot
  );

  // Track mounted state without useEffect setState
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  // Local state for optimistic updates
  const [optimisticLocale, setOptimisticLocale] = useState<Locale | null>(null);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      // Optimistic update
      setOptimisticLocale(newLocale);
      // Persist to localStorage
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      // Persist to cookie for SSR
      document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
      // Refresh to apply new locale
      startTransition(() => {
        router.refresh();
        // Clear optimistic state after refresh
        setOptimisticLocale(null);
      });
    },
    [router]
  );

  return {
    locale: optimisticLocale ?? locale,
    setLocale,
    isPending,
    mounted,
  };
}
