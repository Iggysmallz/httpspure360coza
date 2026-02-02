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
      bookings: {
        Row: {
          bathrooms: number
          bedrooms: number
          created_at: string
          id: string
          scheduled_date: string
          scheduled_time: string
          service_type: string
          status: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          id?: string
          scheduled_date: string
          scheduled_time: string
          service_type: string
          status?: string
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          id?: string
          scheduled_date?: string
          scheduled_time?: string
          service_type?: string
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          additional_notes: string | null
          area_suburb: string
          contact_number: string
          created_at: string
          full_name: string
          id: string
          preferred_date: string | null
          service_required: string
          status: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          area_suburb: string
          contact_number: string
          created_at?: string
          full_name: string
          id?: string
          preferred_date?: string | null
          service_required: string
          status?: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          area_suburb?: string
          contact_number?: string
          created_at?: string
          full_name?: string
          id?: string
          preferred_date?: string | null
          service_required?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          complex_name: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          profile_completed: boolean | null
          profile_picture_url: string | null
          province: string | null
          street_address: string | null
          suburb: string | null
          unit_number: string | null
          updated_at: string
          user_id: string
          worker_status: Database["public"]["Enums"]["worker_status"] | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          complex_name?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          profile_completed?: boolean | null
          profile_picture_url?: string | null
          province?: string | null
          street_address?: string | null
          suburb?: string | null
          unit_number?: string | null
          updated_at?: string
          user_id: string
          worker_status?: Database["public"]["Enums"]["worker_status"] | null
        }
        Update: {
          address?: string | null
          city?: string | null
          complex_name?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          profile_completed?: boolean | null
          profile_picture_url?: string | null
          province?: string | null
          street_address?: string | null
          suburb?: string | null
          unit_number?: string | null
          updated_at?: string
          user_id?: string
          worker_status?: Database["public"]["Enums"]["worker_status"] | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          admin_notes: string | null
          care_type: string | null
          created_at: string
          dropoff_suburb: string | null
          frequency: string | null
          id: string
          item_description: string | null
          photo_url: string | null
          pickup_suburb: string | null
          service_type: string
          special_requirements: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          care_type?: string | null
          created_at?: string
          dropoff_suburb?: string | null
          frequency?: string | null
          id?: string
          item_description?: string | null
          photo_url?: string | null
          pickup_suburb?: string | null
          service_type: string
          special_requirements?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          care_type?: string | null
          created_at?: string
          dropoff_suburb?: string | null
          frequency?: string | null
          id?: string
          item_description?: string | null
          photo_url?: string | null
          pickup_suburb?: string | null
          service_type?: string
          special_requirements?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      worker_applications: {
        Row: {
          additional_notes: string | null
          area: string
          contact_number: string
          created_at: string
          full_name: string
          id: string
          status: string
          updated_at: string
          work_type: string
          years_experience: string | null
        }
        Insert: {
          additional_notes?: string | null
          area: string
          contact_number: string
          created_at?: string
          full_name: string
          id?: string
          status?: string
          updated_at?: string
          work_type: string
          years_experience?: string | null
        }
        Update: {
          additional_notes?: string | null
          area?: string
          contact_number?: string
          created_at?: string
          full_name?: string
          id?: string
          status?: string
          updated_at?: string
          work_type?: string
          years_experience?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "client" | "worker"
      worker_status: "pending_approval" | "approved" | "rejected"
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
      app_role: ["admin", "moderator", "user", "client", "worker"],
      worker_status: ["pending_approval", "approved", "rejected"],
    },
  },
} as const
