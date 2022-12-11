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
          fields?: Json
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
          project_id: string
          name: string
          notify_admin: boolean
          notify_responder: boolean
          domains: string[]
          destination: string | null
          keys: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          name: string
          notify_admin?: boolean
          notify_responder?: boolean
          domains?: string[]
          destination?: string | null
          keys?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          name?: string
          notify_admin?: boolean
          notify_responder?: boolean
          domains?: string[]
          destination?: string | null
          keys?: string[]
        }
      }
      member: {
        Row: {
          created_at: string
          user_id: string
          project_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
          project_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
          project_id?: string
        }
      }
      project: {
        Row: {
          id: string
          created_at: string
          name: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
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
          project_id: string | null
          entry_id: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          email: string | null
          created_at: string | null
        }
      }
      dashboard: {
        Row: {
          p_id: string | null
          contact_count: number | null
          ent_count: number | null
        }
      }
      project_user: {
        Row: {
          name: string | null
          project_created_at: string | null
          project_id: string | null
          member_created_at: string | null
          user_id: string | null
        }
      }
    }
    Functions: {
      delete_form_with_children: {
        Args: { f_id: string }
        Returns: undefined
      }
      delete_project_with_children: {
        Args: { p_id: string }
        Returns: undefined
      }
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
