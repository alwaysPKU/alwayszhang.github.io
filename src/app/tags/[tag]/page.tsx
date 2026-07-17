import { getPostsByTag, getAllTags } from '@/lib/posts';
import PostCard from '@/components/post-card';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag }));
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
  const posts = getPostsByTag(tag);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-6">
        <Link
          href="/tags"
          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All Tags
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          #{tag}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          共 {posts.length} 篇文章
        </p>
      </div>

      <div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
