'use client';

import { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';
import { navItemKeys } from './sidebar';

// React Compiler compatible mounted state detection
function subscribeMounted(callback: () => void): () => void {
  callback();
  return () => {};
}

function getMountedSnapshot(): boolean {
  return true;
}

function getMountedServerSnapshot(): boolean {
  return false;
}

/**
 * Mobile navigation drawer
 * Shows hamburger menu on mobile, opens slide-out drawer with nav links
 */
export function MobileNav() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Use useSyncExternalStore for mounted state (React Compiler compatible)
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  const drawerContent = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/70 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-[9999] w-64 border-r border-zinc-800 shadow-2xl transition-transform duration-200 ease-in-out md:hidden overflow-hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: '#0a0a0a' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-zinc-800"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          <span className="font-semibold text-white">{t('navigation.menu')}</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label={t('navigation.closeMenu')}
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="p-4 space-y-1 h-full overflow-y-auto"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          {navItemKeys.map(({ href, icon: Icon, labelKey }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-border hover:bg-muted transition-colors"
        aria-label={t('navigation.openMenu')}
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Portal to body */}
      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
