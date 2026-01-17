'use client';

import { Button } from '@/src/shared/ui';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';
import Link from 'next/link';

interface PricingPlan {
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$2.99',
    credits: 3,
    description: '가볍게 시작하기',
    features: ['PRD 3회 생성', '5가지 템플릿', 'Markdown 복사'],
  },
  {
    name: 'Basic',
    price: '$7.99',
    credits: 10,
    description: '인디 해커용',
    features: ['PRD 10회 생성', '5가지 템플릿', 'Markdown 복사', 'PRD 히스토리'],
  },
  {
    name: 'Pro',
    price: '$14.99',
    credits: 25,
    description: '스타트업 PM용',
    features: [
      'PRD 25회 생성',
      '5가지 템플릿',
      'Markdown 복사',
      'PRD 히스토리',
      'PDF 다운로드',
    ],
    popular: true,
  },
  {
    name: 'Business',
    price: '$49.99',
    credits: 100,
    description: '팀/에이전시용',
    features: [
      'PRD 100회 생성',
      '5가지 템플릿',
      'Markdown 복사',
      'PRD 히스토리',
      'PDF 다운로드',
      '우선 지원',
    ],
    badge: '최고 가성비',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative bg-background py-24 lg:py-32">
      <div className="container relative mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="overline mb-4 block">Pricing</span>
          <h2 className="heading-2 mb-4">심플한 가격, 숨김 비용 없음</h2>
          <p className="body-large">
            구독 없이 필요한 만큼만 크레딧을 구매하세요.
            <br />
            한 번 구매하면 영구적으로 사용할 수 있습니다.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-200',
                plan.popular
                  ? 'border-foreground shadow-lg'
                  : 'border-border hover:border-foreground/20 hover:shadow-md'
              )}
            >
              {/* Badge */}
              {(plan.popular || plan.badge) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={cn(
                      'inline-block rounded-full px-3 py-1 text-xs font-semibold',
                      plan.popular
                        ? 'bg-foreground text-background'
                        : 'bg-brand-primary text-white'
                    )}
                  >
                    {plan.popular ? 'Most Popular' : plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-4 pt-2">
                <p className="mb-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <h3 className="text-xl font-semibold text-foreground">
                  {plan.name}
                </h3>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.credits} 크레딧 · 일회성 구매
                </p>
              </div>

              {/* Features */}
              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/signup">
                <Button
                  className={cn(
                    'w-full transition-all',
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-ghost'
                  )}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  구매하기
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </Link>
            </article>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            안전한 결제
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            Lemon Squeezy 기반
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            언제든 환불 가능
          </span>
        </div>
      </div>
    </section>
  );
}
