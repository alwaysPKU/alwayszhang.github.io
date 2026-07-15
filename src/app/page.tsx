import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* Hero */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm flex-shrink-0">
            <img
              src="/images/avatar.jpg"
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              HalfSugar
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              半甜不要腻 / Come on!
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          记录学习、算法、AI 前沿论文解读，偶尔分享小游戏和生活。
        </p>
      </section>

      {/* Post list */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="h-1 w-4 rounded-full bg-primary" />
          Recent Posts
        </h2>
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
