"use client";

import { useEffect, useState } from "react";

interface ArticleViewsProps {
  slug: string;
}

const VIEWS_KEY_PREFIX = "article_views_";
const READ_PREFIX = "read_";

function getViews(slug: string): number {
  if (typeof window === "undefined") return 0;
  const key = `${VIEWS_KEY_PREFIX}${slug}`;
  const stored = localStorage.getItem(key);
  return stored ? parseInt(stored, 10) : 0;
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
