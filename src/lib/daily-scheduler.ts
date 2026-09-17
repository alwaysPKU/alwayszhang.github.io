/**
 * AI 每日调研自动调度器
 * ---------------------
 * 常驻服务启动时挂载：每天 18:00（北京时间）自动运行调研脚本，
 * 生成连载文章并自动 commit + push 回 master，触发 GitHub Pages 部署。
 * 不依赖外部 cron / GitHub secrets —— 直接在本进程内调度。
 *
 * 依赖项目内置的 coze-coding-dev-sdk 认证（与沙箱一致），
 * 因此沙箱内可直接运行；生产部署如无 SDK 凭据则优雅跳过。
 */

import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const PROJECT_ROOT = process.cwd();
const POSTS_DIR = path.join(PROJECT_ROOT, 'content', 'posts');

/** 把本机任意时区的时间换算成北京时间（UTC+8）的 时:分 */
function beijingTime(): { h: number; m: number; date: string } {
  // 采用 Intl 直接取北京时间，避免依赖系统时区设置
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return {
    h: parseInt(get('hour'), 10),
    m: parseInt(get('minute'), 10),
    date: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

/** 今天（北京时间）是否已有调研文章（幂等判断） */
function todayPostExists(date: string): boolean {
  try {
    const files = fs.readdirSync(POSTS_DIR);
    return files.some((f) => f.includes(date) && f.includes('AI每日调研'));
  } catch {
    return false;
  }
}

function run(cmd: string): Promise<{ ok: boolean; out: string; err: string }> {
  return new Promise((resolve) => {
    exec(cmd, { cwd: PROJECT_ROOT, timeout: 600_000, maxBuffer: 64 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        out: stdout,
        err: stderr,
      });
    });
  });
}

async function runResearchOnce(): Promise<void> {
  const { date } = beijingTime();
  if (todayPostExists(date)) {
    console.log(`[daily-scheduler] ${date} 今日调研文章已存在，跳过。`);
    return;
  }
  console.log(`[daily-scheduler] ${date} 开始自动调研并生成文章…`);
  const gen = await run(`node scripts/daily-research.js --date=${date}`);
  if (!gen.ok) {
    console.error('[daily-scheduler] 调研生成失败：', gen.err || gen.out);
    return;
  }
  console.log('[daily-scheduler] 调研文章已生成：', gen.out.trim().split('\n').pop());

  // 自动提交并推送，触发部署
  await run('git config user.name "alwaysPKU"');
  await run('git config user.email "alwaysPKU@users.noreply.github.com"');
  await run('git add content/posts');
  const staged = await run('git diff --cached --name-only');
  if (!staged.out.trim()) {
    console.log('[daily-scheduler] 无新增内容，跳过提交。');
    return;
  }
  await run(`git commit -m "feat(daily): AI 每日调研连载 ${date}"`);
  const push = await run('git push origin HEAD:master');
  if (!push.ok) {
    console.error('[daily-scheduler] push 失败：', push.err || push.out);
    return;
  }
  console.log(`[daily-scheduler] 已推送 master，触发部署完成（${date}）。`);
}

let lastCheckedDay = '';

/** 主循环：每分钟检查一次是否到达"今天 18:00 之后且尚未运行" */
export function startDailyScheduler(): void {
  console.log('[daily-scheduler] 已挂载（每天北京时间 18:00 自动调研并发布）。');
  const tick = () => {
    const { h, m, date } = beijingTime();
    // 到达 18:00-18:01 区间且当天没跑过，则触发一次
    if (h === 18 && m >= 0 && m <= 1 && date !== lastCheckedDay) {
      lastCheckedDay = date;
      runResearchOnce();
    }
  };
  tick();
  setInterval(tick, 60_000);
}