'use client';

import { useMemo, useState } from 'react';

interface TagItem {
  tag: string;
  count: number;
}

export interface TagGroup {
  name: string;
  tags: TagItem[];
}

export default function TagsExplorer({
  groups,
  allTags,
}: {
  groups: TagGroup[];
  allTags: TagItem[];
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allTags.filter((t) => t.tag.toLowerCase().includes(q));
  }, [query, allTags]);

  const isSearching = query.trim().length > 0;

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

      {isSearching ? (
        filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            没有匹配 “{query.trim()}” 的标签
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {filtered.map(({ tag, count }) => (
                <TagPill key={tag} tag={tag} count={count} variant="plain" />
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground/80">
              找到 {filtered.length} 个匹配标签
            </p>
          </>
        )
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.name}>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-1 h-4 bg-primary/70 rounded-full" />
                <h2 className="text-sm font-semibold text-foreground">{group.name}</h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {group.tags.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tags.map(({ tag, count }) => (
                  <TagPill key={tag} tag={tag} count={count} variant="plain" />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function TagPill({
  tag,
  count,
  variant = 'plain',
}: {
  tag: string;
  count: number;
  variant?: 'hot' | 'plain';
}) {
  const sizeCls =
    variant === 'hot' && count >= 10
      ? 'text-base px-4 py-2'
      : variant === 'hot' && count >= 7
        ? 'text-[15px] px-3.5 py-1.5'
        : 'text-sm px-3 py-1.5';
  const base =
    variant === 'hot'
      ? 'border-border bg-card/60 hover:border-primary/50 hover:bg-primary/5 hover:text-primary'
      : 'border-border bg-card/40 hover:border-primary/50 hover:bg-primary/5 hover:text-primary';
  return (
    <a
      href={`/tags/${encodeURIComponent(tag)}`}
      className={`inline-flex items-center gap-1.5 rounded-full border ${base} ${sizeCls} text-foreground/85 transition-all group`}
    >
      <span className="group-hover:text-primary transition-colors">{tag}</span>
      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground tabular-nums">
        {count}
      </span>
    </a>
  );
}
