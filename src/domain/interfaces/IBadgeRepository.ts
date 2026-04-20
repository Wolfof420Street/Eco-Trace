import type { UserBadge } from "@/src/domain/entities/Badge";

export type CreateUserBadgeInput = {
  userId: string;
  badgeId: string;
};

export interface IBadgeRepository {
  findByUserId(userId: string): Promise<UserBadge[]>;
  create(input: CreateUserBadgeInput): Promise<UserBadge>;
  markMinted(userId: string, badgeId: string, mintAddress: string, txSignature: string): Promise<UserBadge>;
}
