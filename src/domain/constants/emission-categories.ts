import type { ActivityCategory } from "@/src/domain/entities/Activity";

export const EMISSION_CATEGORIES: Array<{
  category: ActivityCategory;
  label: string;
  description: string;
}> = [
  { category: "transport", label: "Transport", description: "How you move through the world." },
  { category: "food", label: "Food", description: "Meals and ingredient choices." },
  { category: "energy", label: "Energy", description: "Power and heating at home." },
  { category: "goods", label: "Goods", description: "Things you buy and use." }
];
