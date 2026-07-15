import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group py-5 border-b border-border/50 last:border-b-0">
      <div className="flex flex-col gap-2">
        {/* Title */}
        <Link
          href={`/posts/${post.slug}`}
          className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug"
        >
          {post.title}
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          {post.categories.length > 0 && (
            <>
              <span className="text-border">|</span>
              <div className="flex gap-1.5">
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-1.5 py-0.5 rounded bg-primary/8 text-primary/80 text-xs"
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
              <div className="flex gap-1 flex-wrap">
                {post.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags#${encodeURIComponent(tag)}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-muted-foreground/60">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-1">
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
