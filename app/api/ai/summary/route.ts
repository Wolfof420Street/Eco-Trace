import type { NextRequest } from "next/server";
import { ok } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { GetAIInsightsUseCase } from "@/src/application/use-cases/GetAIInsightsUseCase";
import { BackboardAIService } from "@/src/infrastructure/backboard/AIService";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";
import { getOrCreateBackboardThread } from "@/app/(app)/actions";

export const dynamic = "force-dynamic";

export const GET = withAuth(async (_req: NextRequest, userId: string) => {
  const threadId = await getOrCreateBackboardThread(userId);
  const insights = await new GetAIInsightsUseCase(
    new SupabaseActivityRepository(),
    new BackboardAIService()
  ).execute(userId, threadId);
  return ok({ summary: insights.summary });
});
