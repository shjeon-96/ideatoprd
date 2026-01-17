'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ComponentPropsWithoutRef } from 'react';

interface PrdViewerProps {
  content: string;
}

/**
 * PRD Markdown Viewer
 *
 * Renders PRD content with GFM support (tables, task lists, strikethrough)
 * and syntax highlighting for code blocks.
 */
export function PrdViewer({ content }: PrdViewerProps) {
  return (
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
    </article>
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
