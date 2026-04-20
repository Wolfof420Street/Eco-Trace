import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CarbonScoreRing } from "@/components/dashboard/CarbonScoreRing";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { CommunityBenchmark } from "@/components/dashboard/CommunityBenchmark";
import { DailyAITip } from "@/components/dashboard/DailyAITip";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { GetDashboardDataUseCase } from "@/src/application/use-cases/GetDashboardDataUseCase";
import { GetAIInsightsUseCase } from "@/src/application/use-cases/GetAIInsightsUseCase";
import { BackboardAIService } from "@/src/infrastructure/backboard/AIService";
import { auth0 } from "@/src/infrastructure/auth0/client";
import { SnowflakeCommunityRepository } from "@/src/infrastructure/snowflake/CommunityRepository";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";
import { getOrCreateBackboardThread } from "@/app/(app)/actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    redirect("/login");
  }

  const userId = session.user.sub;
  const dashboard = await new GetDashboardDataUseCase(
    new SupabaseActivityRepository(),
    new SnowflakeCommunityRepository()
  ).execute(userId);

  let threadId: string | undefined;
  try {
    threadId = await getOrCreateBackboardThread(userId);
  } catch (error) {
    console.warn("[dashboard] unable to get backboard thread; using fallback insights", error);
  }

  const insights = await new GetAIInsightsUseCase(
    new SupabaseActivityRepository(),
    new BackboardAIService()
  ).execute(userId, threadId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-muted">Dashboard</div>
          <h1 className="mt-2 font-display text-4xl text-text">Your carbon week at a glance</h1>
        </div>
        <QuickActions />
      </div>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <CarbonScoreRing score={dashboard.score} todayKg={dashboard.todayKg} avgKg={dashboard.averageKg} />
        <WeeklyChart data={dashboard.dailyTotals} />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <CategoryBreakdown data={dashboard.categoryBreakdown} />
        <CommunityBenchmark
          percentile={dashboard.community.percentile}
          avgCO2Today={dashboard.community.avgCO2Today}
          userCO2Today={dashboard.todayKg}
          userCount={dashboard.community.userCount}
        />
        <DailyAITip tip={insights.tip} />
      </div>
      <ActivityFeed activities={dashboard.recentActivities} />
    </div>
  );
}
