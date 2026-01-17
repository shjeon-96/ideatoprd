import type { Metadata } from 'next';
import { Mail, MessageSquare, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

const SUPPORT_EMAIL = 'tmdgns893758@gmail.com';

const CONTACT_OPTIONS = [
  {
    icon: Mail,
    titleKey: 'options.email.title',
    descriptionKey: 'options.email.description',
    action: 'email',
  },
  {
    icon: FileText,
    titleKey: 'options.refund.title',
    descriptionKey: 'options.refund.description',
    action: 'refund',
  },
  {
    icon: MessageSquare,
    titleKey: 'options.feedback.title',
    descriptionKey: 'options.feedback.description',
    action: 'feedback',
  },
] as const;

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/" className="text-xl font-bold text-brand-primary">
            IdeaToPRD
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Response time notice */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          <span>{t('responseTime')}</span>
        </div>

        {/* Contact options */}
        <div className="grid gap-6 md:grid-cols-3">
          {CONTACT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const subject = option.action === 'refund'
              ? t('emailSubjects.refund')
              : option.action === 'feedback'
                ? t('emailSubjects.feedback')
                : t('emailSubjects.general');

            return (
              <a
                key={option.action}
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-brand-secondary">
                  <Icon className="size-6 text-brand-primary" />
                </div>
                <h3 className="mb-2 font-semibold group-hover:text-primary">
                  {t(option.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(option.descriptionKey)}
                </p>
              </a>
            );
          })}
        </div>

        {/* Direct email */}
        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="mb-2 text-sm text-muted-foreground">{t('directEmail')}</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-lg font-medium text-primary hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        {/* FAQ link */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            {t('faqPrompt')}{' '}
            <Link href="/subscribe" className="font-medium text-primary hover:underline">
              {t('faqLink')}
            </Link>
          </p>
        </div>

        {/* Refund policy */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('refundPolicy.title')}</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{t('refundPolicy.description')}</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>{t('refundPolicy.items.timeframe')}</li>
              <li>{t('refundPolicy.items.subscription')}</li>
              <li>{t('refundPolicy.items.credits')}</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            {t('backToHome')}
          </Link>
        </div>
      </footer>
    </div>
  );
}
