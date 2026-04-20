import { z } from "zod";

export const ChatRequestSchema = z.object({
  threadId: z.string().min(1),
  message: z.string().min(1).max(2000)
});
