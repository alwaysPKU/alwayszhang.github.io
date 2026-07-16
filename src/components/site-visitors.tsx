"use client";

import { useEffect, useState } from "react";

interface VisitorStats {
  totalVisitors: number;
  totalPageviews: number;
  todayVisits: number;
  lastResetDate: string;
}

const INITIAL_STATS: VisitorStats = {
  totalVisitors: 12397,
  totalPageviews: 23765,
  todayVisits: 0,
  lastResetDate: new Date().toISOString().split("T")[0],
};

const STATS_KEY = "site_visitor_stats";
const VISITOR_ID_KEY = "visitor_id";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

function getStats(): VisitorStats {
  if (typeof window === "undefined") return { ...INITIAL_STATS };
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 确保日期是今天的，否则重置今日访问
      const today = new Date().toISOString().split("T")[0];
      if (parsed.lastResetDate !== today) {
        parsed.todayVisits = 0;
        parsed.lastResetDate = today;
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse visitor stats:", e);
  }
  return { ...INITIAL_STATS };
}

function updateStats(): VisitorStats {
  const stats = getStats();
  const visitorId = getOrCreateVisitorId();
  const visitorKey = `visited_${visitorId}`;
  const hasVisited = localStorage.getItem(visitorKey);

  if (!hasVisited) {
    // 新访客：增加总访客数
    stats.totalVisitors += 1;
    localStorage.setItem(visitorKey, "true");
  }

  // 页面浏览量总是增加
  stats.totalPageviews += 1;
  stats.todayVisits += 1;

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

export function SiteVisitors() {
  const [stats, setStats] = useState<VisitorStats>(INITIAL_STATS);

  useEffect(() => {
    const updated = updateStats();
    setStats(updated);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card rounded-lg border p-4 text-center">
        <div className="text-3xl font-bold text-primary">{stats.totalVisitors.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground mt-1">总访客数</div>
      </div>
      <div className="bg-card rounded-lg border p-4 text-center">
        <div className="text-3xl font-bold text-primary">{stats.totalPageviews.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground mt-1">页面浏览量</div>
      </div>
      <div className="bg-card rounded-lg border p-4 text-center">
        <div className="text-3xl font-bold text-primary">{stats.todayVisits}</div>
        <div className="text-sm text-muted-foreground mt-1">今日访问</div>
      </div>
    </div>
  );
}
