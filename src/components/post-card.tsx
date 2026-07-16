'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  const [views, setViews] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取阅读量
    const key = `article_views_${post.slug}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setViews(parseInt(stored, 10));
    }
  }, [post.slug]);

  // 计算阅读时间（假设每分钟 300 字）
  const readTime = Math.max(1, Math.ceil((post.excerpt?.length || 200) / 300));

  return (
    <article
      className="group relative flex flex-col gap-3 p-6 border border-border/50 rounded-xl bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 顶部信息栏 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <time dateTime={post.date} className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {post.date}
          </time>
          {post.categories && post.categories.length > 0 && (
            <>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {post.categories.join(', ')}
              </span>
            </>
          )}
        </div>

        {/* 阅读时间和阅读量 */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime} 分钟
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {views}
          </span>
        </div>
      </div>

      {/* 标题 */}
      <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
        <a href={`/posts/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </a>
      </h2>

      {/* 摘要 */}
      {post.excerpt && (
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {post.excerpt}
        </p>
      )}

      {/* 标签 */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {post.tags.map((tag) => (
            <a
              key={tag}
              href={`/tags/${tag}`}
              className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              #{tag}
            </a>
          ))}
        </div>
      )}

      {/* 悬停装饰线 */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 ${
          isHovered ? 'w-full' : 'w-0'
        }`}
      />
    </article>
  );
}
