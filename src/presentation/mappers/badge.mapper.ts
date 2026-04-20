import type { BadgeDTO } from "@/src/application/dtos/BadgeDTO";
import type { UserBadge } from "@/src/domain/entities/Badge";

export function mapUserBadgeToDTO(badge: UserBadge): BadgeDTO {
  return {
    id: badge.definition.id,
    name: badge.definition.name,
    description: badge.definition.description,
    rarity: badge.definition.rarity,
    state: badge.state,
    artwork: badge.definition.artwork,
    mintedLink: badge.solanaTxSignature
      ? `https://explorer.solana.com/tx/${badge.solanaTxSignature}?cluster=devnet`
      : undefined
  };
}
