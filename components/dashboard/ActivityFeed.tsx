import { Card } from "@/components/ui/Card";

export function ActivityFeed({
  activities
}: {
  activities: Array<{ id: string; category: string; subcategory: string; co2Kg: number; loggedAt: string }>;
}) {
  return (
    <Card>
      <h3 className="font-display text-xl text-text">Recent Activity</h3>
      <div className="mt-4 space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between rounded-xl bg-surface/80 px-4 py-3">
            <div>
              <div className="capitalize text-text">{activity.subcategory.replaceAll("_", " ")}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted">{activity.category}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-text">{activity.co2Kg.toFixed(1)} kg</div>
              <div className="text-xs text-muted">{new Date(activity.loggedAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
