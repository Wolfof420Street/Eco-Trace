import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseDb = any;

let browserClient: SupabaseClient<SupabaseDb> | null = null;

export function createSupabaseBrowserClient(): SupabaseClient<SupabaseDb> {
  if (browserClient) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase browser env vars are not configured");
  }

  browserClient = createClient<SupabaseDb>(url, key);
  return browserClient;
}
