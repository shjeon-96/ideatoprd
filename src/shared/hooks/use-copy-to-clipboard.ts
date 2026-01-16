'use client';

import { useCallback, useState } from 'react';

type CopiedValue = string | null;

interface UseCopyToClipboardReturn {
  copiedText: CopiedValue;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Hook for copying text to clipboard
 *
 * Uses navigator.clipboard API with proper error handling
 * for older browsers and permission denials.
 *
 * @example
 * const { copiedText, copy, reset } = useCopyToClipboard();
 * await copy('Hello, world!');
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setCopiedText(null);
  }, []);

  return { copiedText, copy, reset };
}
