export type BadgeDTO = {
  id: string;
  name: string;
  description: string;
  rarity: string;
  state: "locked" | "earned" | "minted";
  artwork: string;
  mintedLink?: string;
};
