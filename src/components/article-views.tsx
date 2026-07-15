"use client";

import { useState, useEffect } from "react";

export function ArticleViews({ slug }: { slug: string }) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const key = `views-${slug}`;
    const stored = localStorage.getItem(key);
    const count = stored ? parseInt(stored) + 1 : 1;
    localStorage.setItem(key, count.toString());
    setViews(count);

    // 更新全局访客数
    const totalKey = "total-visitors";
    const totalStored = localStorage.getItem(totalKey);
    const total = totalStored ? parseInt(totalStored) + 1 : 1;
    localStorage.setItem(totalKey, total.toString());
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {views} 次阅读
    </span>
  );
}

export function TotalVisitors() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const key = "total-visitors";
    const stored = localStorage.getItem(key);
    const count = stored ? parseInt(stored) : 0;
    setTotal(count);
  }, []);

  return (
    <span className="text-sm text-gray-500 dark:text-gray-400">
      全站访客：{total} 人
    </span>
  );
}
