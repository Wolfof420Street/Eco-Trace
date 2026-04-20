ALTER TABLE IF EXISTS public.profiles
	ADD COLUMN IF NOT EXISTS backboard_thread_id TEXT;
