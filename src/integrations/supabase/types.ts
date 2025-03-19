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
      charities: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          owner_id: string
          supporting_text: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          owner_id: string
          supporting_text?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          owner_id?: string
          supporting_text?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      display_media: {
        Row: {
          created_at: string
          description: string | null
          display_year_id: string | null
          id: string
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_year_id?: string | null
          id?: string
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_year_id?: string | null
          id?: string
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "display_media_display_year_id_fkey"
            columns: ["display_year_id"]
            isOneToOne: false
            referencedRelation: "display_years"
            referencedColumns: ["id"]
          },
        ]
      }
      display_songs: {
        Row: {
          artist: string
          created_at: string
          display_year_id: string | null
          id: string
          reused_from: string | null
          sequence_available: boolean | null
          sequence_file_url: string | null
          sequence_price: number | null
          title: string
          updated_at: string
          year_introduced: number
        }
        Insert: {
          artist: string
          created_at?: string
          display_year_id?: string | null
          id?: string
          reused_from?: string | null
          sequence_available?: boolean | null
          sequence_file_url?: string | null
          sequence_price?: number | null
          title: string
          updated_at?: string
          year_introduced: number
        }
        Update: {
          artist?: string
          created_at?: string
          display_year_id?: string | null
          id?: string
          reused_from?: string | null
          sequence_available?: boolean | null
          sequence_file_url?: string | null
          sequence_price?: number | null
          title?: string
          updated_at?: string
          year_introduced?: number
        }
        Relationships: [
          {
            foreignKeyName: "display_songs_display_year_id_fkey"
            columns: ["display_year_id"]
            isOneToOne: false
            referencedRelation: "display_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "display_songs_reused_from_fkey"
            columns: ["reused_from"]
            isOneToOne: false
            referencedRelation: "display_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      display_years: {
        Row: {
          created_at: string
          description: string | null
          display_id: number | null
          id: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_id?: number | null
          id?: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          description?: string | null
          display_id?: number | null
          id?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "display_years_display_id_fkey"
            columns: ["display_id"]
            isOneToOne: false
            referencedRelation: "displays"
            referencedColumns: ["id"]
          },
        ]
      }
      displays: {
        Row: {
          created_at: string
          description: string | null
          display_type: string | null
          fm_station: string | null
          holiday_type: string | null
          id: number
          image_url: string | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          schedule: Json | null
          tags: string[] | null
          updated_at: string
          year_started: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_type?: string | null
          fm_station?: string | null
          holiday_type?: string | null
          id?: number
          image_url?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          schedule?: Json | null
          tags?: string[] | null
          updated_at?: string
          year_started?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_type?: string | null
          fm_station?: string | null
          holiday_type?: string | null
          id?: number
          image_url?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          schedule?: Json | null
          tags?: string[] | null
          updated_at?: string
          year_started?: number | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount_paid: number
          created_at: string | null
          id: string
          seller_id: string | null
          sequence_id: string
          status: string
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          id?: string
          seller_id?: string | null
          sequence_id: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          id?: string
          seller_id?: string | null
          sequence_id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
