import type { ActivityCategory } from "@/src/domain/entities/Activity";
import type { IEmissionFactorRepository } from "@/src/domain/interfaces/IEmissionFactorRepository";
import type { EmissionFactor } from "@/src/domain/value-objects/EmissionFactor";
import { querySnowflake } from "@/src/infrastructure/snowflake/connection";

type EmissionFactorRow = {
  ID?: string;
  CATEGORY: string;
  SUBCATEGORY: string;
  FACTOR: number;
  UNIT: string;
  LABEL: string;
  SOURCE?: string | null;
};

const VALID_CATEGORIES = new Set<ActivityCategory>(["transport", "food", "energy", "goods"]);

function getEmissionFactorTable() {
  return process.env.SNOWFLAKE_EMISSION_FACTORS_TABLE ?? "EMISSION_FACTORS";
}

function mapRow(row: EmissionFactorRow): EmissionFactor {
  const category = row.CATEGORY.toLowerCase() as ActivityCategory;
  if (!VALID_CATEGORIES.has(category)) {
    throw new Error(`Unexpected emission factor category from Snowflake: ${row.CATEGORY}`);
  }

  const subcategory = row.SUBCATEGORY.toLowerCase();

  return {
    id: row.ID ?? `${category}_${subcategory}`,
    category,
    subcategory,
    factor: Number(row.FACTOR),
    unit: row.UNIT,
    label: row.LABEL,
    source: row.SOURCE ?? undefined
  };
}

export class SnowflakeEmissionFactorRepository implements IEmissionFactorRepository {
  async getAll(): Promise<EmissionFactor[]> {
    const table = getEmissionFactorTable();
    const rows = await querySnowflake<EmissionFactorRow>(
      `SELECT ID, CATEGORY, SUBCATEGORY, FACTOR, UNIT, LABEL, SOURCE FROM ${table}`
    );

    return rows.map(mapRow);
  }

  async getByCategory(category: ActivityCategory): Promise<EmissionFactor[]> {
    const table = getEmissionFactorTable();
    const rows = await querySnowflake<EmissionFactorRow>(
      `SELECT ID, CATEGORY, SUBCATEGORY, FACTOR, UNIT, LABEL, SOURCE FROM ${table} WHERE LOWER(CATEGORY) = ?`,
      [category]
    );

    return rows.map(mapRow);
  }

  async getById(id: string): Promise<EmissionFactor | null> {
    const table = getEmissionFactorTable();
    const normalizedId = id.toLowerCase();
    const rows = await querySnowflake<EmissionFactorRow>(
      `SELECT ID, CATEGORY, SUBCATEGORY, FACTOR, UNIT, LABEL, SOURCE FROM ${table} WHERE LOWER(CONCAT(CATEGORY, '_', SUBCATEGORY)) = ? OR LOWER(ID) = ? LIMIT 1`,
      [normalizedId, normalizedId]
    );

    return rows.length ? mapRow(rows[0]) : null;
  }
}
