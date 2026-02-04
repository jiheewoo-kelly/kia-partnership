import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'ADMIN' | 'STARTUP'
  created_at: string
  updated_at: string
}

export interface Startup {
  id: string
  name: string
  description: string | null
  category: string | null
  contact_name: string | null
  contact_email: string | null
  website: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  description: string | null
  category: string | null
  contact_name: string | null
  contact_email: string | null
  website: string | null
  logo_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Collaboration {
  id: string
  title: string
  description: string | null
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  start_date: string | null
  end_date: string | null
  notes: string | null
  startup_id: string
  partner_id: string
  created_at: string
  updated_at: string
  startup?: Startup
  partner?: Partner
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  user_id: string
  startup_id: string | null
  partner_id: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}
