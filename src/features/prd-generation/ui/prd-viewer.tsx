'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

interface PRDViewerProps {
  content: string;
  isStreaming: boolean;
}

export function PRDViewer({ content, isStreaming }: PRDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll while streaming
  useEffect(() => {
    if (isStreaming && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
        <p className="text-muted-foreground">PRD가 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">PRD 미리보기</span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              생성 중...
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={isStreaming}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="ml-1">{copied ? '복사됨' : '복사'}</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="h-[500px] overflow-y-auto whitespace-pre-wrap p-6 font-mono text-sm leading-relaxed"
      >
        {content}
        {isStreaming && <span className="animate-pulse">▌</span>}
      </div>
    </div>
  );
}
