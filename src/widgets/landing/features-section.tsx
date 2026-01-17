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
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: '즉시 PRD 생성',
    description:
      '5분 만에 완성되는 PRD. 아이디어만 입력하면 체계적인 문서가 자동으로 생성됩니다.',
  },
  {
    icon: LayoutTemplate,
    title: '5가지 템플릿',
    description:
      'SaaS, Mobile, Marketplace, Extension, AI-Wrapper 등 프로젝트 유형에 맞는 템플릿을 제공합니다.',
  },
  {
    icon: Brain,
    title: 'AI 기반 분석',
    description:
      'Claude AI가 아이디어를 구조화하고, 타겟 사용자와 핵심 기능을 분석합니다.',
  },
  {
    icon: Download,
    title: '다양한 내보내기',
    description:
      'Markdown 복사, PDF 다운로드로 어디서든 PRD를 활용할 수 있습니다.',
  },
  {
    icon: History,
    title: 'PRD 히스토리',
    description: '생성한 PRD를 언제든 다시 확인하고 수정할 수 있습니다.',
  },
  {
    icon: CreditCard,
    title: '유연한 가격',
    description:
      '구독 없이 필요한 만큼만 크레딧을 구매하세요. 숨겨진 비용이 없습니다.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-muted/30 py-24 lg:py-32">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />

      <div className="container relative mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="overline mb-4 block">Features</span>
          <h2 className="heading-2 mb-4">
            왜 <span className="text-gradient">IdeaToPRD</span> 인가요?
          </h2>
          <p className="body-large">
            복잡한 PRD 작성 과정을 AI가 대신합니다.
            <br />
            아이디어에만 집중하세요.
          </p>
        </div>

        {/* Features grid */}
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="card-feature group"
              >
                {/* Icon */}
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-secondary transition-colors group-hover:bg-brand-primary/10">
                  <Icon className="size-6 text-brand-primary" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
