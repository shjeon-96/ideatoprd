export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      prds: {
        Row: {
          content: Json | null
          created_at: string
          credits_used: number
          generation_time_ms: number | null
          id: string
          idea: string
          parent_id: string | null
          rated_at: string | null
          rating: number | null
          rating_feedback: string | null
          revised_sections: string[] | null
          revision_feedback: string | null
          template: Database["public"]["Enums"]["prd_template"]
          title: string | null
          updated_at: string
          user_id: string
          version: Database["public"]["Enums"]["prd_version"]
          version_number: number
          workspace_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          credits_used?: number
          generation_time_ms?: number | null
          id?: string
          idea: string
          parent_id?: string | null
          rated_at?: string | null
          rating?: number | null
          rating_feedback?: string | null
          revised_sections?: string[] | null
          revision_feedback?: string | null
          template?: Database["public"]["Enums"]["prd_template"]
          title?: string | null
          updated_at?: string
          user_id: string
          version?: Database["public"]["Enums"]["prd_version"]
          version_number?: number
          workspace_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          credits_used?: number
          generation_time_ms?: number | null
          id?: string
          idea?: string
          parent_id?: string | null
          rated_at?: string | null
          rating?: number | null
          rating_feedback?: string | null
          revised_sections?: string[] | null
          revision_feedback?: string | null
          template?: Database["public"]["Enums"]["prd_template"]
          title?: string | null
          updated_at?: string
          user_id?: string
          version?: Database["public"]["Enums"]["prd_version"]
          version_number?: number
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prds_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "prds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prds_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          default_workspace_id: string | null
          display_name: string | null
          email: string | null
          id: string
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_renews_at: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          default_workspace_id?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_renews_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          default_workspace_id?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_renews_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_default_workspace_id_fkey"
            columns: ["default_workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          amount_cents: number
          completed_at: string | null
          created_at: string
          credits_amount: number
          currency: string
          id: string
          lemon_squeezy_order_id: string | null
          lemon_squeezy_product_id: string | null
          lemon_squeezy_variant_id: string | null
          package: Database["public"]["Enums"]["credit_package"]
          status: Database["public"]["Enums"]["purchase_status"]
          user_id: string
        }
        Insert: {
          amount_cents: number
          completed_at?: string | null
          created_at?: string
          credits_amount: number
          currency?: string
          id?: string
          lemon_squeezy_order_id?: string | null
          lemon_squeezy_product_id?: string | null
          lemon_squeezy_variant_id?: string | null
          package: Database["public"]["Enums"]["credit_package"]
          status?: Database["public"]["Enums"]["purchase_status"]
          user_id: string
        }
        Update: {
          amount_cents?: number
          completed_at?: string | null
          created_at?: string
          credits_amount?: number
          currency?: string
          id?: string
          lemon_squeezy_order_id?: string | null
          lemon_squeezy_product_id?: string | null
          lemon_squeezy_variant_id?: string | null
          package?: Database["public"]["Enums"]["credit_package"]
          status?: Database["public"]["Enums"]["purchase_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount_cents: number
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          cancelled_at: string | null
          created_at: string
          credit_cap: number
          currency: string
          current_period_end: string
          current_period_start: string
          ends_at: string | null
          id: string
          last_invoice_id: string | null
          lemon_squeezy_customer_id: string | null
          lemon_squeezy_subscription_id: string
          lemon_squeezy_variant_id: string | null
          monthly_credits: number
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          billing_interval?: Database["public"]["Enums"]["billing_interval"]
          cancelled_at?: string | null
          created_at?: string
          credit_cap: number
          currency?: string
          current_period_end: string
          current_period_start: string
          ends_at?: string | null
          id?: string
          last_invoice_id?: string | null
          lemon_squeezy_customer_id?: string | null
          lemon_squeezy_subscription_id: string
          lemon_squeezy_variant_id?: string | null
          monthly_credits: number
          plan: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          billing_interval?: Database["public"]["Enums"]["billing_interval"]
          cancelled_at?: string | null
          created_at?: string
          credit_cap?: number
          currency?: string
          current_period_end?: string
          current_period_start?: string
          ends_at?: string | null
          id?: string
          last_invoice_id?: string | null
          lemon_squeezy_customer_id?: string | null
          lemon_squeezy_subscription_id?: string
          lemon_squeezy_variant_id?: string | null
          monthly_credits?: number
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          created_at: string
          credits_after: number
          credits_before: number
          credits_delta: number
          description: string | null
          id: string
          metadata: Json | null
          related_prd_id: string | null
          related_purchase_id: string | null
          usage_type: Database["public"]["Enums"]["usage_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_after: number
          credits_before: number
          credits_delta: number
          description?: string | null
          id?: string
          metadata?: Json | null
          related_prd_id?: string | null
          related_purchase_id?: string | null
          usage_type: Database["public"]["Enums"]["usage_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          credits_after?: number
          credits_before?: number
          credits_delta?: number
          description?: string | null
          id?: string
          metadata?: Json | null
          related_prd_id?: string | null
          related_purchase_id?: string | null
          usage_type?: Database["public"]["Enums"]["usage_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_related_prd_id_fkey"
            columns: ["related_prd_id"]
            isOneToOne: false
            referencedRelation: "prds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_logs_related_purchase_id_fkey"
            columns: ["related_purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string
          credit_balance: number
          subscription_id: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          owner_id: string
          credit_balance?: number
          subscription_id?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          owner_id?: string
          credit_balance?: number
          subscription_id?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspaces_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: Database["public"]["Enums"]["workspace_role"]
          joined_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: Database["public"]["Enums"]["workspace_role"]
          joined_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          joined_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_invitations: {
        Row: {
          id: string
          workspace_id: string
          email: string
          role: Database["public"]["Enums"]["workspace_role"]
          status: Database["public"]["Enums"]["invitation_status"]
          invited_by: string
          token: string
          created_at: string
          expires_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          email: string
          role?: Database["public"]["Enums"]["workspace_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
          invited_by: string
          token?: string
          created_at?: string
          expires_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          email?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
          invited_by?: string
          token?: string
          created_at?: string
          expires_at?: string
          responded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invitations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credit: {
        Args: {
          p_amount: number
          p_description?: string
          p_purchase_id?: string
          p_usage_type?: Database["public"]["Enums"]["usage_type"]
          p_user_id: string
        }
        Returns: boolean
      }
      deduct_credit: {
        Args: {
          p_amount: number
          p_description?: string
          p_prd_id?: string
          p_user_id: string
        }
        Returns: boolean
      }
      get_active_subscription: {
        Args: { p_user_id: string }
        Returns: {
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          cancelled_at: string
          credit_cap: number
          current_period_end: string
          ends_at: string
          id: string
          monthly_credits: number
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"]
        }[]
      }
      get_latest_prd_version: { Args: { p_prd_id: string }; Returns: string }
      get_prd_versions: {
        Args: { p_prd_id: string }
        Returns: {
          created_at: string
          id: string
          revised_sections: string[]
          revision_feedback: string
          title: string
          version_number: number
        }[]
      }
      get_user_credits: { Args: { p_user_id: string }; Returns: number }
      grant_subscription_credits: {
        Args: {
          p_amount: number
          p_credit_cap: number
          p_description?: string
          p_subscription_id?: string
          p_user_id: string
        }
        Returns: number
      }
      // Workspace functions
      deduct_workspace_credit: {
        Args: {
          p_workspace_id: string
          p_user_id: string
          p_amount: number
          p_prd_id?: string
          p_description?: string
        }
        Returns: boolean
      }
      add_workspace_credit: {
        Args: {
          p_workspace_id: string
          p_amount: number
          p_subscription_id?: string
          p_credit_cap?: number
          p_description?: string
        }
        Returns: number
      }
      transfer_credit_to_workspace: {
        Args: {
          p_user_id: string
          p_workspace_id: string
          p_amount: number
        }
        Returns: boolean
      }
      create_workspace: {
        Args: {
          p_name: string
          p_slug: string
          p_owner_id?: string
        }
        Returns: string
      }
      accept_workspace_invitation: {
        Args: {
          p_token: string
          p_user_id?: string
        }
        Returns: string
      }
      get_user_workspaces: {
        Args: {
          p_user_id?: string
        }
        Returns: {
          id: string
          name: string
          slug: string
          role: Database["public"]["Enums"]["workspace_role"]
          credit_balance: number
          member_count: number
          created_at: string
        }[]
      }
      get_workspace_details: {
        Args: {
          p_workspace_id: string
        }
        Returns: {
          id: string
          name: string
          slug: string
          credit_balance: number
          owner_id: string
          member_id: string
          member_email: string
          member_name: string
          member_role: Database["public"]["Enums"]["workspace_role"]
          member_joined_at: string
        }[]
      }
      is_workspace_member: {
        Args: {
          p_workspace_id: string
          p_user_id?: string
        }
        Returns: boolean
      }
      get_workspace_role: {
        Args: {
          p_workspace_id: string
          p_user_id?: string
        }
        Returns: Database["public"]["Enums"]["workspace_role"]
      }
      can_manage_workspace: {
        Args: {
          p_workspace_id: string
          p_user_id?: string
        }
        Returns: boolean
      }
      can_create_in_workspace: {
        Args: {
          p_workspace_id: string
          p_user_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      billing_interval: "monthly" | "yearly"
      credit_package: "starter" | "basic" | "pro" | "business"
      invitation_status: "pending" | "accepted" | "declined" | "expired"
      prd_template:
        | "saas"
        | "mobile"
        | "marketplace"
        | "extension"
        | "ai_wrapper"
      prd_version: "basic" | "detailed" | "research"
      purchase_status: "pending" | "completed" | "failed" | "refunded"
      subscription_plan: "basic" | "pro" | "business"
      subscription_status:
        | "active"
        | "paused"
        | "cancelled"
        | "expired"
        | "past_due"
      usage_type:
        | "prd_generation"
        | "credit_purchase"
        | "credit_refund"
        | "signup_bonus"
        | "subscription_credit"
        | "workspace_prd_generation"
        | "workspace_credit_transfer"
      workspace_role: "owner" | "member" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      billing_interval: ["monthly", "yearly"],
      credit_package: ["starter", "basic", "pro", "business"],
      invitation_status: ["pending", "accepted", "declined", "expired"],
      prd_template: [
        "saas",
        "mobile",
        "marketplace",
        "extension",
        "ai_wrapper",
      ],
      prd_version: ["basic", "detailed", "research"],
      purchase_status: ["pending", "completed", "failed", "refunded"],
      subscription_plan: ["basic", "pro", "business"],
      subscription_status: [
        "active",
        "paused",
        "cancelled",
        "expired",
        "past_due",
      ],
      usage_type: [
        "prd_generation",
        "credit_purchase",
        "credit_refund",
        "signup_bonus",
        "subscription_credit",
        "workspace_prd_generation",
        "workspace_credit_transfer",
      ],
      workspace_role: ["owner", "member", "viewer"],
    },
  },
} as const
