import type { Activity, ActivityCategory } from "@/src/domain/entities/Activity";

export type CreateActivityRecord = Omit<Activity, "id" | "createdAt">;
export type DailyTotal = { date: string; co2Kg: number };
export type CategoryBreakdown = { category: ActivityCategory; co2Kg: number };

export type ActivityFilters = {
  userId: string;
  from?: Date;
  to?: Date;
  category?: ActivityCategory;
  limit?: number;
};

export interface IActivityRepository {
  create(input: CreateActivityRecord): Promise<Activity>;
  findMany(filters: ActivityFilters): Promise<Activity[]>;
  findById(id: string): Promise<Activity | null>;
  delete(id: string, userId: string): Promise<void>;
  getDailyTotals(userId: string, days: number): Promise<DailyTotal[]>;
  getCategoryBreakdown(userId: string, days: number): Promise<CategoryBreakdown[]>;
}
