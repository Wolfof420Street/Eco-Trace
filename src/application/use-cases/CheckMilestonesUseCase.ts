import type { IActivityRepository } from "@/src/domain/interfaces/IActivityRepository";
import type { IBadgeRepository } from "@/src/domain/interfaces/IBadgeRepository";
import { BADGE_DEFINITIONS } from "@/src/domain/constants/badge-definitions";

export class CheckMilestonesUseCase {
  constructor(
    private readonly activities: IActivityRepository,
    private readonly badges: IBadgeRepository
  ) {}

  async execute(userId: string): Promise<string[]> {
    const [allActivities, earnedBadges, dailyTotals] = await Promise.all([
      this.activities.findMany({ userId, limit: 1000 }),
      this.badges.findByUserId(userId),
      this.activities.getDailyTotals(userId, 30)
    ]);

    const earnedIds = new Set(earnedBadges.map((badge) => badge.badgeId));
    const newlyEarned: string[] = [];
    const streak = this.calculateStreak(dailyTotals);
    const latestDay = dailyTotals[dailyTotals.length - 1]?.co2Kg ?? 0;
    const meatFreeDays = allActivities.some(
      (activity) => activity.category === "food" && activity.subcategory === "plant_protein"
    )
      ? 1
      : 0;

    for (const definition of BADGE_DEFINITIONS) {
      if (earnedIds.has(definition.id)) continue;
      const threshold = definition.threshold;
      if (!threshold) continue;

      let metricValue = 0;
      switch (threshold.metric) {
        case "first_log":
        case "total_logs":
          metricValue = allActivities.length;
          break;
        case "streak_days":
          metricValue = streak;
          break;
        case "daily_co2_kg":
          metricValue = latestDay;
          break;
        case "meat_free_days":
          metricValue = meatFreeDays;
          break;
        default:
          metricValue = 0;
      }

      if (this.compare(metricValue, threshold.value, threshold.operator)) {
        await this.badges.create({ userId, badgeId: definition.id });
        newlyEarned.push(definition.id);
      }
    }

    return newlyEarned;
  }

  private calculateStreak(dailyTotals: Array<{ date: string; co2Kg: number }>) {
    let streak = 0;
    for (let index = dailyTotals.length - 1; index >= 0; index -= 1) {
      if (dailyTotals[index].co2Kg <= 0) break;
      streak += 1;
    }
    return streak;
  }

  private compare(a: number, b: number, op: string): boolean {
    if (op === "lt") return a < b;
    if (op === "lte") return a <= b;
    if (op === "gt") return a > b;
    if (op === "gte") return a >= b;
    if (op === "eq") return a === b;
    return false;
  }
}
