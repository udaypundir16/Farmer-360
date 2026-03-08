-- Price Alerts table for Smart Agriculture platform
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  commodity TEXT NOT NULL,
  market TEXT,
  target_price NUMERIC NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'above' CHECK (alert_type IN ('above', 'below')),
  phone_number TEXT,
  triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on price_alerts" ON price_alerts
  FOR ALL USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
