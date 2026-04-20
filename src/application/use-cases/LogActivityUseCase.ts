import type { Activity } from "@/src/domain/entities/Activity";
import type { IBadgeRepository } from "@/src/domain/interfaces/IBadgeRepository";
import type { ICommunityRepository } from "@/src/domain/interfaces/ICommunityRepository";
import type { IEmissionFactorRepository } from "@/src/domain/interfaces/IEmissionFactorRepository";
import type { IActivityRepository } from "@/src/domain/interfaces/IActivityRepository";
import type { CreateActivityInput } from "@/src/domain/schemas/activity.schema";
import { createCO2Amount } from "@/src/domain/value-objects/CO2Amount";
import { CheckMilestonesUseCase } from "@/src/application/use-cases/CheckMilestonesUseCase";

export type LogActivityResult = {
  activity: Activity;
  newBadges: string[];
};

export type LogActivityOptions = {
  source?: Activity["source"];
};

export class LogActivityUseCase {
  constructor(
    private readonly activities: IActivityRepository,
    private readonly factors: IEmissionFactorRepository,
    private readonly community: ICommunityRepository,
    private readonly badges: IBadgeRepository
  ) {}

  async execute(userId: string, input: CreateActivityInput, options: LogActivityOptions = {}): Promise<LogActivityResult> {
    const factor = await this.factors.getById(`${input.category}_${input.subcategory}`);
    if (!factor) {
      throw new Error(`Unknown emission factor: ${input.category}_${input.subcategory}`);
    }

    const co2Kg = input.quantity * factor.factor;
    const activity = await this.activities.create({
      userId,
      category: input.category,
      subcategory: input.subcategory,
      quantity: input.quantity,
      unit: factor.unit,
      co2: createCO2Amount(co2Kg),
      notes: input.notes,
      source: options.source ?? "manual",
      loggedAt: input.loggedAt ? new Date(input.loggedAt) : new Date()
    });

    await this.community.recordDailyTotal(co2Kg);
    const newBadges = await new CheckMilestonesUseCase(this.activities, this.badges).execute(userId);

    return { activity, newBadges };
  }
}
