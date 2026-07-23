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
- 支持 GFM（GitHub Flavored Markdown）

### 页面路由
- `/` - 首页，展示最新文章列表
- `/archive` - 按年归档的所有文章
- `/tags` - 标签云
- `/tags/[tag]` - 按标签筛选文章
- `/games` - 小游戏中心（18个 HTML 游戏）
- `/about` - 关于页面
- `/posts/[slug]` - 文章详情页

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
