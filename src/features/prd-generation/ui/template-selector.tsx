'use client';

import { useTranslations } from 'next-intl';
import type { PRDTemplate } from '@/src/entities';
import { cn } from '@/src/shared/lib/utils';
import { Briefcase, Smartphone, Store, Puzzle, Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
  value: PRDTemplate;
  onChange: (template: PRDTemplate) => void;
  disabled?: boolean;
}

const TEMPLATES: {
  id: PRDTemplate;
  labelKey: string;
  icon: typeof Briefcase;
  descriptionKey: string;
}[] = [
  { id: 'saas', labelKey: 'templates.saas.label', icon: Briefcase, descriptionKey: 'templates.saas.description' },
  { id: 'mobile', labelKey: 'templates.mobile.label', icon: Smartphone, descriptionKey: 'templates.mobile.description' },
  { id: 'marketplace', labelKey: 'templates.marketplace.label', icon: Store, descriptionKey: 'templates.marketplace.description' },
  { id: 'extension', labelKey: 'templates.extension.label', icon: Puzzle, descriptionKey: 'templates.extension.description' },
  { id: 'ai_wrapper', labelKey: 'templates.aiWrapper.label', icon: Sparkles, descriptionKey: 'templates.aiWrapper.description' },
];

export function TemplateSelector({
  value,
  onChange,
  disabled,
}: TemplateSelectorProps) {
  const t = useTranslations('generate');

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {TEMPLATES.map(({ id, labelKey, icon: Icon, descriptionKey }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
            'hover:border-primary/50 hover:bg-primary/5',
            'disabled:cursor-not-allowed disabled:opacity-50',
            value === id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground'
          )}
        >
          <Icon className="h-6 w-6" />
          <span className="text-sm font-medium">{t(labelKey)}</span>
          <span className="text-center text-xs opacity-70">{t(descriptionKey)}</span>
        </button>
      ))}
    </div>
  );
}
