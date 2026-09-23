#!/usr/bin/env bash
#
# 每日 AI 调研 cron 入口（由系统 cron 触发，每天北京时间 18:00）
# 职责：
#   1. 加载 COZE 集成凭据（如果存在 .env.local / 环境注入）
#   2. 运行 daily-research.js 生成当天连载文章（幂等：已存在则自动跳过）
#   3. 自动 commit + 推送 main & master，触发 GitHub Pages 部署
#
# 注意：cron 环境很干净（无 HOME 等），必须在此显式设置。

set -uo pipefail

# --- 固定环境 ---
export PATH="/usr/bin:/bin:/usr/local/bin:/workspace/projects/node_modules/.bin:$PATH"
export HOME="${HOME:-/root}"
cd /workspace/projects || exit 1

# --- git 身份（AGENTS.md 规定）---
git config user.name "alwaysPKU"
git config user.email "alwaysPKU@users.noreply.github.com"

# --- 加载 COZE 凭据（优先沙箱环境变量，其次 .env.local / 内置） ---
# 沙箱运行时已注入多组 COZE_* 变量，若缺失则从 .env.local 兜底
if [ -f .env.local ]; then
  # 只补齐缺失的必需变量，避免覆盖已注入的值
  while IFS='=' read -r k v; do
    case "$k" in
      COZE_INTEGRATION_BASE_URL|COZE_INTEGRATION_MODEL_BASE_URL|COZE_WORKLOAD_IDENTITY_API_KEY|COZE_WORKLOAD_IDENTITY_CLIENT_ID|COZE_WORKLOAD_IDENTITY_CLIENT_SECRET|COZE_WORKLOAD_IDENTITY_TOKEN_ENDPOINT|COZE_WORKLOAD_ACCESS_TOKEN_ENDPOINT)
        if [ -z "${!k:-}" ] && [ -n "$v" ]; then
          export "$k=$v"
        fi
        ;;
    esac
  done < .env.local
fi

# --- 论断言：缺少集成凭据时跳过（与 CI 行为一致，避免误推空提交） ---
if [ -z "${COZE_INTEGRATION_BASE_URL:-}" ]; then
  echo "[daily-cron] 未配置 COZE_INTEGRATION_BASE_URL，跳过本次自动生成。"
  exit 0
fi

# --- 1) 生成当天调研文章（幂等） ---
echo "[daily-cron] 开始生成 $(date '+%F') 调研文章..."
node scripts/daily-research.js 2>&1 || {
  echo "[daily-cron] 生成失败";
  exit 1;
}

# --- 2) 提交并推送 ---
if ! git diff --quiet || [ -n "$(git ls-files --others --exclude-standard content/posts)" ]; then
  git add content/posts
  date=$(date '+%Y-%m-%d')
  git commit -m "feat(daily): AI 每日调研连载 ${date}" >/dev/null 2>&1 || echo "[daily-cron] 无新增，跳过提交"
  # 确保 main 与 master 一致后双推
  cur=$(git rev-parse --abbrev-ref HEAD)
  other="master"
  [ "$cur" = "master" ] && other="main"
  git checkout "$other" >/dev/null 2>&1 && git merge --ff-only "$cur" >/dev/null 2>&1 && git checkout "$cur" >/dev/null 2>&1
  git push origin main >/dev/null 2>&1 || true
  git push origin master >/dev/null 2>&1 || true
  echo "[daily-cron] 已推送 main + master（${date}）。"
else
  echo "[daily-cron] 无文件变更，跳过提交推送。"
fi

echo "[daily-cron] 完成。"