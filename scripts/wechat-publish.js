/**
 * 微信公众号文章发布脚本
 * 将 Markdown 文章推送到微信公众号草稿箱
 *
 * 使用方法：
 *   node scripts/wechat-publish.js --appid YOUR_APPID --secret YOUR_SECRET --file content/posts/xxx.md
 *
 * 环境变量（可选）：
 *   WECHAT_APPID - 公众号 AppID
 *   WECHAT_SECRET - 公众号 AppSecret
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { remark } = require('remark');
const htmlModule = require('remark-html');
const html = htmlModule.default || htmlModule;
const gfmModule = require('remark-gfm');
const gfm = gfmModule.default || gfmModule;

// ============ 配置 ============
const SITE_URL = 'https://alwayszhang.cn';
const DEFAULT_COVER = `${SITE_URL}/images/og-default.png`;

// ============ 微信公众号 API ============

/**
 * 获取 access_token
 */
async function getAccessToken(appid, secret) {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.errcode) {
    throw new Error(`获取 access_token 失败: ${data.errcode} - ${data.errmsg}`);
  }
  console.log('✅ 获取 access_token 成功');
  return data.access_token;
}

/**
 * 上传永久素材（图片）
 */
async function uploadImage(accessToken, imagePath) {
  const formData = new FormData();
  const imageBuffer = fs.readFileSync(imagePath);
  const fileName = path.basename(imagePath);
  const blob = new Blob([imageBuffer]);
  formData.append('media', blob, fileName);

  const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (data.errcode) {
    throw new Error(`上传图片失败: ${data.errcode} - ${data.errmsg}`);
  }
  console.log(`✅ 图片上传成功: ${fileName} → ${data.media_id}`);
  return { media_id: data.media_id, url: data.url };
}

/**
 * 上传图文消息内的图片（返回 URL，不占用素材配额）
 */
async function uploadContentImage(accessToken, imagePath) {
  const formData = new FormData();
  const imageBuffer = fs.readFileSync(imagePath);
  const fileName = path.basename(imagePath);
  const blob = new Blob([imageBuffer]);
  formData.append('media', blob, fileName);

  const url = `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${accessToken}`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (data.errcode) {
    throw new Error(`上传内容图片失败: ${data.errcode} - ${data.errmsg}`);
  }
  console.log(`✅ 内容图片上传成功: ${fileName}`);
  return data.url;
}

/**
 * 新建草稿
 */
async function createDraft(accessToken, articles) {
  const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articles }),
  });
  const data = await res.json();
  if (data.errcode) {
    throw new Error(`创建草稿失败: ${data.errcode} - ${data.errmsg}`);
  }
  console.log(`✅ 草稿创建成功: media_id = ${data.media_id}`);
  return data.media_id;
}

// ============ Markdown 转换 ============

/**
 * 将 Markdown 转换为微信公众号兼容的 HTML（内联样式）
 */
async function markdownToWechatHtml(markdownContent) {
  // 先用 remark 转换为标准 HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html)
    .process(markdownContent);
  let htmlContent = processedContent.toString();

  // 转换为微信公众号兼容的内联样式 HTML
  htmlContent = applyWechatStyles(htmlContent);

  return htmlContent;
}

/**
 * 应用微信公众号内联样式
 */
