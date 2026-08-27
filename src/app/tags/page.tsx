import { getAllTags, groupTags } from '@/lib/posts';
import TagsExplorer, { type TagGroup } from '@/components/tags-explorer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '标签',
  description: '按主题浏览 HalfSugar 博客标签，涵盖 AI 技术架构、多模态、Agent、AI 治理、算法数学等',
  openGraph: {
    title: '标签分类 | HalfSugar',
    description: '按主题浏览博客标签，涵盖 AI 技术架构、多模态、Agent、AI 治理、算法数学等',
  },
};

export default function TagsPage() {
  const tags = getAllTags();
  const hot = tags.filter((t) => t.count >= 5);
  const groups = groupTags(tags);
  const totalGroups = groups.length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">标签</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          共 {tags.length} 个标签 · {totalGroups} 个主题 · {hot.length} 个热门标签
        </p>
      </header>

      {/* 热门标签：按文章数分档字号 */}
      {hot.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-base font-semibold text-foreground">热门标签</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {hot.map(({ tag, count }) => {
              const sizeCls =
                count >= 10
                  ? 'text-base px-4 py-2'
                  : count >= 7
                    ? 'text-[15px] px-3.5 py-1.5'
                    : 'text-sm px-3 py-1.5';
              return (
                <a
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 ${sizeCls} text-foreground/85 transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary`}
                >
                  <span>{tag}</span>
                  <span className="text-[11px] font-normal text-muted-foreground tabular-nums">
                    {count}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 按主题分组的完整标签，可搜索 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-1 h-4 bg-primary rounded-full" />
          <h2 className="text-base font-semibold text-foreground">按主题浏览</h2>
        </div>
        <TagsExplorer groups={groups} allTags={tags} />
      </section>
    </div>
  );
}
