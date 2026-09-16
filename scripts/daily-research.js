/**
 * AI 每日调研脚本
 * -----------------
 * 定时任务（每天 18:00，北京时间）自动运行：
 *  1) 用 SearchClient 检索国内外头部厂商动态（blog/Twitter/公众号）与 arXiv 最新论文
 *  2) 用 LLMClient 把素材汇总成一篇"AI 每日调研"连载文章
 *  3) 写入 content/posts/YYYY-MM-DD-AI每日调研-xxx.md 并打印文件名
 *
 * 用法：
 *  node scripts/daily-research.js              # 默认生成今天的
 *  node scripts/daily-research.js --date=2026-09-16
 *  node scripts/daily-research.js --dry        # 只跑搜索，不写文件，用于调试
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SearchClient, LLMClient, Config } from 'coze-coding-dev-sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(PROJECT_ROOT, 'content', 'posts');

const LEVELS = [
  '大模型',
  'AI 应用',
  '多模态',
  '具身智能',
];

const VENDOR_SITES = [
  'openai.com', 'anthropic.com', 'ai.meta.com', 'blog.google',
  'deepmind.google', 'mistral.ai', 'x.ai',
  'qwen.ai', 'open.bigmodel.cn', 'deepseek.com', 'volcengine.com',
  'modelscope.cn', 'zhipuai.cn', 'minimax.io',
];

const DEFAULT_MODEL = 'doubao-seed-2-0-pro-260215';

function parseArgs(argv) {
  const out = { date: '', dry: false };
  for (const a of argv) {
    if (a.startsWith('--date=')) out.date = a.slice(7);
    if (a === '--dry') out.dry = true;
  }
  return out;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 搜一个领域，返回格式化素材串 */
async function searchLevel(sc, level) {
  const blocks = [`===== 领域：${level} =====`];
  // 1) 通用检索
  try {
    const g = await sc.advancedSearch(`${level} 最新动态 发布 2026`, {
      count: 6,
      needUrl: true,
      timeRange: 'week',
    });
    (g.web_items || []).slice(0, 6).forEach((it) => {
      const title = it.title || '';
      const url = it.url || '';
      const content = (it.content || it.snippet || '').slice(0, 220);
      blocks.push(`- [${title}](${url}) ${content}`);
    });
  } catch (e) {
    blocks.push(`- (通用检索失败：${e?.message})`);
  }

  // 2) 头部厂商站点定向检索
  for (const site of VENDOR_SITES.slice(0, 6)) {
    try {
      const s = await sc.advancedSearch(`${level} site:${site}`, {
        count: 3,
        needUrl: true,
        sites: site,
        count: 2,
      });
      (s.web_items || []).slice(0, 2).forEach((it) => {
        blocks.push(`- [${it.title || 'untitled'}](${it.url || ''}) ${(it.snippet || it.content || '').slice(0, 180)}`);
      });
    } catch {
      /* 单个站点失败不阻塞 */
    }
  }

  // 3) arXiv 最新论文
  try {
    const ar = await sc.advancedSearch(`${level} arxiv 论文`, {
      count: 5,
      needUrl: true,
      sites: 'arxiv.org',
      timeRange: 'week',
    });
    (ar.web_items || []).slice(0, 5).forEach((it) => {
      blocks.push(`- arXiv: [${it.title || 'untitled'}](${it.url || ''}) ${(it.snippet || it.content || '').slice(0, 160)}`);
    });
  } catch (e) {
    blocks.push(`- (arXiv 检索失败：${e?.message})`);
  }

  return blocks.join('\n');
}

