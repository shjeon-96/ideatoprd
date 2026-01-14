'use client';

import {
  Zap,
  LayoutTemplate,
  Brain,
  Download,
  History,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    number: '01',
    title: '즉시 PRD 생성',
    description:
      '5분 만에 완성되는 PRD. 아이디어만 입력하면 체계적인 문서가 자동으로 생성됩니다.',
  },
  {
    icon: LayoutTemplate,
    number: '02',
    title: '5가지 템플릿',
    description:
      'SaaS, Mobile, Marketplace, Extension, AI-Wrapper 등 프로젝트 유형에 맞는 템플릿을 제공합니다.',
  },
  {
    icon: Brain,
    number: '03',
    title: 'AI 기반 분석',
    description:
      'Claude AI가 아이디어를 구조화하고, 타겟 사용자와 핵심 기능을 분석합니다.',
  },
  {
    icon: Download,
    number: '04',
    title: '다양한 내보내기',
    description:
      'Markdown 복사, PDF 다운로드로 어디서든 PRD를 활용할 수 있습니다.',
  },
  {
    icon: History,
    number: '05',
    title: 'PRD 히스토리',
    description: '생성한 PRD를 언제든 다시 확인하고 수정할 수 있습니다.',
  },
  {
    icon: CreditCard,
    number: '06',
    title: '유연한 가격',
    description:
      '구독 없이 필요한 만큼만 크레딧을 구매하세요. 숨겨진 비용이 없습니다.',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
      {/* Top border with gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Decorative number */}
      <div className="pointer-events-none absolute -right-20 top-20 select-none font-mono text-[280px] font-bold leading-none text-foreground/[0.02]">
        06
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - Editorial asymmetric layout */}
        <div className="mb-20 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="overline mb-4 block">Features</span>
            <h2 className="heading-2">왜 IdeaToPRD인가요?</h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-7">
            <p className="body-large">
              복잡한 PRD 작성 과정을 AI가 대신합니다.
              <span className="mt-2 block text-muted-foreground/80">
                아이디어에만 집중하세요. 나머지는 저희가 처리합니다.
              </span>
            </p>
          </div>
        </div>

        {/* Features grid - Editorial card style */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.number}
                className="group relative bg-card p-8 transition-colors duration-300 hover:bg-muted/30"
              >
                {/* Number */}
                <span className="mb-6 block font-mono text-xs text-muted-foreground/60">
                  {feature.number}
                </span>

                {/* Icon */}
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl border border-border bg-background transition-all duration-300 group-hover:border-brand-primary/30 group-hover:bg-brand-secondary">
                  <Icon className="size-5 text-foreground/70 transition-colors group-hover:text-brand-primary" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-primary transition-all duration-300 group-hover:w-full" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
