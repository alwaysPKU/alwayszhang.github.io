import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '归档',
  description: 'HalfSugar 博客所有文章按时间归档，涵盖深度学习、AI论文解读、算法分析等内容',
  openGraph: {
    title: '文章归档 | HalfSugar',
    description: '所有文章按时间归档，涵盖深度学习、AI论文解读、算法分析等内容',
  },
};

export default function ArchivePage() {
  const posts = getAllPosts();

  // Group by year
  const grouped = new Map<string, typeof posts>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(post);
  }

  const years = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">Archive</h1>
      <p className="text-sm text-muted-foreground mb-8">
        共 {posts.length} 篇文章
      </p>

      {years.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="h-1 w-3 rounded-full bg-primary" />
            {year}
            <span className="text-xs font-normal text-muted-foreground">
              ({grouped.get(year)!.length} 篇)
            </span>
          </h2>
          <div className="space-y-1">
            {grouped.get(year)!.map((post) => (
              <div
                key={post.slug}
                className="flex items-baseline gap-3 py-1.5 group"
              >
                <time className="text-xs text-muted-foreground flex-shrink-0 tabular-nums w-20">
                  {post.date.slice(5)}
                </time>
                <a
                  href={`/posts/${post.slug}`}
                  className="text-sm text-foreground group-hover:text-primary transition-colors truncate"
                >
                  {post.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
