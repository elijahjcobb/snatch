export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName: string
          query: string
          variables: Json
          extensions: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      entry: {
        Row: {
          created_at: string
          email: string | null
          fields: Json
          first_name: string | null
          form_id: string
          id: string
          last_name: string | null
          message: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          fields?: Json
          first_name?: string | null
          form_id: string
          id?: string
          last_name?: string | null
          message?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          fields?: Json
          first_name?: string | null
          form_id?: string
          id?: string
          last_name?: string | null
          message?: string | null
          phone?: string | null
        }
      }
      form: {
        Row: {
          created_at: string
          destination: string | null
          domains: string[]
          id: string
          keys: string[]
          name: string
          notify_admin: boolean
          notify_responder: boolean
          project_id: string
          unbranded: boolean
        }
        Insert: {
          created_at?: string
          destination?: string | null
          domains?: string[]
          id?: string
          keys?: string[]
          name: string
          notify_admin?: boolean
          notify_responder?: boolean
          project_id: string
          unbranded?: boolean
        }
        Update: {
          created_at?: string
          destination?: string | null
          domains?: string[]
          id?: string
          keys?: string[]
          name?: string
          notify_admin?: boolean
          notify_responder?: boolean
          project_id?: string
          unbranded?: boolean
        }
      }
      member: {
        Row: {
          created_at: string
          is_owner: boolean
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          is_owner?: boolean
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          is_owner?: boolean
          project_id?: string
          user_id?: string
        }
      }
      plan: {
        Row: {
          name: string
          price: number
        }
        Insert: {
          name: string
          price: number
        }
        Update: {
          name?: string
          price?: number
        }
      }
      project: {
        Row: {
          created_at: string
          id: string
          name: string
          plan: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          plan?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          plan?: string
        }
      }
      user: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          verified?: boolean
        }
      }
    }
    Views: {
      contacts: {
        Row: {
          created_at: string | null
          email: string | null
          entry_id: string | null
          first_name: string | null
          form_id: string | null
          last_name: string | null
          phone: string | null
          project_id: string | null
        }
      }
      dashboard: {
        Row: {
          contact_count: number | null
          ent_count: number | null
          p_id: string | null
        }
      }
      project_user: {
        Row: {
          is_owner: boolean | null
          member_created_at: string | null
          name: string | null
          p_id: string | null
          plan: string | null
          project_created_at: string | null
          project_id: string | null
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: { size: number; bucket_id: string }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits: number
          levels: number
          offsets: number
          search: string
          sortcolumn: string
          sortorder: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
