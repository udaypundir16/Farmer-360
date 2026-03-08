-- Crop Trades table for Smart Agriculture platform
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vcajepqvzfihmxvyprre/sql/new

CREATE TABLE IF NOT EXISTS crop_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'cancelled')),
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crop_trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on crop_trades" ON crop_trades
  FOR ALL USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
