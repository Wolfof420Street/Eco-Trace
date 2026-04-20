"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function BadgeCard({
  badge,
  onMint
}: {
  badge: { id: string; name: string; description: string; rarity: string; state: string; mintedLink?: string };
  onMint?: (badgeId: string) => void;
}) {
  return (
    <Card className={badge.state === "minted" ? "shadow-glow" : ""}>
      <Badge>{badge.rarity}</Badge>
      <h3 className="mt-4 font-display text-2xl text-text">{badge.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{badge.description}</p>
      <div className="mt-4 text-sm text-text">State: {badge.state}</div>
      {badge.state === "earned" ? (
        <Button className="mt-4" onClick={() => onMint?.(badge.id)}>
          Mint on Solana
        </Button>
      ) : null}
      {badge.mintedLink ? (
        <a className="mt-4 inline-block text-sm text-primary underline" href={badge.mintedLink} target="_blank">
          View explorer
        </a>
      ) : null}
    </Card>
  );
}
