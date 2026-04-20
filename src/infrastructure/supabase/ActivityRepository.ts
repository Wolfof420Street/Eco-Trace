import type {
  ActivityFilters,
  CategoryBreakdown,
  CreateActivityRecord,
  DailyTotal,
  IActivityRepository
} from "@/src/domain/interfaces/IActivityRepository";
import type { Activity } from "@/src/domain/entities/Activity";
import { generateId } from "@/src/domain/utils/id";
import { daysAgo, formatShortDate, startOfDay } from "@/src/domain/utils/date-utils";
import { createSupabaseAdminClient } from "@/src/infrastructure/supabase/server";

export class SupabaseActivityRepository implements IActivityRepository {
  async create(input: CreateActivityRecord): Promise<Activity> {
    throw new Error("Not implemented: Use Supabase for activity creation");
  }

  async findMany(filters: ActivityFilters): Promise<Activity[]> {
    throw new Error("Not implemented: Use Supabase for activity queries");
  }

  async findById(id: string): Promise<Activity | null> {
    throw new Error("Not implemented: Use Supabase for activity lookup");
  }

  async delete(id: string, userId: string): Promise<void> {
    throw new Error("Not implemented: Use Supabase for activity deletion");
  }

  async getDailyTotals(userId: string, days: number): Promise<DailyTotal[]> {
    throw new Error("Not implemented: Use Supabase for daily totals");
  }

  async getCategoryBreakdown(userId: string, days: number): Promise<CategoryBreakdown[]> {
    throw new Error("Not implemented: Use Supabase for category breakdown");
  }
}
