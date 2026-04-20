"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WeeklyChart({
  data
}: {
  data: Array<{ date: string; co2Kg: number }>;
}) {
  return (
    <div className="h-72 rounded-2xl border border-[var(--border)] bg-elevated p-4">
      <div className="mb-4 font-display text-xl text-text">Weekly Carbon Flow</div>
      <ResponsiveContainer width="100%" height="88%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="co2Gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip />
          <Area type="monotone" dataKey="co2Kg" stroke="var(--accent-primary)" fill="url(#co2Gradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
