'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  BookOpen,
  Link2,
  Loader2,
  Sparkles,
  Languages,
  FileText,
  Copy,
  Check,
  AlertCircle,
  StopCircle,
  Settings2,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

type Mode = 'translate' | 'summary' | 'both';

interface Chunk {
  index: number;
  text: string;
}

interface LLMSetting {
  baseUrl: string;
  apiKey: string;
  model: string;
}

/** 常用 OpenAI 兼容服务预设。baseUrl 为站点根地址，后端会自动补 /v1。 */
const PROVIDER_PRESETS: Record<string, { label: string; baseUrl: string; model: string }> = {
  custom: { label: '自定义', baseUrl: '', model: '' },
  doubao: {
    label: '豆包 / 火山方舟（兼容模式）',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    model: 'doubao-seed-1-6-250615',
  },
  deepseek: {
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
  },
  zhipu: {
    label: '智谱 GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-plus',
  },
  openai: {
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  moonshot: {
    label: 'Moonshot Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-32k',
  },
  openrouter: {
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-chat',
  },
};

const STORAGE_KEY = 'halfsugar.papers.llm';

const EMPTY_LLM: LLMSetting = { baseUrl: '', apiKey: '', model: '' };

function loadLLMSetting(): LLMSetting {
  if (typeof window === 'undefined') return EMPTY_LLM;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_LLM;
    const parsed = JSON.parse(raw) as Partial<LLMSetting>;
    return {
      baseUrl: parsed.baseUrl || '',
      apiKey: parsed.apiKey || '',
      model: parsed.model || '',
    };
  } catch {
    return EMPTY_LLM;
  }
}

const EXAMPLE_URLS = [
  {
    label: 'arXiv 摘要页',
    url: 'https://arxiv.org/abs/1706.03762',
  },
  {
    label: 'PDF 直链',
    url: 'https://arxiv.org/pdf/1706.03762',
  },
];

