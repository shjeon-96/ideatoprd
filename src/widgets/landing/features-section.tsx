'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/src/shared/ui';
import {
  Zap,
  LayoutTemplate,
  Brain,
  Download,
  History,
  CreditCard,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: '즉시 PRD 생성',
    description: '5분 만에 완성되는 PRD. 아이디어만 입력하면 체계적인 문서가 자동으로 생성됩니다.',
  },
  {
    icon: LayoutTemplate,
    title: '5가지 템플릿',
    description: 'SaaS, Mobile, Marketplace, Extension, AI-Wrapper 등 프로젝트 유형에 맞는 템플릿을 제공합니다.',
  },
  {
    icon: Brain,
    title: 'AI 기반 분석',
    description: 'Claude AI가 아이디어를 구조화하고, 타겟 사용자와 핵심 기능을 분석합니다.',
  },
  {
    icon: Download,
    title: '다양한 내보내기',
    description: 'Markdown 복사, PDF 다운로드로 어디서든 PRD를 활용할 수 있습니다.',
  },
  {
    icon: History,
    title: 'PRD 히스토리',
    description: '생성한 PRD를 언제든 다시 확인하고 수정할 수 있습니다.',
  },
  {
    icon: CreditCard,
    title: '유연한 가격',
    description: '구독 없이 필요한 만큼만 크레딧을 구매하세요. 숨겨진 비용이 없습니다.',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative bg-muted/30 py-24 lg:py-32">
      {/* Subtle top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="heading-2 mb-4">왜 IdeaToPRD인가요?</h2>
          <p className="body-large">
            복잡한 PRD 작성 과정을 AI가 대신합니다.
            <br className="hidden sm:block" />
            아이디어에만 집중하세요.
          </p>
        </div>

        {/* Features grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group relative border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardHeader className="pb-4">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-brand-secondary transition-colors group-hover:bg-brand-primary/10">
                    <Icon className="size-6 text-brand-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
