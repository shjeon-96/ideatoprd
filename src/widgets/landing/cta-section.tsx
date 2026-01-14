'use client';

import { Button } from '@/src/shared/ui';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Gradient background - warm coral */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -left-20 top-1/2 size-40 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 size-40 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Icon */}
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-white/20 p-4 backdrop-blur-sm">
            <Sparkles className="size-6 text-white" />
          </div>

          {/* Headline */}
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            지금 바로 첫 PRD를
            <br />
            만들어보세요
          </h2>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-lg text-lg text-white/80">
            가입하면 3 크레딧 무료 지급.
            <br className="hidden sm:block" />
            신용카드 없이 시작하세요.
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="group h-14 bg-white px-10 text-base font-semibold text-foreground shadow-xl shadow-black/20 transition-all hover:bg-white/95 hover:shadow-2xl"
          >
            무료로 시작하기
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Secondary info */}
          <p className="mt-6 text-sm text-white/60">
            2분 내 가입 완료 · 바로 PRD 생성 시작
          </p>
        </div>
      </div>
    </section>
  );
}
