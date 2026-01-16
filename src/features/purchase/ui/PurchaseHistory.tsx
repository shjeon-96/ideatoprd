import type { PurchaseWithDetails } from '../api/get-purchases';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Receipt } from 'lucide-react';

interface PurchaseHistoryProps {
  purchases: PurchaseWithDetails[];
}

export function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Receipt className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">구매 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="divide-y rounded-lg border">
      {purchases.map((purchase) => (
        <div
          key={purchase.id}
          className="flex items-center justify-between p-4"
        >
          <div>
            <p className="font-medium">{purchase.packageName} 패키지</p>
            <p className="text-sm text-muted-foreground">
              +{purchase.credits_amount} 크레딧
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              ${(purchase.amount_cents / 100).toFixed(2)}{' '}
              <span className="text-xs text-muted-foreground">
                {purchase.currency.toUpperCase()}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(purchase.created_at), {
                addSuffix: true,
                locale: ko,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
