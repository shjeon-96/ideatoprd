'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale, locales, type Locale } from '@/src/i18n/config';

/**
 * Hook for managing locale state
 * Persists to localStorage and cookie for SSR support
 */
export function useLocale() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Initialize locale from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && locales.includes(stored)) {
      setLocaleState(stored);
    }
  }, []);

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
