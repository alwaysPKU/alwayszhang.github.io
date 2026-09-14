import { getAllSeries } from '@/lib/series';
import { SeriesCard } from '@/components/series-card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '系列归档',
  description: 'HalfSugar 博客系列文章归档：成体系的技术系列按目录组织，方便顺序阅读',
  openGraph: {
    title: '系列归档 | HalfSugar',
    description: '成体系的技术系列按目录组织，方便顺序阅读',
  },
};

export default function SeriesPage() {
  const series = getAllSeries();
  const totalPosts = series.reduce((sum, s) => sum + s.posts.length, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">系列归档</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {series.length} 个系列 · {totalPosts} 篇文章，按目录顺序阅读；单篇文章见{' '}
        <Link href="/archive" className="text-primary hover:underline underline-offset-4">
          时间归档
        </Link>
      </p>

      {series.length === 0 ? (
        <p className="text-sm text-muted-foreground">还没有系列文章。</p>
      ) : (
        <div className="space-y-4">
          {series.map((group) => {
            // 系列跨月时显示完整 MM-DD，单月内只显示 DD
            const months = new Set(group.posts.map((p) => p.date.slice(5, 7)));
            const crossMonth = months.size > 1;
            return (
              <div key={group.name}>
                <SeriesCard {...group} crossMonth={crossMonth} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
