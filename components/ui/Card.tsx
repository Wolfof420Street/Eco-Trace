import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] bg-elevated/90 p-5 shadow-md backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
      {...props}
    />
  );
}
