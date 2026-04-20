import { Select } from "@/components/ui/Select";
import type { EmissionFactor } from "@/src/domain/value-objects/EmissionFactor";

export function SubcategoryPicker({
  factors,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  factors: EmissionFactor[];
}) {
  return (
    <Select {...props}>
      <option value="">Choose a subcategory</option>
      {factors.map((factor) => (
        <option key={factor.id} value={factor.subcategory}>
          {factor.label}
        </option>
      ))}
    </Select>
  );
}
