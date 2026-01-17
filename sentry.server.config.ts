// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter and enrich error events
  beforeSend(event, hint) {
    const error = hint.originalException;

    // Add custom context for PRD-related errors
    if (error instanceof Error) {
      if (error.message.includes('credit') || error.message.includes('크레딧')) {
        event.tags = { ...event.tags, category: 'credits' };
      }
      if (error.message.includes('PRD') || error.message.includes('prd')) {
        event.tags = { ...event.tags, category: 'prd' };
      }
    }

    return event;
  },

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
});
