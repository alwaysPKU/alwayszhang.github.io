import { getAllPosts, getAllTags } from "@/lib/posts";
import StatsClient from "./stats-client";

export const dynamic = "force-static";

export default function StatsPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  // 按月统计文章数量
  const monthlyStats: { [key: string]: number } = {};
  posts.forEach((post) => {
    const date = new Date(post.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyStats[key] = (monthlyStats[key] || 0) + 1;
  });

  // 按年统计文章数量
  const yearlyStats: { [key: string]: number } = {};
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString();
    yearlyStats[year] = (yearlyStats[year] || 0) + 1;
  });

  // 标签统计
  const tagStats = tags.map(({ tag, count }) => ({ tag, count }));

  // 分类统计
  const categoryStats: { [key: string]: number } = {};
  posts.forEach((post) => {
    post.categories.forEach((cat) => {
      categoryStats[cat] = (categoryStats[cat] || 0) + 1;
    });
  });

  return (
    <StatsClient
      totalPosts={posts.length}
      totalTags={tags.length}
      monthlyStats={monthlyStats}
      yearlyStats={yearlyStats}
      tagStats={tagStats}
      categoryStats={categoryStats}
    />
  );
}
