'use client';

import { useMemo, useState } from 'react';

interface TagItem {
  tag: string;
  count: number;
}

export default function TagsExplorer({
  tags,
  hotTags,
}: {
  tags: TagItem[];
  hotTags: TagItem[];
}) {
  const [query, setQuery] = useState('');

  // 搜索时把热门也纳入，避免搜热门词无结果
  const all = useMemo(() => {
    const merged = new Map<string, number>();
    for (const t of [...hotTags, ...tags]) merged.set(t.tag, t.count);
    return Array.from(merged.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hans-CN'));
  }, [tags, hotTags]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tags;
    return all.filter((t) => t.tag.toLowerCase().includes(q));
  }, [query, all, tags]);

  const isSearching = query.trim().length > 0;
  const list = isSearching ? filtered : tags;

  return (
    <div>
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索标签..."
          aria-label="搜索标签"
          className="w-full rounded-lg border border-border bg-card/60 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
        />
        {isSearching && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="清除"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          没有匹配 “{query.trim()}” 的标签
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {list.map(({ tag, count }) => (
            <a
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary group"
            >
              <span className="group-hover:text-primary transition-colors">{tag}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground tabular-nums">
                {count}
              </span>
            </a>
          ))}
        </div>
      )}

      {!isSearching && tags.length > 0 && (
        <p className="mt-6 text-xs text-muted-foreground/80">
          以下为出现 5 次以下的标签，共 {tags.length} 个；使用搜索可在全部标签中快速定位。
        </p>
      )}
      {isSearching && (
        <p className="mt-6 text-xs text-muted-foreground/80">
          找到 {filtered.length} 个匹配标签
        </p>
      )}
    </div>
  );
}
