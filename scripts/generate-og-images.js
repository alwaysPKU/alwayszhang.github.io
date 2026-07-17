/**
 * Build-time script to generate OG (Open Graph) images for social sharing.
 * Uses sharp to create PNG images with text overlay.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_NAME = 'HalfSugar';
const SITE_TAGLINE = '半甜不要腻';
const AUTHOR = 'CuteJ';
const postsDir = path.join(__dirname, '..', 'content', 'posts');
const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Color palette - matches the blog's dark blue-gray theme
const BG_COLOR = '#1a1f2e';
const ACCENT_COLOR = '#6366f1';
const TEXT_COLOR = '#e2e8f0';
const MUTED_COLOR = '#94a3b8';
const CARD_BG = '#252b3b';

/**
 * Create an SVG template for OG image
 */
function createOGSvg(title, options = {}) {
  const {
    width = 1200,
    height = 630,
    isDefault = false,
    date = '',
    tags = [],
  } = options;

  // Truncate long titles
  let displayTitle = title;
  if (displayTitle.length > 50) {
    displayTitle = displayTitle.slice(0, 47) + '...';
  }

  // Word wrap for title (max ~25 chars per line for CJK)
  const lines = [];
  const maxCharsPerLine = 22;
  let remaining = displayTitle;
  while (remaining.length > 0) {
    if (remaining.length <= maxCharsPerLine) {
      lines.push(remaining);
      break;
    }
    // Find a good break point
    let breakAt = maxCharsPerLine;
    // Try to break at space or punctuation
    const spaceIdx = remaining.lastIndexOf(' ', maxCharsPerLine);
    const punctIdx = Math.max(
      remaining.lastIndexOf('，', maxCharsPerLine),
      remaining.lastIndexOf('、', maxCharsPerLine),
      remaining.lastIndexOf('：', maxCharsPerLine),
      remaining.lastIndexOf('-', maxCharsPerLine),
    );
    if (punctIdx > maxCharsPerLine * 0.5) breakAt = punctIdx + 1;
    else if (spaceIdx > maxCharsPerLine * 0.5) breakAt = spaceIdx + 1;

    lines.push(remaining.slice(0, breakAt));
    remaining = remaining.slice(breakAt);
    if (lines.length >= 3) {
      lines[2] = lines[2].slice(0, -3) + '...';
      break;
    }
  }

  const titleY = isDefault ? 280 : 240;
  const titleSvg = lines
    .map(
      (line, i) =>
        `<text x="80" y="${titleY + i * 65}" font-family="sans-serif" font-size="48" font-weight="700" fill="${TEXT_COLOR}">${escapeXml(line)}</text>`,
    )
    .join('\n');

  // Tag pills
  const tagSvg = tags
    .slice(0, 4)
    .map((tag, i) => {
      const x = 80 + i * 130;
      const y = height - 130;
      return `
        <rect x="${x}" y="${y}" width="${Math.min(tag.length * 18 + 24, 120)}" height="32" rx="16" fill="${ACCENT_COLOR}" opacity="0.2"/>
        <text x="${x + 12}" y="${y + 22}" font-family="sans-serif" font-size="14" fill="${ACCENT_COLOR}">${escapeXml(tag)}</text>
      `;
    })
    .join('');

  // Decorative elements
  const decorSvg = `
    <!-- Top-right gradient circle -->
    <circle cx="${width - 100}" cy="80" r="200" fill="${ACCENT_COLOR}" opacity="0.06"/>
    <circle cx="${width - 50}" cy="120" r="120" fill="${ACCENT_COLOR}" opacity="0.04"/>
    <!-- Bottom-left gradient circle -->
    <circle cx="100" cy="${height - 50}" r="180" fill="${ACCENT_COLOR}" opacity="0.04"/>
    <!-- Accent line -->
    <rect x="80" y="${titleY - 40}" width="60" height="4" rx="2" fill="${ACCENT_COLOR}"/>
  `;

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BG_COLOR}"/>
      <stop offset="100%" style="stop-color:#0f1219"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <!-- Card area -->
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="24" fill="${CARD_BG}" opacity="0.5"/>

  ${decorSvg}

  <!-- Site name -->
  <text x="80" y="100" font-family="sans-serif" font-size="28" font-weight="600" fill="${ACCENT_COLOR}">${SITE_NAME}</text>
  <text x="${80 + SITE_NAME.length * 17 + 12}" y="100" font-family="sans-serif" font-size="18" fill="${MUTED_COLOR}">${SITE_TAGLINE}</text>

  ${isDefault ? `
  <!-- Default page subtitle -->
  <text x="80" y="360" font-family="sans-serif" font-size="24" fill="${MUTED_COLOR}">深度学习 · 算法 · AI论文解读 · 技术分享</text>
  ` : `
  <!-- Date -->
  ${date ? `<text x="80" y="${height - 80}" font-family="sans-serif" font-size="16" fill="${MUTED_COLOR}">${date} · ${AUTHOR}</text>` : ''}
  `}

  ${titleSvg}
  ${tagSvg}
</svg>`;

  return svg;
}

function escapeXml(str) {
  if (typeof str !== 'string') str = String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateDefaultOG() {
  const svg = createOGSvg('HalfSugar', { isDefault: true });
  await sharp(Buffer.from(svg)).png().toFile(path.join(imagesDir, 'og-default.png'));
  console.log('[og] Generated og-default.png');
}

async function generatePostOG() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  for (const filename of files) {
    const fullPath = path.join(postsDir, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(fileContents);

    const slug = filename.replace(/\.md$/, '');
    const title = String(data.title || slug);
    const date = data.date ? String(data.date) : '';
    const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];

    const svg = createOGSvg(title, { date, tags });
    const outPath = path.join(imagesDir, `og-${slug}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
  }
  console.log(`[og] Generated ${files.length} post OG images`);
}

async function main() {
  await generateDefaultOG();
  await generatePostOG();
  console.log('[og] All OG images generated.');
}

main().catch((err) => {
  console.error('[og] Error generating OG images:', err);
  process.exit(1);
});
