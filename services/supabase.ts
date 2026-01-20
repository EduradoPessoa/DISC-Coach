import { createClient } from '@supabase/supabase-js'

// Novo projeto Supabase (atualizado em 19/01/2026)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tpancojploqdfddxvgre.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_73NI4K2_RwneSniHlB4cmw_WLzeUYh4'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos do Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'team-admin' | 'saas-admin'
          position: string
          department: string
          plan: 'free' | 'pro'
          subscription_status?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          answers: number[]
          scores: { D: number; I: number; S: number; C: number }
          analysis?: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['assessments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['assessments']['Row']>
      }
      focus_areas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: 'D' | 'I' | 'S' | 'C'
          status: 'pending' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['focus_areas']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['focus_areas']['Row']>
      }
      invitations: {
        Row: {
          id: string
          email: string
          token: string
          role: 'user' | 'team-admin'
          invited_by: string
          used: boolean
          created_at: string
          used_at?: string
        }
        Insert: Omit<Database['public']['Tables']['invitations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['invitations']['Row']>
      }
    }
  }
}