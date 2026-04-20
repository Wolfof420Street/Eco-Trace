import { ActivityForm } from "@/components/log/ActivityForm";
import { SnowflakeEmissionFactorRepository } from "@/src/infrastructure/snowflake/EmissionFactorRepository";

export default async function LogPage() {
  const factors = await new SnowflakeEmissionFactorRepository().getAll();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.24em] text-muted">Log Activity</div>
        <h1 className="mt-2 font-display text-4xl text-text">Capture today&apos;s choices</h1>
      </div>
      <ActivityForm factors={factors} />
    </div>
  );
}
