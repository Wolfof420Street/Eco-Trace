export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type BadgeState = "locked" | "earned" | "minted";

export type BadgeMetric =
  | "first_log"
  | "daily_co2_kg"
  | "streak_days"
  | "meat_free_days"
  | "week_reduction_pct"
  | "total_logs";

export type BadgeThreshold = {
  readonly metric: BadgeMetric;
  readonly value: number;
  readonly operator: "lt" | "lte" | "gt" | "gte" | "eq";
};

export type BadgeDefinition = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly rarity: BadgeRarity;
  readonly artwork: string;
  readonly threshold: BadgeThreshold | null;
};

export type UserBadge = {
  readonly id: string;
  readonly userId: string;
  readonly badgeId: string;
  readonly definition: BadgeDefinition;
  readonly state: BadgeState;
  readonly earnedAt: Date;
  readonly solanaMintAddress?: string;
  readonly solanaTxSignature?: string;
};
