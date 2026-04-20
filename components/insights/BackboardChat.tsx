"use client";

import { useState } from "react";
import { useBackboardChat } from "@/hooks/useBackboardChat";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const prompts = [
  "Where is my biggest carbon leak right now?",
  "Give me a small win for this week",
  "Compare my transport choices",
  "What should I reduce first?"
];

export function BackboardChat({ threadId }: { threadId: string }) {
  const { messages, isStreaming, send } = useBackboardChat(threadId);
  const [value, setValue] = useState("");

  async function handleSend(next: string) {
    await send(next);
    setValue("");
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-elevated p-5">
      <div className="text-sm uppercase tracking-[0.22em] text-muted">Persistent AI Chat</div>
      {messages.length === 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="rounded-full border border-strong bg-surface px-3 py-2 text-sm text-text"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto bg-primary text-[var(--text-inverse)]"
                : "bg-surface text-text"
            }`}
          >
            {message.content || (isStreaming ? "Thinking..." : "")}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ask EcoTrace AI" />
        <Button type="button" onClick={() => handleSend(value)} loading={isStreaming}>
          Send
        </Button>
      </div>
    </div>
  );
}
