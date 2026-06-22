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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      buses: {
        Row: {
          capacity: number
          created_at: string
          id: number
          name: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          id: number
          name: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      payment_slips: {
        Row: {
          amount: number
          id: string
          payment_type: Database["public"]["Enums"]["payment_type"]
          reviewed_at: string | null
          reviewed_by: string | null
          slip_url: string
          status: Database["public"]["Enums"]["payment_slip_status"]
          student_id: string
          uploaded_at: string
        }
        Insert: {
          amount: number
          id?: string
          payment_type: Database["public"]["Enums"]["payment_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          slip_url: string
          status?: Database["public"]["Enums"]["payment_slip_status"]
          student_id: string
          uploaded_at?: string
        }
        Update: {
          amount?: number
          id?: string
          payment_type?: Database["public"]["Enums"]["payment_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          slip_url?: string
          status?: Database["public"]["Enums"]["payment_slip_status"]
          student_id?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          advance_payment_status: Database["public"]["Enums"]["payment_status"]
          created_at: string
          department: Database["public"]["Enums"]["department"] | null
          dinner_preference:
            | Database["public"]["Enums"]["dinner_preference"]
            | null
          email: string
          final_payment_status: Database["public"]["Enums"]["payment_status"]
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          lunch_preference:
            | Database["public"]["Enums"]["lunch_preference"]
            | null
          name: string
          phone: string | null
          registration_number: string | null
          updated_at: string
        }
        Insert: {
          advance_payment_status?: Database["public"]["Enums"]["payment_status"]
          created_at?: string
          department?: Database["public"]["Enums"]["department"] | null
          dinner_preference?:
            | Database["public"]["Enums"]["dinner_preference"]
            | null
          email: string
          final_payment_status?: Database["public"]["Enums"]["payment_status"]
          gender?: Database["public"]["Enums"]["gender"] | null
          id: string
          lunch_preference?:
            | Database["public"]["Enums"]["lunch_preference"]
            | null
          name?: string
          phone?: string | null
          registration_number?: string | null
          updated_at?: string
        }
        Update: {
          advance_payment_status?: Database["public"]["Enums"]["payment_status"]
          created_at?: string
          department?: Database["public"]["Enums"]["department"] | null
          dinner_preference?:
            | Database["public"]["Enums"]["dinner_preference"]
            | null
          email?: string
          final_payment_status?: Database["public"]["Enums"]["payment_status"]
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          lunch_preference?:
            | Database["public"]["Enums"]["lunch_preference"]
            | null
          name?: string
          phone?: string | null
          registration_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seat_bookings: {
        Row: {
          booked_at: string
          bus_id: number
          id: string
          seat_number: number
          student_id: string
        }
        Insert: {
          booked_at?: string
          bus_id: number
          id?: string
          seat_number: number
          student_id: string
        }
        Update: {
          booked_at?: string
          bus_id?: number
          id?: string
          seat_number?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_bookings_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "student" | "admin"
      department:
        | "Computer Engineering"
        | "Electrical Engineering"
        | "Mechanical Engineering"
        | "Civil Engineering"
        | "MENA Engineering"
      dinner_preference: "Rice" | "Kottu" | "Fried Rice" | "Vegetarian"
      gender: "Male" | "Female"
      lunch_preference: "Chicken" | "Fish" | "Vegetarian"
      payment_slip_status: "pending" | "approved" | "rejected"
      payment_status: "not_uploaded" | "pending" | "approved" | "rejected"
      payment_type: "advance" | "final"
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
      app_role: ["student", "admin"],
      department: [
        "Computer Engineering",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "MENA Engineering",
      ],
      dinner_preference: ["Rice", "Kottu", "Fried Rice", "Vegetarian"],
      gender: ["Male", "Female"],
      lunch_preference: ["Chicken", "Fish", "Vegetarian"],
      payment_slip_status: ["pending", "approved", "rejected"],
      payment_status: ["not_uploaded", "pending", "approved", "rejected"],
      payment_type: ["advance", "final"],
    },
  },
} as const
