import type { IBadgeRepository } from "@/src/domain/interfaces/IBadgeRepository";
import { BADGE_DEFINITIONS } from "@/src/domain/constants/badge-definitions";
import { SolanaBadgeMintService } from "@/src/infrastructure/solana/BadgeMintService";

export class MintBadgeUseCase {
  constructor(private readonly badges: IBadgeRepository) {}

  async execute(userId: string, badgeId: string, wallet: string) {
    const definition = BADGE_DEFINITIONS.find((badge) => badge.id === badgeId);
    if (!definition) {
      throw new Error("Unknown badge");
    }

    const result = await new SolanaBadgeMintService().mint(wallet, definition);
    const badge = await this.badges.markMinted(userId, badgeId, result.mintAddress, result.txSignature);
    return { badge, result };
  }
}
