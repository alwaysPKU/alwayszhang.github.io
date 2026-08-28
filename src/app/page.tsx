import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/post-card';
import FeaturedPost from '@/components/featured-post';
import Link from 'next/link';
import { Archive, Tags, Gamepad2, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const posts = getAllPosts();

  // 所有分类（按文章数降序，取前 8 个）
  const categoryCount = new Map<string, number>();
  posts.forEach((p) =>
    (p.categories || []).forEach((c) =>
      categoryCount.set(c, (categoryCount.get(c) || 0) + 1)
    )
  );
  const topCategories = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => name);

  // 精选：最新一篇有封面的作为大图，其后两篇有封面的作为小图
  const withCover = posts.filter((p) => p.ogImage);
  const featuredLarge = withCover[0] ?? posts[0];
  const featuredCompact = withCover
    .filter((p) => p.slug !== featuredLarge?.slug)
    .slice(0, 2);

  // 列表：跳过精选大图，仅展示最新 15 篇，其余进入归档页
  const RECENT_LIMIT = 15;
  const listPosts = posts
    .filter((p) => p.slug !== featuredLarge?.slug)
    .slice(0, RECENT_LIMIT);
  const hasMore = posts.length - 1 > RECENT_LIMIT;

  const quickLinks = [
    { href: '/archive', label: '归档', icon: Archive },
    { href: '/tags', label: '标签', icon: Tags },
    { href: '/games', label: '游戏', icon: Gamepad2 },
    { href: '/stats', label: '统计', icon: BarChart3 },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <header className="mb-12 border-b border-border/60 pb-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-border/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/avatar.png"
              alt="HalfSugar avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              HalfSugar
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              半甜不要腻 · 记录学习、算法与 AI 前沿
            </p>
          </div>
          <div className="hidden gap-6 text-right sm:flex">
            <div>
              <div className="text-xl font-bold text-foreground">{posts.length}</div>
              <div className="text-xs text-muted-foreground">篇文章</div>
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">
                {categoryCount.size}
              </div>
              <div className="text-xs text-muted-foreground">个分类</div>
            </div>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          这里是 HalfSugar 的个人博客，分享大模型与多模态前沿论文解读、工程实践、算法题解，
          偶尔也有小游戏和生活碎片。内容按主题归档，欢迎用标签或搜索自由探索。
        </p>

        {/* 快捷入口 */}
        <nav className="mt-5 flex flex-wrap gap-2">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-sm text-foreground transition-all hover:border-primary/40 hover:text-primary"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* 热门分类 */}
        {topCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">热门分类：</span>
            {topCategories.map((c) => (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c)}`}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {c}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 精选 */}
      {featuredLarge && (
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground">最新精选</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-3">
              <FeaturedPost post={featuredLarge} size="large" />
            </div>
            <div className="flex flex-col gap-4 md:col-span-2">
              {featuredCompact.map((p) => (
                <FeaturedPost key={p.slug} post={p} size="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 最近文章 */}
      <section>
        <div className="mb-5 flex items-baseline gap-2">
          <span className="h-1.5 w-5 rounded-full bg-primary" />
          <h2 className="text-base font-semibold text-foreground">最近文章</h2>
          <span className="text-xs text-muted-foreground">
            展示 {listPosts.length} / {posts.length} 篇
          </span>
        </div>

        <div className="space-y-3">
          {listPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 text-center">
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary"
            >
              查看全部 {posts.length} 篇文章
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
