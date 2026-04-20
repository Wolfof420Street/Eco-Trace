"use client";

import { useEffect, useState } from "react";
import type { BadgeDTO } from "@/src/application/dtos/BadgeDTO";

export function useBadges() {
  const [badges, setBadges] = useState<BadgeDTO[]>([]);

  useEffect(() => {
    fetch("/api/badges")
      .then((response) => response.json())
      .then((json) => {
        if (json.success) setBadges(json.data);
      })
      .catch(() => undefined);
  }, []);

  return { badges, setBadges };
}
