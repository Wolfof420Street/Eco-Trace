import "dotenv/config";
import { SnowflakeCommunityRepository } from "../src/infrastructure/snowflake/CommunityRepository";
import { SnowflakeEmissionFactorRepository } from "../src/infrastructure/snowflake/EmissionFactorRepository";

async function main() {
  const factorsRepo = new SnowflakeEmissionFactorRepository();
  const communityRepo = new SnowflakeCommunityRepository();

  const allFactors = await factorsRepo.getAll();
  if (!allFactors.length) {
    throw new Error("Snowflake returned zero emission factors.");
  }

  const transport = await factorsRepo.getByCategory("transport");
  if (!transport.length) {
    throw new Error("No transport factors found in Snowflake.");
  }

  const sampleId = `${transport[0].category}_${transport[0].subcategory}`;
  const byId = await factorsRepo.getById(sampleId);
  if (!byId) {
    throw new Error(`Could not read factor by id: ${sampleId}`);
  }

  await communityRepo.recordDailyTotal(1.23, "smoke", { transport: 1.23 });
  const percentile = await communityRepo.getPercentile(1.23);

  if (Number.isNaN(percentile.percentile) || Number.isNaN(percentile.avgCO2Today)) {
    throw new Error("Community percentile query returned invalid numeric values.");
  }

  console.log("Snowflake repository smoke test passed.");
  console.log(`factors=${allFactors.length} transport=${transport.length} percentile=${percentile.percentile}`);
}

main().catch((error) => {
  console.error("Snowflake repository smoke test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
