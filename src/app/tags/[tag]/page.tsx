import { getPostsByTag, getAllPosts } from '@/lib/posts';
import PostCard from '@/components/post-card';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  const tagMap = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const t of post.tags) tagMap.set(t, (tagMap.get(t) || 0) + 1);
  }
  return Array.from(tagMap.keys()).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `${decodedTag} 标签文章`,
    description: `HalfSugar 博客中关于 "${decodedTag}" 的所有文章`,
    openGraph: {
      title: `${decodedTag} | HalfSugar`,
      description: `关于 "${decodedTag}" 的所有技术文章`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(tag);

  // 相关标签：该标签下所有文章出现的其他标签，按共现次数排序
  const relatedMap = new Map<string, number>();
  for (const post of posts) {
    for (const t of post.tags) {
      if (t === decodedTag) continue;
      relatedMap.set(t, (relatedMap.get(t) || 0) + 1);
    }
  }
  const related = Array.from(relatedMap.entries())
    .map(([t, c]) => ({ tag: t, count: c }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hans-CN'))
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Link
          href="/tags"
          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          全部标签
        </Link>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">#{decodedTag}</h1>
        <p className="text-sm text-muted-foreground mt-1">共 {posts.length} 篇文章</p>
      </div>

      <div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {related.length > 0 && (
        <nav className="mt-12 border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-foreground/80 mb-3">相关标签</h2>
          <div className="flex flex-wrap gap-2">
            {related.map(({ tag: t, count }) => (
              <Link
                key={t}
                href={`/tags/${encodeURIComponent(t)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <span>{t}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground tabular-nums">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
