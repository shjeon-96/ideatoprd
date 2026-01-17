/**
 * Rate limiting utility using Upstash Redis
 *
 * Provides sliding window rate limiting for API endpoints.
 * Falls back to allowing requests if Redis is unavailable.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { ErrorCodes } from '../errors';

// Rate limit configurations for different endpoints
export const RATE_LIMITS = {
  // PRD generation: 10 requests per minute (expensive operation)
  prdGeneration: {
    requests: 10,
    window: '1 m',
  },
  // PRD revision: 20 requests per minute
  prdRevision: {
    requests: 20,
    window: '1 m',
  },
  // Auth endpoints: 5 requests per minute (prevent brute force)
  auth: {
    requests: 5,
    window: '1 m',
  },
  // General API: 100 requests per minute
  general: {
    requests: 100,
    window: '1 m',
  },
} as const;

type RateLimitType = keyof typeof RATE_LIMITS;

// Lazy-initialized Redis client
let redis: Redis | null = null;
const rateLimiters: Map<RateLimitType, Ratelimit> = new Map();

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('[RateLimit] Upstash Redis not configured - rate limiting disabled');
    return null;
  }

  try {
    redis = new Redis({ url, token });
    return redis;
  } catch (error) {
    console.error('[RateLimit] Failed to initialize Redis:', error);
    return null;
  }
}

function getRateLimiter(type: RateLimitType): Ratelimit | null {
  const existing = rateLimiters.get(type);
  if (existing) return existing;

  const redisClient = getRedis();
  if (!redisClient) return null;

  const config = RATE_LIMITS[type];
  const limiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `ratelimit:${type}`,
    analytics: true,
  });

  rateLimiters.set(type, limiter);
  return limiter;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier and limit type
 *
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @param type - Type of rate limit to apply
 * @returns Rate limit result with success status and metadata
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const limiter = getRateLimiter(type);

  // If Redis is not available, allow the request
  if (!limiter) {
    return {
      success: true,
      limit: RATE_LIMITS[type].requests,
      remaining: RATE_LIMITS[type].requests,
      reset: Date.now() + 60000,
    };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // On error, allow the request but log the issue
    console.error('[RateLimit] Check failed:', error);
    return {
      success: true,
      limit: RATE_LIMITS[type].requests,
      remaining: RATE_LIMITS[type].requests,
      reset: Date.now() + 60000,
    };
  }
}

/**
 * Create rate limit headers for response
 */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}

/**
 * Create a 429 Too Many Requests response
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: ErrorCodes.RATE_LIMIT_EXCEEDED,
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...rateLimitHeaders(result),
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
      },
    }
  );
}
