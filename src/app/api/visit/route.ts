import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STATS_FILE = path.join(process.cwd(), "data", "visit-stats.json");

interface VisitStats {
  totalVisitors: number;
  totalPageviews: number;
  todayVisits: number;
  lastResetDate: string;
}

function getStatsFile(): VisitStats {
  // 确保 data 目录存在
  const dataDir = path.dirname(STATS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 读取或初始化统计数据
  if (!fs.existsSync(STATS_FILE)) {
    const initialStats: VisitStats = {
      totalVisitors: 12397,
      totalPageviews: 23765,
      todayVisits: 0,
      lastResetDate: new Date().toISOString().split("T")[0],
    };
    fs.writeFileSync(STATS_FILE, JSON.stringify(initialStats, null, 2));
    return initialStats;
  }

  const stats: VisitStats = JSON.parse(fs.readFileSync(STATS_FILE, "utf-8"));

  // 检查是否需要重置今日统计
  const today = new Date().toISOString().split("T")[0];
  if (stats.lastResetDate !== today) {
    stats.todayVisits = 0;
    stats.lastResetDate = today;
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  }

  return stats;
}

function saveStats(stats: VisitStats): void {
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

export async function POST() {
  try {
    const stats = getStatsFile();

    // 增加页面浏览量
    stats.totalPageviews += 1;

    // 增加今日访问
    stats.todayVisits += 1;

    // 检查是否是新访客（使用简单的 session 标记）
    // 这里简化处理：每次 POST 都增加访客数
    // 实际生产环境应该使用 cookie 或 IP 去重
    stats.totalVisitors += 1;

    saveStats(stats);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Failed to record visit:", error);
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = getStatsFile();

    return NextResponse.json({
      totalVisitors: stats.totalVisitors,
      totalPageviews: stats.totalPageviews,
      todayVisits: stats.todayVisits,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}