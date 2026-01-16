'use client';

import { Coins } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';

interface CreditBalanceProps {
  credits: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function CreditBalance({
  credits,
  size = 'md',
  showIcon = true,
  className,
}: CreditBalanceProps) {
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

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg bg-primary/10',
        s.container,
        className
      )}
    >
      {showIcon && <Coins className={cn('text-primary', s.icon)} />}
      <span className={cn('font-semibold text-primary', s.text)}>
        {credits.toLocaleString()}
      </span>
      <span className={cn('text-muted-foreground', s.text)}>크레딧</span>
    </div>
  );
}
