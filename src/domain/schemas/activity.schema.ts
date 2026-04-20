import { z } from "zod";

export const CreateActivitySchema = z.object({
  category: z.enum(["transport", "food", "energy", "goods"]),
  subcategory: z.string().min(1).max(64),
  quantity: z.number().positive().max(100000),
  unit: z.string().min(1).max(16).optional(),
  notes: z.string().max(500).optional(),
  loggedAt: z.string().datetime().optional()
});

export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
