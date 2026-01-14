'use client';

import { Button } from '@/src/shared/ui';
import { Sparkles, FileText, ArrowRight, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-background">
      {/* Subtle gradient orb background */}
      <div
        className="pointer-events-none absolute -right-1/4 -top-1/4 h-[800px] w-[800px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, oklch(0.62 0.24 300) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-[600px] w-[600px] rounded-full opacity-15 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, oklch(0.65 0.25 330) 0%, transparent 70%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.2 0 0) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.2 0 0) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm backdrop-blur-sm"
              style={{ animationDelay: '0ms', animationFillMode: 'backwards' }}
            >
              <Sparkles className="size-4 text-brand-accent" />
              <span className="text-muted-foreground">
                AI 기반 PRD 자동 생성
              </span>
            </div>

            {/* Headline */}
            <h1
              className="heading-1 mb-6 animate-fade-in"
              style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
            >
              아이디어 한 줄로
              <br />
              <span className="text-gradient">PRD 완성</span>
            </h1>

            {/* Subheadline */}
            <p
              className="body-large mb-10 max-w-lg animate-fade-in"
              style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
            >
              2-3일 걸리던 PRD 작성, 5분이면 충분합니다.
              <br className="hidden sm:block" />
              Claude AI가 당신의 아이디어를 체계적인 문서로 변환합니다.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex animate-fade-in flex-col gap-4 sm:flex-row"
              style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
            >
              <Button
                size="lg"
                className="group bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90"
              >
                무료로 시작하기
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                데모 보기
              </Button>
            </div>

            {/* Social proof */}
            <div
              className="mt-12 flex animate-fade-in items-center gap-6 text-sm text-muted-foreground"
              style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
            >
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-brand-accent" />
                <span>가입 시 3 크레딧 무료</span>
              </div>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="hidden sm:block">신용카드 필요 없음</div>
            </div>
          </div>

          {/* Right: Visual illustration */}
          <div
            className="relative hidden animate-fade-in lg:block"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
          >
            <div className="relative">
              {/* Transformation visual */}
              <div className="relative mx-auto max-w-md">
                {/* Input card (Idea) */}
                <div className="relative z-10 rounded-xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-brand-secondary">
                      <Sparkles className="size-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">아이디어 입력</div>
                      <div className="text-xs text-muted-foreground">
                        한 줄이면 충분해요
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                    &quot;AI로 PRD 자동 생성하는 SaaS&quot;
                  </div>
                </div>

                {/* Arrow connector */}
                <div className="relative z-0 my-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                    <ArrowRight className="size-5 rotate-90 text-brand-primary" />
                  </div>
                </div>

                {/* Output card (PRD) */}
                <div className="relative z-10 rounded-xl border border-brand-primary/20 bg-card/80 p-6 shadow-lg shadow-brand-primary/5 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-brand-primary/10">
                      <FileText className="size-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">완성된 PRD</div>
                      <div className="text-xs text-muted-foreground">
                        5분 만에 생성
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-brand-primary" />
                      <span>문제 정의 및 배경</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-brand-primary" />
                      <span>타겟 사용자 분석</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-brand-primary" />
                      <span>핵심 기능 명세</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-brand-primary" />
                      <span>성공 지표 (KPI)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
