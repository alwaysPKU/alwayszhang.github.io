import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Comments from '@/components/comments';
import LikeButton from '@/components/like-button';
import { ArticleViews } from '@/components/article-views';
import SharePoster from '@/components/share-poster';
import TableOfContents from '@/components/table-of-contents';
import ReadingProgress from '@/components/reading-progress';
import RelatedPosts from '@/components/related-posts';
import MobileGestures from '@/components/mobile-gestures';

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = 'https://alwayszhang.cn';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };

  const postUrl = `${siteUrl}/posts/${encodeURIComponent(slug)}/`;
  const ogImageUrl = `${siteUrl}/images/og-${encodeURIComponent(slug)}.png`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: 'CuteJ', url: siteUrl }],
    keywords: [...post.tags, ...post.categories].join(', '),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'HalfSugar',
      locale: 'zh_CN',
      publishedTime: post.date,
      authors: ['CuteJ'],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
      creator: '@CuteJ',
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'CuteJ',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HalfSugar',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/posts/${encodeURIComponent(slug)}/`,
    },
    keywords: [...post.tags, ...post.categories].join(', '),
    image: `${siteUrl}/images/og-${encodeURIComponent(slug)}.png`,
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress */}
      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 max-w-3xl">
            {/* Mobile Gestures */}
            <MobileGestures />

            {/* Table of Contents - Desktop */}
            <div className="hidden lg:block fixed right-8 top-20 w-64">
              <TableOfContents />
            </div>

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
          <span className="text-border">|</span>
          <ArticleViews slug={slug} />
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

      {/* Article footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center justify-between">
          <LikeButton slug={slug} />
          <SharePoster
            title={post.title}
            date={post.date}
            slug={slug}
          />
        </div>
      </div>

      {/* Related Posts */}
      <RelatedPosts
        currentSlug={slug}
        currentTags={post.tags}
        currentCategories={post.categories}
      />

      {/* Comments */}
      <div className="mt-8">
        <Comments slug={slug} title={post.title} />
      </div>
          </div>
        </div>
      </div>
    </>
  );
}
