import type { NextRequest } from "next/server";
import { ok } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { GetDashboardDataUseCase } from "@/src/application/use-cases/GetDashboardDataUseCase";
import { SnowflakeCommunityRepository } from "@/src/infrastructure/snowflake/CommunityRepository";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";

export const GET = withAuth(async (_req: NextRequest, userId: string) => {
  const data = await new GetDashboardDataUseCase(
    new SupabaseActivityRepository(),
    new SnowflakeCommunityRepository()
  ).execute(userId);
  return ok(data);
});
