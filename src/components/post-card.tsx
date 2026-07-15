import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative flex flex-col gap-3 p-6 border border-border/50 rounded-lg bg-card hover:border-primary/50 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <time dateTime={post.date}>{post.date}</time>
        {post.categories && post.categories.length > 0 && (
          <>
            <span>·</span>
            <span>{post.categories.join(', ')}</span>
          </>
        )}
      </div>
      <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
        <a href={`/posts/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </a>
      </h2>
      {post.excerpt && (
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {post.excerpt}
        </p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {post.tags.map((tag) => (
            <a
              key={tag}
              href={`/tags/${tag}`}
              className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {tag}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
