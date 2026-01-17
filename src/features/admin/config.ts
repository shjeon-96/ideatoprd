/**
 * Admin configuration
 * Only emails in this list can access the admin panel
 */

// Admin emails - add your admin emails here
export const ADMIN_EMAILS = [
  'tmdgns893758@gmail.com',
  // Add more admin emails as needed
] as const;

/**
 * Check if an email is an admin
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email as typeof ADMIN_EMAILS[number]);
}
