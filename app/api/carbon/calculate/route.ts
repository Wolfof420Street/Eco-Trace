import { ok, err } from "@/app/api/_helpers/response";
import { SnowflakeEmissionFactorRepository } from "@/src/infrastructure/snowflake/EmissionFactorRepository";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const category = body?.category as string | undefined;
  const subcategory = body?.subcategory as string | undefined;
  const quantity = Number(body?.quantity);

  if (!category || !subcategory || Number.isNaN(quantity)) {
    return err("Invalid input", "INVALID_INPUT", 400);
  }

  const factor = await new SnowflakeEmissionFactorRepository().getById(`${category}_${subcategory}`);
  if (!factor) {
    return err("Unknown emission factor", "UNKNOWN_FACTOR", 404);
  }

  return ok({
    factor,
    co2Kg: Number((factor.factor * quantity).toFixed(2))
  });
}
