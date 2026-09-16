import Link from 'next/link';
import type { Metadata } from 'next';
import { getDailyPosts, DAILY_SERIES_NAME } from '@/lib/series';

export const metadata: Metadata = {
  title: '每日调研连载',
  description: 'AI 每日调研连载：每天定时调研大模型、AI 应用、多模态、具身智能领域的最新进展，聚合头部厂商动态与 arXiv 论文',
  openGraph: {
    title: '每日调研连载 | HalfSugar',
    description: '每天一项 AI 领域每日调研，紧跟大模型、多模态、具身智能的前沿动态',
  },
};

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function DailyPage() {
  const posts = getDailyPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="flex items-start gap-3 mb-2">
        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CalendarIcon />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">每日调研连载</h1>
          <p className="text-sm text-muted-foreground mt-1">
            聚焦大模型、AI 应用、多模态、具身智能，聚合国内外头部厂商 blog/动态与 arXiv 最新论文。
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-8">
        每日 18:00 自动生成 · 已收录 {posts.length} 篇
      </p>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">连载尚未开始。</p>
      ) : (
        <ol className="relative border-l border-border/60 ml-4">
          {posts.map((post) => {
            const [ , mm, dd ] = post.date.split('-');
            return (
              <li key={post.slug} className="relative pl-7 pb-6 last:pb-0">
                {/* 时间线节点 */}
                <span className="absolute left-[-5px] top-1 h-[9px] w-[9px] rounded-full border border-primary bg-background" aria-hidden />
                <div className="group">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground tabular-nums">
                      {post.date}
                    </span>
                    <span className="text-[11px] text-primary/70">
                      {Number(mm)}月{Number(dd)}日
                    </span>
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="block text-sm font-medium text-foreground/90 leading-snug break-words transition-colors group-hover:text-primary"
                  >
                    {post.title.replace('AI 每日调研 · ', '').replace(/：.*$/, '')}
                  </Link>
                  <span className="block text-xs text-muted-foreground/80 mt-0.5">
                    AI 每日调研
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}