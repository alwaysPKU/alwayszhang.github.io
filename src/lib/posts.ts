import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  excerpt: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

function formatDate(val: unknown): string {
  if (!val) return '';
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(val);
}

function parseCategories(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    // handle comma-separated
    return val.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  return [];
}

function parseTags(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    return val.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  return [];
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDirectory).filter((f: string) => f.endsWith('.md'));
  const posts = files.map((filename: string) => {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const { data, excerpt: matterExcerpt } = matter(fileContents);

    const slug = filename.replace(/\.md$/, '');

    // Generate excerpt: use matter excerpt or first 150 chars of content
    let excerpt = '';
    if (matterExcerpt) {
      excerpt = matterExcerpt.trim().replace(/<!--more-->/g, '').trim();
    }
    if (!excerpt) {
      const raw = fileContents.replace(/^---[\s\S]*?---/, '').replace(/<!--more-->/g, '').trim();
      excerpt = raw.slice(0, 150).replace(/[#*_\[\]()]/g, '').trim();
    }

    return {
      slug,
      title: String(data.title || slug),
      date: formatDate(data.date),
      categories: parseCategories(data.categories),
      tags: parseTags(data.tags),
      excerpt,
    };
  });

  // Sort by date descending (newest first)
  return posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Decode URL-encoded slug to match filename
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(gfm)
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  let excerpt = '';
  const raw = content.replace(/<!--more-->/g, '').trim();
  excerpt = raw.slice(0, 150).replace(/[#*_\[\]()]/g, '').trim();

  return {
    slug,
    title: String(data.title || slug),
    date: formatDate(data.date),
    categories: parseCategories(data.categories),
    tags: parseTags(data.tags),
    excerpt,
    contentHtml,
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { category: string; count: number }[] {
  const posts = getAllPosts();
  const catMap = new Map<string, number>();
  for (const post of posts) {
    for (const cat of post.categories) {
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    }
  }
  return Array.from(catMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.categories.includes(category));
}

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(postsDirectory).filter((f: string) => f.endsWith('.md'));
  return files.map((f: string) => f.replace(/\.md$/, ''));
}
