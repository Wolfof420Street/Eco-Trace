import type { BadgeDefinition } from "@/src/domain/entities/Badge";

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first_log",
    name: "First Footprint",
    description: "Logged your first activity.",
    rarity: "common",
    artwork: "/badge-seed.svg",
    threshold: { metric: "first_log", value: 1, operator: "gte" }
  },
  {
    id: "five_logs",
    name: "Data Gardener",
    description: "Logged five activities.",
    rarity: "uncommon",
    artwork: "/badge-gardener.svg",
    threshold: { metric: "total_logs", value: 5, operator: "gte" }
  },
  {
    id: "streak_3",
    name: "Canopy Streak",
    description: "Logged activity for three days in a row.",
    rarity: "rare",
    artwork: "/badge-streak.svg",
    threshold: { metric: "streak_days", value: 3, operator: "gte" }
  },
  {
    id: "low_day",
    name: "Low-Impact Day",
    description: "Finished a day under 8kg CO2e.",
    rarity: "epic",
    artwork: "/badge-low-day.svg",
    threshold: { metric: "daily_co2_kg", value: 8, operator: "lte" }
  },
  {
    id: "meat_free",
    name: "Plant-Powered",
    description: "Logged a meat-free food choice.",
    rarity: "legendary",
    artwork: "/badge-plant.svg",
    threshold: { metric: "meat_free_days", value: 1, operator: "gte" }
  }
];
