/**
 * Type declarations for Lemon.js client-side library.
 * @see https://docs.lemonsqueezy.com/help/lemonjs/opening-overlays
 */

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Setup: (config?: { eventHandler?: (event: LemonSqueezyEvent) => void }) => void;
      Url: {
        Open: (url: string) => void;
        Close: () => void;
      };
      Refresh: () => void;
    };
  }
}

export interface LemonSqueezyEvent {
  event:
    | 'Checkout.Success'
    | 'Checkout.Cancelled'
    | 'Checkout.ViewCart'
    | 'PaymentMethodUpdate.Mounted'
    | 'PaymentMethodUpdate.Closed'
    | 'PaymentMethodUpdate.Updated';
}

export {};
