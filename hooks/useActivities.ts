"use client";

import { useEffect, useState } from "react";
import type { ActivityDTO } from "@/src/application/dtos/ActivityDTO";

export function useActivities() {
  const [activities, setActivities] = useState<ActivityDTO[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((json) => {
        if (json.success) setActivities(json.data);
      })
      .catch(() => undefined);
  }, []);

  return { activities, setActivities };
}
