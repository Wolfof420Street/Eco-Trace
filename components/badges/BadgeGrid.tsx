"use client";

import { useState } from "react";
import { BadgeCard } from "@/components/badges/BadgeCard";
import { MintFlow } from "@/components/badges/MintFlow";

export function BadgeGrid({
  badges
}: {
  badges: Array<{ id: string; name: string; description: string; rarity: string; state: string; mintedLink?: string }>;
}) {
  const [activeBadgeId, setActiveBadgeId] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} onMint={setActiveBadgeId} />
        ))}
      </div>
      <MintFlow badgeId={activeBadgeId} onClose={() => setActiveBadgeId(null)} />
    </>
  );
}
