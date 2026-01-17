'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { locales, localeNames, type Locale } from '@/src/i18n/config';
import { cn } from '@/src/shared/lib/utils';

/**
 * Language switcher dropdown component
 * Allows users to switch between available locales
 */
export function LanguageSwitcher() {
  const { locale, setLocale, isPending } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          isPending && 'opacity-50 cursor-not-allowed'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 rounded-md border border-border bg-popover shadow-lg z-50"
          role="listbox"
          aria-label="Available languages"
        >
          <div className="py-1">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-accent',
                  locale === loc && 'bg-accent/50 font-medium'
                )}
                role="option"
                aria-selected={locale === loc}
              >
                <span>{localeNames[loc]}</span>
                {locale === loc && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
