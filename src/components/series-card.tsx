import Link from 'next/link';
import type { SeriesGroup } from '@/lib/series';

function LayersIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      className="h-2.5 w-2.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

/**
 * 系列文章目录树卡片：
 * 卡片头为系列名 + 篇数，正文竖排各篇（总览实心书本节点 + 序号圆圈节点，左侧竖线串联）。
 * - showDate：是否在每篇右侧显示完整日期 YYYY-MM-DD（跨天/跨月均完整展示，避免只剩"日"产生歧义）。
 */
export function SeriesCard({
  name,
  posts,
  showDate = true,
}: SeriesGroup & { showDate?: boolean }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
        <LayersIcon />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          系列
        </span>
        <span className="text-sm font-medium text-foreground truncate">{name}</span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums flex-shrink-0">
          {posts.length} 篇
        </span>
      </div>

      <ol className="px-3 py-1.5">
        {posts.map((post, i) => {
          const order = post.series!.order;
          const isOverview = order === 0;
          const isFirst = i === 0;
          const isLast = i === posts.length - 1;
          // 系列目录保持文章原标题，不做短标题替换、不截断
          const label = post.title;

          return (
            <li key={post.slug} className="relative">
              {/* 竖向连接线：首篇从节点中部开始，末篇到节点中部结束 */}
              <span
                aria-hidden
                className={[
                  'absolute left-[9px] w-px bg-border/70',
                  isFirst ? 'top-1/2' : 'top-0',
                  isLast ? 'bottom-1/2' : 'bottom-0',
                ].join(' ')}
              />
              <Link
                href={`/posts/${post.slug}`}
                title={post.title}
                className="group relative flex items-start gap-2.5 rounded-md py-1.5 pl-7 pr-2 transition-colors hover:bg-muted/60"
              >
                {/* 节点：总览为实心书本，其余为序号圆圈 */}
                <span
                  className={[
                    'absolute left-0 mt-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors',
                    isOverview
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground group-hover:border-primary/60 group-hover:text-primary',
                  ].join(' ')}
                >
                  {isOverview ? (
                    <BookIcon />
                  ) : (
                    <span className="text-[10px] font-medium tabular-nums leading-none">
                      {order}
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex flex-wrap items-baseline gap-x-1.5">
                  {isOverview && (
                    <span className="flex-shrink-0 text-[11px] font-semibold text-primary">
                      总览
                    </span>
                  )}
                  <span
                    className={[
                      'leading-snug break-words transition-colors',
                      isOverview
                        ? 'text-sm font-medium text-foreground group-hover:text-primary'
                        : 'text-sm text-foreground/90 group-hover:text-primary',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </span>

                {showDate && (
                  <time
                    dateTime={post.date}
                    className="ml-auto flex-shrink-0 pt-[3px] text-xs text-muted-foreground/70 tabular-nums"
                  >
                    {post.date}
                  </time>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
