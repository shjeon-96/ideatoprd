'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { useCopyToClipboard } from '@/src/shared/hooks/use-copy-to-clipboard';

interface CopyMarkdownButtonProps {
  markdown: string;
}

/**
 * Copy Markdown Button
 *
 * Copies PRD markdown content to clipboard with visual feedback.
 * Shows "Copied!" state for 2 seconds after successful copy.
 */
export function CopyMarkdownButton({ markdown }: CopyMarkdownButtonProps) {
  const { copy } = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const success = await copy(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Markdown
        </>
      )}
    </Button>
  );
}
