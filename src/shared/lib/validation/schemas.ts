import { z } from 'zod';
import { ErrorCodes } from '../errors';

// PRD Generation Request Schema
export const generatePRDSchema = z.object({
  idea: z
    .string()
    .min(10, ErrorCodes.VALIDATION_IDEA_MIN_LENGTH)
    .max(500, ErrorCodes.VALIDATION_IDEA_MAX_LENGTH)
    .transform((val) => val.trim()),
  template: z.enum(['saas', 'mobile', 'marketplace', 'extension', 'ai_wrapper'], {
    message: ErrorCodes.VALIDATION_INVALID_TEMPLATE,
  }),
  version: z.enum(['basic', 'detailed', 'research'], {
    message: ErrorCodes.VALIDATION_INVALID_VERSION,
  }),
  language: z.enum(['ko', 'en']).optional().default('ko'),
  workspace_id: z.string().uuid(ErrorCodes.VALIDATION_INVALID_WORKSPACE_ID).optional(),
});

export type GeneratePRDInput = z.infer<typeof generatePRDSchema>;

// PRD Revision Request Schema
export const revisePRDSchema = z.object({
  prdId: z.string().uuid(ErrorCodes.VALIDATION_INVALID_PRD_ID),
  feedback: z
    .string()
    .min(10, ErrorCodes.VALIDATION_FEEDBACK_MIN_LENGTH)
    .max(2000, ErrorCodes.VALIDATION_FEEDBACK_MAX_LENGTH)
    .transform((val) => val.trim()),
  sections: z
    .array(z.string())
    .min(1, ErrorCodes.VALIDATION_SECTIONS_MIN)
    .max(15, ErrorCodes.VALIDATION_SECTIONS_MAX),
  language: z.enum(['ko', 'en']).optional().default('ko'),
});

export type RevisePRDInput = z.infer<typeof revisePRDSchema>;

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email(ErrorCodes.VALIDATION_INVALID_EMAIL),
  password: z
    .string()
    .min(8, ErrorCodes.VALIDATION_PASSWORD_MIN_LENGTH)
    .max(72, ErrorCodes.VALIDATION_PASSWORD_MAX_LENGTH),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = loginSchema.extend({
  name: z
    .string()
    .min(2, ErrorCodes.VALIDATION_NAME_MIN_LENGTH)
    .max(50, ErrorCodes.VALIDATION_NAME_MAX_LENGTH)
    .optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;

// Webhook Custom Data Schema
export const webhookCustomDataSchema = z.object({
  user_id: z.string().uuid(ErrorCodes.VALIDATION_INVALID_USER_ID),
});

export type WebhookCustomData = z.infer<typeof webhookCustomDataSchema>;

// Environment Variables Schema (for startup validation)
export const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  LEMONSQUEEZY_API_KEY: z.string().min(1),
  LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1),
  LEMONSQUEEZY_STORE_ID: z.string().min(1),
  TAVILY_API_KEY: z.string().min(1).optional(),
});

// Validation helper
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError?.message || ErrorCodes.VALIDATION_FAILED,
    };
  }

  return { success: true, data: result.data };
}
