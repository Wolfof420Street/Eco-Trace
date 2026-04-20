export type AIContext = {
  userId: string;
  threadId: string;
  weeklyTotalCO2: number;
  topCategory: string;
  recentActivities: Array<{ category: string; co2Kg: number }>;
};

export interface IAIService {
  chat(threadId: string, message: string, context: AIContext): Promise<ReadableStream<Uint8Array>>;
  generateTip(context: AIContext): Promise<string>;
  generateWeeklySummary(context: AIContext): Promise<string>;
}
