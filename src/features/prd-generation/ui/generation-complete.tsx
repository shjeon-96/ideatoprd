'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

interface GenerationCompleteProps {
  prdId: string;
  onGenerateAnother: () => void;
}

export function GenerationComplete({ prdId, onGenerateAnother }: GenerationCompleteProps) {
  const t = useTranslations('generate');
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      router.push(`/dashboard/prds/${prdId}`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, prdId, router]);

  const handleViewPrd = () => {
    router.push(`/dashboard/prds/${prdId}`);
  };

  return (
    <div className="animate-fade-in rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-6 md:p-8">
      {/* Success Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
          <div className="relative flex size-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="size-8 text-green-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">
          {t('saveSuccess')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('complete.autoRedirect', { seconds: countdown })}
        </p>
      </div>

      {/* Progress bar for countdown */}
      <div className="relative h-1 rounded-full bg-muted mb-6 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${(countdown / 5) * 100}%` }}
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleViewPrd}
          size="lg"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <ArrowRight className="size-4 mr-2" />
          {t('complete.viewPrd')}
        </Button>
        <Button
          onClick={onGenerateAnother}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <Plus className="size-4 mr-2" />
          {t('complete.generateAnother')}
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-start gap-3 text-sm">
          <Sparkles className="size-5 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">
              {t('complete.tipTitle')}
            </p>
            <p className="text-muted-foreground">
              {t('complete.tipContent')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
