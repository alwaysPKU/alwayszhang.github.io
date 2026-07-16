import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
  currentCategories: string[];
}

export default function RelatedPosts({ currentSlug, currentTags, currentCategories }: RelatedPostsProps) {
  const allPosts = getAllPosts();
  
  // 基于标签和分类计算相似度
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0;
      
      // 标签匹配
      const matchingTags = post.tags.filter((tag) => currentTags.includes(tag));
      score += matchingTags.length * 2;
      
      // 分类匹配
      const matchingCategories = post.categories.filter((cat) => currentCategories.includes(cat));
      score += matchingCategories.length * 3;
      
      return { ...post, score };
    })
    .filter((post) => post.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        相关推荐
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${encodeURIComponent(post.slug)}`}
            className="group p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
          >
            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {post.title}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary/8 text-primary/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
