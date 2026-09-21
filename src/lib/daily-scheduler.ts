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
  // 双分支推送：main 保留源码历史，master 触发 GitHub Pages 部署。
  // commit 落在当时所在分支，先把另一分支 fast-forward 到相同提交，
  // 确保 main 与 master 一致，避免 main 长期滞后。
  const cur = (await run('git rev-parse --abbrev-ref HEAD')).out.trim();
  const other = cur === 'main' ? 'master' : 'main';
  if (/^[a-zA-Z][\w./-]*$/.test(other) && other !== cur) {
    await run(`git checkout ${other} && git merge --ff-only ${cur} && git checkout ${cur}`);
  }
  const pushMain = await run('git push origin main');
  const pushMaster = await run('git push origin master');
  if (!pushMain.ok || !pushMaster.ok) {
    console.error('[daily-scheduler] push 失败：', pushMain.err || pushMaster.err);
    return;
  }
  console.log(`[daily-scheduler] 已推送 main + master，触发部署完成（${date}）。`);
}

let lastCheckedDay = '';

/**
 * 主循环：每分钟检查一次。
 * 触发规则（比"仅 18:00 那一分钟"稳健得多）：
 *  - 只要当前北京时间已到 18:00 之后（含补发/晚启动场景）
 *  - 且当天尚未生成过调研文章
 *  - 则在当天首次通过该判断时触发一次
 * 这样即便 18:00 整那一刻服务没在跑，只要之后任一时间服务存活，
 * 都会自动补齐当天的文章；已生成则天然幂等跳过。
 */
export function startDailyScheduler(): void {
  console.log('[daily-scheduler] 已挂载（每天北京时间 18:00 后自动调研并发布，含窗口期补发）。');
  const tick = () => {
    const { h, date } = beijingTime();
    const dayElapsed = h >= 18; // 已过当天 18:00
    if (dayElapsed && date !== lastCheckedDay) {
      // 当天首次通过（含晚启动导致的补发），记录后触发
      lastCheckedDay = date;
      runResearchOnce();
    }
  };
  tick();
  setInterval(tick, 60_000);
}