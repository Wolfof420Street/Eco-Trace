import type { DashboardDTO } from "@/src/application/dtos/DashboardDTO";
import type { IActivityRepository } from "@/src/domain/interfaces/IActivityRepository";
import type { ICommunityRepository } from "@/src/domain/interfaces/ICommunityRepository";
import { mapActivityToDTO } from "@/src/presentation/mappers/activity.mapper";

export class GetDashboardDataUseCase {
  constructor(
    private readonly activities: IActivityRepository,
    private readonly community: ICommunityRepository
  ) {}

  async execute(userId: string): Promise<DashboardDTO> {
    const [recentActivities, dailyTotals, categoryBreakdown] = await Promise.all([
      this.activities.findMany({ userId, limit: 10 }),
      this.activities.getDailyTotals(userId, 7),
      this.activities.getCategoryBreakdown(userId, 7)
    ]);

    const todayKg = dailyTotals[dailyTotals.length - 1]?.co2Kg ?? 0;
    const weeklyTotalKg = dailyTotals.reduce((sum, day) => sum + day.co2Kg, 0);
    const averageKg = weeklyTotalKg / Math.max(dailyTotals.length, 1);
    const community = await this.community.getPercentile(todayKg);
    const score = Math.max(0, Math.min(100, Math.round((todayKg / 25) * 100)));

    return {
      todayKg: Number(todayKg.toFixed(2)),
      weeklyTotalKg: Number(weeklyTotalKg.toFixed(2)),
      averageKg: Number(averageKg.toFixed(2)),
      score,
      dailyTotals,
      categoryBreakdown,
      recentActivities: recentActivities.map(mapActivityToDTO),
      community
    };
  }
}
