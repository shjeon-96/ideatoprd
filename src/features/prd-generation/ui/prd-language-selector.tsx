'use client';

import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import type { PRDLanguage } from '../model/types';
import { cn } from '@/src/shared/lib/utils';

interface PRDLanguageSelectorProps {
  value: PRDLanguage;
  onChange: (value: PRDLanguage) => void;
  disabled?: boolean;
}

const languages: { value: PRDLanguage; labelKey: 'korean' | 'english' }[] = [
  { value: 'ko', labelKey: 'korean' },
  { value: 'en', labelKey: 'english' },
];

/**
 * PRD Language Selector
 * Allows users to select the language for the generated PRD document
 * This is independent of the UI language
 */
export function PRDLanguageSelector({ value, onChange, disabled }: PRDLanguageSelectorProps) {
  const t = useTranslations('prdLanguage');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="size-4 text-muted-foreground" />
        <label className="text-sm font-medium text-foreground">{t('label')}</label>
      </div>
      <p className="text-xs text-muted-foreground">{t('description')}</p>
      <div className="flex gap-2">
        {languages.map(({ value: lang, labelKey }) => (
          <button
            key={lang}
            type="button"
            onClick={() => onChange(lang)}
            disabled={disabled}
            className={cn(
              'flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200',
              value === lang
                ? 'border-brand-primary bg-brand-secondary/30 text-brand-primary'
                : 'border-border hover:border-brand-primary/30 hover:bg-muted/30 text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
