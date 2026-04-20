import { BADGE_DEFINITIONS } from "@/src/domain/constants/badge-definitions";

export async function GET(
  _request: Request,
  context: { params: { badgeId: string } }
) {
  const badge = BADGE_DEFINITIONS.find((item) => item.id === context.params.badgeId);
  if (!badge) {
    return Response.json({ error: "Badge not found" }, { status: 404 });
  }

  return Response.json({
    name: badge.name,
    symbol: "ECO",
    description: badge.description,
    image: `${process.env.NEXT_PUBLIC_APP_URL}${badge.artwork}`,
    attributes: [
      { trait_type: "rarity", value: badge.rarity },
      { trait_type: "badge_id", value: badge.id },
      { trait_type: "project", value: "EcoTrace" }
    ]
  });
}
