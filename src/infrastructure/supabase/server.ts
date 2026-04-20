import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseDb = any;

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  return url;
}

export function createSupabaseServerClient(): SupabaseClient<SupabaseDb> {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured");
  }

  return createClient<SupabaseDb>(getSupabaseUrl(), key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function createSupabaseAdminClient(): SupabaseClient<SupabaseDb> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return createClient<SupabaseDb>(getSupabaseUrl(), key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
