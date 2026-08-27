import { getPostsByCategory, getAllCategories, getAllPosts } from '@/lib/posts';
import PostCard from '@/components/post-card';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map(({ category }) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = decodeURIComponent(category);
  return {
    title: `${name} · 分类文章`,
    description: `HalfSugar 博客中「${name}」分类下的所有文章`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const name = decodeURIComponent(category);
  const posts = getPostsByCategory(name);

  if (posts.length === 0) notFound();

  // 相关分类：该分类下文章的其他分类，按共现次数排序
  const relatedMap = new Map<string, number>();
  for (const post of posts) {
    for (const c of post.categories) {
      if (c === name) continue;
      relatedMap.set(c, (relatedMap.get(c) || 0) + 1);
    }
  }
  const related = Array.from(relatedMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([c]) => c);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回首页
      </Link>

      <div className="mb-8 border-b border-border/60 pb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          分类
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          {name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          共 {posts.length} 篇文章
        </p>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-12 border-t border-border/60 pt-6">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            相关分类
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((c) => (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c)}`}
                className="rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
