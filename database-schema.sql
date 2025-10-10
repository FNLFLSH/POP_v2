-- POP! Event Layout Manager - Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Venues Table - Stores venue data with geocoding and building footprints
CREATE TABLE IF NOT EXISTS venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL UNIQUE,
  lat DECIMAL(10, 8) NOT NULL,
  lon DECIMAL(11, 8) NOT NULL,
  display_name TEXT NOT NULL,
  building_footprint JSONB, -- Stores the building outline coordinates
  building_type TEXT DEFAULT 'venue',
  building_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Events Table - Stores event information
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft', -- draft, active, completed
  layout_data JSONB, -- Stores the event layout configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Event Elements Table - Stores individual elements in an event layout
CREATE TABLE IF NOT EXISTS event_elements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  element_type TEXT NOT NULL, -- bar, table, stage, booth, seat, etc.
  position_x DECIMAL(10, 2) NOT NULL,
  position_y DECIMAL(10, 2) NOT NULL,
  width DECIMAL(10, 2) DEFAULT 1.0,
  height DECIMAL(10, 2) DEFAULT 1.0,
  rotation DECIMAL(5, 2) DEFAULT 0.0,
  properties JSONB, -- Custom properties for each element
  assigned_to TEXT, -- User ID or vendor name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Users Table - Basic user management
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user', -- user, admin, vendor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Vendors Table - Vendor information
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  business_type TEXT, -- food, beverage, merchandise, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_venues_address ON venues(address);
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues(lat, lon);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_elements_event_id ON event_elements(event_id);
CREATE INDEX IF NOT EXISTS idx_event_elements_type ON event_elements(element_type);

-- Row Level Security (RLS) policies
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to venues (for now)
CREATE POLICY "Allow public read access to venues" ON venues
  FOR SELECT USING (true);

-- Allow public insert/update for venues (for caching)
CREATE POLICY "Allow public insert/update venues" ON venues
  FOR ALL USING (true);

-- Allow public read access to events
CREATE POLICY "Allow public read access to events" ON events
  FOR SELECT USING (true);

-- Allow public insert/update for events
CREATE POLICY "Allow public insert/update events" ON events
  FOR ALL USING (true);

-- Allow public read access to event elements
CREATE POLICY "Allow public read access to event_elements" ON event_elements
  FOR SELECT USING (true);

-- Allow public insert/update for event elements
CREATE POLICY "Allow public insert/update event_elements" ON event_elements
  FOR ALL USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_elements_updated_at BEFORE UPDATE ON event_elements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


