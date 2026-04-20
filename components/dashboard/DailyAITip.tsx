import { Card } from "@/components/ui/Card";

export function DailyAITip({ tip }: { tip: string }) {
  return (
    <Card className="bg-[radial-gradient(circle_at_top,_rgba(76,201,122,0.2),_transparent_55%),var(--bg-elevated)]">
      <div className="text-sm uppercase tracking-[0.22em] text-muted">AI Memory Tip</div>
      <p className="mt-3 text-base leading-7 text-text">{tip}</p>
    </Card>
  );
}
