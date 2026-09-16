import { getAllPosts, getAllPostsIncludingDaily, type PostMeta } from '@/lib/posts';

export interface SeriesGroup {
  /** 系列名（front matter 的 series.name） */
  name: string;
  /** 系列内文章，已按 series.order 升序（order=0 的总览排在最前） */
  posts: PostMeta[];
  /** 系列最新一篇文章的日期，用于系列之间倒序排列 */
  latestDate: string;
}

/**
 * 汇总所有带 front matter `series` 的文章，按系列名聚合成目录分组。
 * - 每个系列内部按 series.order 升序；
 * - 系列之间按"最新一篇文章日期"倒序（最近更新的系列排最前）。
 */
export function getAllSeries(): SeriesGroup[] {
  const posts = getAllPosts();
  const map = new Map<string, PostMeta[]>();

  for (const post of posts) {
    if (!post.series) continue;
    const arr = map.get(post.series.name) ?? [];
    arr.push(post);
    map.set(post.series.name, arr);
  }

  // 「论文解读」系列按编号（order）倒排 —— 编号越大越靠前，最新解读置顶；
  // 其余系列按 order 升序（order=0 总览排最前）。
  const REVERSE_SERIES_NAMES = new Set(['论文解读']);
  const groups: SeriesGroup[] = Array.from(map.entries()).map(([name, arr]) => {
    const ordered = arr.sort((a, b) =>
      REVERSE_SERIES_NAMES.has(name)
        ? b.series!.order - a.series!.order
        : a.series!.order - b.series!.order,
    );
    const latestDate = ordered.reduce(
      (max, p) => (p.date > max ? p.date : max),
      ordered[0]?.date ?? '',
    );
    return { name, posts: ordered, latestDate };
  });

  groups.sort((a, b) => (a.latestDate < b.latestDate ? 1 : -1));
  return groups;
}

/** 每日调研连载系列的固定名 */
export const DAILY_SERIES_NAME = 'AI 每日调研';

/**
 * 获取每日调研连载系列的文章，按日期倒序（最新在前）。
 * 用于 /daily 连载页展示。
 * 注意：必须用 getAllPostsIncludingDaily() —— getAllPosts() 已默认排除该系列。
 */
export function getDailyPosts(seriesName = DAILY_SERIES_NAME): PostMeta[] {
  const posts = getAllPostsIncludingDaily();
  return posts
    .filter((p) => p.series?.name === seriesName)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}