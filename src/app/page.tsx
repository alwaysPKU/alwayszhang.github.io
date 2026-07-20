import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/post-card';
import Link from 'next/link';

export default function HomePage() {
  const posts = getAllPosts();

  // 获取所有分类
  const categories = Array.from(
    new Set(posts.flatMap((p) => p.categories || []))
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Hero Section */}
      <section className="mb-16 relative">
        {/* 背景装饰 */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          {/* 头像 */}
          <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg flex-shrink-0 group hover:scale-105 transition-transform duration-300">
            <img
              src="/images/avatar.png"
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>

          {/* 标题区 */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                HalfSugar
              </span>
            </h1>
            <p className="text-base text-muted-foreground">
              半甜不要腻 / Come on!
            </p>
          </div>

          {/* 统计卡片 */}
          <div className="flex gap-3 text-sm">
            <div className="px-4 py-2 rounded-lg bg-card border border-border/50 shadow-sm">
              <div className="text-2xl font-bold text-primary">{posts.length}</div>
              <div className="text-xs text-muted-foreground">篇文章</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border/50 shadow-sm">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-xs text-muted-foreground">个分类</div>
            </div>
          </div>
        </div>

        {/* 简介 */}
        <p className="text-muted-foreground leading-relaxed max-w-2xl text-base">
          记录学习、算法、AI 前沿论文解读，偶尔分享小游戏和生活。
        </p>

        {/* 快捷入口 */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            归档
          </Link>
          <Link
            href="/tags"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            标签
          </Link>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            游戏
          </Link>
          <Link
            href="/stats"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            统计
          </Link>
        </div>
      </section>

      {/* 文章列表 */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="h-1.5 w-6 rounded-full bg-primary" />
          <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
          <span className="text-sm text-muted-foreground">
            ({posts.length} 篇)
          </span>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
