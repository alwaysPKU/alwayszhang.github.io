import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'HalfSugar - 半甜不要腻',
    template: '%s | HalfSugar',
  },
  description: 'CuteJ 的个人博客 - 深度学习、算法、AI论文解读、小游戏与生活分享',
  authors: [{ name: 'CuteJ', url: 'https://github.com/alwaysPKU' }],
  openGraph: {
    title: 'HalfSugar - 半甜不要腻',
    description: 'CuteJ 的个人博客 - 深度学习、算法、AI论文解读、小游戏与生活分享',
    url: 'https://alwayszhang.cn',
    siteName: 'HalfSugar',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
