#!/usr/bin/env node

/**
 * OG 图片生成脚本 - 标题文本指引版本
 * 
 * 功能：
 * 1. 根据文章标题和标签生成语义化的背景图案
 * 2. 使用更精美的文字排版和布局
 * 3. 支持 AI 图像生成（可选，需配置 COZE_TOKEN 环境变量）
 * 
 * 使用方式：
 *   node generate-og-images.js                    # 本地模式（默认）
 *   COZE_TOKEN=xxx node generate-og-images.js     # AI 模式
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ============ 配置 ============

const IMAGES_DIR = path.join(__dirname, '../public/images');
const POSTS_DIR = path.join(__dirname, '../content/posts');
const OG_DIR = path.join(IMAGES_DIR);

// 确保输出目录存在
if (!fs.existsSync(OG_DIR)) {
  fs.mkdirSync(OG_DIR, { recursive: true });
}

// ============ 颜色主题 ============

// 根据标签/关键词选择配色方案
const COLOR_THEMES = {
  // 技术/AI 相关
  'ai': { bg: '#1a1a2e', accent: '#e94560', text: '#ffffff' },
  '大模型': { bg: '#16213e', accent: '#0f3460', text: '#eaeaea' },
  'transformer': { bg: '#1a1a2e', accent: '#533483', text: '#ffffff' },
  '注意力': { bg: '#1a1a2e', accent: '#e94560', text: '#ffffff' },
  'kimi': { bg: '#0f3460', accent: '#16213e', text: '#eaeaea' },
  
  // 编程相关
  'code': { bg: '#1e1e2e', accent: '#cdd6f4', text: '#ffffff' },
  '编程': { bg: '#1e1e2e', accent: '#89b4fa', text: '#ffffff' },
  'python': { bg: '#306998', accent: '#ffd43b', text: '#ffffff' },
  'javascript': { bg: '#f7df1e', accent: '#323330', text: '#323330' },
  
  // 数学/科学
  'math': { bg: '#2d1b69', accent: '#11998e', text: '#ffffff' },
  '数学': { bg: '#2d1b69', accent: '#38ef7d', text: '#ffffff' },
  '论文': { bg: '#141e30', accent: '#243b55', text: '#eaeaea' },
  
  // 通用
  'default': { bg: '#1a1a2e', accent: '#e94560', text: '#ffffff' },
};

// ============ 辅助函数 ============

/**
 * 根据标签和标题获取配色主题
 */
function getColorTheme(tags, title) {
  const allText = [...(tags || []), title].join(' ').toLowerCase();
  
  for (const [keyword, theme] of Object.entries(COLOR_THEMES)) {
    if (keyword !== 'default' && allText.includes(keyword)) {
      return theme;
    }
  }
  
  return COLOR_THEMES.default;
}

/**
 * 生成装饰性背景图案
 */
