import { Select } from "@/components/ui/Select";
import { EMISSION_CATEGORIES } from "@/src/domain/constants/emission-categories";

export function CategoryPicker(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Select {...props}>
      <option value="">Choose a category</option>
      {EMISSION_CATEGORIES.map((category) => (
        <option key={category.category} value={category.category}>
          {category.label}
        </option>
      ))}
    </Select>
  );
}
