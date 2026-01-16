'use client';

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
  label: string;
  icon: typeof Briefcase;
  description: string;
}[] = [
  { id: 'saas', label: 'SaaS', icon: Briefcase, description: '구독 기반 웹 서비스' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, description: 'iOS/Android 앱' },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Store,
    description: '양면 플랫폼',
  },
  {
    id: 'extension',
    label: 'Extension',
    icon: Puzzle,
    description: '브라우저/앱 확장',
  },
  {
    id: 'ai_wrapper',
    label: 'AI Wrapper',
    icon: Sparkles,
    description: 'AI 기반 서비스',
  },
];

export function TemplateSelector({
  value,
  onChange,
  disabled,
}: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {TEMPLATES.map(({ id, label, icon: Icon, description }) => (
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
          <span className="text-sm font-medium">{label}</span>
          <span className="text-center text-xs opacity-70">{description}</span>
        </button>
      ))}
    </div>
  );
}
