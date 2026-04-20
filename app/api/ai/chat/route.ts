import type { NextRequest } from "next/server";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { err } from "@/app/api/_helpers/response";
import { ChatRequestSchema } from "@/src/domain/schemas/chat.schema";
import { BackboardAIService } from "@/src/infrastructure/backboard/AIService";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";
import { ProfileRepository } from "@/src/infrastructure/supabase/ProfileRepository";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isTimeoutError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  const withCause = error as Error & { cause?: { code?: string; message?: string } };
  const causeCode = (withCause.cause?.code ?? "").toLowerCase();
  const causeMessage = (withCause.cause?.message ?? "").toLowerCase();

  return (
    message.includes("timeout") ||
    message.includes("timed out") ||
    causeCode.includes("etimedout") ||
    causeMessage.includes("timed out") ||
    causeMessage.includes("aggregateerror")
  );
}

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const body = await req.json().catch(() => null);
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid input", { status: 400 });
  }

  const repo = new SupabaseActivityRepository();
  const [recentActivities, dailyTotals] = await Promise.all([
    repo.findMany({ userId, limit: 5 }),
    repo.getDailyTotals(userId, 7)
  ]);
  const profile = await new ProfileRepository().getById(userId);
  if (!profile?.backboardThreadId || profile.backboardThreadId !== parsed.data.threadId) {
    return err("Thread ID does not match stored profile thread", "INVALID_THREAD", 400);
  }
  if (!isUuid(parsed.data.threadId)) {
    return err("Thread ID does not match stored profile thread", "INVALID_THREAD", 400);
  }
  const weeklyTotalCO2 = dailyTotals.reduce((sum, day) => sum + day.co2Kg, 0);
  const topCategory =
    Object.entries(
      recentActivities.reduce<Record<string, number>>((accumulator, activity) => {
        accumulator[activity.category] = (accumulator[activity.category] ?? 0) + activity.co2.kg;
        return accumulator;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "transport";
  let stream: ReadableStream<Uint8Array>;
  try {
    stream = await new BackboardAIService().chat(parsed.data.threadId, parsed.data.message, {
      userId,
      threadId: parsed.data.threadId,
      weeklyTotalCO2,
      topCategory,
      recentActivities: recentActivities.map((activity) => ({
        category: activity.category,
        co2Kg: activity.co2.kg
      }))
    });
  } catch (error) {
    console.warn("[api/ai/chat] Backboard request failed", error);

    if (isTimeoutError(error)) {
      return err("AI service timed out. Please try again in a moment.", "AI_TIMEOUT", 503);
    }

    return err("AI service is temporarily unavailable.", "AI_UNAVAILABLE", 503);
  }

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
});
