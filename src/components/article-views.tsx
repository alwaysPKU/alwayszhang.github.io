"use client";

import { useEffect, useState } from "react";

interface ArticleViewsProps {
  slug: string;
}

const VIEWS_KEY_PREFIX = "article_views_";
const READ_PREFIX = "read_";

// 根据 slug 生成伪随机数（确保同一篇文章始终返回相同的初始值）
function getInitialViews(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // 映射到 100-999 范围，让阅读量看起来更真实
  return Math.abs(hash % 900) + 100;
}

function getViews(slug: string): number {
  if (typeof window === "undefined") return getInitialViews(slug);
  const key = `${VIEWS_KEY_PREFIX}${slug}`;
  const stored = localStorage.getItem(key);
  // 如果没有存储数据，返回初始值而不是 0
  return stored ? parseInt(stored, 10) : getInitialViews(slug);
}

function incrementViews(slug: string): number {
  if (typeof window === "undefined") return 0;

  // 检查是否已读过（使用 cookie 去重）
  const readKey = `${READ_PREFIX}${slug}`;
  const hasRead = localStorage.getItem(readKey);

  if (!hasRead) {
    // 首次阅读
    const key = `${VIEWS_KEY_PREFIX}${slug}`;
    const current = getViews(slug);
    const newCount = current + 1;
    localStorage.setItem(key, newCount.toString());
    localStorage.setItem(readKey, "true");
    return newCount;
  }

  return getViews(slug);
}

export function ArticleViews({ slug }: ArticleViewsProps) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const count = incrementViews(slug);
    setViews(count);
  }, [slug]);

  return <span>{views} 次阅读</span>;
}
