export type BackboardChatPayload = {
  thread_id: string;
  content: string;
  memory: "Auto" | "off";
  model_name?: string;
  send_to_llm: boolean;
  stream?: boolean;
  system_prompt?: string;
};

const BACKBOARD_BASE = "https://app.backboard.io/api";

function resolveBackboardModel(explicitModel?: string): string | undefined {
  return explicitModel ?? process.env.BACKBOARD_MODEL_NAME;
}

function getBackboardApiKey() {
  const apiKey = process.env.BACKBOARD_API_KEY;
  if (!apiKey) {
    throw new Error("BACKBOARD_API_KEY is not configured");
  }

  return apiKey;
}

function getBackboardJsonHeaders() {
  return {
    "X-API-Key": getBackboardApiKey(),
    "Content-Type": "application/json"
  };
}

function getBackboardFormHeaders() {
  return {
    "X-API-Key": getBackboardApiKey(),
    "Content-Type": "application/x-www-form-urlencoded"
  };
}

export async function backboardChat(payload: BackboardChatPayload): Promise<Response> {
  const modelName = resolveBackboardModel(payload.model_name);

  const response = await fetch(`${BACKBOARD_BASE}/threads/${payload.thread_id}/messages`, {
    method: "POST",
    headers: getBackboardFormHeaders(),
    body: new URLSearchParams({
      content: payload.content,
      stream: String(payload.stream ?? false),
      memory: payload.memory,
      send_to_llm: String(payload.send_to_llm),
      ...(modelName ? { model_name: modelName } : {}),
      ...(payload.system_prompt ? { system_prompt: payload.system_prompt } : {})
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Backboard error ${response.status}: ${details}`);
  }

  return response;
}

export async function backboardCreateThread(assistantId: string): Promise<string> {
  const response = await fetch(`${BACKBOARD_BASE}/assistants/${assistantId}/threads`, {
    method: "POST",
    headers: getBackboardJsonHeaders(),
    body: JSON.stringify({}),
    cache: "no-store"
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Backboard thread creation failed ${response.status}: ${details}`);
  }

  const json = (await response.json()) as { thread_id?: string };
  if (!json.thread_id) {
    throw new Error("Backboard thread creation returned no thread_id");
  }

  return json.thread_id;
}

export async function readBackboardTextResponse(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = (await response.json()) as { content?: string; message?: string };
    return json.content ?? json.message ?? "";
  }

  return response.text();
}
