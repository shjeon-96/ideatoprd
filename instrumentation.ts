export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = async (
  error: Error & { digest?: string },
  request: {
    method: string;
    url: string;
    headers: Record<string, string | undefined>;
  },
  context: { routerKind: string; routePath: string; routeType: string; renderSource?: string }
) => {
  // Skip if Sentry is not configured
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  const Sentry = await import('@sentry/nextjs');

  Sentry.withScope((scope) => {
    scope.setTag('routerKind', context.routerKind);
    scope.setTag('routePath', context.routePath);
    scope.setTag('routeType', context.routeType);
    scope.setExtra('method', request.method);
    scope.setExtra('url', request.url);
    scope.setExtra('renderSource', context.renderSource);
    Sentry.captureException(error);
  });
};
