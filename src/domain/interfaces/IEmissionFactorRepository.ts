import type { ActivityCategory } from "@/src/domain/entities/Activity";
import type { EmissionFactor } from "@/src/domain/value-objects/EmissionFactor";

export interface IEmissionFactorRepository {
  getAll(): Promise<EmissionFactor[]>;
  getByCategory(category: ActivityCategory): Promise<EmissionFactor[]>;
  getById(id: string): Promise<EmissionFactor | null>;
}
