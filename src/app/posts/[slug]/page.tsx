import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug: encodeURIComponent(slug) }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </Link>

      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          {post.categories.length > 0 && (
            <>
              <span className="text-border">|</span>
              <div className="flex gap-1.5">
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-0.5 rounded-full bg-primary/8 text-primary/80 text-xs"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </>
          )}
          {post.tags.length > 0 && (
            <>
              <span className="text-border">|</span>
              <div className="flex gap-1.5 flex-wrap">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Article content */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  );
}
