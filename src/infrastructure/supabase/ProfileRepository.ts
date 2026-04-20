import type { UserProfile } from "@/src/domain/entities/UserProfile";
import type { IProfileRepository } from "@/src/domain/interfaces/IProfileRepository";
import { createSupabaseAdminClient } from "@/src/infrastructure/supabase/server";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function isMissingProfilesTableError(error: { code?: string | null; message?: string | null } | null): boolean {
  if (!error) return false;
  const message = (error.message ?? "").toLowerCase();

  return (
    error.code === "PGRST205" ||
    message.includes("could not find the table 'public.profiles'") ||
    message.includes('relation "profiles" does not exist')
  );
}

function isSupabaseUnavailableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return error.message.toLowerCase().includes("fetch failed");
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes("fetch failed") || message.includes("network error") || message.includes("econnrefused");
  }

  return false;
}

type ProfileRow = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  streak_days: number | null;
  longest_streak: number | null;
  total_co2_kg: number | null;
  onboarded: boolean | null;
  region: string | null;
  backboard_thread_id: string | null;
  created_at: string | null;
};

function mapRow(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    username: row.username ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    streakDays: row.streak_days ?? 0,
    longestStreak: row.longest_streak ?? 0,
    totalCO2Kg: Number(row.total_co2_kg ?? 0),
    onboarded: row.onboarded ?? false,
    region: row.region ?? undefined,
    backboardThreadId: row.backboard_thread_id ?? undefined,
    createdAt: row.created_at ? new Date(row.created_at) : new Date()
  };
}

export class ProfileRepository implements IProfileRepository {
  async getCurrent(): Promise<UserProfile> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured");
    }

    // In production, getCurrent should be called with a valid user ID from session
    throw new Error("getCurrent requires a userId - use getById(userId) instead");
  }

  async getById(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured");
    }

    const db = createSupabaseAdminClient();
    try {
      const { data, error } = await db
        .from("profiles")
        .select("id, username, avatar_url, streak_days, longest_streak, total_co2_kg, onboarded, region, backboard_thread_id, created_at")
        .eq("id", userId)
        .maybeSingle<ProfileRow>();

      if (error) {
        throw new Error(error.message);
      }
      return data ? mapRow(data) : null;
    } catch (error) {
      throw error;
    }
  }

  async upsert(profile: Partial<UserProfile> & Pick<UserProfile, "id">): Promise<UserProfile> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured");
    }

    const db = createSupabaseAdminClient();
    const payload = {
      id: profile.id,
      username: profile.username ?? null,
      avatar_url: profile.avatarUrl ?? null,
      streak_days: profile.streakDays ?? 0,
      longest_streak: profile.longestStreak ?? 0,
      total_co2_kg: profile.totalCO2Kg ?? 0,
      onboarded: profile.onboarded ?? true,
      region: profile.region ?? null,
      backboard_thread_id: profile.backboardThreadId ?? null
    };

    try {
      const { data, error } = await db
        .from("profiles")
        .upsert(payload)
        .select("id, username, avatar_url, streak_days, longest_streak, total_co2_kg, onboarded, region, backboard_thread_id, created_at")
        .single<ProfileRow>();

      if (error) {
        throw new Error(error.message);
      }
      return mapRow(data);
    } catch (error) {
      throw error;
    }
  }

  async setThreadId(userId: string, threadId: string): Promise<void> {
    await this.upsert({ id: userId, backboardThreadId: threadId, onboarded: true });
  }
}
