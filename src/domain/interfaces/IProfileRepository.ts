import type { UserProfile } from "@/src/domain/entities/UserProfile";

export interface IProfileRepository {
  getCurrent(): Promise<UserProfile>;
  getById(userId: string): Promise<UserProfile | null>;
  upsert(profile: Partial<UserProfile> & Pick<UserProfile, "id">): Promise<UserProfile>;
  setThreadId(userId: string, threadId: string): Promise<void>;
}
