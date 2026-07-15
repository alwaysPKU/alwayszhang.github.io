"use client";

import { useState, useEffect } from "react";

interface SiteVisitorsProps {
  type: "total" | "pageviews" | "today";
}

export default function SiteVisitors({ type }: SiteVisitorsProps) {
  const [count, setCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 检查是否已初始化
    const isInitialized = localStorage.getItem("stats-initialized");
    
    if (!isInitialized) {
      // 首次访问，初始化数据
      localStorage.setItem("total-visitors", "12397");
      localStorage.setItem("total-pageviews", "23765");
      localStorage.setItem("today-visits", "0");
      localStorage.setItem("stats-initialized", "true");
    }

    // 从 localStorage 读取访问统计
    const totalVisitors = parseInt(localStorage.getItem("total-visitors") || "0");
    const totalPageviews = parseInt(localStorage.getItem("total-pageviews") || "0");
    const todayVisits = parseInt(localStorage.getItem("today-visits") || "0");
    const lastVisitDate = localStorage.getItem("last-visit-date");

    // 检查是否是新的一天
    const today = new Date().toDateString();
    if (lastVisitDate !== today) {
      // 新的一天，重置今日访问数
      localStorage.setItem("today-visits", "1");
      localStorage.setItem("last-visit-date", today);
      setCount(type === "today" ? 1 : type === "total" ? totalVisitors : totalPageviews);
    } else {
      // 同一天，增加计数
      const newTodayVisits = todayVisits + 1;
      localStorage.setItem("today-visits", newTodayVisits.toString());
      
      const newPageviews = totalPageviews + 1;
      localStorage.setItem("total-pageviews", newPageviews.toString());

      setCount(
        type === "today" 
          ? newTodayVisits 
          : type === "total" 
          ? totalVisitors 
          : newPageviews
      );
    }
    
    setInitialized(true);
  }, [type]);

  if (!initialized) return null;
  
  return <>{count}</>;
}
