import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import type { PostMeta } from '@/lib/posts';

interface FeaturedPostProps {
  post: PostMeta;
  size?: 'large' | 'compact';
}

export default function FeaturedPost({ post, size = 'large' }: FeaturedPostProps) {
  const href = `/posts/${post.slug}`;
  const cover = post.ogImage;

  if (size === 'compact') {
    return (
      <Link
        href={href}
        className="group flex gap-4 rounded-xl border border-border/50 bg-card p-3 transition-all hover:border-primary/40 hover:shadow-md"
      >
        {cover && (
          <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {post.categories?.[0] && (
            <span className="mb-1 text-xs font-medium text-primary">
              {post.categories[0]}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {post.date}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
    >
      {cover ? (
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-muted sm:aspect-[16/7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>
      ) : (
        <div className="h-2 w-full bg-primary/10" />
      )}

      <div className={cover ? 'relative -mt-16 px-6 pb-6 sm:-mt-20 sm:px-8 sm:pb-8' : 'p-6 sm:p-8'}>
        {post.categories?.[0] && (
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {post.categories[0]}
          </span>
        )}
        <h2 className="mt-3 text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl md:text-3xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {post.date}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            阅读全文
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
