import type { ErrorCode } from './error-codes';

/**
 * Translate error code to user-friendly message using next-intl translations.
 *
 * Usage in client component:
 * ```tsx
 * const t = useTranslations('errors');
 * const message = translateError(errorCode, t);
 * ```
 *
 * Usage in server component:
 * ```tsx
 * const t = await getTranslations('errors');
 * const message = translateError(errorCode, t);
 * ```
 */
export function translateError(
  errorCode: string | ErrorCode | undefined,
  t: (key: string) => string
): string {
  if (!errorCode) {
    return t('UNKNOWN_ERROR');
  }

  // Try to translate the error code
  try {
    const translated = t(errorCode);
    // If the translation returns the key itself, it means no translation was found
    if (translated === errorCode) {
      return t('UNKNOWN_ERROR');
    }
    return translated;
  } catch {
    // Fallback to unknown error if translation fails
    return t('UNKNOWN_ERROR');
  }
}

/**
 * Check if a string is a known error code
 */
export function isErrorCode(value: string): value is ErrorCode {
  // Error codes are uppercase with underscores
  return /^[A-Z][A-Z0-9_]+$/.test(value);
}
