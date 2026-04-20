import type { NextRequest } from "next/server";
import { ok } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { BADGE_DEFINITIONS } from "@/src/domain/constants/badge-definitions";
import { SupabaseBadgeRepository } from "@/src/infrastructure/supabase/BadgeRepository";
import { mapUserBadgeToDTO } from "@/src/presentation/mappers/badge.mapper";

export const GET = withAuth(async (_req: NextRequest, userId: string) => {
  const earned = await new SupabaseBadgeRepository().findByUserId(userId);
  const earnedMap = new Map(earned.map((badge) => [badge.badgeId, mapUserBadgeToDTO(badge)]));
  const badges = BADGE_DEFINITIONS.map((definition) => earnedMap.get(definition.id) ?? {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    rarity: definition.rarity,
    state: "locked",
    artwork: definition.artwork
  });
  return ok(badges);
});