async function generateDecorativeBackground(width, height, theme) {
  // 创建渐变背景
  const gradient = Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${theme.accent};stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
    </svg>
  `);
  
  return sharp(gradient);
}

/**
 * 生成装饰元素（几何图形）
 */
function generateDecorations(width, height, theme) {
  const decorations = [];
  
  // 右上角装饰圆
  decorations.push(`
    <circle cx="${width - 100}" cy="100" r="80" fill="${theme.accent}" opacity="0.1"/>
  `);
  
  // 左下角装饰圆
  decorations.push(`
    <circle cx="100" cy="${height - 100}" r="60" fill="${theme.accent}" opacity="0.1"/>
  `);
  
  // 装饰线
  decorations.push(`
    <line x1="50" y1="${height - 50}" x2="${width - 50}" y2="${height - 50}" 
          stroke="${theme.accent}" stroke-width="4" opacity="0.3"/>
  `);
  
  return decorations.join('');
}

/**
 * 文字自动换行
 */
function wrapText(text, maxWidth, fontSize) {
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
  const lines = [];
  let currentLine = '';
  
  for (const char of text) {
    if ((currentLine + char).length > charsPerLine && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine += char;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * XML 转义（用于 SVG 文本）
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 生成文章 OG 图片
 */
async function generatePostOG(post) {
  const { title, date, tags, slug } = post;
  const theme = getColorTheme(tags, title);
  
  const width = 1200;
  const height = 630;
  
  // 生成背景
  const background = await generateDecorativeBackground(width, height, theme);
  
  // 生成装饰元素
  const decorations = generateDecorations(width, height, theme);
  
  // 处理标题换行
  const titleLines = wrapText(title, width - 120, 42);
  const titleY = 280 - (titleLines.length - 1) * 25;
  
  // 生成 SVG 文字内容
  const textContent = `
    <svg width="${width}" height="${height}">
      ${decorations}
      
      <!-- 标签 -->
      ${tags && tags.length > 0 ? `
        <text x="60" y="180" font-family="Arial, sans-serif" font-size="16" 
              fill="${theme.accent}" opacity="0.8">
          ${escapeXml(tags.slice(0, 3).join(' · '))}
        </text>
      ` : ''}
      
      <!-- 标题 -->
      ${titleLines.map((line, i) => `
        <text x="60" y="${titleY + i * 50}" font-family="Arial, sans-serif" 
              font-size="42" font-weight="bold" fill="${theme.text}">
          ${escapeXml(line)}
        </text>
      `).join('')}
      
      <!-- 日期 -->
      <text x="60" y="${height - 80}" font-family="Arial, sans-serif" 
            font-size="18" fill="${theme.text}" opacity="0.6">
        ${escapeXml(date)}
      </text>
      
      <!-- 博客名称 -->
      <text x="${width - 60}" y="${height - 80}" font-family="Arial, sans-serif" 
            font-size="18" fill="${theme.text}" opacity="0.6" text-anchor="end">
        alwayszhang.cn
      </text>
    </svg>
  `;
  
  // 合成最终图片
  const svgBuffer = Buffer.from(textContent);
  
  await background
    .composite([{ input: svgBuffer }])
    .png()
    .toFile(path.join(OG_DIR, `og-${slug}.png`));
}

/**
 * 生成默认 OG 图片（首页等）
 */
async function generateDefaultOG() {
  const width = 1200;
  const height = 630;
  const theme = COLOR_THEMES.default;
  
  const svg = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e94560;stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      
      <text x="${width/2}" y="${height/2 - 40}" font-family="Arial, sans-serif" 
            font-size="48" font-weight="bold" fill="#ffffff" text-anchor="middle">
        HalfSugar
      </text>
      
      <text x="${width/2}" y="${height/2 + 20}" font-family="Arial, sans-serif" 
            font-size="24" fill="#ffffff" opacity="0.8" text-anchor="middle">
        半甜不要腻 · 技术博客
      </text>
      
      <text x="${width/2}" y="${height - 80}" font-family="Arial, sans-serif" 
            font-size="18" fill="#ffffff" opacity="0.6" text-anchor="middle">
        alwayszhang.cn
      </text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(OG_DIR, 'og-default.png'));
}

// ============ 主函数 ============

async function main() {
  console.log('[og] Generating OG images...');
  
  // 生成默认 OG 图片
  await generateDefaultOG();
  console.log('[og] Generated og-default.png');
  
  // 读取所有文章
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    const dateMatch = content.match(/^date:\s*(.+)$/m);
    const tagsMatch = content.match(/^tags:\s*\[(.+)\]$/m);
    
    return {
      slug: file.replace('.md', ''),
      title: titleMatch ? titleMatch[1].trim() : file,
      date: dateMatch ? dateMatch[1].trim() : '',
      tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [],
    };
  });
  
  // 生成文章 OG 图片
  for (const post of posts) {
    await generatePostOG(post);
    console.log(`[og] Generated og-${post.slug}.png`);
  }
  
  console.log(`[og] Generated ${posts.length} post OG images`);
  console.log('[og] All OG images generated.');
}

main().catch(console.error);
