'use client';

import { Button } from '@/src/shared/ui';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            지금 바로 첫 PRD를 만들어보세요
          </h2>
          <p className="mb-10 text-lg text-white/80">
            가입하면 3 크레딧 무료 지급. 신용카드 없이 시작하세요.
          </p>
          <Button
            size="lg"
            className="group h-12 bg-white px-8 text-base font-semibold text-brand-primary hover:bg-white/90"
          >
            무료로 시작하기
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
