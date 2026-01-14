'use client';

import { Button } from '@/src/shared/ui';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="paper-texture relative min-h-[92vh] overflow-hidden bg-background">
      {/* Subtle warm gradient accent */}
      <div
        className="pointer-events-none absolute -right-[20%] top-[10%] h-[600px] w-[600px] rounded-full opacity-[0.08] blur-[120px]"
        style={{
          background: 'var(--gradient-start)',
        }}
      />

      {/* Editorial grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="absolute left-[8%] top-0 h-full w-px"
          style={{ background: 'var(--foreground)' }}
        />
        <div
          className="absolute left-[50%] top-0 h-full w-px"
          style={{ background: 'var(--foreground)' }}
        />
        <div
          className="absolute right-[8%] top-0 h-full w-px"
          style={{ background: 'var(--foreground)' }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Left: Content - spans 7 columns */}
          <div className="lg:col-span-7">
            {/* Overline label */}
            <div
              className="animate-fade-up mb-6 opacity-0"
              style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
            >
              <span className="overline inline-flex items-center gap-2">
                <span
                  className="inline-block size-1.5 rounded-full bg-brand-primary"
                  style={{ animation: 'pulse 2s infinite' }}
                />
                AI-Powered Document Generation
              </span>
            </div>

            {/* Headline - Editorial style with mixed weights */}
            <h1
              className="animate-fade-up mb-8 opacity-0"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <span className="heading-1 block">아이디어 한 줄로</span>
              <span className="heading-1 mt-2 block">
                <span className="text-gradient">PRD 완성</span>
              </span>
            </h1>

            {/* Subheadline with editorial dash */}
            <div
              className="animate-fade-up mb-12 flex items-start gap-4 opacity-0"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <div className="mt-3 hidden h-px w-12 flex-shrink-0 bg-brand-primary sm:block" />
              <p className="body-large max-w-md">
                2-3일 걸리던 PRD 작성, 이제 5분이면 충분합니다.
                <span className="mt-2 block text-base text-muted-foreground/80">
                  Claude AI가 당신의 아이디어를 체계적인 문서로 변환합니다.
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="animate-fade-up flex flex-col gap-4 opacity-0 sm:flex-row"
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              <Button
                size="lg"
                className="group relative h-12 overflow-hidden bg-foreground px-8 text-base font-medium text-background transition-all hover:bg-foreground/90"
              >
                <span className="relative z-10 flex items-center gap-2">
                  무료로 시작하기
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 border-foreground/20 px-8 text-base font-medium transition-all hover:border-foreground/40 hover:bg-foreground/5"
              >
                데모 보기
              </Button>
            </div>

            {/* Trust indicators */}
            <div
              className="animate-fade-up mt-16 flex items-center gap-8 opacity-0"
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background">
                  <Sparkles className="size-4 text-brand-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">가입 시 3 크레딧</div>
                  <div className="text-muted-foreground">무료 제공</div>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-sm text-muted-foreground">
                신용카드 필요 없음
              </div>
            </div>
          </div>

          {/* Right: Visual - spans 5 columns */}
          <div
            className="animate-slide-in-right relative hidden opacity-0 lg:col-span-5 lg:block"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {/* Document preview card */}
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-brand-secondary/50 to-transparent" />

              {/* Main card */}
              <div className="card-shine relative rounded-xl border border-border bg-card p-8 shadow-xl shadow-foreground/5">
                {/* Document header */}
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-brand-primary/10">
                      <FileText className="size-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Product Requirements</div>
                      <div className="text-xs text-muted-foreground">
                        Generated in 4m 32s
                      </div>
                    </div>
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-full bg-brand-primary/10">
                    <span className="text-xs font-bold text-brand-primary">AI</span>
                  </div>
                </div>

                {/* Document content preview */}
                <div className="space-y-4">
                  {/* Input preview */}
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Input
                    </div>
                    <div className="font-mono text-sm">
                      &quot;AI로 PRD 자동 생성하는 SaaS&quot;
                    </div>
                  </div>

                  {/* Generated sections */}
                  <div className="space-y-3">
                    {[
                      { label: '01', title: '문제 정의 및 배경', progress: 100 },
                      { label: '02', title: '타겟 사용자 분석', progress: 100 },
                      { label: '03', title: '핵심 기능 명세', progress: 100 },
                      { label: '04', title: '성공 지표 (KPI)', progress: 100 },
                    ].map((section, idx) => (
                      <div
                        key={section.label}
                        className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/30"
                        style={{
                          animationDelay: `${500 + idx * 100}ms`,
                        }}
                      >
                        <span className="flex size-6 items-center justify-center rounded bg-foreground/5 font-mono text-xs text-muted-foreground">
                          {section.label}
                        </span>
                        <span className="flex-1 text-sm">{section.title}</span>
                        <div className="h-1 w-12 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-brand-primary transition-all"
                            style={{ width: `${section.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
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
