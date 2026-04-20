import { Card } from "@/components/ui/Card";

export function TipCard({ tip }: { tip: string }) {
  return (
    <Card>
      <div className="text-sm uppercase tracking-[0.22em] text-muted">Today&apos;s Tip</div>
      <p className="mt-3 text-text">{tip}</p>
    </Card>
  );
}
