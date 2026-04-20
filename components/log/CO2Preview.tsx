import { Card } from "@/components/ui/Card";
import { getCarbonEquivalencies } from "@/src/domain/utils/carbon-equivalencies";
import { formatCO2 } from "@/src/domain/utils/formatters";

export function CO2Preview({ co2Kg }: { co2Kg: number }) {
  const equivalencies = getCarbonEquivalencies(co2Kg);

  return (
    <Card>
      <div className="text-sm uppercase tracking-[0.22em] text-muted">Live Preview</div>
      <div className="mt-3 font-mono text-3xl text-text">{formatCO2(co2Kg)}</div>
      <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
        <div>{equivalencies.trees} tree-days</div>
        <div>{equivalencies.drivingKm} km driving</div>
        <div>{equivalencies.phoneCharges} phone charges</div>
      </div>
    </Card>
  );
}
