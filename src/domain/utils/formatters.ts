export function formatCO2(kg: number): string {
  return `${kg.toFixed(1)} kg CO2e`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}
