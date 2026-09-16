# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── content/posts/          # Markdown 博客文章（从原 Jekyll _posts 迁移）
├── public/
│   ├── games/              # 小游戏 HTML 文件（18个独立游戏）
│   └── images/             # 图片资源（头像、背景等）
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── page.tsx        # 首页（文章列表）
│   │   ├── archive/        # 归档页（按年分组）
│   │   ├── tags/           # 标签页 + 标签筛选
│   │   ├── games/          # 游戏中心
│   │   ├── about/          # 关于我
│   │   └── posts/[slug]/   # 文章详情页
│   ├── components/         # 组件（header, footer, post-card, theme-provider）
│   ├── lib/posts.ts        # 博客数据层（读取/解析 Markdown）
│   └── server.ts           # 自定义服务端入口
├── package.json
└── tsconfig.json
```

## 包管理规范

**仅允许使用 pnpm** 作为包管理器。

## 开发规范

### 博客文章格式
- 文章存放在 `content/posts/` 目录
- 文件名格式：`YYYY-MM-DD-slug.md`
- Front Matter 字段：`title`, `date`, `categories`, `tags`
- **系列文章字段（可选）`series`**：同一系列的文章填同一 `series.name`；`series.order` 为系列内排序序号（`0` = 总览/索引篇，会排在系列最前；正篇从 `1` 起递增）；`series.title` 字段已不再用于目录展示——系列归档页 `/series` 直接显示每篇文章的原标题（长标题换行不截断）。该页会自动把同系列文章归拢成一棵目录树（总览实心书本节点 + 序号圆圈节点），按系列最新更新时间倒序排列；时间归档 `/archive` 仍把每篇按年/月平铺。示例：
  ```yaml
  series:
    name: "全双工语音模型精读"
    order: 3
    title: "GLM-4-Voice"
  ```
- **文章日期必须取写作当天的系统日期**（先执行 `date '+%Y-%m-%d'` 确认），文件名日期与 front matter 的 `date` 保持一致；**不要**用被调研事件的发布日期作为文章日期（事件日期作为事实写在正文里即可）
- Markdown 正文中的美元符号必须转义为 `\$`（如 `\$10`），否则会被 KaTeX 误解析为数学公式定界符
- 支持 GFM（GitHub Flavored Markdown）

### 页面路由
- `/` - 首页，展示最新文章列表
- `/archive` - 按年/月的纯时间线归档（所有文章，含系列单篇）
- `/daily` - 每日调研连载页：展示系列 `AI 每日调研` 的文章，按日期倒序
- `/series` - 系列文章归档：带 `series` front matter 的文章按系列聚合成目录树
- `/tags` - 标签云
- `/tags/[tag]` - 按标签筛选文章
- `/games` - 小游戏中心（18个 HTML 游戏）
- `/about` - 关于页面
- `/posts/[slug]` - 文章详情页

### 每日调研连载（定时任务）
- 脚本：`scripts/daily-research.js`，用 coze-coding-dev-sdk（SearchClient + LLMClient）检索国内外头部厂商动态与 arXiv 论文，汇总成 `series.name = "AI 每日调研"` 的连载文章，写入 `content/posts/YYYY-MM-DD-AI每日调研-*.md`。
- 幂等：当天文章已存在则跳过写入，避免重复提交。
- 手动运行：`node scripts/daily-research.js [--date=YYYY-MM-DD] [--dry]`（沙箱内置 SDK 认证）。
- 标题格式：`AI 每日调研 · YYYY年MM月DD日｜当天重点标题`；LLM 会先把重点标题输出为正文首行 `【重点】xxx`，脚本解析后写入 title 并从正文剔除。
- 展示范围：每日调研连载只在 `/daily` 页与首页展示；`getAllPosts()`（archive/tags/series/stats/搜索等）默认排除 `AI 每日调研` 系列，首页与 `getDailyPosts()` 须用 `getAllPostsIncludingDaily()`。
- 定时触发：`.github/workflows/daily-research.yml`，`schedule: cron '0 10 * * *'`（北京时间 18:00）运行脚本，生成后 commit + push 回 master 触发 Pages 部署。
- CI 注意：GitHub Actions 里 SDK 需通过仓库 Secrets（`CI_COZE_INTEGRATION_BASE_URL` 等 COZE_* 凭据）注入；未配置时 workflow 优雅跳过并在日志提示。

### 功能特性
- 暗色模式（next-themes）
- 响应式设计
- Markdown 渲染（remark + remark-gfm）
- 代码高亮样式

## Git 推送规范

**每次推送必须使用以下身份**（已在 AGENTS.md 中记录，每次会话开始时必须检查）：

```bash
git config user.name "alwaysPKU"
git config user.email "alwaysPKU@users.noreply.github.com"
```

**禁止**使用沙箱默认身份（`用户 3031733109593`）推送。

## 文章发布流程规范

**必须遵循以下流程**：

1. **撰写文章** — 完成文章初稿
2. **用户确认** — 展示文章预览或关键内容，等待用户确认
3. **推送 GitHub** — 用户确认后执行 `git commit` 和 `git push`
4. **发布公众号** — 用户确认后执行微信公众号草稿箱推送

**禁止**在未经用户确认的情况下自动推送到 GitHub 或微信公众号。

**确认方式**：
- 展示文章标题、摘要、关键章节
- 或展示文章预览链接（本地构建后）
- 等待用户明确回复"发布"、"推送"、"确认"等指令

## 构建与运行

```bash
pnpm install          # 安装依赖
pnpm run dev          # 开发模式
pnpm run build        # 生产构建
pnpm run start        # 生产运行
```
