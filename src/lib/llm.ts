/**
 * LLM 客户端工厂
 *
 * 两种模式：
 * 1. 内置模式（默认）：使用平台托管的 coze-coding-dev-sdk，零配置，
 *    仅在当前开发/托管环境可用。
 * 2. 自定义模式：用户提供 OpenAI 兼容的 baseURL / apiKey / model，
 *    适用于部署到自有生产环境（豆包火山方舟、DeepSeek、智谱、OpenAI、
 *    Moonshot、OpenRouter 等兼容 /v1/chat/completions 的服务）。
 *
 * 仅在服务端使用。
 */
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import type { NextRequest } from 'next/server';

export interface CustomLLMConfig {
  baseUrl?: string;
  apiKey?: string;
  model?: string;
}

/**
 * 规范化 baseUrl：去掉末尾斜杠；若用户填的是站点根地址（不含 /v1），
 * 自动补上 /v1，匹配 OpenAI 兼容接口约定。
 */
function normalizeBaseUrl(raw: string): string {
  let u = raw.trim().replace(/\/+$/, '');
  if (!/\/v\d+$/.test(u)) {
    u = `${u}/v1`;
  }
  return u;
}

/**
 * 判断是否提供了完整的自定义配置
 */
export function hasCustomLLMConfig(cfg?: CustomLLMConfig): boolean {
  return Boolean(cfg?.baseUrl && cfg.apiKey && cfg.model);
}

/**
 * 创建 LLMClient。
 * - 自定义配置完整时：用用户提供的 baseUrl/apiKey 直连第三方 OpenAI 兼容接口。
 * - 否则回退到平台托管的内置 SDK（透传 forward headers）。
 */
export function createLLMClient(
  custom?: CustomLLMConfig,
  request?: NextRequest,
): { client: LLMClient; model: string; source: 'custom' | 'builtin' } {
  if (hasCustomLLMConfig(custom)) {
    const baseUrl = normalizeBaseUrl(custom!.baseUrl!);
    const config = new Config({
      apiKey: custom!.apiKey!,
      // modelBaseUrl 是 SDK 透传给底层 ChatOpenAI 的 baseURL
      modelBaseUrl: baseUrl,
      baseUrl,
      timeout: 120000,
    });
    // 自定义模式下不透传平台内部 header，避免鉴权冲突
    return {
      client: new LLMClient(config),
      model: custom!.model!,
      source: 'custom',
    };
  }

  const customHeaders = request
    ? HeaderUtils.extractForwardHeaders(request.headers)
    : undefined;
  return {
    client: new LLMClient(new Config({ timeout: 120000 }), customHeaders),
    model: process.env.PAPERS_DEFAULT_MODEL || 'doubao-seed-2-0-pro-260215',
    source: 'builtin',
  };
}
