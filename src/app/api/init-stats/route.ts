import { NextResponse } from "next/server";

export const dynamic = "force-static";

// 初始化访问统计数据
const INITIAL_DATA = {
  totalVisitors: 12397,
  totalPageviews: 23765,
  todayVisits: 0,
  lastVisitDate: null,
};

export async function GET() {
  return NextResponse.json(INITIAL_DATA);
}
