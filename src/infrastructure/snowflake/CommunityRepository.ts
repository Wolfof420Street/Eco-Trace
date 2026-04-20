import type { CommunityStats, ICommunityRepository } from "@/src/domain/interfaces/ICommunityRepository";
import { querySnowflake } from "@/src/infrastructure/snowflake/connection";

type PercentileRow = {
  AVG_CO2_TODAY: number | null;
  USER_COUNT: number | null;
  PERCENTILE: number | null;
};

function getCommunityTable() {
  return process.env.SNOWFLAKE_COMMUNITY_TOTALS_TABLE ?? "COMMUNITY_DAILY_TOTALS";
}

export class SnowflakeCommunityRepository implements ICommunityRepository {
  async recordDailyTotal(co2Kg: number, region?: string, breakdown?: Record<string, number>): Promise<void> {
    const table = getCommunityTable();
    const serializedBreakdown = breakdown ? JSON.stringify(breakdown) : null;
    const value = Number(co2Kg.toFixed(2));

    if (serializedBreakdown) {
      await querySnowflake(
        `INSERT INTO ${table} (CO2_KG, LOG_DATE, REGION, CATEGORY_BREAKDOWN)
         SELECT ?, CURRENT_DATE(), ?, PARSE_JSON(?)`,
        [value, region ?? null, serializedBreakdown]
      );
      return;
    }

    await querySnowflake(
      `INSERT INTO ${table} (CO2_KG, LOG_DATE, REGION)
       VALUES (?, CURRENT_DATE(), ?)`,
      [value, region ?? null]
    );
  }

  async getPercentile(co2Kg: number, date: Date = new Date()): Promise<CommunityStats> {
    const table = getCommunityTable();
    const dateIso = date.toISOString();
    const rows = await querySnowflake<PercentileRow>(
      `SELECT
         AVG(CO2_KG) AS AVG_CO2_TODAY,
         COUNT(*) AS USER_COUNT,
         COALESCE((100.0 * SUM(IFF(CO2_KG > ?, 1, 0)) / NULLIF(COUNT(*), 0)), 50) AS PERCENTILE
       FROM ${table}
       WHERE LOG_DATE = TO_DATE(?)`,
      [co2Kg, dateIso]
    );

    const row = rows[0];
    if (!row) {
      return {
        percentile: 50,
        avgCO2Today: 0,
        userCount: 0
      };
    }

    return {
      percentile: Number((row.PERCENTILE ?? 50).toFixed(1)),
      avgCO2Today: Number((row.AVG_CO2_TODAY ?? 0).toFixed(2)),
      userCount: row.USER_COUNT ?? 0
    };
  }
}
