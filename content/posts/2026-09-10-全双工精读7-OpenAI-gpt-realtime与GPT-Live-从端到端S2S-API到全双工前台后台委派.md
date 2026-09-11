---
title: "全双工语音模型精读⑦：OpenAI gpt-realtime 与 GPT-Live——从端到端 S2S API 到全双工前台/后台委派"
date: 2026-09-10
categories: 技术
tags:
  - 全双工
  - 语音大模型
  - OpenAI
  - gpt-realtime
  - GPT-Live
  - Realtime-API
  - 论文精读
  - 技术调研
series:
  name: "全双工语音模型精读"
  order: 7
  title: "OpenAI gpt-realtime / GPT-Live"
---

> 全双工语音模型系列精读第 7 篇。本文基于 OpenAI 官方博客与官方帮助文档，梳理 OpenAI 语音线两代产品：gpt-realtime（2025-08-28 GA）与 GPT-Live（2026-07-08）。配套总览见《全双工语音大模型全景调研》。

## 一、OpenAI 语音线的两代划分

OpenAI 在实时语音上有清晰的两步走：

1. **gpt-realtime**（2025-08-28 GA）：面向开发者的**端到端 speech-to-speech 单模型** + Realtime API，主打低延迟、函数调用、MCP、电话渠道；
2. **GPT-Live**（2026-07-08）：面向 ChatGPT 消费者的**全双工语音产品**，官方明确"基于全双工架构构建，可同时倾听和说话"，并引入**前台/后台委派**。

两者关系：gpt-realtime 是 API 基座能力，GPT-Live 是把全双工 + 后台智能体做成亿级用户的产品形态。

## 二、gpt-realtime：端到端 S2S 单模型

来源：OpenAI 官方博客《Introducing gpt-realtime》（2025-08-28）。

### 核心定位
- **端到端 speech-to-speech 单模型**，不是 ASR→LLM→TTS 级联；Realtime API 同步 GA；
- 相比上代 gpt-4o-realtime-preview，智能、指令遵循、函数调用全面提升。

### 官方评测
| 基准 | gpt-realtime | 上代 |
|---|---|---|
| Big Bench Audio（音频推理） | **82.8%** | 65.6% |
| MultiChallenge（指令遵循） | **30.5%** | 20.6% |
| ComplexFuncBench（复杂函数调用） | **66.5%** | 49.7% |

### API 新能力
- **远程 MCP server 支持**：实时语音中直接接入外部工具生态；
- **图片输入**：Realtime API 侧支持视觉（注意：这与 GPT-Live 产品侧"视觉缺席"不同）；
- **SIP 电话拨入**：可接入电话网络；
- **异步函数调用**：等工具返回结果期间对话不断流；
- 新音色 **Cedar、Marin**。

### 定价（官方）
- 比 gpt-4o-realtime-preview **降价 20%**；
- 音频输入 **32 美元 / 百万 token**（缓存输入 0.40 美元），音频输出 **64 美元 / 百万 token**。

## 三、GPT-Live：全双工架构 + 前台/后台委派

来源：OpenAI 官方博客《Introducing GPT-Live》（2026-07-08）及官方帮助文档。

### 全双工交互
官方原文要点：
- "基于**全双工架构**构建，可以**同时倾听和说话**"；
- 会用"嗯嗯""是啊"等**附和词（backchannel）**表示在听；
- 支持**快速来回**对话，用户思考时它**安静等待**（不靠 VAD 硬切）；
- OpenAI 在论文引用中把 GPT-Live 的全双工架构描述为"**类似 Moshi**"——即双流原生建模路线。

### 前台/后台委派（小脑-大脑思想的产品化）
- 需要**网页搜索、深度推理或复杂工作**时，GPT-Live 会在幕后**委派给最新前沿模型**（发布时为 **GPT-5.5**）；
- 等待后台结果期间，**前台语音对话不中断**——这正是"实时性与深度推理不该由同一套权重承担"的工程共识；
- 两个版本：**GPT-Live-1** 与 **GPT-Live-1 mini**，面向全球 ChatGPT 用户逐步推出，API 随后开放。

### 规模与治理
- 官方称每周超 **1.5 亿**用户使用 ChatGPT 语音/听写；
- 2026-07-31 更新：GPT-Live 生成音频加入 **SynthID 水印**，并开放验证 API。

### 一个重要边界：GPT-Live 本身视觉缺席
- GPT-Live 作为语音产品，**视觉能力不在前台语音模型里**；图片/屏幕输入是在 Realtime API（gpt-realtime）侧支持。这一点和 SeedRealtime、Gemini Live、Gander 的"音视频原生在环"形成差异。

## 四、在全双工版图里的位置

- **gpt-realtime** 是"**端到端 S2S + 成熟工具链**"的代表：MCP、SIP、异步函数调用、图片输入构成最完整的开发者生态，Full-Duplex-Bench v3 上 GPT-Realtime 的任务 Pass@1 达 **0.600**（在 Gander 报告的六个基线中最高），工具选择 F1 0.876；
- **GPT-Live** 是"**小脑-大脑派**"的产品标杆：前台轻量全双工语音模型管交互节奏，后台 GPT-5.5 管深度任务，与 2026 年 9 月腾讯混元开源的 Gander（Cerebellum-Brain + task_start/send/resolve 编排）在架构思想上同构——一个闭源产品化、一个开源可复现；
- OpenAI 路线的特点是**生态与渠道最成熟**（MCP/SIP/水印/计费），但在"音视频原生全双工"上相对保守（视觉放在 API 而非 Live 前台）。

## 参考来源

1. OpenAI gpt-realtime 发布（2025-08-28）：https://openai.com/index/introducing-gpt-realtime/
2. OpenAI GPT-Live 发布（2026-07-08）：https://openai.com/index/introducing-gpt-live/
3. ChatGPT 语音官方帮助文档：https://help.openai.com/en/articles/20001274-chatgpt-voice
