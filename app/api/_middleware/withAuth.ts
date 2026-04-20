import type { NextRequest } from "next/server";
import { auth0 } from "@/src/infrastructure/auth0/client";
import { err } from "@/app/api/_helpers/response";

type Handler = (req: NextRequest, userId: string) => Promise<Response>;

export function withAuth(handler: Handler) {
  return async (req: NextRequest) => {
    const session = await auth0.getSession(req);
    if (!session?.user?.sub) {
      return err("Unauthorized", "AUTH_REQUIRED", 401);
    }

    return handler(req, session.user.sub);
  };
}
