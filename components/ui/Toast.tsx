"use client";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-full border border-strong bg-elevated px-4 py-3 text-sm text-text shadow-md">
      {message}
    </div>
  );
}