async function run() {
  const { date, dry } = parseArgs(process.argv.slice(2));
  const targetDate = date || todayStr();
  const cfg = new Config({ timeout: 90000 });
  const sc = new SearchClient(cfg);

  console.log(`[daily-research] 目标日期 ${targetDate}，开始检索...`);

  const collected = [];
  for (const lv of LEVELS) {
    const block = await searchLevel(sc, lv);
    collected.push(block);
  }
  // 整体综合检索（跨领域热点）
  try {
    const hot = await sc.advancedSearch('AI 大模型 具身智能 多模态 今日最热发布', {
      count: 8, needUrl: true, timeRange: 'day',
    });
    const hb = ['===== 当日最热====='];
    (hot.web_items || []).slice(0, 8).forEach((it) => {
      hb.push(`- [${it.title || 'untitled'}](${it.url || ''}) ${(it.snippet || it.content || '').slice(0, 200)}`);
    });
    collected.push(hb.join('\n'));
  } catch (e) {
    collected.push(`===== 当日最热 ==== \n- (失败：${e?.message})`);
  }

  const source = collected.join('\n\n');

  if (dry) {
    console.log('\n===== 已检索到素材（--dry 不写文件） =====\n');
    console.log(source.slice(0, 4000));
    console.log(`\n[素材总长度 ${source.length} 字符]`);
    return;
  }

  console.log(`[daily-research] 素材 ${source.length} 字符，交给 LLM 生成文章...`);

  const lc = new LLMClient(cfg);
  const [yy, mm, dd] = targetDate.split('-');
  const dateDisplay = `${yy}年${mm}月${dd}日`;
  const prompt = `你是资深 AI 技术调研编辑。下面是 ${targetDate} 这一天国内外 AI 领域（大模型、AI 应用、多模态、具身智能）在头部厂商 blog/官方动态及 arXiv 的原始检索素材。

请基于素材写一篇 Markdown 连载文章《AI 每日调研》，要求：
0. 先给一句"重点标题"：用不超过 25 个字（一个顿号/斜杠分隔的短语列表也行）概括当天最值得关注的核心动态，必须基于素材，不要空泛套话。这一句单独放一行，格式为 `【重点】xxx`，作为整篇文章的第一行。
1. 正文结构：先用 3-5 个要点做"今日速览"；再按「大模型 / AI 应用 / 多模态 / 具身智能」分节细述，每节覆盖厂商动态与 arXiv 论文；最后给一小节"本周趋势观察"。正文从第二行开始，不要把【重点】这行重复写进正文。
2. 每一条信息尽量保留原文出处链接，用 markdown 链接 [标题](url)；引不到具体 URL 的用 [来源] 括注。
3. 只依据素材，不要编造；素材不足的地方直接说明"暂未捕获到该方向动态"。
4. 语言中文，正文里如有美元金额请写成「美元」避免歧义，不要在正文出现裸的 $ 符号。
5. 行文专业、克制、信息密度高。

素材如下：
${source}

请只输出 Markdown 正文（第一行为【重点】…，第二行起为正文），不要写 front matter、不要用代码块包裹全文。`;

  const resp = await lc.invoke(
    [{ role: 'user', content: prompt }],
    { model: DEFAULT_MODEL, temperature: 0.5 },
  );
  const body = (resp.content || '').trim();

  // 解析第一行的重点标题：【重点】xxx
  const titleMatch = body.match(/^【重点】(.+)$/m);
  const keyTitle = titleMatch ? titleMatch[1].trim() : '大模型多模态具身智能前沿动态';
  // 去掉正文里的重点行，避免重复写入正文
  let article = body.replace(/^【重点】.+$/m, '').trim();

  const frontMatter = [
    '---',
    `title: "AI 每日调研 · ${dateDisplay}｜${keyTitle}"`,
    `date: "${targetDate}"`,
    'categories: ["技术调研"]',
    'tags:',
    '  - AI每日调研',
    '  - 大模型',
    '  - 多模态',
    '  - 具身智能',
    '  - 技术趋势',
    'series:',
    '  name: "AI 每日调研"',
    '  order: 0',
    '---',
    '',
  ].join('\n');

  const safe = article.replace(/\\\$/g, '美元').replace(/\$(\d)/g, '美元$1').replace(/\$/g, '（美元）');
  const filename = `${targetDate}-AI每日调研-${keyTitle.replace(/[\\/:*?"<>|\s·｜]/g, '')}.md`;
  const fullPath = path.join(POSTS_DIR, filename);

  // 幂等：当天文章已存在则跳过，避免定时任务重复提交
  if (fs.existsSync(fullPath)) {
    console.log(`[daily-research] 已存在 ${fullPath}，跳过写入（幂等）。`);
    console.log(`[daily-research] 输出文件名=${filename}`);
    return;
  }

  fs.writeFileSync(fullPath, frontMatter + safe + '\n', 'utf8');
  console.log(`[daily-research] 已写入 ${fullPath}`);
  console.log(`[daily-research] 输出文件名=${filename}`);
}

run().catch((e) => {
  console.error('[daily-research] 执行失败:', e?.message || e);
  process.exit(1);
});