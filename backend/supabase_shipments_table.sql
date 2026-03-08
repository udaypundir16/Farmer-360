-- Shipments table for Smart Agriculture platform
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vcajepqvzfihmxvyprre/sql/new

CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id TEXT UNIQUE NOT NULL,
  farmer_id TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  driver_name TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  vehicle_type TEXT,
  pickup_location JSONB,
  delivery_location JSONB,
  current_location JSONB,
  route_details TEXT,
  estimated_delivery_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  tracking_notes TEXT,
  phone_number TEXT,
  email TEXT
);

-- Enable Row Level Security
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for development/hackathon)
CREATE POLICY "Allow all operations" ON shipments
  FOR ALL USING (true) WITH CHECK (true);
