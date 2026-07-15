import { getAllTags } from '@/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags',
  description: '文章标签',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">Tags</h1>
      <p className="text-sm text-muted-foreground mb-8">
        共 {tags.length} 个标签
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors group"
          >
            <span className="text-foreground/80 group-hover:text-primary transition-colors">
              {tag}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
