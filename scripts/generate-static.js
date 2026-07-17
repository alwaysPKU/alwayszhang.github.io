/**
 * Build-time script to generate sitemap.xml and per-post OG images.
 * Runs before `next build`.
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://alwayszhang.cn';
const postsDir = path.join(__dirname, '..', 'content', 'posts');
const publicDir = path.join(__dirname, '..', 'public');

// --- 1. Generate sitemap.xml ---
function generateSitemap() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  // Parse posts
  const posts = files.map((filename) => {
    const content = fs.readFileSync(path.join(postsDir, filename), 'utf-8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let date = '';
    if (fmMatch) {
      const dateMatch = fmMatch[1].match(/^date:\s*(.+)$/m);
      if (dateMatch) date = dateMatch[1].trim();
    }
    const slug = filename.replace(/\.md$/, '');
    return { slug, date };
  });

  // Sort by date descending
  posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/archive/', priority: '0.8', changefreq: 'weekly' },
    { url: '/tags/', priority: '0.7', changefreq: 'weekly' },
    { url: '/games/', priority: '0.6', changefreq: 'monthly' },
    { url: '/about/', priority: '0.5', changefreq: 'monthly' },
    { url: '/stats/', priority: '0.4', changefreq: 'weekly' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // Post pages
  for (const post of posts) {
    const encodedSlug = encodeURIComponent(post.slug);
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/posts/${encodedSlug}/</loc>\n`;
    if (post.date) {
      xml += `    <lastmod>${post.date}</lastmod>\n`;
    }
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.9</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
  console.log(`[sitemap] Generated sitemap.xml with ${staticPages.length + posts.length} URLs`);
}

// --- 2. Generate robots.txt (with sitemap reference) ---
function generateRobots() {
  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /_next/',
    'Disallow: /static/',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), content, 'utf-8');
  console.log('[robots] Generated robots.txt with sitemap reference');
}

// --- 3. Generate RSS feed.xml ---
function generateRSS() {
  const matter = require('gray-matter');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const fullPath = path.join(postsDir, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(fileContents);
    const slug = filename.replace(/\.md$/, '');

    let excerpt = '';
    const raw = content.replace(/<!--more-->/g, '').trim();
    excerpt = raw.slice(0, 300).replace(/[#*_\[\]()]/g, '').trim();

    return {
      slug,
      title: String(data.title || slug),
      date: data.date ? new Date(data.date).toUTCString() : '',
      categories: Array.isArray(data.categories) ? data.categories : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
  rss += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  rss += '  <channel>\n';
  rss += `    <title>HalfSugar - 半甜不要腻</title>\n`;
  rss += `    <link>${SITE_URL}</link>\n`;
  rss += `    <description>CuteJ 的个人博客 - 深度学习、算法、AI论文解读、大模型技术分析</description>\n`;
  rss += `    <language>zh-cn</language>\n`;
  rss += `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>\n`;

  for (const post of posts) {
    const postUrl = `${SITE_URL}/posts/${encodeURIComponent(post.slug)}/`;
    rss += '    <item>\n';
    rss += `      <title><![CDATA[${post.title}]]></title>\n`;
    rss += `      <link>${postUrl}</link>\n`;
    rss += `      <guid isPermaLink="true">${postUrl}</guid>\n`;
    rss += `      <description><![CDATA[${post.excerpt}]]></description>\n`;
    if (post.date) rss += `      <pubDate>${post.date}</pubDate>\n`;
    for (const cat of post.categories) {
      rss += `      <category><![CDATA[${cat}]]></category>\n`;
    }
    rss += '    </item>\n';
  }

  rss += '  </channel>\n';
  rss += '</rss>\n';

  fs.writeFileSync(path.join(publicDir, 'feed.xml'), rss, 'utf-8');
  console.log(`[rss] Generated feed.xml with ${posts.length} posts`);
}

// Run
generateSitemap();
generateRobots();
generateRSS();
console.log('[build-scripts] All static files generated.');
