'use client';

import { Button } from '@/src/shared/ui';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';

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
    <section className="paper-texture relative overflow-hidden bg-background py-24 lg:py-32">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-64 w-64 rounded-full bg-brand-secondary/30 blur-[100px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - Editorial asymmetric */}
        <div className="mb-20 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="overline mb-4 block">Pricing</span>
            <h2 className="heading-2">
              심플한 가격,
              <br />
              숨김 비용 없음
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-7">
            <p className="body-large">
              구독 없이 필요한 만큼만 크레딧을 구매하세요.
              <span className="mt-2 block text-muted-foreground/80">
                한 번 구매하면 영구적으로 사용할 수 있습니다.
              </span>
            </p>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                'group relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300',
                plan.popular
                  ? 'border-foreground shadow-xl shadow-foreground/5'
                  : 'border-border hover:border-foreground/20 hover:shadow-lg'
              )}
            >
              {/* Badge */}
              {(plan.popular || plan.badge) && (
                <div className="absolute -top-3 left-6">
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
              <div className="mb-6 pt-2">
                <p className="mb-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <h3 className="text-xl font-semibold tracking-tight">
                  {plan.name}
                </h3>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.credits} 크레딧 · 일회성 구매
                </p>
              </div>

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={cn(
                  'group/btn w-full transition-all',
                  plan.popular
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5'
                )}
                variant={plan.popular ? 'default' : 'outline'}
              >
                구매하기
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </article>
          ))}
        </div>

        {/* Trust badge */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
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
