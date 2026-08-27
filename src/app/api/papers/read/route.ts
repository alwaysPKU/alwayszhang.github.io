import { NextRequest } from 'next/server';
import {
  LLMClient,
  Config,
  HeaderUtils,
  APIError,
  type Message,
} from 'coze-coding-dev-sdk';
import { fetchDocument, chunkText } from '@/lib/papers';

export const runtime = 'nodejs';
export const maxDuration = 300;

type Mode = 'translate' | 'summary' | 'both';

interface Body {
  url?: string;
  mode?: Mode;
  targetLang?: string;
}

const TRANSLATION_MODEL = 'doubao-seed-2-0-pro-260215';
const MAX_CHARS_PER_CHUNK = 6000;

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const rawUrl = (body.url || '').trim();
  const mode: Mode = body.mode || 'both';
  const targetLang = body.targetLang || '简体中文';

  if (!rawUrl) {
    return new Response(
      sseEvent('error', { message: '请提供论文 URL' }),
      { status: 400, headers: sseHeaders() },
    );
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return new Response(
      sseEvent('error', { message: 'URL 格式不正确' }),
      { status: 400, headers: sseHeaders() },
    );
  }

  const encoder = new TextEncoder();
  const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(sseEvent(event, data)));

      try {
        // 1. 抓取并解析文档
        send('status', { stage: 'fetch', message: '正在抓取并解析论文…' });
        const doc = await fetchDocument(url.toString(), request);
        send('meta', {
          title: doc.title,
          url: doc.url,
          filetype: doc.filetype,
          charCount: doc.charCount,
        });

        const llm = new LLMClient(new Config({ timeout: 120000 }), customHeaders);

        // 2. 摘要 / 元信息解读
        if (mode === 'summary' || mode === 'both') {
          send('status', { stage: 'summary', message: '正在生成摘要与要点…' });
          const summary = await streamSummary(llm, doc, targetLang, send);
          send('summaryDone', { summary });
        }

        // 3. 分块翻译
        if (mode === 'translate' || mode === 'both') {
          const chunks = chunkText(doc.text, MAX_CHARS_PER_CHUNK, 300);
          send('status', {
            stage: 'translate',
            message: `开始翻译，共 ${chunks.length} 个分块…`,
            total: chunks.length,
          });

          for (let i = 0; i < chunks.length; i++) {
            send('progress', { current: i + 1, total: chunks.length });
            const translated = await translateChunk(
              llm,
              chunks[i],
              targetLang,
              i === 0,
              i === chunks.length - 1,
            );
            send('chunk', { index: i, text: translated });
          }
        }

        send('done', { ok: true });
      } catch (err) {
        const message =
          err instanceof APIError
            ? `模型服务错误: ${err.message}`
            : err instanceof Error
              ? err.message
              : '处理失败';
        send('error', { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}

function sseHeaders(): Record<string, string> {
  return {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  };
}

async function streamSummary(
  llm: LLMClient,
  doc: { title: string; text: string },
  targetLang: string,
  send: (event: string, data: unknown) => void,
): Promise<string> {
  // 摘要只取开头部分，避免无谓的长上下文消耗
  const head = doc.text.slice(0, 24000);
  const system = `你是一位资深科研编辑，擅长快速提炼论文核心。请用${targetLang}输出，严格遵循以下结构：
1. **一句话总结**：不超过 60 字，说清论文做了什么。
2. **核心问题**：论文试图解决什么问题。
3. **方法/创新点**：用 3-5 个要点列出关键方法与创新。
4. **主要结论**：实验或理论结论。
5. **阅读建议**：适合谁读、值得关注的章节。
要求专业、准确、忠于原文，不要编造原文没有的数据。`;

  const messages: Message[] = [
    { role: 'system', content: system },
    {
      role: 'user',
      content: `论文标题：${doc.title}\n\n以下是论文内容（可能为节选）：\n\n${head}`,
    },
  ];

  let acc = '';
  const stream = llm.stream(messages, {
    model: TRANSLATION_MODEL,
    temperature: 0.3,
    thinking: 'disabled',
  });
  for await (const chunk of stream) {
    if (chunk.content) {
      const text = chunk.content.toString();
      acc += text;
      send('summaryDelta', { text });
    }
  }
  return acc;
}

async function translateChunk(
  llm: LLMClient,
  chunk: string,
  targetLang: string,
  isFirst: boolean,
  isLast: boolean,
): Promise<string> {
  const system = `你是一位专业的学术论文译者，将用户提供的英文学术内容翻译成通顺、专业的${targetLang}。
翻译规则：
- 忠实原文，不增译、不漏译、不加入主观评价；
- 专业术语首次出现时用"中文（English）"格式标注，之后统一使用中文；
- 公式、数字、图表标号、引用标记 [1]、代码、变量名保持原样；
- 保持原文的段落与标题层级（Markdown 格式）；
- 若内容包含参考文献列表，保留原文不翻译；
- 只输出译文，不要任何解释或前后缀。`;

  const positionHint = isFirst
    ? '（这是论文的开头部分，请保留标题与作者信息）'
    : isLast
      ? '（这是论文的结尾部分）'
      : '';

  const messages: Message[] = [
    { role: 'system', content: system },
    {
      role: 'user',
      content: `请翻译以下论文片段${positionHint}：\n\n${chunk}`,
    },
  ];

  // 翻译用非流式 invoke，在后端聚合后作为整块发送，避免前端拼接碎片
  const response = await llm.invoke(messages, {
    model: TRANSLATION_MODEL,
    temperature: 0.2,
    thinking: 'disabled',
  });
  return response.content.trim();
}
