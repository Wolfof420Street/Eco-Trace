"use server";

import { backboardCreateThread } from "@/src/infrastructure/backboard/client";
import { auth0 } from "@/src/infrastructure/auth0/client";
import { ProfileRepository } from "@/src/infrastructure/supabase/ProfileRepository";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getOrCreateBackboardThread(userId: string): Promise<string> {
  const profiles = new ProfileRepository();
  const profile = await profiles.getById(userId);
  if (profile?.backboardThreadId && isUuid(profile.backboardThreadId)) {
    return profile.backboardThreadId;
  }

  const assistantId = process.env.BACKBOARD_ASSISTANT_ID;
  if (!assistantId) {
    throw new Error("BACKBOARD_ASSISTANT_ID is not configured");
  }

  const threadId = await backboardCreateThread(assistantId);
  await profiles.setThreadId(userId, threadId);
  return threadId;
}

export async function getCurrentUser() {
  const session = await auth0.getSession();
  return session?.user ?? null;
}
