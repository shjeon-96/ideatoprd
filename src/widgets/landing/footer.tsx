'use client';

import { Twitter, Github, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { label: '기능', href: '#features' },
      { label: '가격', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: '블로그', href: '/blog' },
      { label: '문의하기', href: '/contact' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: '이용약관', href: '/terms' },
      { label: '개인정보처리방침', href: '/privacy' },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-muted/20">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <span className="text-xl font-bold tracking-tight">IdeaToPRD</span>
              <span className="ml-2 rounded bg-brand-secondary px-2 py-0.5 text-xs font-medium text-brand-primary">
                Beta
              </span>
            </div>
            <p className="mb-8 max-w-xs text-sm leading-relaxed text-muted-foreground">
              아이디어 한 줄로 PRD 완성.
              <br />
              AI 기반 PRD 자동 생성 서비스.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                    aria-label={social.label}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                        <ArrowUpRight className="size-3 opacity-0 transition-all group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 IdeaToPRD. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Powered by Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}
