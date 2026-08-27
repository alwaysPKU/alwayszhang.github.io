/**
 * 论文/网页正文抓取工具
 * 基于 coze-coding-dev-sdk 的 FetchClient，将 URL 解析为纯文本。
 * 仅在服务端使用。
 */
import { FetchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import type { NextRequest } from 'next/server';

export interface FetchedDocument {
  title: string;
  url: string;
  filetype?: string;
  text: string;
  charCount: number;
}

/**
 * 抓取并提取 URL 的正文文本。
 *
 * @param preferNative true 时使用服务端原生 fetch + HTML 提取（适用于自有部署，
 *   不依赖平台内部端点）；false/默认使用平台托管的 FetchClient（解析能力更强，
 *   支持 PDF/Office，但仅在当前托管环境可用）。
 */
export async function fetchDocument(
  url: string,
  request?: NextRequest,
  preferNative = false,
): Promise<FetchedDocument> {
  if (preferNative) {
    return fetchDocumentNative(url);
  }
  try {
    return await fetchDocumentViaSDK(url, request);
  } catch (err) {
    // 内置解析不可用（如自有环境）时，回退到原生 fetch
    const message = err instanceof Error ? err.message : String(err);
    if (isPlatformUnavailable(message)) {
      return fetchDocumentNative(url);
    }
    throw err;
  }
}

function isPlatformUnavailable(message: string): boolean {
  return /(ECONNREFUSED|ENOTFOUND|fetch failed|platform|sdk|authentication|401|403)/i.test(
    message,
  );
}

async function fetchDocumentViaSDK(
  url: string,
  request?: NextRequest,
): Promise<FetchedDocument> {
  const config = new Config({ timeout: 60000 });
  const customHeaders = request
    ? HeaderUtils.extractForwardHeaders(request.headers)
    : undefined;
  const client = new FetchClient(config, customHeaders);

  const response = await client.fetch(url);

  if (response.status_code && response.status_code !== 0) {
    throw new Error(
      `抓取失败 (${response.status_code}): ${response.status_message || '未知错误'}`,
    );
  }

  const textParts: string[] = [];
  for (const item of response.content || []) {
    if (item.type === 'text' && item.text) {
      textParts.push(item.text);
    }
  }

  const rawText = textParts.join('\n');
  const text = normalizeText(rawText);

  if (!text || text.trim().length < 50) {
    throw new Error('未能从该链接解析到足够的正文内容，请尝试 PDF 直链或 arXiv 摘要页');
  }

  return {
    title: response.title || deriveTitle(text) || '未命名文档',
    url: response.url || url,
    filetype: response.filetype,
    text,
    charCount: text.length,
  };
}

/**
 * 原生 fetch 抓取：适用于自有部署环境。
 * - HTML 页面：提取 <title> 与正文区域文本
 * - PDF/二进制：返回明确提示，建议改用 arXiv 摘要页或支持文本的链接
 *   （自有环境如需 PDF 解析，可后续接入自建文档解析服务）
 */
async function fetchDocumentNative(url: string): Promise<FetchedDocument> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; HalfSugarPaperReader/1.0; +https://github.com/alwaysPKU)',
      Accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error(`抓取失败：HTTP ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get('content-type') || '';
  const finalUrl = res.url || url;

  if (contentType.includes('application/pdf') || /\.pdf(\?|$)/i.test(finalUrl)) {
    throw new Error(
      '当前使用自定义模型配置，内置 PDF 解析服务不可用。请改用论文的 HTML/摘要页链接（如 arXiv 的 /abs/ 页面），或在内置托管模式下使用 PDF 直链。',
    );
  }

  const html = await res.text();
  const { title, text } = extractHtmlContent(html);
  const cleaned = normalizeText(text);

  if (!cleaned || cleaned.trim().length < 50) {
    throw new Error('未能从该链接解析到足够的正文内容，请尝试 arXiv 摘要页或其他文本网页链接');
  }

  return {
    title: title || deriveTitle(cleaned) || '未命名文档',
    url: finalUrl,
    filetype: 'html',
    text: cleaned,
    charCount: cleaned.length,
  };
}

/**
 * 从 HTML 中提取标题与正文文本。
 * 优先选取 <article>/<main> 等语义标签，退化到 <body>；去除 script/style/nav 等噪声。
 */
function extractHtmlContent(html: string): { title: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeHtmlEntities(titleMatch[1]).trim() : '';

  // 去掉脚本、样式、导航、页脚等非正文内容
  let body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');

  // 优先抽取语义化正文容器
  const containerMatch =
    body.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    body.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    body.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (containerMatch) body = containerMatch[1];

  // 块级标签转换为换行
  const text = body
    .replace(/<\/(p|div|section|h[1-6]|li|tr|br|blockquote|pre)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+\n/g, '\n');

  return { title: decodeHtmlEntities(title), text: decodeHtmlEntities(text) };
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)));
}

/**
 * 文本清洗：压缩多余空行、去除页眉页脚噪声
 */
function normalizeText(input: string): string {
  return input
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[-−–]\s*\n\s*([a-z])/g, '$1') // 修复断词连字符
    .trim();
}

function deriveTitle(text: string): string {
  const firstLine = text.split('\n').find((l) => l.trim().length > 6);
  return firstLine ? firstLine.trim().slice(0, 120) : '';
}

/**
 * 将长文本切分为重叠分块，优先按段落边界切分。
 * @param text 原文
 * @param maxChars 每块目标字符数
 * @param overlap 相邻块重叠字符数
 */
export function chunkText(
  text: string,
  maxChars = 6000,
  overlap = 300,
): string[] {
  if (text.length <= maxChars) return [text];

  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).length > maxChars && current) {
      chunks.push(current.trim());
      // 保留尾部 overlap 作为上下文
      current = current.slice(-overlap) + '\n\n' + para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.filter((c) => c.length > 0);
}
