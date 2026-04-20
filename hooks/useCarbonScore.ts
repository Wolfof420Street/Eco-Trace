"use client";

export function useCarbonScore(todayKg: number) {
  return Math.max(0, Math.min(100, Math.round((todayKg / 25) * 100)));
}
