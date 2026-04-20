"use client";

import { useRef, useState } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function extractJsonObjects(input: string): { objects: string[]; rest: string } {
  const objects: string[] = [];
  let depth = 0;
  let inString = false;
  let escaped = false;
  let start = -1;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) {
        start = i;
      }
      depth += 1;
      continue;
    }

    if (char === "}") {
      if (depth > 0) {
        depth -= 1;
      }
      if (depth === 0 && start !== -1) {
        objects.push(input.slice(start, i + 1));
        start = -1;
      }
    }
  }

  if (depth > 0 && start !== -1) {
    return { objects, rest: input.slice(start) };
  }

  return { objects, rest: "" };
}

export function useBackboardChat(threadId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const frameRef = useRef<number | null>(null);

  async function send(content: string) {
    if (!content.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content }, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    let response: Response;
    try {
      response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, message: content })
      });
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "I could not reach the AI service. Please check your connection and try again." }
      ]);
      setIsStreaming(false);
      return;
    }

    if (!response.ok) {
      const fallbackMessage = "AI is temporarily unavailable. Please try again in a moment.";

      try {
        const json = (await response.json()) as { error?: string };
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: json.error ?? fallbackMessage }
        ]);
      } catch {
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: fallbackMessage }]);
      }

      setIsStreaming(false);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: "No AI response was received." }]);
      setIsStreaming(false);
      return;
    }

    const decoder = new TextDecoder();
    let aggregate = "";
    let buffer = "";

    const flush = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(() => {
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: aggregate }]);
      });
    };

    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });

      // Backboard stream is JSON event objects (often concatenated), not plain text.
      const { objects, rest } = extractJsonObjects(buffer);
      buffer = rest;

      for (const raw of objects) {
        try {
          const event = JSON.parse(raw) as {
            type?: string;
            content?: string;
            final_content?: string;
          };

          if (event.type === "content_streaming" && typeof event.content === "string") {
            aggregate += event.content;
            flush();
            continue;
          }

          if (event.type === "run_ended" && typeof event.final_content === "string" && !aggregate) {
            aggregate = event.final_content;
            flush();
          }
        } catch {
          // Ignore malformed chunks and keep reading until a valid JSON object is formed.
        }
      }
    }

    if (!aggregate && buffer.trim()) {
      // Last-resort fallback for unexpected non-JSON responses.
      aggregate += buffer.replace(/^data:\s?/gm, "");
      flush();
    }

    setIsStreaming(false);
  }

  return { messages, isStreaming, send };
}
