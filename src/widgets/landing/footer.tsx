import { Twitter, Github } from 'lucide-react';

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
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4 text-xl font-bold">IdeaToPRD</div>
            <p className="mb-6 max-w-xs text-sm text-muted-foreground">
              아이디어 한 줄로 PRD 완성.
              <br />
              AI 기반 PRD 자동 생성 서비스.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={social.label}
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 IdeaToPRD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
