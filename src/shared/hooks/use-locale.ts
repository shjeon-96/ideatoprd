'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale, locales, type Locale } from '@/src/i18n/config';

/**
 * Get initial locale from localStorage (client-side only)
 */
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  const stored = localStorage.getItem('locale') as Locale | null;
  return stored && locales.includes(stored) ? stored : defaultLocale;
}

/**
 * Hook for managing locale state
 * Persists to localStorage and cookie for SSR support
 */
export function useLocale() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (newLocale: Locale) => {
    // Persist to localStorage
    localStorage.setItem('locale', newLocale);
    // Persist to cookie for SSR
    document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    // Update local state
    setLocaleState(newLocale);
    // Refresh to apply new locale
    startTransition(() => {
      router.refresh();
    });
  };

  return { locale, setLocale, isPending };
}
