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
  series?: {
    name: string;
    order: number;
    title?: string;
  };
}

interface YearGroup {
  year: string;
  posts: Post[];
}

interface MonthGroup {
  month: string; // "08"
  monthLabel: string;
  posts: Post[];
}

interface SeriesGroup {
  name: string;
  posts: Post[]; // 已按 series.order 升序（order=0 的总览排在最前）
}

function groupByYear(posts: Post[]): YearGroup[] {
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

/**
 * 把一个月内的文章拆成「系列分组」和「独立文章」。
 * - 带 front matter `series` 的文章聚合成系列卡片，系列内按 order 排序；
 * - 其余文章保持平铺时间线。
 */
function partitionPosts(posts: Post[]): { seriesGroups: SeriesGroup[]; standalone: Post[] } {
  const map = new Map<string, Post[]>();
  const standalone: Post[] = [];

  for (const post of posts) {
    if (post.series) {
      const arr = map.get(post.series.name) ?? [];
      arr.push(post);
      map.set(post.series.name, arr);
    } else {
      standalone.push(post);
    }
  }

  const seriesGroups: SeriesGroup[] = Array.from(map.entries()).map(([name, arr]) => ({
    name,
    posts: arr.sort((a, b) => (a.series!.order - b.series!.order)),
  }));

  // 系列卡片按其最新一篇文章的日期倒序（入参本身已按日期倒序，取首篇即可）
  seriesGroups.sort((a, b) => (a.posts[0].date < b.posts[0].date ? 1 : -1));

  return { seriesGroups, standalone };
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

function LayersIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      className="h-2.5 w-2.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

/** 独立文章的平铺时间线 */
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

/** 系列文章：目录树卡片（总览在最前，其后按序号 1..N 竖排） */
function SeriesCard({ name, posts }: SeriesGroup) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
        <LayersIcon />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          系列
        </span>
        <span className="text-sm font-medium text-foreground truncate">{name}</span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums flex-shrink-0">
          {posts.length} 篇
        </span>
      </div>

      <ol className="px-3 py-1.5">
        {posts.map((post, i) => {
          const order = post.series!.order;
          const isOverview = order === 0;
          const isFirst = i === 0;
          const isLast = i === posts.length - 1;
          const label = post.series!.title || post.title;

          return (
            <li key={post.slug} className="relative">
              {/* 竖向连接线：首篇从节点中部开始，末篇到节点中部结束 */}
              <span
                aria-hidden
                className={[
                  'absolute left-[9px] w-px bg-border/70',
                  isFirst ? 'top-1/2' : 'top-0',
                  isLast ? 'bottom-1/2' : 'bottom-0',
                ].join(' ')}
              />
              <Link
                href={`/posts/${post.slug}`}
                title={post.title}
                className="group relative flex items-center gap-2.5 rounded-md py-1.5 pl-7 pr-2 transition-colors hover:bg-muted/60"
              >
                {/* 节点：总览为实心书本，其余为序号圆圈 */}
                <span
                  className={[
                    'absolute left-0 flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors',
                    isOverview
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground group-hover:border-primary/60 group-hover:text-primary',
                  ].join(' ')}
                >
                  {isOverview ? (
                    <BookIcon />
                  ) : (
                    <span className="text-[10px] font-medium tabular-nums leading-none">
                      {order}
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex items-baseline gap-1.5">
                  {isOverview && (
                    <span className="flex-shrink-0 text-[11px] font-semibold text-primary">
                      总览
                    </span>
                  )}
                  <span
                    className={[
                      'truncate transition-colors',
                      isOverview
                        ? 'text-sm font-medium text-foreground group-hover:text-primary'
                        : 'text-sm text-foreground/90 group-hover:text-primary',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </span>

                <time className="ml-auto flex-shrink-0 text-xs text-muted-foreground/70 tabular-nums">
                  {post.date.slice(5)}
                </time>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** 一个月内的内容：先渲染系列目录树，再渲染独立文章时间线 */
function MonthContent({ posts }: { posts: Post[] }) {
  const { seriesGroups, standalone } = partitionPosts(posts);

  if (seriesGroups.length === 0) {
    return <PostList posts={standalone} />;
  }

  return (
    <div className="space-y-3">
      {seriesGroups.map((group) => (
        <SeriesCard key={group.name} name={group.name} posts={group.posts} />
      ))}
      {standalone.length > 0 && <PostList posts={standalone} />}
    </div>
  );
}

export default function ArchivePage() {
  const posts = getAllPosts();
  const yearGroups = groupByYear(posts);
  const newestYear = yearGroups[0]?.year;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">归档</h1>
      <p className="text-sm text-muted-foreground mb-8">
        共 {posts.length} 篇文章 · 按年/月分组，系列文章自动归拢为目录
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
                  <MonthContent posts={monthGroups[0].posts} />
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
                        <MonthContent posts={monthPosts} />
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
