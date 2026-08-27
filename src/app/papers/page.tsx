'use client';

import { useState, useRef, useCallback } from 'react';
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
} from 'lucide-react';

type Mode = 'translate' | 'summary' | 'both';

interface Chunk {
  index: number;
  text: string;
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

  const [meta, setMeta] = useState<{
    title?: string;
    url?: string;
    filetype?: string;
    charCount?: number;
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
        body: JSON.stringify({ url: url.trim(), mode }),
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
  }, [url, mode]);

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
