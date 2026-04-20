import type { NextRequest } from "next/server";
import { ok, err } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { CreateActivitySchema } from "@/src/domain/schemas/activity.schema";
import { LogActivityUseCase } from "@/src/application/use-cases/LogActivityUseCase";
import { SnowflakeCommunityRepository } from "@/src/infrastructure/snowflake/CommunityRepository";
import { SnowflakeEmissionFactorRepository } from "@/src/infrastructure/snowflake/EmissionFactorRepository";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";
import { SupabaseBadgeRepository } from "@/src/infrastructure/supabase/BadgeRepository";
import { mapActivityToDTO } from "@/src/presentation/mappers/activity.mapper";

type CreateActivityResponseData = {
  activity: ReturnType<typeof mapActivityToDTO>;
  newBadges: string[];
};

type CachedPostResult = {
  status: number;
  data: CreateActivityResponseData;
  createdAt: number;
};

const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000;
const activityPostCache = new Map<string, CachedPostResult>();
const pendingActivityPosts = new Map<string, Promise<CachedPostResult>>();

function cleanupExpiredIdempotencyEntries() {
  const now = Date.now();
  for (const [key, value] of activityPostCache.entries()) {
    if (now - value.createdAt > IDEMPOTENCY_TTL_MS) {
      activityPostCache.delete(key);
    }
  }
}

export const GET = withAuth(async (_req: NextRequest, userId: string) => {
  const activities = await new SupabaseActivityRepository().findMany({ userId, limit: 50 });
  return ok(activities.map(mapActivityToDTO));
});

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  cleanupExpiredIdempotencyEntries();

  const body = await req.json().catch(() => null);
  const parsed = CreateActivitySchema.safeParse(body);
  if (!parsed.success) {
    return err("Validation failed", "INVALID_INPUT", 400);
  }

  const idempotencyKey = req.headers.get("Idempotency-Key")?.trim();
  const scopedKey = idempotencyKey ? `${userId}:${idempotencyKey}` : null;

  if (scopedKey) {
    const cached = activityPostCache.get(scopedKey);
    if (cached) {
      return ok(cached.data, cached.status);
    }

    const pending = pendingActivityPosts.get(scopedKey);
    if (pending) {
      const result = await pending;
      return ok(result.data, result.status);
    }
  }

  const executePost = async (): Promise<CachedPostResult> => {
    const result = await new LogActivityUseCase(
      new SupabaseActivityRepository(),
      new SnowflakeEmissionFactorRepository(),
      new SnowflakeCommunityRepository(),
      new SupabaseBadgeRepository()
    ).execute(userId, parsed.data);

    return {
      status: 201,
      data: {
        activity: mapActivityToDTO(result.activity),
        newBadges: result.newBadges
      },
      createdAt: Date.now()
    };
  };

  try {
    if (!scopedKey) {
      const result = await executePost();
      return ok(result.data, result.status);
    }

    const pending = executePost();
    pendingActivityPosts.set(scopedKey, pending);

    const result = await pending;
    activityPostCache.set(scopedKey, result);
    return ok(result.data, result.status);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Internal error", "SERVER_ERROR", 500);
  } finally {
    if (scopedKey) {
      pendingActivityPosts.delete(scopedKey);
    }
  }
});
