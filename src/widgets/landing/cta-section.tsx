'use client';

import Link from 'next/link';
import { Button } from '@/src/shared/ui';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-foreground py-24 lg:py-32">
      {/* Subtle pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="grid-pattern h-full w-full" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)' }} />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Headline */}
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-background md:text-4xl lg:text-5xl">
            지금 바로 첫 PRD를
            <br />
            만들어보세요
          </h2>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-background/70">
            가입하면 <span className="font-semibold text-background">3 크레딧 무료</span> 지급.
            <br />
            신용카드 없이 바로 시작하세요.
          </p>

          {/* CTA Button */}
          <Link href="/signup">
            <Button
              size="lg"
              className="group h-12 gap-2 rounded-lg bg-background px-8 text-base font-medium text-foreground transition-all hover:bg-background/90"
            >
              무료로 시작하기
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-background/50">
            <span>✓ 2분 내 가입 완료</span>
            <span>✓ 안전한 결제</span>
            <span>✓ 즉시 PRD 생성</span>
          </div>
        </div>
      </div>
    </section>
  );
}
