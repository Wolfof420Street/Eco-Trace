"use client";

import { cn } from "@/lib/cn";

export function Modal({
  open,
  title,
  children
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay)] p-4">
      <div className={cn("w-full max-w-lg rounded-2xl border border-strong bg-elevated p-6 shadow-lg")}>
        <h3 className="font-display text-2xl text-text">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
