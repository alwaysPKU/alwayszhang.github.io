import { getAllPosts, type PostMeta } from '@/lib/posts';

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

  const groups: SeriesGroup[] = Array.from(map.entries()).map(([name, arr]) => {
    const ordered = arr.sort((a, b) => a.series!.order - b.series!.order);
    const latestDate = ordered.reduce(
      (max, p) => (p.date > max ? p.date : max),
      ordered[0]?.date ?? '',
    );
    return { name, posts: ordered, latestDate };
  });

  groups.sort((a, b) => (a.latestDate < b.latestDate ? 1 : -1));
  return groups;
}
