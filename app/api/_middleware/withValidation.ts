import type { NextRequest } from "next/server";
import type { ZodSchema } from "zod";
import { err } from "@/app/api/_helpers/response";

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (data: T, req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return err("Validation failed", "INVALID_INPUT", 400);
    }
    return handler(parsed.data, req);
  };
}
