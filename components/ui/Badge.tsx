import { cn } from "@/lib/cn";

export function Badge({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-strong bg-surface px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
