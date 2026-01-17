'use client';

import { cn } from '@/src/shared/lib/utils';
import type { BillingInterval } from '@/src/entities';

interface BillingIntervalToggleProps {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  disabled?: boolean;
}

export function BillingIntervalToggle({
  value,
  onChange,
  disabled = false,
}: BillingIntervalToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onChange('monthly')}
        disabled={disabled}
        className={cn(
          'rounded-lg px-4 py-2 text-sm font-medium transition-all',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          value === 'monthly'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
      >
        월간 결제
      </button>
      <button
        onClick={() => onChange('yearly')}
        disabled={disabled}
        className={cn(
          'relative rounded-lg px-4 py-2 text-sm font-medium transition-all',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          value === 'yearly'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
      >
        연간 결제
        <span className="absolute -right-2 -top-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
          20% 할인
        </span>
      </button>
    </div>
  );
}
