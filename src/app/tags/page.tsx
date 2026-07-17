import { getAllTags } from '@/lib/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '标签',
  description: '按标签浏览 HalfSugar 博客文章，涵盖 AI、大模型、深度学习、算法等主题',
  openGraph: {
    title: '标签分类 | HalfSugar',
    description: '按标签浏览博客文章，涵盖 AI、大模型、深度学习、算法等主题',
  },
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
          <a
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
          </a>
        ))}
      </div>
    </div>
  );
}
