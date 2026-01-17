'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ComponentPropsWithoutRef } from 'react';

interface PRDViewerProps {
  content: string;
  isStreaming: boolean;
}

export function PRDViewer({ content, isStreaming }: PRDViewerProps) {
  const t = useTranslations('generate.viewer');
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
        <p className="text-muted-foreground">{t('placeholder')}</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{t('preview')}</span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <span className="h-2 w-2 motion-safe:animate-pulse rounded-full bg-primary" />
              {t('generating')}
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
            <span className="ml-1">{copied ? t('copied') : t('copy')}</span>
          </Button>
        </div>
      </div>

      {/* Content - Markdown Rendered */}
      <div
        ref={containerRef}
        className="h-[500px] overflow-y-auto p-6 bg-background"
      >
        <article className="prose prose-neutral dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h1:text-foreground prose-h1:mb-4
          prose-h2:text-2xl prose-h2:text-foreground prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
          prose-h3:text-xl prose-h3:text-foreground prose-h3:mt-6 prose-h3:mb-2
          prose-h4:text-lg prose-h4:text-foreground
          prose-p:text-foreground/90 prose-p:leading-7
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:text-foreground/80
          prose-li:text-foreground/90 prose-li:marker:text-brand-primary
          prose-ul:my-4 prose-ol:my-4
          prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-brand-primary prose-blockquote:text-foreground/80 prose-blockquote:not-italic
          prose-code:text-brand-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#1e1e2e] prose-pre:border prose-pre:border-border
          prose-table:border prose-table:border-border
          prose-th:bg-muted prose-th:text-foreground prose-th:font-semibold prose-th:px-4 prose-th:py-2
          prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-border
          prose-hr:border-border
        ">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock,
              table: ResponsiveTable,
            }}
          >
            {content}
          </Markdown>
          {isStreaming && (
            <span className="inline-block motion-safe:animate-pulse text-primary">▌</span>
          )}
        </article>
      </div>
    </div>
  );
}

/**
 * Code block component with syntax highlighting
 */
function CodeBlock({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'code'>) {
  const match = /language-(\w+)/.exec(className || '');

  if (match) {
    return (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

/**
 * Responsive table wrapper for horizontal scrolling
 */
function ResponsiveTable({
  children,
  ...props
}: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="overflow-x-auto">
      <table {...props}>{children}</table>
    </div>
  );
}
