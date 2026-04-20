import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
import { backboardCreateThread } from "@/src/infrastructure/backboard/client";
import { ProfileRepository } from "@/src/infrastructure/supabase/ProfileRepository";

function normalizeAuth0Domain(raw?: string): string | null {
  if (!raw) return null;

  // The SDK expects a hostname (example.us.auth0.com), while existing envs may include https://.
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return new URL(raw).hostname;
  }

  return raw;
}

function resolveAuth0AppBaseUrl(): string | null {
  return process.env.APP_BASE_URL ?? process.env.AUTH0_BASE_URL ?? null;
}

function validateAuth0Config(): { valid: boolean; domain: string | null; appBaseUrl: string | null } {
  const domain = normalizeAuth0Domain(process.env.AUTH0_DOMAIN ?? process.env.AUTH0_ISSUER_BASE_URL);
  const appBaseUrl = resolveAuth0AppBaseUrl();

  const valid =
    Boolean(process.env.AUTH0_SECRET) &&
    Boolean(process.env.AUTH0_CLIENT_ID) &&
    Boolean(process.env.AUTH0_CLIENT_SECRET) &&
    Boolean(domain);

  return { valid, domain, appBaseUrl };
}

function getAuth0ErrorDetails(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { raw: String(error) };
  }

  const anyError = error as Error & {
    code?: string;
    cause?: {
      code?: string;
      message?: string;
      status?: number;
      statusCode?: number;
      body?: unknown;
      error?: string;
      error_description?: string;
    };
  };

  return {
    name: anyError.name,
    message: anyError.message,
    code: anyError.code,
    causeCode: anyError.cause?.code,
    causeMessage: anyError.cause?.message,
    status: anyError.cause?.status ?? anyError.cause?.statusCode,
    oauthError: anyError.cause?.error,
    oauthDescription: anyError.cause?.error_description,
    body: anyError.cause?.body
  };
}

function getSideEffectErrorDetails(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { raw: String(error) };
  }

  const withCause = error as Error & {
    cause?: {
      code?: string;
      message?: string;
      errno?: string | number;
      name?: string;
      errors?: unknown;
    };
  };

  return {
    name: error.name,
    message: error.message,
    causeName: withCause.cause?.name,
    causeCode: withCause.cause?.code,
    causeErrno: withCause.cause?.errno,
    causeMessage: withCause.cause?.message,
    causeErrors: withCause.cause?.errors
  };
}

const auth0Config = validateAuth0Config();
export const isAuth0Configured = auth0Config.valid;

const auth0Client = isAuth0Configured
  ? new Auth0Client({
      domain: auth0Config.domain!,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      secret: process.env.AUTH0_SECRET!,
      appBaseUrl: auth0Config.appBaseUrl ?? undefined,
      signInReturnToPath: "/dashboard",
      authorizationParameters: {
        scope: "openid profile email"
      },
      onCallback: async (error, ctx, session) => {
        if (error) {
          const details = getAuth0ErrorDetails(error);
          console.error("[auth0] callback exchange failed", details);

          const baseUrl = ctx.appBaseUrl ?? auth0Config.appBaseUrl ?? "http://localhost:3000";
          const loginUrl = new URL("/auth/login", baseUrl);
          loginUrl.searchParams.set("auth_error", "callback_exchange_failed");
          return NextResponse.redirect(loginUrl);
        }

        if (session?.user?.sub) {
          const userId = session.user.sub;
          const profiles = new ProfileRepository();

          try {
            await profiles.upsert({
              id: userId,
              username: session.user.name,
              avatarUrl: "picture" in session.user && typeof session.user.picture === "string" ? session.user.picture : undefined,
              onboarded: true
            });
          } catch (upsertError) {
            console.warn("[auth0] side-effect failed at profiles.upsert", getSideEffectErrorDetails(upsertError));
          }

          let profile: Awaited<ReturnType<ProfileRepository["getById"]>> | null = null;
          try {
            profile = await profiles.getById(userId);
          } catch (getProfileError) {
            console.warn("[auth0] side-effect failed at profiles.getById", getSideEffectErrorDetails(getProfileError));
          }

          if (!profile?.backboardThreadId) {
            const assistantId = process.env.BACKBOARD_ASSISTANT_ID;
            if (!assistantId) {
              console.warn("[auth0] BACKBOARD_ASSISTANT_ID is not configured; skipping thread creation");
            } else {
              let threadId: string | null = null;

              try {
                threadId = await backboardCreateThread(assistantId);
              } catch (createThreadError) {
                console.warn(
                  "[auth0] side-effect failed at backboardCreateThread",
                  getSideEffectErrorDetails(createThreadError)
                );
              }

              if (threadId) {
                try {
                  await profiles.setThreadId(userId, threadId);
                } catch (setThreadIdError) {
                  console.warn("[auth0] side-effect failed at profiles.setThreadId", getSideEffectErrorDetails(setThreadIdError));
                }
              }
            }
          }
        }

        return NextResponse.redirect(
          new URL(
            ctx.returnTo ?? "/dashboard",
            ctx.appBaseUrl ?? auth0Config.appBaseUrl ?? "http://localhost:3000"
          )
        );
      }
    })
  : null;

export async function getSession(request?: Request) {
  if (!auth0Client) {
    throw new Error("Auth0 is not configured. Please set required environment variables: AUTH0_SECRET, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_DOMAIN");
  }

  return request ? await auth0Client.getSession(request) : await auth0Client.getSession();
}

export const auth0 = {
  getSession,
  middleware: async (request: Request) => {
    if (auth0Client) {
      return auth0Client.middleware(request);
    }
    return NextResponse.next();
  }
};
