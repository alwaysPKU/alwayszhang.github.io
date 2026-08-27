import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
  trailingSlash: true,
  allowedDevOrigins: ['*.dev.coze.site'],
  // Next 16.2+ Turbopack 需要显式指定 workspace root，否则从 src/app 无法解析 next 包
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
