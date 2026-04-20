"use client";

import { useEffect, useState } from "react";
import type { DashboardDTO } from "@/src/application/dtos/DashboardDTO";

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then((json) => {
        if (json.success) setDashboard(json.data);
      })
      .catch(() => undefined);
  }, []);

  return dashboard;
}
