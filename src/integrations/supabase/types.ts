export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
