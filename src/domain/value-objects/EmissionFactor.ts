import type { ActivityCategory } from "@/src/domain/entities/Activity";

export type EmissionFactor = {
  readonly id: string;
  readonly category: ActivityCategory;
  readonly subcategory: string;
  readonly factor: number;
  readonly unit: string;
  readonly label: string;
  readonly source?: string;
};
