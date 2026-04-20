import type { AIContext, IAIService } from "@/src/domain/interfaces/IAIService";
import { backboardChat, readBackboardTextResponse } from "@/src/infrastructure/backboard/client";

function buildSystemPrompt(context: AIContext): string {
  return `You are EcoTrace AI - a warm, knowledgeable sustainability coach with memory of this user's journey.

User's current data:
- Weekly CO2 total: ${context.weeklyTotalCO2.toFixed(1)} kg (global avg: 92 kg/week)
- Biggest impact category: ${context.topCategory}
- Recent activities: ${JSON.stringify(context.recentActivities)}

Your memory: You remember everything this user has ever told you and all their eco-data. Reference it naturally.
Be specific (use their actual numbers), concise (max 150 words per response), encouraging but honest.
Always end with one concrete action they can take TODAY. Never be preachy.`;
}

export class BackboardAIService implements IAIService {
  async chat(threadId: string, message: string, context: AIContext): Promise<ReadableStream<Uint8Array>> {
    const response = await backboardChat({
      thread_id: threadId,
      content: message,
      memory: "Auto",
      send_to_llm: true,
      stream: true,
      system_prompt: buildSystemPrompt(context)
    });

    if (!response.body) {
      throw new Error("Backboard returned no stream body");
    }

    return response.body;
  }

  async generateTip(context: AIContext): Promise<string> {
    const response = await backboardChat({
      thread_id: context.threadId,
      content: "Give me one specific, actionable tip based on my most recent activity. Keep it under 80 words.",
      memory: "Auto",
      send_to_llm: true,
      system_prompt: buildSystemPrompt(context)
    });

    return readBackboardTextResponse(response);
  }

  async generateWeeklySummary(context: AIContext): Promise<string> {
    const response = await backboardChat({
      thread_id: context.threadId,
      content: "Give me a 3-sentence narrative summary of my carbon week. Be specific. End with my biggest opportunity.",
      memory: "Auto",
      send_to_llm: true,
      system_prompt: buildSystemPrompt(context)
    });

    return readBackboardTextResponse(response);
  }
}
