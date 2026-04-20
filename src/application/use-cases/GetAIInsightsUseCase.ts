import type { InsightDTO } from "@/src/application/dtos/InsightDTO";
import type { IAIService } from "@/src/domain/interfaces/IAIService";
import type { IActivityRepository } from "@/src/domain/interfaces/IActivityRepository";

export class GetAIInsightsUseCase {
  constructor(
    private readonly activities: IActivityRepository,
    private readonly ai: IAIService
  ) {}

  async execute(userId: string, threadId?: string): Promise<InsightDTO> {
    const [recentActivities, dailyTotals] = await Promise.all([
      this.activities.findMany({ userId, limit: 5 }),
      this.activities.getDailyTotals(userId, 7)
    ]);
    const weeklyTotalCO2 = dailyTotals.reduce((sum, day) => sum + day.co2Kg, 0);
    const byCategory = recentActivities.reduce<Record<string, number>>((acc, activity) => {
      acc[activity.category] = (acc[activity.category] ?? 0) + activity.co2.kg;
      return acc;
    }, {});
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "transport";
    const context = {
      userId,
      threadId: threadId ?? "",
      weeklyTotalCO2,
      topCategory,
      recentActivities: recentActivities.map((activity) => ({
        category: activity.category,
        co2Kg: activity.co2.kg
      }))
    };

    const fallback: InsightDTO = {
      tip: `Focus on ${topCategory}: replace one high-impact action today with a lower-carbon option.`,
      summary: `You emitted ${weeklyTotalCO2.toFixed(1)} kg CO2 this week. Your highest-impact category was ${topCategory}.`
    };

    const isUuid = typeof threadId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(threadId);
    if (!isUuid) {
      return fallback;
    }

    try {
      const [tip, summary] = await Promise.all([
        this.ai.generateTip(context),
        this.ai.generateWeeklySummary(context)
      ]);

      return { tip, summary };
    } catch {
      return fallback;
    }
  }
}
