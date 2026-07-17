import { getAllPosts, getAllTags } from "@/lib/posts";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import StatsClient from "./stats-client";
import type { Metadata } from 'next';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: '写作统计',
  description: 'HalfSugar 博客写作数据统计，包括文章数量、分类分布、月度趋势等',
  openGraph: {
    title: '写作统计 | HalfSugar',
    description: '博客写作数据统计，包括文章数量、分类分布、月度趋势等',
  },
};

const postsDirectory = path.join(process.cwd(), "content/posts");

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

  // 计算总字数（读取完整文章内容）
  let totalWords = 0;
  const files = fs.readdirSync(postsDirectory).filter((f: string) => f.endsWith(".md"));
  files.forEach((filename: string) => {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const { content } = matter(fileContents);
    
    // 移除 front matter、代码块、HTML 标签、Markdown 标记
    const cleanContent = content
      .replace(/```[\s\S]*?```/g, "") // 移除代码块
      .replace(/<[^>]+>/g, "") // 移除 HTML 标签
      .replace(/[#*_~`\[\]()>-]/g, "") // 移除 Markdown 标记
      .replace(/\s+/g, ""); // 移除空白
    
    // 统计中文字符和英文单词
    const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;
    const numbers = (cleanContent.match(/\d+/g) || []).length;
    
    totalWords += chineseChars + englishWords + numbers;
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
