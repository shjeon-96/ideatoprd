/**
 * Entities Layer (FSD)
 *
 * Domain entities representing business objects.
 * Examples: user, prd, purchase, credit
 *
 * Rules:
 * - Can import from: shared
 * - Cannot import from: app, pages, widgets, features, other entities
 */

// Database types (auto-generated from Supabase)
export type { Database } from '@/src/shared/types/database'

// Convenience type aliases
import type { Database } from '@/src/shared/types/database'

// Table row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type PRD = Database['public']['Tables']['prds']['Row']
export type Purchase = Database['public']['Tables']['purchases']['Row']
export type UsageLog = Database['public']['Tables']['usage_logs']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type PRDInsert = Database['public']['Tables']['prds']['Insert']
export type PurchaseInsert = Database['public']['Tables']['purchases']['Insert']
export type UsageLogInsert = Database['public']['Tables']['usage_logs']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type PRDUpdate = Database['public']['Tables']['prds']['Update']
export type PurchaseUpdate = Database['public']['Tables']['purchases']['Update']

// Enum types
export type PRDTemplate = Database['public']['Enums']['prd_template']
export type PRDVersion = Database['public']['Enums']['prd_version']
export type PurchaseStatus = Database['public']['Enums']['purchase_status']
export type CreditPackage = Database['public']['Enums']['credit_package']
export type UsageType = Database['public']['Enums']['usage_type']
