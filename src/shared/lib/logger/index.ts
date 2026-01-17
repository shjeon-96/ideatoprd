/**
 * Structured logging utility for consistent error and event logging
 *
 * Log format: [CONTEXT] message { ...context }
 * - ERROR: Unexpected errors requiring investigation
 * - WARN: Recoverable issues or deprecation notices
 * - INFO: Important business events (credit transactions, PRD saves)
 * - DEBUG: Detailed debugging info (development only)
 *
 * Integrates with Sentry for error tracking in production.
 */

import * as Sentry from '@sentry/nextjs';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  userId?: string | null;
  workspaceId?: string;
  prdId?: string;
  credits?: number;
  error?: unknown;
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  context: string;
  message: string;
  data: LogContext;
  timestamp: string;
}

// Format error for logging (avoid circular references)
function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

// Create structured log entry
function createLogEntry(
  level: LogLevel,
  context: string,
  message: string,
  data: LogContext = {}
): LogEntry {
  const { error, ...rest } = data;
  return {
    level,
    context,
    message,
    data: {
      ...rest,
      ...(error !== undefined && { error: formatError(error) }),
    },
    timestamp: new Date().toISOString(),
  };
}

// Output log entry
function output(entry: LogEntry): void {
  const prefix = `[${entry.context}]`;
  const logFn =
    entry.level === 'error'
      ? console.error
      : entry.level === 'warn'
        ? console.warn
        : entry.level === 'debug'
          ? console.debug
          : console.info;

  // In production, use structured JSON for log aggregation
  if (process.env.NODE_ENV === 'production') {
    logFn(JSON.stringify(entry));
  } else {
    // In development, use readable format
    logFn(prefix, entry.message, entry.data);
  }
}

/**
 * Create a logger instance for a specific context (e.g., API route)
 */
export function createLogger(context: string) {
  return {
    error(message: string, data?: LogContext): void {
      const entry = createLogEntry('error', context, message, data);
      output(entry);

      // Send to Sentry in production
      if (process.env.NODE_ENV === 'production') {
        const originalError = data?.error;
        const sentryError =
          originalError instanceof Error
            ? originalError
            : new Error(`[${context}] ${message}`);

        Sentry.captureException(sentryError, {
          tags: { context },
          extra: entry.data,
        });
      }
    },

    warn(message: string, data?: LogContext): void {
      output(createLogEntry('warn', context, message, data));
    },

    info(message: string, data?: LogContext): void {
      output(createLogEntry('info', context, message, data));
    },

    debug(message: string, data?: LogContext): void {
      if (process.env.NODE_ENV !== 'production') {
        output(createLogEntry('debug', context, message, data));
      }
    },

    /**
     * Log credit-related transactions
     */
    credit(
      action: 'deduct' | 'refund' | 'add',
      data: { userId: string; amount: number; workspaceId?: string; reason?: string }
    ): void {
      output(
        createLogEntry('info', context, `Credit ${action}`, {
          userId: data.userId,
          workspaceId: data.workspaceId,
          credits: data.amount,
          reason: data.reason,
        })
      );
    },
  };
}

// Pre-configured loggers for common contexts
export const prdLogger = createLogger('PRD Generation');
export const revisionLogger = createLogger('PRD Revision');
export const authLogger = createLogger('Auth');
export const creditLogger = createLogger('Credits');
export const webhookLogger = createLogger('Webhook');
