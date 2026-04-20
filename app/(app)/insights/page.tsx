import { BackboardChat } from "@/components/insights/BackboardChat";
import { getOrCreateBackboardThread } from "@/app/(app)/actions";
import { TipCard } from "@/components/insights/TipCard";
import { WeeklySummary } from "@/components/insights/WeeklySummary";
import { WhatIfScenario } from "@/components/insights/WhatIfScenario";
import { GetAIInsightsUseCase } from "@/src/application/use-cases/GetAIInsightsUseCase";
import { BackboardAIService } from "@/src/infrastructure/backboard/AIService";
import { auth0 } from "@/src/infrastructure/auth0/client";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    redirect("/login");
  }

  const userId = session.user.sub;

  let threadId: string | undefined;
  try {
    threadId = await getOrCreateBackboardThread(userId);
  } catch (error) {
    console.warn("[insights] unable to get backboard thread; chat will be disabled", error);
  }

  const insights = await new GetAIInsightsUseCase(
    new SupabaseActivityRepository(),
    new BackboardAIService()
  ).execute(userId, threadId);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-6">
        <WeeklySummary summary={insights.summary} />
        <TipCard tip={insights.tip} />
        <WhatIfScenario />
      </div>
      {threadId ? (
        <BackboardChat threadId={threadId} />
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-elevated p-5 text-sm text-muted">
          Persistent AI chat is temporarily unavailable. Your insights above are shown in fallback mode.
        </div>
      )}
    </div>
  );
}
