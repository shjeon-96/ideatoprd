'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FileText, PlusCircle, CreditCard, Crown, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';
import { SubscriptionBadge } from '@/src/features/subscription/ui/SubscriptionBadge';
import { useUser } from '@/src/features/auth/hooks/use-user';

// Navigation items with translation keys
export const navItemKeys = [
  { href: '/dashboard', icon: FileText, labelKey: 'navigation.myPRDs', descKey: 'navigation.myPRDsDesc' },
  { href: '/generate', icon: PlusCircle, labelKey: 'navigation.newPRD', descKey: 'navigation.newPRDDesc' },
  { href: '/subscribe', icon: Crown, labelKey: 'navigation.subscribe', descKey: 'navigation.subscribeDesc' },
  { href: '/purchase', icon: CreditCard, labelKey: 'navigation.creditsNav', descKey: 'navigation.creditsNavDesc' },
  { href: '/dashboard/settings', icon: Settings, labelKey: 'navigation.settingsNav', descKey: 'navigation.settingsNavDesc' },
] as const;

interface SidebarProps {
  className?: string;
}

/**
 * Dashboard sidebar navigation
 * Enhanced design with gradient accents and smooth animations
 */
export function Sidebar({ className }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const { profile } = useUser();

  return (
    <aside className={cn('flex flex-col bg-card/50 backdrop-blur-sm', className)}>
      {/* Logo section */}
      <div className="border-b border-border/50 p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="glow-brand flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent">
            <Sparkles className="size-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold tracking-tight text-foreground">
              IdeaToPRD
            </span>
            <span className="block text-xs text-muted-foreground">{t('navigation.dashboard')}</span>
          </div>
        </Link>
        {/* Subscription Badge */}
        {profile?.subscription_plan && (
          <SubscriptionBadge
            plan={profile.subscription_plan}
            status={profile.subscription_status}
            className="mt-3"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-4">
          <span className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            {t('navigation.menu')}
          </span>
        </div>
        {navItemKeys.map(({ href, icon: Icon, labelKey, descKey }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'sidebar-item group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive
                  ? 'active bg-brand-secondary/50 text-brand-primary'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-muted/50 text-muted-foreground group-hover:bg-foreground/5 group-hover:text-foreground'
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="flex-1">
                <span className={cn('font-medium', isActive && 'text-foreground')}>
                  {t(labelKey)}
                </span>
                <span className="block text-xs text-muted-foreground/70">
                  {t(descKey)}
                </span>
              </div>
              {isActive && (
                <div className="size-1.5 rounded-full bg-brand-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section - Quick tips */}
      <div className="border-t border-border/50 p-4">
        <div className="rounded-xl bg-gradient-to-br from-brand-secondary/50 to-brand-secondary/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-brand-primary/20">
              <Sparkles className="size-3 text-brand-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">{t('sidebar.proTip')}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t('sidebar.proTipContent')}
          </p>
        </div>
      </div>
    </aside>
  );
}
