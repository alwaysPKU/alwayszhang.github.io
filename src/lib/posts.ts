import 'server-only';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import math from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  ogImage?: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

function formatDate(val: unknown): string {
  if (!val) return '';
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(val);
}

function parseCategories(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    // 兼容中英文逗号、中文顿号、分号分隔
    return val
      .split(/[,，、;；]/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * 标签同义词规范化映射：键为原始写法（统一转小写后匹配），值为规范标签。
 * 仅合并明确同义的写法；不同但相关的概念（如公司与其产品线、公司与产品名）保持独立。
 */
const TAG_SYNONYMS: Record<string, string> = {
  // 大小写 / 中英混用
  llm: '大语言模型',
  aigc: '生成式AI',
  'ai agent': 'Agent',
  agentic: 'Agent',
  'agentic ai': 'Agent',
  python: 'Python',
  github: 'GitHub',
  leetcode: 'LeetCode',
  html: 'HTML',
  rtc: '实时音视频',
  // 中英同义
  nvidia: '英伟达',
  nsfc: '国自然',
  rfis: '外国学者研究基金',
  waic: '世界人工智能大会',
  coze: '扣子',
  doubao: '豆包',
  moonshot: '月之暗面',
  // 公司主体合并（保留其产品线为独立标签）
  阿里: '阿里巴巴',
  华为昇腾: '华为',
  // 产品/概念写法统一
  k3: 'Kimi K3',
  'c端产品': 'C端',
  'ai商业化': '商业化',
  'attention residuals': 'AttnRes',
};

/** 标签主题一级分组：顺序即展示顺序。未命中的标签归入“其他”。 */
export const TAG_GROUPS: { name: string; tags: string[] }[] = [
  {
    name: 'AI 技术与架构',
    tags: [
      'Transformer', '注意力机制', '自注意力', '多头注意力', '线性注意力',
      '稀疏注意力', '混合注意力',
      'Mamba', 'MoE', 'KV Cache', 'Prompt Caching', '缓存机制', '语义缓存',
      'DiT', 'VQ-VAE', 'VQGAN', 'Flow-Matching', 'DDPM', '扩散模型',
      'Streaming DiT', 'SAO', '自回归', '思维链', '推理优化', '推测解码',
      '推理控制', '实时生成', '失配',
      'Titans', 'TTT', '长上下文', '编解码', '深度学习', '深度学习-视觉',
      '计算机视觉', '架构创新', '架构设计', 'AttnRes', 'H3', 'Flash', 'MoT', 'AGI',
    ],
  },
  {
    name: '训练·对齐·强化',
    tags: [
      'GRPO', 'RLHF', 'DPO', 'SFT', '后训练', '预训练', '强化学习',
      '自奖励', '自博弈', '递归自我改进', '对齐', '训练数据', '记忆机制',
      'Harness', 'Next-State-Prediction', '训练方法', '异步训练', 'DSpark',
      'Agent安全', 'AI 安全',
    ],
  },
  {
    name: '多模态与生成',
    tags: [
      '多模态', '全模态', '统一模型', 'UMM', 'NEO-unify', 'Chameleon',
      'Transfusion', 'Omni Model', 'Omni', 'Janus-Pro', 'Show-o', 'BAGEL',
      'Emu3', 'Emu3.5', '图像生成', '文本到图像', '图像编辑', '视频生成',
      'Causal Video Generation', '数字人', 'MoonEP', 'UniVideo', 'WITA-Omni',
      '世界模型', '具身智能', '机器人', '视觉思维链',
      'VCoT', 'Visual-Aware-CoT', 'Visual-Sketchpad', 'Gen-VCoT', 'CoVT',
      'CoT-VLA', 'CLIP', 'LLaVA', 'InternVL', 'Qwen-VL', 'V4', 'AIGC',
    ],
  },
  {
    name: 'Agent 与应用',
    tags: [
      'Agent', '智能体', 'AgentEnv', 'Agent Memory', 'RAG', 'Prompt Engineering',
      'AI编程', 'AI 编程', 'Codex', 'Claude Code', 'AI应用', 'C端', 'B端', '扣子',
      '编程Agent',
      'AI降噪',
    ],
  },
  {
    name: '模型·公司·产品',
    tags: [
      '大模型', '大语言模型', '开源', '开源模型', '开放权重', 'DeepSeek', 'Kimi', 'Kimi K3',
      '月之暗面', 'Qwen', '阿里巴巴', '阿里平头哥', '通义万象', '字节跳动',
      '豆包', 'Seeduplex', '商汤', 'SenseNova', '腾讯云', 'OpenAI', 'Anthropic',
      'Gemini', 'Claude', 'GPT-4o', 'GPT-5', '智元',
      '智谱', 'GLM', 'Z.ai',
      'MiniMax', 'Hailuo', 'Boogu', 'Boogu-Image', 'MiniCPM', 'Lance',
      'DiDA', 'KDA', 'FlashKDA', 'Mem0', 'MemGPT',
    ],
  },
  {
    name: '算力·芯片·基建',
    tags: [
      '算力', '国产算力', '国产芯片', '英伟达', 'GPU', 'GB200', '华为', '昇腾950',
      '真武M890', '超节点', '芯片封锁', 'AI基础设施', '数据工程', '多租户隔离', '硬件',
      '类脑计算', '脉冲神经网络', 'SNN', 'LIF', 'STDP', '神经形态芯片',
      '低功耗AI',
    ],
  },
  {
    name: '音视频·工程',
    tags: [
      'WebRTC', '实时音视频', 'QUIC', 'LiveKit', '声网', 'DuplexSLA',
      '编程', 'Python', 'GitHub', 'HTML',
    ],
  },
  {
    name: 'AI 治理与社会',
    tags: [
      'AI治理', '算法透明度', '生成式AI', '公众信任', 'AI信任', '可解释AI', '内容溯源',
      'C2PA', 'SynthID', '算法备案', '欧盟AI法案', '双重加工理论', '系统1系统2',
      '系统1', '系统2', '卡尼曼', '启发式与偏差', '行为经济学', '认知心理学',
      '中美AI竞争', '中美科技', '地缘政治', '世界人工智能大会', '商业化',
      '商业模式', '单位经济学', '边际成本', '成本优化', '推理成本', '行业分析',
    ],
  },
  {
    name: '论文·学习',
    tags: [
      '论文解读', '论文翻译', '综述', '技术综述', '技术解析', '技术深度', '技术历史',
      '学习路径', '研究设计', '模型对比', 'AI评测', '评测', 'AAII', 'LMArena',
      'AI芯片对比', 'Arena', 'Elo', 'Bradley-Terry',
    ],
  },
  {
    name: '算法·数学·游戏',
    tags: [
      'LeetCode', '算法er的自我修养', '数学', '数学猜想', '菲尔兹奖',
      '千禧年难题', '希尔伯特问题', '挂谷猜想', '游戏', '2048', '数独',
      '生命游戏',
    ],
  },
  {
    name: '科研·基金',
    tags: [
      '国自然', '外国学者研究基金', '基金申请', '博士后', '国际合作', '结题',
      '评审',
    ],
  },
  {
    name: '专栏·系列·生活',
    tags: [
      '拾遗', '任意门', '飞船乐园', '赶海', '珠海', '外伶仃岛', '海洋王国',
      '亲子游', 'MBTI', '王虹', '邓煜',
    ],
  },
];

function normalizeTag(raw: string): string {
  const trimmed = raw.trim();
  const key = trimmed.toLowerCase();
  return TAG_SYNONYMS[key] ?? trimmed;
}

/** 将外部传入的标签（含历史别名、不同大小写写法）解析为当前规范标签。 */
export function resolveTag(raw: string): string {
  return normalizeTag(raw);
}

function parseTags(val: unknown): string[] {
  let raw: string[] = [];
  if (Array.isArray(val)) raw = val.map(String);
  else if (typeof val === 'string') {
    raw = val.split(/[,，、;；]/);
  }
  // 规范化同义词并去重（保序）
  const seen = new Set<string>();
  const result: string[] = [];
  for (const t of raw) {
    const norm = normalizeTag(t);
    if (norm && !seen.has(norm)) {
      seen.add(norm);
      result.push(norm);
    }
  }
  return result;
}

/** 将标签归入主题分组，返回按分组组织的结果；未归类标签放入“其他”。 */
export function groupTags(
  tags: { tag: string; count: number }[],
): { name: string; tags: { tag: string; count: number }[] }[] {
  const countMap = new Map(tags.map((t) => [t.tag, t.count]));
  const assigned = new Set<string>();
  const groups = TAG_GROUPS.map((g) => {
    const items = g.tags
      .filter((name) => countMap.has(name))
      .map((name) => ({ tag: name, count: countMap.get(name) ?? 0 }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
    items.forEach((i) => assigned.add(i.tag));
    return { name: g.name, tags: items };
  }).filter((g) => g.tags.length > 0);

  const others = tags
    .filter((t) => !assigned.has(t.tag))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  if (others.length > 0) groups.push({ name: '其他', tags: others });
  return groups;
}

let _postsCache: PostMeta[] | null = null;

export function getAllPosts(): PostMeta[] {
  if (_postsCache) return _postsCache;

  const files = fs.readdirSync(postsDirectory).filter((f: string) => f.endsWith('.md'));
  const posts = files.map((filename: string) => {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const { data, excerpt: matterExcerpt } = matter(fileContents);

    const slug = filename.replace(/\.md$/, '');

    // Generate excerpt: use matter excerpt or first 150 chars of content
    let excerpt = '';
    if (matterExcerpt) {
      excerpt = matterExcerpt.trim().replace(/<!--more-->/g, '').trim();
    }
    if (!excerpt) {
      const raw = fileContents.replace(/^---[\s\S]*?---/, '').replace(/<!--more-->/g, '').trim();
      excerpt = raw.slice(0, 150).replace(/[#*_\[\]()]/g, '').trim();
    }

    return {
      slug,
      title: String(data.title || slug),
      date: formatDate(data.date),
      categories: parseCategories(data.categories),
      tags: parseTags(data.tags),
      excerpt,
      ogImage: data.ogImage ? String(data.ogImage).trim() : undefined,
    };
  });

  // Sort by date descending (newest first)
  _postsCache = posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  return _postsCache;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Decode URL-encoded slug to match filename
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(gfm)
    .use(math)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  const contentHtml = processedContent.toString();

  let excerpt = '';
  const raw = content.replace(/<!--more-->/g, '').trim();
  excerpt = raw.slice(0, 150).replace(/[#*_\[\]()]/g, '').trim();

  return {
    slug,
    title: String(data.title || slug),
    date: formatDate(data.date),
    categories: parseCategories(data.categories),
    tags: parseTags(data.tags),
    excerpt,
    contentHtml,
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { category: string; count: number }[] {
  const posts = getAllPosts();
  const catMap = new Map<string, number>();
  for (const post of posts) {
    for (const cat of post.categories) {
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    }
  }
  return Array.from(catMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  const decodedTag = decodeURIComponent(tag);
  const canonical = normalizeTag(decodedTag);
  return getAllPosts().filter((p) => p.tags.includes(canonical));
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.categories.includes(category));
}

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(postsDirectory).filter((f: string) => f.endsWith('.md'));
  return files.map((f: string) => f.replace(/\.md$/, ''));
}
