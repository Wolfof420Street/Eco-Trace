import { BadgeGrid } from "@/components/badges/BadgeGrid";
import { WalletConnect } from "@/components/badges/WalletConnect";
import type { BadgeDTO } from "@/src/application/dtos/BadgeDTO";
import { BADGE_DEFINITIONS } from "@/src/domain/constants/badge-definitions";
import { auth0 } from "@/src/infrastructure/auth0/client";
import { SupabaseBadgeRepository } from "@/src/infrastructure/supabase/BadgeRepository";
import { mapUserBadgeToDTO } from "@/src/presentation/mappers/badge.mapper";
import { redirect } from "next/navigation";

export default async function BadgesPage() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    redirect("/login");
  }

  const userId = session.user.sub;
  const earned = await new SupabaseBadgeRepository().findByUserId(userId);
  const earnedMap = new Map(earned.map((badge) => [badge.badgeId, mapUserBadgeToDTO(badge)]));

  const badges: BadgeDTO[] = BADGE_DEFINITIONS.map((definition) => {
    const existing = earnedMap.get(definition.id);
    return (
      existing ?? {
        id: definition.id,
        name: definition.name,
        description: definition.description,
        rarity: definition.rarity,
        state: "locked",
        artwork: definition.artwork
      }
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-muted">Eco Badges</div>
          <h1 className="mt-2 font-display text-4xl text-text">Milestones you can mint</h1>
        </div>
        <WalletConnect />
      </div>
      <BadgeGrid badges={badges} />
    </div>
  );
}
