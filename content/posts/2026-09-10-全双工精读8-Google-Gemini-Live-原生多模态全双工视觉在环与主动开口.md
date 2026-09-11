---
title: "全双工语音模型精读⑧：Google Gemini Live API——原生多模态全双工、视觉在环与主动开口"
date: 2026-09-10
categories: 技术
tags:
  - 全双工
  - 语音大模型
  - Google
  - Gemini-Live
  - 多模态
  - 论文精读
  - 技术调研
series:
  name: "全双工语音模型精读"
  order: 8
  title: "Google Gemini Live"
---

> 全双工语音模型系列精读第 8 篇。本文基于 Google 官方 Gemini API 文档（Live API）梳理其原生多模态全双工方案。配套总览见《全双工语音大模型全景调研》。

## 一、定位：把"视觉在环"做成 Live API 标配

Gemini Live API 是 Google 面向实时语音/多模态对话的官方接口。和纯语音全双工不同，它从设计之初就把**音频 + 图像 + 文本**放在同一条有状态连接里：模型边听、边看、边说，是"音视频原生全双工"阵营的代表（与字节 SeedRealtime、Gander 同阵营）。

## 二、接口与模态规格（官方文档）

- **连接方式**：有状态的 **WebSocket（WSS）** 连接，双向流式；
- **输入**：
  - 音频：**16kHz、16-bit PCM**；
  - 图像：**JPEG，≤ 1 FPS**（可在对话中持续推送摄像头/屏幕画面）；
  - 文本：系统指令与上下文；
- **输出**：音频 **24kHz PCM**，以及音频转写等；
- 文档示例模型为 `gemini-3.1-flash-live-preview`（Live API 处于预览阶段，走轻量 **Flash 级**模型路线，主打低延迟）。

## 三、官方核心特性

1. **多语言对话**：约 **70 种语言**实时对话；
2. **Barge-in（随时打断）**：用户可在模型说话时直接插话，模型即时停住并响应；
3. **函数调用 + Google 搜索**：对话中调用工具、联网检索；
4. **音频转写**：实时给出语音转文字；
5. **Proactive Audio（主动音频）**：可控制模型**何时主动开口**——不必等用户发问，模型能基于上下文主动提示/追问；
6. **Affective Dialog（情感对话）**：识别并回应用户情绪，做共情式对话；
7. **实时翻译**：70+ 语言的同声传译式对话。

## 四、视觉在环：和 GPT-Live 的关键差异

Gemini Live 与 OpenAI 语音线最本质的差别在于**视觉原生在环**：

- 对话过程中可持续推送画面（摄像头/屏幕共享），模型能"看着你在做什么"来回答——比如对着实物提问、共享屏幕让模型边看边指导；
- 这与 GPT-Live（前台语音模型本身视觉缺席，图片输入放在 Realtime API 侧）形成鲜明对比；
- 与字节 SeedRealtime、腾讯 Gander 同属"边听边看边说"路线，但 Gemini Live 走的是**闭源云 API + Flash 轻量模型**，Gander 是开源全模态 Agent。

## 五、在全双工版图里的位置

- **路线归属**：原生多模态全双工，视觉在环 + 主动交互（Proactive Audio）+ 工具调用；
- **性能参照**（来自 Gander 技术报告 Full-Duplex-Bench v3，第三方同表评测）：Gemini Live 3.1 的任务 Pass@1 为 **0.540**（仅次于 GPT-Realtime 0.600），但适时接话率 78.0%、抢话率 19.2%——即"任务能力强、话轮节奏偏保守"；Gemini Live 2.5 的 Pass@1 0.490、抢话率 14.1%、Filler 仅 8.9%；
- **差异化**：Google 的优势在多模态理解底座（Gemini 系列视觉/音频能力）+ Google 搜索 + 70 语言 + 主动开口/情感对话，走"轻量 Flash + 云 API"高并发路线；
- **局限**：闭源 API（预览阶段）、无开源权重；图像帧率 ≤1 FPS（不是高帧率视频理解）；深度长任务 Agent 编排不是 Live API 的重点（那是 Gander/GPT-Live 委派架构的方向）。

## 参考来源

1. Google Gemini Live API 官方文档：https://ai.google.dev/gemini-api/docs/live-api
2. 交互评测数据引自 Gander 技术报告（Full-Duplex-Bench v3）：https://arxiv.org/abs/2609.08977
