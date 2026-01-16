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
    <article className="prose prose-neutral dark:prose-invert max-w-none">
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
