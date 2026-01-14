'use client';

import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/src/shared/ui';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/src/shared/lib/utils';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$2.99',
    credits: 3,
    description: '가볍게 시작하기',
    features: ['PRD 3회 생성', '5가지 템플릿', 'Markdown 복사'],
    popular: false,
  },
  {
    name: 'Basic',
    price: '$7.99',
    credits: 10,
    description: '인디 해커용',
    features: ['PRD 10회 생성', '5가지 템플릿', 'Markdown 복사', 'PRD 히스토리'],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$14.99',
    credits: 25,
    description: '스타트업 PM용',
    features: ['PRD 25회 생성', '5가지 템플릿', 'Markdown 복사', 'PRD 히스토리', 'PDF 다운로드'],
    popular: true,
  },
  {
    name: 'Business',
    price: '$49.99',
    credits: 100,
    description: '팀/에이전시용',
    features: ['PRD 100회 생성', '5가지 템플릿', 'Markdown 복사', 'PRD 히스토리', 'PDF 다운로드', '우선 지원'],
    popular: false,
    badge: '최고 가성비',
  },
];

export function PricingSection() {
  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="heading-2 mb-4">심플한 가격, 숨김 비용 없음</h2>
          <p className="body-large">
            구독 없이 필요한 만큼만 크레딧을 구매하세요.
            <br className="hidden sm:block" />
            한 번 구매하면 영구적으로 사용할 수 있습니다.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1',
                plan.popular && 'border-brand-primary ring-1 ring-brand-primary/20'
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-xs font-medium text-white">
                    <Sparkles className="size-3" />
                    인기
                  </div>
                </div>
              )}

              {/* Value badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                    {plan.badge}
                  </div>
                </div>
              )}

              <CardHeader className="pb-4 pt-6">
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 pb-4">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    / {plan.credits} 크레딧
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-brand-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  className={cn(
                    'w-full',
                    plan.popular && 'bg-brand-primary text-white hover:bg-brand-primary/90'
                  )}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  구매하기
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust badge */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          안전한 결제 · Lemon Squeezy 기반 · 언제든 환불 가능
        </p>
      </div>
    </section>
  );
}
