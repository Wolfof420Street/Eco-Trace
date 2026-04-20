"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const colors = ["#4cc97a", "#2d9a5f", "#f0a855", "#c0392b"];

export function CategoryBreakdown({
  data
}: {
  data: Array<{ category: string; co2Kg: number }>;
}) {
  return (
    <div className="h-72 rounded-2xl border border-[var(--border)] bg-elevated p-4">
      <div className="mb-4 font-display text-xl text-text">Category Mix</div>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie data={data} dataKey="co2Kg" nameKey="category" innerRadius={58} outerRadius={88}>
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