function applyWechatStyles(htmlContent) {
  const styles = {
    // 基础排版
    body: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.8; color: #333; word-wrap: break-word;',
    h1: 'font-size: 24px; font-weight: bold; margin: 30px 0 20px; padding-bottom: 10px; border-bottom: 2px solid #4a5568; color: #1a202c;',
    h2: 'font-size: 20px; font-weight: bold; margin: 28px 0 16px; padding-left: 12px; border-left: 4px solid #4a5568; color: #2d3748;',
    h3: 'font-size: 18px; font-weight: bold; margin: 24px 0 14px; color: #2d3748;',
    h4: 'font-size: 16px; font-weight: bold; margin: 20px 0 12px; color: #4a5568;',
    p: 'margin: 16px 0; line-height: 1.8;',
    // 代码块
    pre: 'background: #f7f8fa; border-radius: 8px; padding: 16px; overflow-x: auto; margin: 16px 0; border: 1px solid #e2e8f0;',
    code: 'font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 14px;',
    inlineCode: 'background: #f0f2f5; color: #e53e3e; padding: 2px 6px; border-radius: 4px; font-size: 14px;',
    // 引用
    blockquote: 'margin: 16px 0; padding: 12px 20px; background: #f7f8fa; border-left: 4px solid #4a5568; color: #4a5568;',
    // 列表
    ul: 'margin: 12px 0; padding-left: 24px;',
    ol: 'margin: 12px 0; padding-left: 24px;',
    li: 'margin: 8px 0; line-height: 1.8;',
    // 表格
    table: 'width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;',
    th: 'background: #f7f8fa; border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; font-weight: 600;',
    td: 'border: 1px solid #e2e8f0; padding: 10px 14px;',
    // 链接
    a: 'color: #4a5568; text-decoration: none; border-bottom: 1px solid #4a5568;',
    // 图片
    img: 'max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;',
    // 分割线
    hr: 'border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;',
    // 粗体/斜体
    strong: 'font-weight: 600; color: #1a202c;',
    em: 'font-style: italic;',
  };

  // 替换标签，添加内联样式
  let result = htmlContent;

  // 处理各个标签
  result = result.replace(/<h1>/g, `<h1 style="${styles.h1}">`);
  result = result.replace(/<h2>/g, `<h2 style="${styles.h2}">`);
  result = result.replace(/<h3>/g, `<h3 style="${styles.h3}">`);
  result = result.replace(/<h4>/g, `<h4 style="${styles.h4}">`);
  result = result.replace(/<p>/g, `<p style="${styles.p}">`);
  result = result.replace(/<pre>/g, `<pre style="${styles.pre}">`);
  result = result.replace(/<blockquote>/g, `<blockquote style="${styles.blockquote}">`);
  result = result.replace(/<ul>/g, `<ul style="${styles.ul}">`);
  result = result.replace(/<ol>/g, `<ol style="${styles.ol}">`);
  result = result.replace(/<li>/g, `<li style="${styles.li}">`);
  result = result.replace(/<table>/g, `<table style="${styles.table}">`);
  result = result.replace(/<th>/g, `<th style="${styles.th}">`);
  result = result.replace(/<td>/g, `<td style="${styles.td}">`);
  result = result.replace(/<a /g, `<a style="${styles.a}" `);
  result = result.replace(/<img /g, `<img style="${styles.img}" `);
  result = result.replace(/<hr>/g, `<hr style="${styles.hr}">`);
  result = result.replace(/<strong>/g, `<strong style="${styles.strong}">`);
  result = result.replace(/<em>/g, `<em style="${styles.em}">`);

  // 处理 code 标签（区分行内代码和代码块内的代码）
  result = result.replace(/<pre><code class="language-([^"]*)">/g, `<pre style="${styles.pre}"><code style="${styles.code}" class="language-$1">`);
  result = result.replace(/<pre><code>/g, `<pre style="${styles.pre}"><code style="${styles.code}">`);
  // 行内代码（不在 pre 内的 code）
  result = result.replace(/(?<!<pre>.*)<code>(?!.*<\/pre>)/g, `<code style="${styles.inlineCode}">`);

  return result;
}

// ============ 主流程 ============

