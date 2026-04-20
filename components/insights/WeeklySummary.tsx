import { Card } from "@/components/ui/Card";

export function WeeklySummary({ summary }: { summary: string }) {
  return (
    <Card>
      <div className="text-sm uppercase tracking-[0.22em] text-muted">Weekly Summary</div>
      <p className="mt-3 leading-7 text-text">{summary}</p>
    </Card>
  );
}
