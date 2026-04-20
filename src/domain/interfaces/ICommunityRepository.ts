export type CommunityStats = {
  percentile: number;
  avgCO2Today: number;
  userCount: number;
};

export interface ICommunityRepository {
  recordDailyTotal(co2Kg: number, region?: string, breakdown?: Record<string, number>): Promise<void>;
  getPercentile(co2Kg: number, date?: Date): Promise<CommunityStats>;
}
