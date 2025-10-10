import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yydkydbadronupfabkul.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZGt5ZGJhZHJvbnVwZmFia3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5ODM0MTUsImV4cCI6MjA3NTU1OTQxNX0.dNO-yTkjSukMadLOOPryDMGAFtQnp63THOGZe0Jg7D0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface VenueData {
  id?: string
  address: string
  lat: number
  lon: number
  display_name: string
  building_footprint?: {
    coordinates: [number, number][]
    type: string
    properties: {
      id: string
      building_type: string
      name?: string
      distance?: number
    }
  }
  building_type?: string
  building_name?: string
  created_at?: string
  updated_at?: string
}

export interface EventData {
  id?: string
  venue_id: string
  name: string
  description?: string
  event_date?: string
  status?: 'draft' | 'active' | 'completed'
  layout_data?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export interface EventElement {
  id?: string
  event_id: string
  element_type: 'bar' | 'table' | 'stage' | 'booth' | 'seat' | 'food_truck' | 'entrance' | 'exit'
  position_x: number
  position_y: number
  width?: number
  height?: number
  rotation?: number
  properties?: Record<string, unknown>
  assigned_to?: string
  created_at?: string
  updated_at?: string
}
