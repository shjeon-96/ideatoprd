'use client';

import { useRouter } from 'next/navigation';
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
  const deficit = requiredCredits - currentCredits;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">크레딧이 부족합니다</DialogTitle>
          <DialogDescription className="text-center">
            PRD 생성에 <strong>{requiredCredits} 크레딧</strong>이 필요하지만,
            현재 <strong>{currentCredits} 크레딧</strong>을 보유하고 있습니다.
            <br />
            <span className="text-destructive">
              {deficit} 크레딧이 더 필요합니다.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            크레딧을 구매하면 바로 PRD를 생성할 수 있습니다.
          </p>
        </div>

        <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              router.push('/purchase');
            }}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            크레딧 구매하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
