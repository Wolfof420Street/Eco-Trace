import type { ICommunityRepository } from "@/src/domain/interfaces/ICommunityRepository";

export class GetCommunityPercentileUseCase {
  constructor(private readonly community: ICommunityRepository) {}

  async execute(co2Kg: number) {
    return this.community.getPercentile(co2Kg);
  }
}
