import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';

const siteUrl = 'https://alwayszhang.cn';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'HalfSugar - 半甜不要腻',
    template: '%s | HalfSugar',
  },
  description:
    'CuteJ 的个人博客 - 深度学习、算法、AI论文解读、大模型技术分析、小游戏与生活分享',
  keywords: [
    '技术博客',
    'AI',
    '大模型',
    '深度学习',
    '算法',
    '论文解读',
    'DeepSeek',
    'Kimi',
    '编程',
    'HalfSugar',
  ],
  authors: [{ name: 'CuteJ', url: siteUrl }],
  creator: 'CuteJ',
  publisher: 'HalfSugar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'HalfSugar',
    title: 'HalfSugar - 半甜不要腻',
    description:
      'CuteJ 的个人博客 - 深度学习、算法、AI论文解读、大模型技术分析、小游戏与生活分享',
    url: siteUrl,
    locale: 'zh_CN',
    images: [
      {
        url: `${siteUrl}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'HalfSugar - 半甜不要腻',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HalfSugar - 半甜不要腻',
    description:
      'CuteJ 的个人博客 - 深度学习、算法、AI论文解读、大模型技术分析、小游戏与生活分享',
    images: [`${siteUrl}/images/og-default.png`],
    creator: '@CuteJ',
  },
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
  verification: {
    google: 'google-site-verification=', // TODO: 替换为实际的 Google Search Console 验证码
  },
  other: {
    'theme-color': '#4a5568',
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
