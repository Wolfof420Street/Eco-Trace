export function CommunityBenchmark({
  percentile,
  avgCO2Today,
  userCO2Today,
  userCount
}: {
  percentile: number;
  avgCO2Today: number;
  userCO2Today: number;
  userCount: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-elevated p-5">
      <div className="text-sm uppercase tracking-[0.22em] text-muted">Community Benchmark</div>
      <div className="mt-3 font-display text-4xl text-text">Better than {percentile.toFixed(0)}%</div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percentile}%` }} />
      </div>
      <div className="mt-3 text-sm text-muted">
        You: {userCO2Today.toFixed(1)} kg today. Community avg: {avgCO2Today.toFixed(1)} kg across {userCount} users.
      </div>
    </div>
  );
}
