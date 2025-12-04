import { createClient } from "./supabase/client"

// Export the browser client creator
export { createClient }

// Create a singleton instance for client-side use
export const supabase = createClient()

// Database types
export interface Database {
  public: {
    Tables: {
      news_articles: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          image: string
          date: string
          category: string
          views: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["news_articles"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["news_articles"]["Insert"]>
      }
      statements: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          image: string
          date: string
          views: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["statements"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["statements"]["Insert"]>
      }
      page_content: {
        Row: {
          id: string
          page_id: string
          page_title: string
          hero_image: string | null
          last_modified: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["page_content"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["page_content"]["Insert"]>
      }
      page_sections: {
        Row: {
          id: string
          page_id: string
          title: string
          content: string
          image: string | null
          order_number: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["page_sections"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["page_sections"]["Insert"]>
      }
      leaders: {
        Row: {
          id: string
          name: string
          position: string
          is_main: boolean
          image: string | null
          order_number: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["leaders"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["leaders"]["Insert"]>
      }
    }
  }
}
