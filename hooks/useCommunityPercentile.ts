"use client";

import { useEffect, useState } from "react";
import type { CommunityStats } from "@/src/domain/interfaces/ICommunityRepository";

export function useCommunityPercentile(co2Kg: number | null) {
  const [stats, setStats] = useState<CommunityStats | null>(null);

  useEffect(() => {
    if (co2Kg === null || co2Kg < 0) return;
    fetch(`/api/community/percentile?co2=${co2Kg}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.success) setStats(json.data);
      })
      .catch(() => undefined);
  }, [co2Kg]);

  return stats;
}
