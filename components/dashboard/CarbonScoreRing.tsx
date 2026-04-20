"use client";

import { motion } from "framer-motion";

export function CarbonScoreRing({
  score,
  todayKg,
  avgKg
}: {
  score: number;
  todayKg: number;
  avgKg: number;
}) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference - (score / 100) * circumference;
  const stroke = score <= 40 ? "var(--accent-glow)" : score <= 70 ? "var(--accent-amber)" : "var(--accent-red)";

  return (
    <div className="flex flex-col items-center rounded-2xl border border-[var(--border)] bg-elevated p-6">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--border)" strokeWidth="14" />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dash }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="-mt-28 text-center">
        <div className="font-mono text-4xl text-text">{score}</div>
        <div className="text-sm text-muted">{todayKg.toFixed(1)} kg today</div>
        <div className="mt-1 text-xs text-muted">7-day avg {avgKg.toFixed(1)} kg</div>
      </div>
    </div>
  );
}
