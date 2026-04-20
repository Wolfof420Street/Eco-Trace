import type { NextRequest } from "next/server";
import { ok } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";

export const DELETE = withAuth(async (_req: NextRequest, userId: string, context?: any) => {
  const id = context?.params?.id;
  if (id) {
    await new SupabaseActivityRepository().delete(id, userId);
  }
  return ok({ deleted: true });
});
