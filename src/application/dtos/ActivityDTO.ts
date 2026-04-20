export type ActivityDTO = {
  id: string;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  co2Kg: number;
  notes?: string;
  source: string;
  loggedAt: string;
};
