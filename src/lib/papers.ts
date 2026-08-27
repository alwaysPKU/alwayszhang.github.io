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
 * 抓取并提取 URL 的正文文本
 */
export async function fetchDocument(
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
