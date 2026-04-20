-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category      TEXT NOT NULL CHECK (category IN ('transport','food','energy','goods')),
  subcategory   TEXT NOT NULL,
  quantity      NUMERIC(10,3) NOT NULL CHECK (quantity > 0),
  unit          TEXT NOT NULL,
  co2_kg        NUMERIC(10,4) NOT NULL CHECK (co2_kg >= 0),
  notes         TEXT,
  source        TEXT DEFAULT 'manual' CHECK (source IN ('manual','agent_scan')),
  logged_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_activities_user_logged ON public.activities(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_category ON public.activities(user_id, category);

-- Enable RLS (Row Level Security)
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own activities
CREATE POLICY activities_select_policy ON public.activities
  FOR SELECT
  USING (auth.uid()::TEXT = user_id);

-- RLS Policy: Users can only insert their own activities
CREATE POLICY activities_insert_policy ON public.activities
  FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

-- RLS Policy: Users can only delete their own activities
CREATE POLICY activities_delete_policy ON public.activities
  FOR DELETE
  USING (auth.uid()::TEXT = user_id);
