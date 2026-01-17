'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/ui/dialog';
import { Button } from '@/src/shared/ui/button';
import { AlertCircle, ShoppingCart } from 'lucide-react';

interface InsufficientCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCredits: number;
  requiredCredits: number;
}

export function InsufficientCreditsModal({
  open,
  onOpenChange,
  currentCredits,
  requiredCredits,
}: InsufficientCreditsModalProps) {
  const router = useRouter();
  const t = useTranslations('purchase.insufficientCredits');
  const tCommon = useTranslations('common');
  const deficit = requiredCredits - currentCredits;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">{t('title')}</DialogTitle>
          <DialogDescription className="text-center">
            {t('description', { required: requiredCredits, current: currentCredits })}
            <br />
            <span className="text-destructive">
              {t('deficit', { count: deficit })}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t('info')}
          </p>
        </div>

        <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              router.push('/purchase');
            }}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {t('buyButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
