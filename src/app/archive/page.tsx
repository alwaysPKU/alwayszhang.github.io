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

const MONTH_NAMES = [
  '1 月', '2 月', '3 月', '4 月', '5 月', '6 月',
  '7 月', '8 月', '9 月', '10 月', '11 月', '12 月',
];

interface Post {
  slug: string;
  title: string;
  date: string;
}

interface YearGroup {
  year: string;
  posts: Post[];
}

interface MonthGroup {
  month: string; // 0-based index as string
  monthLabel: string;
  posts: Post[];
}

function groupByYearMonth(posts: Post[]): YearGroup[] {
  const yearMap = new Map<string, Post[]>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    if (!yearMap.has(year)) yearMap.set(year, []);
    yearMap.get(year)!.push(post);
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}

function groupByMonth(posts: Post[]): MonthGroup[] {
  const monthMap = new Map<string, Post[]>();
  for (const post of posts) {
    const month = post.date.slice(5, 7); // "08"
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push(post);
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, monthPosts]) => ({
      month,
      monthLabel: MONTH_NAMES[parseInt(month, 10) - 1],
      posts: monthPosts,
    }));
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-90"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="space-y-0.5">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/posts/${post.slug}`}
            className="group flex items-baseline gap-3 rounded-md px-2 py-1.5 -mx-2 hover:bg-muted/60 transition-colors"
          >
            <time className="text-xs text-muted-foreground tabular-nums flex-shrink-0 w-12">
              {post.date.slice(5)}
            </time>
            <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors truncate">
              {post.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ArchivePage() {
  const posts = getAllPosts();
  const yearGroups = groupByYearMonth(posts);
  const newestYear = yearGroups[0]?.year;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">归档</h1>
      <p className="text-sm text-muted-foreground mb-8">
        共 {posts.length} 篇文章 · 按年/月分组
      </p>

      <div className="space-y-2">
        {yearGroups.map(({ year, posts: yearPosts }) => {
          const monthGroups = groupByMonth(yearPosts);
          const isNewest = year === newestYear;

          return (
            <details
              key={year}
              open={isNewest}
              className="group rounded-lg border border-border/60 bg-card/30 overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 list-none hover:bg-muted/40 transition-colors marker:content-none">
                <ChevronIcon />
                <span className="text-base font-semibold text-foreground">
                  {year}
                </span>
                <span className="text-xs text-muted-foreground">
                  {yearPosts.length} 篇
                </span>
                {monthGroups.length > 1 && (
                  <span className="text-xs text-muted-foreground/70 ml-auto">
                    {monthGroups.length} 个月
                  </span>
                )}
              </summary>

              <div className="px-4 pb-4 pt-1">
                {monthGroups.length === 1 ? (
                  <PostList posts={monthGroups[0].posts} />
                ) : (
                  <div className="space-y-4">
                    {monthGroups.map(({ month, monthLabel, posts: monthPosts }) => (
                      <div key={month}>
                        <h3 className="flex items-center gap-2 mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          <span className="h-px flex-1 bg-border/60" />
                          <span>{monthLabel}</span>
                          <span className="tabular-nums">
                            {monthPosts.length}
                          </span>
                          <span className="h-px flex-1 bg-border/60" />
                        </h3>
                        <PostList posts={monthPosts} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
