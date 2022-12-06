export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      entry: {
        Row: {
          id: string
          created_at: string
          form_id: string
          fields: Json
          email: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          form_id: string
          fields: Json
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          form_id?: string
          fields?: Json
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          message?: string | null
        }
      }
      form: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          notify_admin: boolean
          notify_responder: boolean
          domains: string[]
          destination: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          notify_admin?: boolean
          notify_responder?: boolean
          domains?: string[]
          destination?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          notify_admin?: boolean
          notify_responder?: boolean
          domains?: string[]
          destination?: string | null
        }
      }
      user: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          password: string
          verified: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          password: string
          verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          password?: string
          verified?: boolean
        }
      }
    }
    Views: {
      contacts: {
        Row: {
          form_id: string | null
          user_id: string | null
          entry_id: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          email: string | null
          created_at: string | null
        }
      }
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
