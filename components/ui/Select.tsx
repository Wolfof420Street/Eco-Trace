import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-strong focus:ring-2 focus:ring-primary/20",
        props.className
      )}
    />
  );
}
