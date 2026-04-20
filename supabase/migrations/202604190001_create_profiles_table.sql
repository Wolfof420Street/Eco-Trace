CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_co2_kg NUMERIC NOT NULL DEFAULT 0,
  onboarded BOOLEAN NOT NULL DEFAULT FALSE,
  region TEXT,
  backboard_thread_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
