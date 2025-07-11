export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          client_id: string
          created_at: string
          end_time: string
          id: string
          meeting_link: string | null
          notes: string | null
          payment_status: string
          session_type: string
          start_time: string
          status: string
          therapist_id: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          client_id: string
          created_at?: string
          end_time: string
          id?: string
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string
          session_type: string
          start_time: string
          status?: string
          therapist_id: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          client_id?: string
          created_at?: string
          end_time?: string
          id?: string
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string
          session_type?: string
          start_time?: string
          status?: string
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "terapeutas"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_events: {
        Row: {
          created_at: string
          days_of_week: number[] | null
          description: string | null
          end_date: string | null
          end_time: string | null
          event_type: string
          id: string
          is_active: boolean
          month_pattern: Json | null
          recurrence_type: string | null
          start_date: string
          start_time: string | null
          therapist_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[] | null
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          event_type: string
          id?: string
          is_active?: boolean
          month_pattern?: Json | null
          recurrence_type?: string | null
          start_date: string
          start_time?: string | null
          therapist_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[] | null
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          event_type?: string
          id?: string
          is_active?: boolean
          month_pattern?: Json | null
          recurrence_type?: string | null
          start_date?: string
          start_time?: string | null
          therapist_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          session_type: string
          start_time: string
          therapist_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          session_type?: string
          start_time: string
          therapist_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          session_type?: string
          start_time?: string
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "terapeutas"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          blocks_appointments: boolean
          city_code: string | null
          country_code: string | null
          created_at: string
          date: string
          id: string
          is_active: boolean
          is_recurring: boolean
          month_day: string | null
          name: string
          state_code: string | null
          updated_at: string
        }
        Insert: {
          blocks_appointments?: boolean
          city_code?: string | null
          country_code?: string | null
          created_at?: string
          date: string
          id?: string
          is_active?: boolean
          is_recurring?: boolean
          month_day?: string | null
          name: string
          state_code?: string | null
          updated_at?: string
        }
        Update: {
          blocks_appointments?: boolean
          city_code?: string | null
          country_code?: string | null
          created_at?: string
          date?: string
          id?: string
          is_active?: boolean
          is_recurring?: boolean
          month_day?: string | null
          name?: string
          state_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          genero: string | null
          id: string
          nome: string
          tipo_usuario: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          genero?: string | null
          id: string
          nome: string
          tipo_usuario: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          genero?: string | null
          id?: string
          nome?: string
          tipo_usuario?: string
          updated_at?: string
        }
        Relationships: []
      }
      schedule_settings: {
        Row: {
          allow_back_to_back: boolean
          break_between_sessions: number
          created_at: string
          default_session_duration: number
          id: string
          max_advance_days: number
          min_advance_hours: number
          therapist_id: string
          timezone: string
          updated_at: string
        }
        Insert: {
          allow_back_to_back?: boolean
          break_between_sessions?: number
          created_at?: string
          default_session_duration?: number
          id?: string
          max_advance_days?: number
          min_advance_hours?: number
          therapist_id: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          allow_back_to_back?: boolean
          break_between_sessions?: number
          created_at?: string
          default_session_duration?: number
          id?: string
          max_advance_days?: number
          min_advance_hours?: number
          therapist_id?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      terapeutas: {
        Row: {
          abordagens: string[] | null
          bio: string | null
          cidade: string | null
          consultorio_nome: string | null
          created_at: string | null
          crp_numero: string | null
          email: string
          especialidades: string[] | null
          estado: string | null
          experience: number | null
          formacao: Json | null
          foto_url: string | null
          id: string
          is_online: boolean | null
          languages: string[] | null
          nome: string
          offers_in_person: boolean | null
          offers_online: boolean | null
          price_per_session: number | null
          rating: number | null
          review_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          abordagens?: string[] | null
          bio?: string | null
          cidade?: string | null
          consultorio_nome?: string | null
          created_at?: string | null
          crp_numero?: string | null
          email: string
          especialidades?: string[] | null
          estado?: string | null
          experience?: number | null
          formacao?: Json | null
          foto_url?: string | null
          id?: string
          is_online?: boolean | null
          languages?: string[] | null
          nome: string
          offers_in_person?: boolean | null
          offers_online?: boolean | null
          price_per_session?: number | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          abordagens?: string[] | null
          bio?: string | null
          cidade?: string | null
          consultorio_nome?: string | null
          created_at?: string | null
          crp_numero?: string | null
          email?: string
          especialidades?: string[] | null
          estado?: string | null
          experience?: number | null
          formacao?: Json | null
          foto_url?: string | null
          id?: string
          is_online?: boolean | null
          languages?: string[] | null
          nome?: string
          offers_in_person?: boolean | null
          offers_online?: boolean | null
          price_per_session?: number | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
