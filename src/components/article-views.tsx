"use client";

import { useState, useEffect } from "react";

export function ArticleViews({ slug }: { slug: string }) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    // 检查是否已经阅读过这篇文章（使用 cookie）
    const hasRead = document.cookie.includes(`read-${slug}=1`);

    if (!hasRead) {
      // 第一次阅读，调用 API 增加阅读量
      fetch(`/api/article-views/${slug}`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setViews(data.views);
          }
        })
        .catch((err) => console.error("Failed to record view:", err));

      // 设置 cookie 标记（有效期 1 年）
      document.cookie = `read-${slug}=1; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      // 已经阅读过，只获取当前阅读量
      fetch(`/api/article-views/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.views) {
            setViews(data.views);
          }
        })
        .catch((err) => console.error("Failed to fetch views:", err));
    }
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
    fetch("/api/visit")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalVisitors) {
          setTotal(data.totalVisitors);
        }
      })
      .catch((err) => console.error("Failed to fetch total visitors:", err));
  }, []);

  return (
    <span className="text-sm text-gray-500 dark:text-gray-400">
      全站访客：{total} 人
    </span>
  );
}
