export type AgentScanResult = {
  source: "google_calendar" | "gmail";
  items: Array<{
    title: string;
    estimatedCategory: string;
    estimatedSubcategory: string;
    estimatedQuantity: number;
    confidence: number;
  }>;
};

export class Auth0AgentToolsService {
  async getCalendarToken(auth0AccessToken: string): Promise<string> {
    const issuer = process.env.AUTH0_ISSUER_BASE_URL;
    if (!issuer) {
      throw new Error("AUTH0_ISSUER_BASE_URL is not configured");
    }

    const response = await fetch(`${issuer}/api/v2/users/me/token-vault/google-calendar`, {
      headers: {
        Authorization: `Bearer ${auth0AccessToken}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Token Vault: failed to get Calendar token (${response.status}): ${details}`);
    }

    const json = (await response.json()) as { access_token?: string };
    if (!json.access_token) {
      throw new Error("Token Vault returned no calendar access token");
    }

    return json.access_token;
  }

  async scanCalendar(calendarToken: string): Promise<AgentScanResult> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const url =
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
      new URLSearchParams({
        timeMin: oneWeekAgo.toISOString(),
        singleEvents: "true",
        orderBy: "startTime"
      }).toString();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${calendarToken}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Calendar API error ${response.status}: ${details}`);
    }

    const json = (await response.json()) as { items?: Array<Record<string, unknown>> };
    const items = json.items ?? [];
    const carbonEvents = items.filter((event) => {
      const summary = String(event.summary ?? "").toLowerCase();
      return ["flight", "fly", "train", "drive", "hotel"].some((keyword) => summary.includes(keyword));
    });

    return {
      source: "google_calendar",
      items: carbonEvents.map((event) => {
        const summary = String(event.summary ?? "");
        const normalized = summary.toLowerCase();
        return {
          title: summary,
          estimatedCategory: "transport",
          estimatedSubcategory: normalized.includes("flight") ? "flight_long" : normalized.includes("train") ? "train" : "car_petrol",
          estimatedQuantity: 0,
          confidence: 0.7
        };
      })
    };
  }
}
