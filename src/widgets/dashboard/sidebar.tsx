'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, PlusCircle, CreditCard, Settings } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';

export const navItems = [
  { href: '/dashboard', icon: FileText, label: 'My PRDs' },
  { href: '/generate', icon: PlusCircle, label: 'New PRD' },
  { href: '/purchase', icon: CreditCard, label: 'Credits' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  className?: string;
}

/**
 * Dashboard sidebar navigation
 * Displays navigation links with active state highlighting
 */
export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('flex flex-col p-4', className)}>
      <nav className="space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          // Dashboard is exact match, others are prefix match
          const isActive =
            href === '/dashboard'
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
