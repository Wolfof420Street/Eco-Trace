import type { NextRequest } from "next/server";
import { err, ok } from "@/app/api/_helpers/response";
import { withAuth } from "@/app/api/_middleware/withAuth";
import { auth0 } from "@/src/infrastructure/auth0/client";
import { Auth0AgentToolsService } from "@/src/infrastructure/auth0/AgentToolsService";

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const session = await auth0.getSession(req);
    const accessToken =
      (session as { accessToken?: string | null } | null)?.accessToken ??
      ((session as { tokenSet?: { accessToken?: string | null } } | null)?.tokenSet?.accessToken ?? null);

    if (!accessToken) {
      return err("No Auth0 access token available for Token Vault", "AUTH0_ACCESS_TOKEN_MISSING", 401);
    }

    const agentService = new Auth0AgentToolsService();
    const calendarToken = await agentService.getCalendarToken(accessToken);
    const results = await agentService.scanCalendar(calendarToken);

    return ok(results);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Agent scan failed", "AGENT_SCAN_FAILED", 500);
  }
});
