'use client';

import { useTranslations } from 'next-intl';
import { Coins, Building2 } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';

interface CreditBalanceProps {
  credits: number;
  workspaceCredits?: number;
  isWorkspaceMode?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function CreditBalance({
  credits,
  workspaceCredits,
  isWorkspaceMode = false,
  size = 'md',
  showIcon = true,
  className,
}: CreditBalanceProps) {
  const t = useTranslations('common');

  const sizes = {
    sm: {
      container: 'px-2 py-1',
      text: 'text-sm',
      icon: 'h-3 w-3',
    },
    md: {
      container: 'px-3 py-1.5',
      text: 'text-base',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'px-4 py-2',
      text: 'text-lg',
      icon: 'h-5 w-5',
    },
  };

  const s = sizes[size];

  // Show workspace credits when in workspace mode
  const displayCredits = isWorkspaceMode && workspaceCredits !== undefined
    ? workspaceCredits
    : credits;
  const Icon = isWorkspaceMode ? Building2 : Coins;
  const iconColor = isWorkspaceMode ? 'text-blue-500' : 'text-primary';
  const bgColor = isWorkspaceMode ? 'bg-blue-500/10' : 'bg-primary/10';
  const textColor = isWorkspaceMode ? 'text-blue-600 dark:text-blue-400' : 'text-primary';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg',
        bgColor,
        s.container,
        className
      )}
    >
      {showIcon && <Icon className={cn(iconColor, s.icon)} />}
      <span className={cn('font-semibold', textColor, s.text)}>
        {displayCredits.toLocaleString()}
      </span>
      <span className={cn('text-muted-foreground', s.text)}>
        {isWorkspaceMode ? t('workspaceCredits') : t('credits')}
      </span>
    </div>
  );
}
