import type { UserBadge } from "@/src/domain/entities/Badge";
import type { CreateUserBadgeInput, IBadgeRepository } from "@/src/domain/interfaces/IBadgeRepository";
import { BADGE_DEFINITIONS } from "@/src/domain/constants/badge-definitions";
import { generateId } from "@/src/domain/utils/id";
import { createSupabaseAdminClient } from "@/src/infrastructure/supabase/server";

export class SupabaseBadgeRepository implements IBadgeRepository {
  async findByUserId(userId: string): Promise<UserBadge[]> {
    throw new Error("Not implemented: Use Supabase queries");
  }

  async create(input: CreateUserBadgeInput): Promise<UserBadge> {
    const definition = BADGE_DEFINITIONS.find((badge) => badge.id === input.badgeId);
    if (!definition) {
      throw new Error(`Unknown badge: ${input.badgeId}`);
    }
    throw new Error("Not implemented: Use Supabase for badge creation");
  }

  async markMinted(userId: string, badgeId: string, mintAddress: string, txSignature: string): Promise<UserBadge> {
    throw new Error("Not implemented: Use Supabase for badge updates");
  }
}
