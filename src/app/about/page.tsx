import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于我',
  description: '了解 HalfSugar 博客作者 CuteJ，关注深度学习、AI论文解读与技术分享',
  openGraph: {
    title: '关于我 | HalfSugar',
    description: '了解博客作者 CuteJ，关注深度学习、AI论文解读与技术分享',
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-6">About Me</h1>

      <div className="prose">
        <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <img
            src="/images/avatar.png"
            alt="avatar"
            className="h-20 w-20 rounded-full object-cover border-2 border-primary/20 shadow-sm"
          />
          <div>
            <h2 className="text-xl font-bold text-foreground m-0">CuteJ</h2>
            <p className="text-sm text-muted-foreground m-0 mt-1">
              PKU / 半甜不要腻
            </p>
          </div>
        </div>

        <h3>Welcome</h3>
        <p>
          欢迎来到我的个人主页! 这里记录着我的学习笔记、算法题解、AI 前沿论文解读，
          以及一些有趣的小游戏和生活分享。
        </p>

        <h3>Interests</h3>
        <ul>
          <li>Deep Learning & Computer Vision</li>
          <li>Large Language Models & Multimodal AI</li>
          <li>Algorithms & Data Structures</li>
          <li>Interactive Web Games</li>
        </ul>

        <h3>Contact</h3>
        <ul>
          <li>
            GitHub:{' '}
            <a href="https://github.com/alwaysPKU" target="_blank" rel="noopener noreferrer">
              @alwaysPKU
            </a>
          </li>
          <li>
            Email: v.cpp@pku.edu.cn
          </li>
        </ul>
      </div>
    </div>
  );
}
