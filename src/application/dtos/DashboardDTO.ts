import type { ActivityDTO } from "@/src/application/dtos/ActivityDTO";

export type DashboardDTO = {
  todayKg: number;
  weeklyTotalKg: number;
  averageKg: number;
  score: number;
  dailyTotals: Array<{ date: string; co2Kg: number }>;
  categoryBreakdown: Array<{ category: string; co2Kg: number }>;
  recentActivities: ActivityDTO[];
  community: {
    percentile: number;
    avgCO2Today: number;
    userCount: number;
  };
};
