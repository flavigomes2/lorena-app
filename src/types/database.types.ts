export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          profile_picture: string | null
          whatsapp: string | null
          niche: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          profile_picture?: string | null
          whatsapp?: string | null
          niche?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          profile_picture?: string | null
          whatsapp?: string | null
          niche?: string | null
          created_at?: string
        }
      }
    }
  }
}