async function publishArticle(options) {
  const { appid, secret, filePath } = options;

  // 1. 读取 Markdown 文件
  console.log(`\n📖 读取文章: ${filePath}`);
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content: markdownContent } = matter(fileContents);

  const title = frontMatter.title || '无标题';
  const date = frontMatter.date ? new Date(frontMatter.date).toISOString().split('T')[0] : '';
  const tags = Array.isArray(frontMatter.tags) ? frontMatter.tags : [];
  const categories = Array.isArray(frontMatter.categories) ? frontMatter.categories : [];

  console.log(`📝 标题: ${title}`);
  console.log(`📅 日期: ${date}`);
  console.log(`🏷️ 标签: ${tags.join(', ') || '无'}`);

  // 2. 获取 access_token
  console.log('\n🔑 获取 access_token...');
  const accessToken = await getAccessToken(appid, secret);

  // 3. 转换 Markdown 为微信 HTML
  console.log('\n🔄 转换 Markdown 为微信格式...');
  const wechatHtml = await markdownToWechatHtml(markdownContent);

  // 添加文章头部信息
  const headerHtml = `
<section style="margin-bottom: 24px; padding: 16px; background: linear-gradient(135deg, #f7f8fa 0%, #edf2f7 100%); border-radius: 12px;">
  <p style="margin: 0; font-size: 14px; color: #718096;">
    <span style="color: #4a5568; font-weight: 600;">HalfSugar</span> · ${date}
    ${tags.length > 0 ? `<br/>标签: ${tags.map(t => `<span style="display: inline-block; background: #edf2f7; color: #4a5568; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 6px;">${t}</span>`).join('')}` : ''}
  </p>
</section>
`;

  // 添加文章尾部
  const footerHtml = `
<section style="margin-top: 40px; padding: 20px; background: #f7f8fa; border-radius: 12px; text-align: center;">
  <p style="margin: 0 0 8px; font-size: 14px; color: #718096;">
    原文发布于 <a style="color: #4a5568;" href="${SITE_URL}">HalfSugar 博客</a>
  </p>
  <p style="margin: 0; font-size: 13px; color: #a0aec0;">
    半甜不要腻 · 记录学习与生活
  </p>
</section>
`;

  const fullContent = headerHtml + wechatHtml + footerHtml;

  // 4. 生成摘要
  const digest = frontMatter.excerpt ||
    markdownContent.slice(0, 120).replace(/[#*_\[\]()]/g, '').trim() + '...';

  // 5. 上传封面图
  console.log('\n🖼️ 上传封面图...');
  const coverPath = frontMatter.cover || path.join(__dirname, '..', 'public', 'images', 'og-default.png');
  let thumbMediaId = '';
  try {
    if (fs.existsSync(coverPath)) {
      const coverResult = await uploadImage(accessToken, coverPath);
      thumbMediaId = coverResult.media_id;
    } else {
      console.log('⚠️ 封面图不存在，跳过上传（需在公众号后台手动设置封面）');
    }
  } catch (err) {
    console.log(`⚠️ 封面上传失败: ${err.message}（需在公众号后台手动设置封面）`);
  }

  // 如果没有封面图，用一个默认的 media_id（微信要求必须有）
  if (!thumbMediaId) {
    // 尝试用文章内容中的第一张图片
    const imgMatch = markdownContent.match(/!\[.*?\]\((.*?)\)/);
    if (imgMatch) {
      console.log('📷 尝试使用文章内第一张图片作为封面...');
    }
    // 微信要求 thumb_media_id 不能为空，生成一个占位图
    const placeholderPath = path.join('/tmp', 'wechat-placeholder.png');
    const sharp = require('sharp');
    await sharp({
      create: { width: 900, height: 383, channels: 3, background: { r: 49, g: 58, b: 70 } }
    }).png().toFile(placeholderPath);
    const placeholderResult = await uploadImage(accessToken, placeholderPath);
    thumbMediaId = placeholderResult.media_id;
    console.log('✅ 使用默认占位封面');
  }

  // 6. 创建草稿
  console.log('\n📤 推送到草稿箱...');
  const mediaId = await createDraft(accessToken, [
    {
      title: title,
      author: 'CuteJ',
      digest: digest,
      content: fullContent,
      content_source_url: `${SITE_URL}/posts/${encodeURIComponent(path.basename(filePath, '.md'))}/`,
      thumb_media_id: thumbMediaId,
      need_open_comment: 0,
      only_fans_can_comment: 0,
    },
  ]);

  console.log('\n' + '='.repeat(50));
  console.log('🎉 文章已成功推送到微信公众号草稿箱！');
  console.log('='.repeat(50));
  console.log(`\n📋 草稿信息:`);
  console.log(`   标题: ${title}`);
  console.log(`   media_id: ${mediaId}`);
  console.log(`\n⚠️  下一步:`);
  console.log(`   1. 登录公众号后台: https://mp.weixin.qq.com`);
  console.log(`   2. 进入「内容管理」→「草稿箱」`);
  console.log(`   3. 找到文章，设置封面图后发布`);
  console.log('');

  return mediaId;
}

// ============ CLI 入口 ============

async function main() {
  const args = process.argv.slice(2);

  let appid = process.env.WECHAT_APPID || '';
  let secret = process.env.WECHAT_SECRET || '';
  let filePath = '';

  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--appid' && args[i + 1]) {
      appid = args[++i];
    } else if (args[i] === '--secret' && args[i + 1]) {
      secret = args[++i];
    } else if (args[i] === '--file' && args[i + 1]) {
      filePath = args[++i];
    } else if (args[i] === '--help') {
      console.log(`
微信公众号文章发布工具

使用方法:
  node scripts/wechat-publish.js --appid YOUR_APPID --secret YOUR_SECRET --file content/posts/xxx.md

环境变量:
  WECHAT_APPID   公众号 AppID
  WECHAT_SECRET  公众号 AppSecret

示例:
  node scripts/wechat-publish.js --file content/posts/2026-07-17-test.md
`);
      process.exit(0);
    }
  }

  // 验证参数
  if (!appid || !secret) {
    console.error('❌ 错误: 缺少 AppID 或 AppSecret');
    console.error('请通过 --appid/--secret 参数或 WECHAT_APPID/WECHAT_SECRET 环境变量提供');
    process.exit(1);
  }

  if (!filePath) {
    console.error('❌ 错误: 缺少文件路径');
    console.error('请使用 --file 参数指定 Markdown 文件路径');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ 错误: 文件不存在: ${filePath}`);
    process.exit(1);
  }

  try {
    await publishArticle({ appid, secret, filePath });
  } catch (err) {
    console.error(`\n❌ 发布失败: ${err.message}`);
    process.exit(1);
  }
}

main();
