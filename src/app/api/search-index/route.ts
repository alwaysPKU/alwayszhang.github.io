import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();

  const searchIndex = posts.map((post) => ({
    ref: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags.join(","),
  }));

  return NextResponse.json(searchIndex);
}
