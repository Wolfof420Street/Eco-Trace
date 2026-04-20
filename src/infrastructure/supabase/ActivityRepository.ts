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
import { createCO2Amount } from "@/src/domain/value-objects/CO2Amount";

export class SupabaseActivityRepository implements IActivityRepository {
  private get db() {
    return createSupabaseAdminClient();
  }

  async create(input: CreateActivityRecord): Promise<Activity> {
    const { data, error } = await this.db
      .from("activities")
      .insert({
        id: generateId(),
        user_id: input.userId,
        category: input.category,
        subcategory: input.subcategory,
        quantity: input.quantity,
        unit: input.unit,
        co2_kg: input.co2.kg,
        notes: input.notes,
        source: input.source,
        logged_at: input.loggedAt.toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRow(data);
  }

  async findMany(filters: ActivityFilters): Promise<Activity[]> {
    let query = this.db
      .from("activities")
      .select("*")
      .eq("user_id", filters.userId)
      .order("logged_at", { ascending: false });

    if (filters.from) query = query.gte("logged_at", filters.from.toISOString());
    if (filters.to) query = query.lte("logged_at", filters.to.toISOString());
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map((row) => this.mapRow(row));
  }

  async findById(id: string): Promise<Activity | null> {
    const { data, error } = await this.db
      .from("activities")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data ? this.mapRow(data) : null;
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.db
      .from("activities")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  }

  async getDailyTotals(userId: string, days: number): Promise<DailyTotal[]> {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const { data, error } = await this.db
      .from("activities")
      .select("logged_at, co2_kg")
      .eq("user_id", userId)
      .gte("logged_at", from.toISOString());

    if (error) throw new Error(error.message);

    const totals: Record<string, number> = {};
    for (const row of data || []) {
      const date = formatShortDate(new Date(row.logged_at));
      totals[date] = (totals[date] ?? 0) + Number(row.co2_kg);
    }

    return Object.entries(totals)
      .map(([date, co2Kg]) => ({
        date,
        co2Kg
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getCategoryBreakdown(userId: string, days: number): Promise<CategoryBreakdown[]> {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const { data, error } = await this.db
      .from("activities")
      .select("category, co2_kg")
      .eq("user_id", userId)
      .gte("logged_at", from.toISOString());

    if (error) throw new Error(error.message);

    const totals: Record<string, number> = {};
    for (const row of data || []) {
      totals[row.category] = (totals[row.category] ?? 0) + Number(row.co2_kg);
    }

    return Object.entries(totals).map(([category, co2Kg]) => ({
      category: category as any,
      co2Kg
    }));
  }

  private mapRow(row: any): Activity {
    return {
      id: row.id,
      userId: row.user_id,
      category: row.category,
      subcategory: row.subcategory,
      quantity: Number(row.quantity),
      unit: row.unit,
      co2: createCO2Amount(Number(row.co2_kg)),
      notes: row.notes ?? undefined,
      source: row.source,
      loggedAt: new Date(row.logged_at),
      createdAt: new Date(row.created_at)
    };
  }
}
