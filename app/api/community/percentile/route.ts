import type { NextRequest } from "next/server";
import { err, ok } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { GetCommunityPercentileUseCase } from "@/src/application/use-cases/GetCommunityPercentileUseCase";
import { SnowflakeCommunityRepository } from "@/src/infrastructure/snowflake/CommunityRepository";

export const GET = withAuth(async (req: NextRequest) => {
  const co2Kg = Number(new URL(req.url).searchParams.get("co2"));
  if (Number.isNaN(co2Kg)) {
    return err("Invalid co2 parameter", "INVALID_INPUT", 400);
  }
  const data = await new GetCommunityPercentileUseCase(new SnowflakeCommunityRepository()).execute(co2Kg);
  return ok(data);
});