export default function PapersPage() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<Mode>('both');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 模型设置
  const [llm, setLlm] = useState<LLMSetting>(EMPTY_LLM);
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState<string>('custom');
  const [showKey, setShowKey] = useState(false);
  const [savedHint, setSavedHint] = useState(false);

  const [meta, setMeta] = useState<{
    title?: string;
    url?: string;
    filetype?: string;
    charCount?: number;
    model?: string;
    modelSource?: string;
  } | null>(null);
  const [stage, setStage] = useState('');
  const [summary, setSummary] = useState('');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const reset = () => {
    setMeta(null);
    setSummary('');
    setChunks([]);
    setProgress({ current: 0, total: 0 });
    setError('');
    setStage('');
  };

  // 挂载时读取本地保存的模型配置
  useEffect(() => {
    const saved = loadLLMSetting();
    setLlm(saved);
    if (saved.baseUrl || saved.apiKey || saved.model) {
      setShowSettings(true);
    }
  }, []);

  const handleProviderChange = (key: string) => {
    setProvider(key);
    if (key === 'custom') return;
    const preset = PROVIDER_PRESETS[key];
    if (preset) {
      setLlm((prev) => ({
        baseUrl: preset.baseUrl,
        model: preset.model,
        apiKey: prev.apiKey,
      }));
    }
  };

  const handleSaveSettings = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(llm));
      setSavedHint(true);
      setTimeout(() => setSavedHint(false), 2000);
    } catch {
      setError('无法写入本地存储（浏览器隐私模式？）');
    }
  };

  const handleClearSettings = () => {
    setLlm(EMPTY_LLM);
    setProvider('custom');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const useCustomLLM = Boolean(llm.baseUrl && llm.apiKey && llm.model);

  const handleRead = useCallback(async () => {
    if (!url.trim()) {
      setError('请输入论文 URL');
      return;
    }
    reset();
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/papers/read/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          mode,
          llm: useCustomLLM ? llm : undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`请求失败 (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const raw of events) {
          const lines = raw.split('\n');
          let eventName = 'message';
          let dataStr = '';
          for (const line of lines) {
            if (line.startsWith('event:')) eventName = line.slice(6).trim();
            else if (line.startsWith('data:')) dataStr += line.slice(5).trim();
          }
          if (!dataStr) continue;
          let data: Record<string, unknown>;
          try {
            data = JSON.parse(dataStr);
          } catch {
            continue;
          }
          handleEvent(eventName, data);
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || '处理失败，请重试');
      }
    } finally {
      setLoading(false);
      setStage('');
      abortRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, mode, useCustomLLM, llm.baseUrl, llm.apiKey, llm.model]);

  function handleEvent(name: string, data: Record<string, unknown>) {
    switch (name) {
      case 'status':
        setStage(String(data.message || ''));
        if (data.total) setProgress({ current: 0, total: Number(data.total) });
        break;
      case 'meta':
        setMeta({
          title: data.title as string,
          url: data.url as string,
          filetype: data.filetype as string | undefined,
          charCount: data.charCount as number,
          model: data.model as string | undefined,
          modelSource: data.modelSource as string | undefined,
        });
        break;
      case 'summaryDelta':
        setSummary((s) => s + String(data.text || ''));
        break;
      case 'summaryDone':
        if (!summary) setSummary(String(data.summary || ''));
        break;
      case 'progress':
        setProgress({ current: Number(data.current), total: Number(data.total) });
        break;
      case 'chunk':
        setChunks((prev) => {
          const idx = Number(data.index);
          if (prev.some((c) => c.index === idx)) return prev;
          return [...prev, { index: idx, text: String(data.text || '') }];
        });
        break;
      case 'error':
        setError(String(data.message || '处理失败'));
        break;
      default:
        break;
    }
  }

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
    setStage('');
  };

  const fullTranslation = chunks
    .sort((a, b) => a.index - b.index)
    .map((c) => c.text)
    .join('\n\n');

  const handleCopy = async () => {
    const parts: string[] = [];
    if (meta?.title) parts.push(`# ${meta.title}\n`);
    if (summary) parts.push(`## 摘要解读\n${summary}\n`);
    if (fullTranslation) parts.push(`## 译文\n${fullTranslation}`);
    await navigator.clipboard.writeText(parts.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasResult = meta || summary || chunks.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          <span className="text-sm font-medium">论文助手</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          读论文
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          输入论文链接（arXiv 摘要页 / PDF 直链 / 在线网页），自动抓取正文，用大模型生成中文摘要与要点，并分块流式翻译。
        </p>
      </header>

      {/* 输入区 */}
      <section className="rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-6">
        <label className="mb-2 block text-sm font-medium text-foreground">
          论文 URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) handleRead();
              }}
              placeholder="https://arxiv.org/abs/..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={loading}
            />
          </div>
          {loading ? (
            <button
              onClick={handleStop}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              <StopCircle className="h-4 w-4" />
              停止
            </button>
          ) : (
            <button
              onClick={handleRead}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" />
              开始解析
            </button>
          )}
        </div>

        {/* 模式选择 */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">模式：</span>
          {(
            [
              { v: 'both', label: '摘要 + 翻译', icon: Sparkles },
              { v: 'summary', label: '仅摘要要点', icon: FileText },
              { v: 'translate', label: '仅全文翻译', icon: Languages },
            ] as { v: Mode; label: string; icon: typeof FileText }[]
          ).map(({ v, label, icon: Icon }) => (
            <button
              key={v}
              onClick={() => setMode(v)}
              disabled={loading}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs transition-colors ${
                mode === v
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>

        {/* 示例 */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">试试：</span>
          {EXAMPLE_URLS.map((ex) => (
            <button
              key={ex.url}
              onClick={() => setUrl(ex.url)}
              disabled={loading}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </section>

      {/* 模型设置 */}
      <section className="mt-4 rounded-xl border border-border/60 bg-card shadow-sm">
        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          className="flex w-full items-center gap-2 px-4 py-3 text-left sm:px-6"
        >
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">模型设置</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {useCustomLLM ? (
              <>
                <ShieldCheck className="h-3 w-3 text-primary" />
                使用自定义模型（Key 仅存本地浏览器）
              </>
            ) : (
              '当前使用平台内置托管模型（仅限本预览环境）'
            )}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {showSettings ? '收起' : '展开'}
          </span>
        </button>

        {showSettings && (
          <div className="space-y-4 border-t border-border/60 px-4 py-4 sm:px-6">
            <p className="text-xs leading-relaxed text-muted-foreground">
              部署到自有环境后，平台内置模型不可用，需填写你自己的 OpenAI 兼容接口。
              API Key 仅保存在你当前浏览器的 localStorage，随请求发给本博客后端用于调用模型，
              不会写入服务端磁盘。
            </p>

            {/* 服务商预设 */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                服务商预设
              </label>
              <select
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {Object.entries(PROVIDER_PRESETS).map(([key, p]) => (
                  <option key={key} value={key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Base URL */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Base URL（OpenAI 兼容端点，可含或不含 /v1）
              </label>
              <input
                type="text"
                value={llm.baseUrl}
                onChange={(e) => setLlm((s) => ({ ...s, baseUrl: e.target.value }))}
                disabled={loading}
                placeholder="https://api.deepseek.com"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                <KeyRound className="h-3 w-3" />
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={llm.apiKey}
                  onChange={(e) => setLlm((s) => ({ ...s, apiKey: e.target.value }))}
                  disabled={loading}
                  placeholder="sk-..."
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Model */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                模型名称（Model）
              </label>
              <input
                type="text"
                value={llm.model}
                onChange={(e) => setLlm((s) => ({ ...s, model: e.target.value }))}
                disabled={loading}
                placeholder="deepseek-chat"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={loading}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                保存设置
              </button>
              <button
                type="button"
                onClick={handleClearSettings}
                disabled={loading}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                清除并使用内置模型
              </button>
              {savedHint && (
                <span className="flex items-center gap-1 text-xs text-primary">
                  <Check className="h-3.5 w-3.5" />
                  已保存到本地浏览器
                </span>
              )}
            </div>

            {llm.baseUrl && llm.apiKey && llm.model && (
              <p className="rounded-md bg-primary/5 px-3 py-2 text-xs text-primary">
                将以自定义模型请求：{llm.model}（{llm.baseUrl.replace(/\/+$/, '')}
                {/\/v\d+$/.test(llm.baseUrl.replace(/\/+$/, '')) ? '' : '/v1'}）
              </p>
            )}
            {llm.baseUrl || llm.apiKey || llm.model ? (
              !(llm.baseUrl && llm.apiKey && llm.model) && (
                <p className="rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
                  Base URL、API Key、模型名称需三项都填写，才会启用自定义模型，否则回退到内置模型。
                </p>
              )
            ) : null}
          </div>
        )}
      </section>

      {/* 状态/错误 */}
      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-border/60 bg-card p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>{stage || '处理中…'}</span>
          {progress.total > 0 && (
            <span className="ml-auto tabular-nums">
              {progress.current}/{progress.total} 块
            </span>
          )}
        </div>
      )}

      {/* 结果 */}
      {hasResult && (
        <div className="mt-8 space-y-8">
          {/* Meta */}
          {meta?.title && (
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-xl font-bold leading-snug text-foreground">
                {meta.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {meta.url && (
                  <a
                    href={meta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    <Link2 className="h-3 w-3" />
                    原文链接
                  </a>
                )}
                {meta.filetype && <span>类型：{meta.filetype}</span>}
                {typeof meta.charCount === 'number' && (
                  <span>正文字数：{meta.charCount.toLocaleString()}</span>
                )}
                {meta.model && (
                  <span className="inline-flex items-center gap-1">
                    模型：{meta.model}
                    {meta.modelSource === 'custom' ? '（自定义）' : '（内置）'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 摘要 */}
          {(summary || (loading && mode !== 'translate')) && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-5 rounded-full bg-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  摘要解读
                </h3>
                {loading && !summary && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </div>
              {summary && (
                <div className="prose-paper rounded-xl border border-border/60 bg-card p-5 text-sm leading-relaxed text-foreground">
                  <MarkdownLite text={summary} />
                </div>
              )}
            </section>
          )}

          {/* 译文 */}
          {(fullTranslation || (loading && mode !== 'summary')) && (
            <section>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-5 rounded-full bg-primary" />
                  <h3 className="text-base font-semibold text-foreground">
                    全文翻译
                  </h3>
                  {loading && progress.total > 0 && mode !== 'summary' && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      ({progress.current}/{progress.total})
                    </span>
                  )}
                </div>
                {fullTranslation && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-primary" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? '已复制' : '复制'}
                  </button>
                )}
              </div>

              {progress.total > 0 && (
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              )}

              <article className="prose-paper space-y-5 rounded-xl border border-border/60 bg-card p-5 text-sm leading-relaxed text-foreground sm:p-6">
                {chunks
                  .sort((a, b) => a.index - b.index)
                  .map((c) => (
                    <MarkdownLite key={c.index} text={c.text} />
                  ))}
                {loading && mode !== 'summary' && chunks.length === 0 && (
                  <p className="text-muted-foreground">等待翻译输出…</p>
                )}
              </article>
            </section>
          )}

          <p className="text-center text-xs text-muted-foreground">
            译文与摘要由 AI 生成，仅供快速理解论文，关键内容请核对原文。
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 极简 Markdown 渲染：支持标题、粗体、列表、段落。
 * 避免为纯译文引入完整 Markdown 依赖。
 */
function MarkdownLite({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        // 标题
        const heading = lines[0].match(/^(#{1,4})\s+(.*)$/);
        if (heading) {
          const level = heading[1].length;
          const content = inline(heading[2]);
          if (level === 1)
            return (
              <h2 key={i} className="mb-2 mt-4 text-lg font-bold text-foreground">
                {content}
              </h2>
            );
          if (level === 2)
            return (
              <h3 key={i} className="mb-2 mt-4 text-base font-semibold text-foreground">
                {content}
              </h3>
            );
          return (
            <h4 key={i} className="mb-1 mt-3 text-sm font-semibold text-foreground">
              {content}
            </h4>
          );
        }
        // 列表
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          const items = lines.map((l) => l.replace(/^\s*([-*•]|\d+\.)\s+/, ''));
          return (
            <ul key={i} className="my-2 space-y-1 pl-5">
              {items.map((it, j) => (
                <li key={j} className="list-disc text-foreground/90">
                  {inline(it)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="my-2 text-foreground/90">
            {lines.map((l, j) => (
              <span key={j}>
                {inline(l)}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

function inline(text: string) {
  // 粗体 **x**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m)
      return (
        <strong key={i} className="font-semibold text-foreground">
          {m[1]}
        </strong>
      );
    return <span key={i}>{part}</span>;
  });
}
