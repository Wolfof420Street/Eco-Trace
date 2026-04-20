import type { NextRequest } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { err, ok } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { MintBadgeUseCase } from "@/src/application/use-cases/MintBadgeUseCase";
import { CheckMilestonesUseCase } from "@/src/application/use-cases/CheckMilestonesUseCase";
import { SupabaseBadgeRepository } from "@/src/infrastructure/supabase/BadgeRepository";
import { SupabaseActivityRepository } from "@/src/infrastructure/supabase/ActivityRepository";

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const body = await req.json().catch(() => null);
  if (!body?.badgeId || !body?.wallet) {
    return err("badgeId and wallet are required", "INVALID_INPUT", 400);
  }

  try {
    new PublicKey(body.wallet);
  } catch {
    return err("Invalid Solana wallet address", "INVALID_WALLET", 400);
  }

  const repo = new SupabaseBadgeRepository();
  await new CheckMilestonesUseCase(new SupabaseActivityRepository(), repo).execute(userId);
  const userBadges = await repo.findByUserId(userId);
  const existing = userBadges.find((badge) => badge.badgeId === body.badgeId);
  if (!existing) {
    return err("Badge not earned by this user", "BADGE_NOT_OWNED", 404);
  }
  if (existing.state === "minted") {
    return err("Badge already minted", "BADGE_ALREADY_MINTED", 400);
  }

  const result = await new MintBadgeUseCase(new SupabaseBadgeRepository()).execute(
    userId,
    body.badgeId,
    body.wallet
  );
  return ok(result);
});
