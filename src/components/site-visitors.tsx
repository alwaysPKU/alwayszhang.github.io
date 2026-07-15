"use client";

import { useState, useEffect } from "react";

interface SiteVisitorsProps {
  type: "total" | "pageviews" | "today";
}

interface VisitStats {
  totalVisitors: number;
  totalPageviews: number;
  todayVisits: number;
}

export default function SiteVisitors({ type }: SiteVisitorsProps) {
  const [count, setCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 记录访问
    fetch("/api/visit", { method: "POST" })
      .then(() => fetch("/api/visit"))
      .then((res) => res.json())
      .then((data: VisitStats) => {
        setCount(
          type === "today"
            ? data.todayVisits
            : type === "total"
            ? data.totalVisitors
            : data.totalPageviews
        );
        setInitialized(true);
      })
      .catch((err) => {
        console.error("Failed to fetch visit stats:", err);
        setInitialized(true);
      });
  }, [type]);

  if (!initialized) return <>{type === "today" ? 0 : type === "total" ? 12397 : 23765}</>;

  return <>{count}</>;
}
