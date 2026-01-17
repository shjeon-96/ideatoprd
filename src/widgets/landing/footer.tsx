'use client';

import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { LanguageSwitcher } from '@/src/widgets/common';

export function Footer() {
  const t = useTranslations('landing.footer');

  return (
    <footer className="relative border-t border-border/50 bg-muted/10">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              IdeaToPRD
            </span>
          </div>

          {/* Center - Copyright */}
          <p className="text-sm text-muted-foreground">{t('copyright')}</p>

          {/* Right - Language & Status */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <span className="status-dot size-1.5" />
              {t('poweredBy')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
