import type { CO2Amount } from "@/src/domain/value-objects/CO2Amount";

export type ActivityCategory = "transport" | "food" | "energy" | "goods";
export type ActivitySource = "manual" | "agent_scan";

export type Activity = {
  readonly id: string;
  readonly userId: string;
  readonly category: ActivityCategory;
  readonly subcategory: string;
  readonly quantity: number;
  readonly unit: string;
  readonly co2: CO2Amount;
  readonly notes?: string;
  readonly source: ActivitySource;
  readonly loggedAt: Date;
  readonly createdAt: Date;
};
