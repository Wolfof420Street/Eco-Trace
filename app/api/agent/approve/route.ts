import type { NextRequest } from "next/server";
import { err, ok } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { LogActivityUseCase } from "@/src/application/use-cases/LogActivityUseCase";
import { SnowflakeCommunityRepository } from "@/src/infrastructure/snowflake/CommunityRepository";
import { SnowflakeEmissionFactorRepository } from "@/src/infrastructure/snowflake/EmissionFactorRepository";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";
import { SupabaseBadgeRepository } from "@/src/infrastructure/supabase/BadgeRepository";

type ApproveBody = {
  items?: Array<{
    estimatedCategory: "transport" | "food" | "energy" | "goods";
    estimatedSubcategory: string;
    estimatedQuantity?: number;
    title?: string;
  }>;
};

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const body = (await req.json().catch(() => null)) as ApproveBody | null;
  const items = body?.items ?? [];
  if (!items.length) {
    return err("No approved items were provided", "INVALID_INPUT", 400);
  }

  const useCase = new LogActivityUseCase(
    new SupabaseActivityRepository(),
    new SnowflakeEmissionFactorRepository(),
    new SnowflakeCommunityRepository(),
    new SupabaseBadgeRepository()
  );

  const created = [];
  for (const item of items) {
    created.push(
      await useCase.execute(
        userId,
        {
          category: item.estimatedCategory,
          subcategory: item.estimatedSubcategory,
          quantity: item.estimatedQuantity && item.estimatedQuantity > 0 ? item.estimatedQuantity : 1,
          notes: item.title
        },
        { source: "agent_scan" }
      )
    );
  }

  return ok({
    createdCount: created.length
  });
});
