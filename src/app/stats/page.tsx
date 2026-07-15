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

  // 计算总字数（估算）
  let totalWords = 0;
  posts.forEach((post) => {
    // 简单估算：中文字符 + 英文单词
    const content = post.excerpt || "";
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    totalWords += chineseChars + englishWords;
  });

  return (
    <StatsClient
      totalPosts={posts.length}
      totalTags={tags.length}
      monthlyStats={monthlyStats}
      yearlyStats={yearlyStats}
      tagStats={tagStats}
      categoryStats={categoryStats}
      totalWords={totalWords}
    />
  );
}
