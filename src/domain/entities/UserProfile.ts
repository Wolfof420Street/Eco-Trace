export type UserProfile = {
  readonly id: string;
  readonly username?: string;
  readonly avatarUrl?: string;
  readonly streakDays: number;
  readonly longestStreak: number;
  readonly totalCO2Kg: number;
  readonly onboarded: boolean;
  readonly region?: string;
  readonly backboardThreadId?: string;
  readonly createdAt: Date;
};
