---
title: "全双工语音大模型全景调研（2026年9月）：13 个维度看懂 Moshi、GPT-Live、Gemini Live、SeedRealtime、Gander 们的技术路线"
date: 2026-09-10
categories: 技术
tags:
  - 全双工
  - 语音大模型
  - Moshi
  - GPT-Live
  - Gemini Live
  - SeedRealtime
  - Seeduplex
  - Qwen3-Omni
  - Qwen3.5-Omni
  - Freeze-Omni
  - Gander
  - 端到端语音
  - 技术调研
---

> 本文所有大厂模型数据均来自其官方博客、官方技术文档或 arXiv 论文，文末附一手来源链接。第三方实测数据单独标注。截至 2026 年 9 月 10 日。

## 一、先统一概念：全双工不是 0/1 开关

"全双工"（Full-duplex）来自通信领域：双方可以同时收发信号。对照三档：

- **单工**：单向，如广播；
- **半双工**：双向但不能同时，如对讲机——早期语音助手靠外置 **VAD（语音活动检测）**当开关，你停顿它才说，它说你被静音，一问一答；
- **全双工**：像打电话，AI 边听边说，你可以随时打断、插话，它还会用"嗯""是啊"表示在听（backchannel，附和词）。

Moshi 论文（arXiv 2410.00037）把级联+VAD 方案的三个病根讲得很清楚：① 多个模型串联导致数秒延迟；② 文本作为中间模态丢失情绪、笑声等非语言信息；③ 按话轮切分无法处理重叠语音、打断和感叹。

**关键认知：全双工是一条光谱**，从"打断得很快"到"架构意义上的双流建模"有明确代差：

```
级联+VAD        流式端到端+快速打断      chunk状态预测         真双流建模
(传统IVR)       (GLM-4-Voice类)        (Freeze-Omni)        (Moshi / GPT-Live / SeedRealtime)
 ←──────────── 半双工 / 伪双工 ──────────────────────→ 真全双工
```

真双流模型把"用户音频流 + AI 音频流"放在同一序列里联合自回归，模型在自己说话的同时持续对用户音频做推理；中间档只是把打断延迟压短。

## 二、对比框架：13 个维度

评测一个全双工模型，不能只看"能不能打断"：

| # | 维度 | 关键问题 |
|---|---|---|
| 1 | 架构范式 | 级联（ASR→LLM→TTS）还是端到端 Speech-to-Speech？ |
| 2 | Token 化 | 神经 codec 码率/帧率多少？（主流 12.5 token/s） |
| 3 | 双工机制 | 双流并行？chunk 状态预测？外置/预测式 VAD？ |
| 4 | 语义-声学对齐 | Inner Monologue？Thinker-Talker？文本参照流式生成？ |
| 5 | LLM 骨干策略 | 从零训练？冻结 LLM 防遗忘？分阶段解冻？MoE？ |
| 6 | 延迟 | 理论/实测 glass-to-glass、首包延迟、**打断恢复延迟**分开看 |
| 7 | 话轮智能 | 停顿 vs 结束判断、插话、附和词、多人、抗噪 |
| 8 | 副语言 | 情绪、笑声、叹息、语速、方言、音色克隆 |
| 9 | 模态范围 | 纯语音？音视频原生（视觉在环）？ |
| 10 | 智能上限 | 推理、工具调用、Agent 任务、上下文长度 |
| 11 | 规模部署 | 参数量、云端/端侧、量化显存、并发 RTF |
| 12 | 语言 | 语种数、方言、口音 |
| 13 | 开放程度 | 闭源 API / 开源权重 / 许可证 |

## 三、四条技术路线

| 路线 | 开创者 | 核心思想 | 代表 |
|---|---|---|---|
| **双流原生派** | Moshi（Kyutai, 2024.9） | 用户流 + AI 流并行自回归 + 文本"内心独白"流对齐 | Moshi、Seeduplex、SeedRealtime |
| **冻结骨干派** | Freeze-Omni（2024.11） | 语音数据量小，全量微调会让 LLM 灾难性遗忘；冻结 LLM，只训语音模块 + chunk 状态预测双工 | Freeze-Omni、VITA 系列 |
| **Thinker-Talker 派** | Qwen2.5/3-Omni（阿里） | 推理（Thinker）与流式语音合成（Talker）解耦，Talker 轻量边想边说 | Qwen3-Omni、Qwen3.5-Omni、Gander 的小脑 |
| **小脑-大脑派** | GPT-Live（2026.7）/ Gander（2026.9） | 实时交互交给轻量"前台/小脑"，深度推理和工具委派给大模型"后台/大脑" | GPT-Live、Gander |

注意第四条路线和前三条不互斥：它是**系统级分工**——工程界形成的共识是"实时性和深度推理不该由同一套权重承担"。

## 四、开源/学术模型逐个详解

### 1. Moshi（Kyutai，法国，2024.9）——全双工鼻祖

来源：论文 arXiv 2410.00037（https://arxiv.org/abs/2410.00037），代码 github.com/kyutai-labs/moshi

- **架构**：文本 LM 骨干出发，把语音建模为神经音频 codec 的残差量化 token；**用户语音和自身语音分成两条并行流**建模，取消显式话轮；
- **Inner Monologue**：先预测与音频时间对齐的**文本 token 作为音频 token 前缀**，显著提升语言质量，同时白送流式 ASR 和 TTS 能力；
- **Codec**：自研 Mimi，24kHz 音频压到约 1.1kbps；
- **延迟**：论文原文"理论 160ms，实际约 200ms"，是第一个实时全双工语音大模型；
- **短板**：仅英法等少数语言、无视觉、智能受限于骨干规模。

### 2. Freeze-Omni（腾讯优图/西工大/腾讯 TEG 等，2024.11）——冻结派

来源：论文 arXiv 2411.00774（https://arxiv.org/abs/2411.00774），项目页 freeze-omni.github.io

- **核心主张**：整个训练**冻结 LLM 参数**，语音输入输出模态以适配器方式接入，保证语音模态智商与文本模态同级，避免灾难性遗忘；
- **训练成本极低**：文本-语音配对数据（ASR/TTS 数据）+ 仅 6 万条多轮文本问答，8 张 GPU 即可完成；
- **双工**：多任务训练出双工对话能力（chunk 级状态判断）；
- 后续 VITA 系列（VITA-1.5 入选 NeurIPS 2025）加入视觉，逼近 GPT-4o 级实时音视频交互。

### 3. GLM-4-Voice-9B（智谱，2024.10）——端侧中文实用派

来源：官方仓库 github.com/THUDM/GLM-4-Voice，技术报告 arXiv 2412.02612、数据扩展方法 arXiv 2411.17607

- **三组件**：① Tokenizer = Whisper Encoder + 向量量化，**每秒音频 12.5 个离散 token**；② Decoder = 基于 CosyVoice 的 Flow Matching 流式解码器，**最少 10 个语音 token 即可开合成**；③ GLM-4-Voice-9B 在 GLM-4-9B 上做语音预训练对齐（数百万小时音频 + 数千亿 token 音文交错数据）；
- **流式思考架构**：流式交替输出文本和语音，语音以文本为参照保质量，最低输出 20 个 token 即可出声；
- **可控性**：情感、语调、语速、方言（东北话、重庆话、北京话等）可由语音指令直接控制；
- **部署**：开源权重，**INT4 量化可跑**（官方提供 int4 启动方式），是本地中文语音助手的最常见选择。

### 4. Qwen3-Omni（阿里，2025.9）——开源全能旗舰

来源：技术报告 arXiv 2509.17765（https://arxiv.org/abs/2509.17765），Apache 2.0 开源

- **Thinker-Talker MoE**：Thinker 30B 总参/3B 激活（MoE），Talker 3B/0.3B（MoE）；音频编码器 AuT 约 650M（2000 万小时监督音频训练，12.5Hz token 率），视觉编码器 SigLIP2 系 540M，MTP 80M，Code2Wav 卷积解码器 200M；
- **流式设计**：Talker 自回归预测 15 个 RVQ 码本的主码本，MTP 预测残差码本，因果 ConvNet 还原波形（不用扩散模型）；**左上下文-only 生成不等块上下文** + Chunked Prefilling 异步；
- **官方延迟数据**：音频首包 **234ms**、视频首包 547ms；RTF 0.47（1 并发）~0.66（6 并发）；音质 MOS 4.3；
- **成绩**：36 项音频/音视频基准中 **32 项开源 SOTA、22 项总 SOTA**，超过 Gemini-2.5-Pro、GPT-4o-Transcribe 等闭源模型；
- **语言**：119 种语言文本交互、19 种语音理解、10 种语音生成，支持 40 分钟长音频；
- **后训练**：SFT → Strong-to-Weak 蒸馏（off-policy + on-policy）→ GSPO 强化学习；
- 开源三版本：Instruct（全功能）、Thinking（纯推理）、Captioner（音频描述）。

### 5. Qwen3.5-Omni Realtime（阿里，2026.3.30）——Thinker-Talker 派最新全模态旗舰

来源：Qwen 官方博客《Qwen3.5-Omni: Scaling Up, Toward Native Omni-Modal AGI》（https://qwen.ai/blog?id=qwen3.5-omni ）＋阿里云百炼 Realtime API 文档

- **定位**：Qwen 最新一代**全模态**（文本/图片/音频/音视频）模型，Thinker 与 Talker **均升级为 Hybrid-Attention MoE**，在 **1 亿小时以上**音视频数据上做原生多模态预训练。Realtime 版提供 `qwen3.5-omni-plus-realtime` 与 `qwen3.5-omni-flash-realtime` 两个实时模型，走百炼 Realtime API（支持 WebSocket / WebRTC / AOQ 三种接入）。
- **Realtime 五大能力**（官方原文）：① **语义打断**——原生话轮意图识别，能区分"真插话下指令"与"附和声/背景噪声"，后者不触发打断；② **原生 WebSearch + 复杂 FunctionCall**，模型自主决定是否联网；③ **端到端语音控制**——直接语音指令调节音量、语速、情感；④ **声音克隆**（上传一段声音定制音色）；⑤ **ARIA**（Adaptive Rate Interleave Alignment，自适应速率交错对齐）——动态对齐文本 token 与语音 token，解决流式语音里漏读/误读/数字发音含糊。
- **架构升级（对比 Qwen3-Omni）**：骨干 MoE→**Hybrid-Attention MoE**；Talker 输入从"双轨自回归"改为**交错（Interleave）**；文-音 token 比率从**固定 1:1 → ARIA 动态对齐**；语音表征沿用 RVQ（替代计算重的 DiT）；Thinker 经 Vision Encoder + AuT 收信号，音视频用 TMRoPE 时间对齐。
- **规格**：上下文 **256K**（上代 32K）；可处理 **10 小时音频** / **400 秒 720P 音视频（1FPS）**；语音识别 **113 种**语言方言、语音生成 **36 种**（Realtime Flash 版 60+ 输入 / 30+ 输出语言）；39 种中文方言识别；输入 PCM 16kHz、输出 PCM 24kHz；声音复刻单会话最长 120 分钟。
- **官方评测（Plus）**：在 **215 个**音频/音视频子任务上 SOTA，整体**超越 Gemini-3.1 Pro**；DailyOmni 84.6（Gemini 3.1 Pro 82.7）、VoiceBench 93.1；ASR LibriSpeech-clean WER 1.11、中文 Wenetspeech-net WER 4.30；语音合成稳定性多语言 WER 2.06（优于 ElevenLabs 12.62、GPT-Audio 2.65）；声音克隆相似度 0.79。涌现能力 **Audio-Visual Vibe Coding**（看着画面、听着语音指令直接写代码）。
- **和 Gander 的边界**：Qwen3.5-Omni Realtime 是**单模型**内集成 WebSearch/FunctionCall，全模态感知 + 语音自然度 + 开箱工具见长；Gander 是"小脑 + 免训练后端大脑"的**异步长任务编排**架构（后台跑几分钟任务、前台随时插话改需求）。前者重"感知与对话全能"，后者重"长任务智能体协作"。

### 6. Gander（腾讯混元语音团队，2026.9.8）——大厂首个开源"小脑-大脑"全模态交互 Agent

来源：论文 arXiv 2609.08977（https://arxiv.org/abs/2609.08977）＋**官方项目页**（https://omni-interaction-gander.github.io/Omni-Interaction-Agent/ ，明确署名"**混元语音团队（研究项目）**"）；模型/代码/数据全开源：github.com/Omni-Interaction-Gander/Omni-Interaction-Agent

> 更正说明：本文初稿曾据 arXiv 作者页误判 Gander 为"与混元无关的开源社区项目"。经核对官方项目页，**Gander 是腾讯混元语音团队的研究项目**，其抗干扰/多人训练数据"选自高质量 Hy-Realtime 生产数据"（Hy 即 Hunyuan）。

- **定位**：端到端全模态交互 Agent，持续接收**语音 + 视频 + 文本**流式输入，全双工对话、随时打断、模型可主动给中间反馈/追问；官方演示 12 类任务：语音+共享屏幕做游戏开发（边做边改按钮配色）、共享文档发起调研、语音查上海拍摄地并后台检索、**流式视频解说**、**视觉主动提醒**（"看到企鹅时告诉我"）、中英同声传译、附和/打断区分、抗背景噪声、多人对话分辨说话人、语音常识推理等。
- **三组件架构**（比 arXiv 摘要更细，来自项目页）：
  - **前端小脑（Cerebellum）**：持续接收音视频，负责实时对话和交互决策；
  - **后端大脑（Brain）**：负责复杂推理、工具调用与耗时任务，**支持替换、接入无需额外训练**（评测中用未经微调的 GPT-5.6）；
  - **智能体编排运行时**：管理任务状态，小脑通过 `task_start`/`task_send`/`task_resolve` 发起任务、追加要求、查询进度、取消或授权——**用户在后台任务跑着的时候仍可语音插话**。
- **流式 Thinker-Talker 细节**：以 **1 秒为一个处理单元**，每单元先收音视频输入与工具返回，再决定聆听/说话/打断/发工具调用；保留最近 **128 个时间块（约两分钟滑动上下文）**；Thinker 出文本和交互动作，Talker 据文本与隐状态生成离散语音单元再流式合成；训练格式中每个说话单元**最多 8 个文本 token 与 50 个 S3 语音 token 时间对齐**。
- **训练数据约 270 万条样本**四类：① 语音交互（InteractionSpeech 26.08 万段对话，明确标注打断与附和、时间线标记重叠区间）；② 音视频交互约 110 万条（来自 JoyAI-VL/LiveCC/Streamo，按每秒约 8 token 控制解说长度）；③ 智能体交互（32.02 万条语音 + 3.6 万条全模态 + 0.34 万条工具推理，GUI 轨迹由 **DeepSeek-V4-Pro** 生成带时间戳的交互轨迹）；④ 抗干扰与负样本（无关视频/噪声/多人/无指令环境，含 Hy-Realtime 生产数据）——核心是教模型"**在没有有效请求时保持安静**"。
- **官方自评（难得地不护短）**：Full-Duplex-Bench v3（100 场景）中，Gander **适时接话率 100.0%、提前抢话率仅 8.0%（全场最低）**，但严格任务成功率 **Pass@1 0.400，低于六个基线**（GPT-Realtime 0.600、Gemini Live 3.1 0.540、级联 Whisper→GPT-4o→TTS 0.450、Grok 0.430、Gemini Live 2.5 0.490、Ultravox v0.7 0.410）；仅用文本驱动后端大脑时 Pass@1 0.520。语音对话（SpokenQA/VoiceBench 2052 条，不调大脑）在全双机组内 Llama Questions 75.60%、Web Questions 59.30% 两项第一；音视频理解 WorldSense 49.62%/Daily-Omni 78.53%，**均低于其初始化模型**，但音视频融合增益 Daily-Omni 达 +19.13 个百分点。
- **意义**：这是**大厂首个把"全双工语音 + 视频在环 + Agent 工具编排"完整开源**的项目，与 GPT-Live 产品形态同构且可复现；评测表揭示了 2026 年全双工的核心权衡——**交互节奏（接话/抢话）与任务完成率是两个轴，节奏做到满分不代表任务做得对**。

### 7. 开源第二梯队

| 模型 | 团队 | 要点 | 来源 |
|---|---|---|---|
| MiniCPM-o | 面壁智能 | 端侧全模态，实时语音对话、音色克隆、情绪控制，手机端可部署 | OpenBMB 开源 |
| Mini-Omni / Mini-Omni2 | 开源社区 | 并行多模态解码（文本语音 token 同时出），Mini-Omni2 加视觉 | GitHub |
| Step-Audio 2 mini | 阶跃星辰 | 7B 全链路语音模型，8GB 显存可跑，口音识别 >92% | 阶跃开源 |
| LFM2-Audio-1.5B | Liquid AI | 1.5B 端侧，低资源设备实时对话 | HuggingFace |
| DuplexGen | 学术 | 数据工程：用 Qwen3.5-122B 合成话轮对话 + Chatterbox TTS 渲染，专造打断/附和/重叠语音数据（arXiv 2607.26178） | HuggingFace DuplexGen |
| Lychee-FD / X2-Turn | 哈工大等 | 帧级同步双头建模，联合流式 ASR 与话轮状态预测 | ACL 2026 / arXiv 2608.10878 |

## 五、闭源大厂模型逐个详解（全部官方来源）

### 1. OpenAI：gpt-realtime 与 GPT-Live 两代产品

**gpt-realtime**（2025-08-28 GA，来源：OpenAI 官方博客 https://openai.com/index/introducing-gpt-realtime/）

- 端到端 speech-to-speech 单模型（非级联），Realtime API 同步 GA；
- 官方评测：Big Bench Audio 推理 **82.8%**（上代 65.6%）；MultiChallenge 指令遵循 30.5%（上代 20.6%）；ComplexFuncBench 函数调用 66.5%（上代 49.7%）；
- API 新能力：**远程 MCP server 支持、图片输入、SIP 电话拨入**、异步函数调用（等工具结果时对话不断）；
- 定价：比 gpt-4o-realtime-preview **降价 20%**，音频输入 \$32 / 百万 token（缓存输入 \$0.40）、音频输出 \$64 / 百万 token；
- 新音色 Cedar、Marin。

**GPT-Live**（2026-07-08 发布，来源：OpenAI 官方博客 https://openai.com/index/introducing-gpt-live/）

- 官方原文："基于**全双工架构**构建，可以同时倾听和说话"，会用"嗯嗯""是啊"表示在听、快速来回、你思考时安静等待；
- **前台/后台委派**：需要网页搜索、深度推理或复杂工作时，幕后委派给最新前沿模型（发布时为 **GPT-5.5**），等待结果期间对话不中断；
- 两个版本：**GPT-Live-1 和 GPT-Live-1 mini**，面向全球 ChatGPT 用户逐步推出，API 随后开放；
- 规模：官方称每周超 **1.5 亿**用户使用 ChatGPT 语音/听写；
- 2026-07-31 更新：GPT-Live 生成音频加入 **SynthID 水印**，开放验证 API；
- **注意：GPT-Live 本身是语音模型，视觉能力缺席**（图片输入在 Realtime API 侧支持）。

### 2. Google：Gemini Live API

来源：Google 官方文档 https://ai.google.dev/gemini-api/docs/live-api

- **多模态在环**：输入音频（16kHz 16-bit PCM）+ **图片（JPEG，≤1 FPS）** + 文本，输出音频（24kHz PCM）；有状态 WebSocket（WSS）连接；
- 官方特性：70 种语言对话、**Barge-in（随时打断）**、函数调用 + Google 搜索、音频转写、**Proactive Audio（控制模型何时主动开口）**、Affective Dialog（情绪共情对话）、实时翻译 70+ 语言；
- 文档示例模型为 `gemini-3.1-flash-live-preview`（Live API 处于预览阶段）；
- 与 GPT-Live 的关键差异：**视觉原生在环**（对话中可共享屏幕/摄像头画面），且走轻量 Flash 级模型路线。

### 3. 字节跳动：Seeduplex 与 SeedRealtime

**Seeduplex**（2026.4，纯语音全双工，来源：Seed 官方页 https://seed.bytedance.com/seeduplex ＋ 火山引擎 API 文档）

- 官方定位"原生全双工语音大模型"，豆包 App 全量上线，官方称率先实现规模化落地；
- 技术：海量语音数据预训练 + **强化学习做话轮决策**，语音语义联合建模实现抗干扰、动态判停；
- **官方一手数据**：判停延迟降低约 **250ms**；复杂场景 AI 抢话比例**减少 40%**；打断响应延迟缩短约 **300ms**；强声学干扰下误回复率/误打断率**降低一半**；判停 MOS +8%、对话流畅度 MOS +12%；
- 人人对比测试：判停表现比半双工方案显著提升，打断响应稳定性略优于人人对话平均水平，但整体流畅度与真人仍有差距（官方如实披露）；
- API：豆包实时语音模型 3.0，WebSocket 接入，支持 function calling。

**SeedRealtime**（2026.8.5，音视频原生全双工，来源：Seed 官网 https://seed.bytedance.com/en/SeedRealtime）

- 单端到端模型统一音频/视频/文本，**无外置 VAD**，turn-taking 内化为模型实时决策；
- 视觉消歧同音词、多人场景"认人+辨声+理解"、画面事件触发**主动开口**与工具调用；
- 官方人评：音视频对话节奏问题较级联模型减少约一半；
- 工程：分块音视频输入 + 流式生成；传输底座火山引擎 MMT（QUIC + MoQ）。

### 4. 其他闭源/商用玩家

| 模型 | 团队 | 官方/一手要点 |
|---|---|---|
| MiniMax speech / Realtime | MiniMax | 语音合成与实时对话 API 持续迭代，媒体口径端到端延迟约 250ms（第三方口径，未见官方统一数字） |
| Step-Audio 2.5 Realtime | 阶跃星辰 | 强副语言、自定义人设，国际盲测靠前（官方发布会口径） |
| Nemotron3 VoiceChat | NVIDIA | 120B 端到端语音基座，面向开发者抢先体验（NVIDIA 官方） |
| Grok Voice 2.0 | xAI | 2026.7 上线全双工语音，语音 Agent 基准 τ-Voice 56.5%（第三方基准） |
| 星火 X2 | 科大讯飞 | 2026.7 全双工上线，中文/方言场景（官方发布会） |
| GLM-Realtime | 智谱 | 实时语音 API（Flash/Air），含视频通道，音频约 0.18~0.3 元/分钟（智谱开放平台定价页） |

### 5. 腾讯混元：研究侧 Gander 开源 + 产品侧组件化双轨

混元在语音全双工上是"**研究开源 + 云产品组件**"两条腿走路：

**研究侧**：混元语音团队 2026 年 9 月开源 **Gander**（详见第四节第 5 条），全模态全双工交互 Agent，模型/代码/数据全开放，是大厂中首个开源的小脑-大脑架构全双工系统；内部生产系统名为 **Hy-Realtime**（Gander 的抗干扰/多人训练数据即选自 Hy-Realtime 生产数据，说明该能力在腾讯内部已有线上化基础）。

**产品侧**（腾讯云对外的是组件化供应链）：
- **对话式 TTS**（`flow_02_turbo`）：首包延迟低至 300ms，支持声音克隆（腾讯云文档 cloud.tencent.com/document/product/647/131300）；
- **TRTC AI 实时对话**：跨文本/音频/视频实时推理，对话延迟 <1000ms（腾讯云官网）；
- **HunyuanVideo-Avatar**：图 + 音频驱动数字人，2025.5 开源单主体能力（腾讯云开发者社区）；
- **Hy ASR**：语音识别组件（MoE 架构，媒体报道中文普通话 WER 3.34%，官方论文/文档未见同口径披露，谨慎引用）。

即对外云服务走"ASR + TTS + 数字人 + RTC"组件打法，而前沿全双工研究以 Gander 开源形式输出——两条线并不矛盾。

## 六、横向对比总表（仅列有官方/论文来源的关键项）

| 模型 | 归属 | 双工机制 | 视觉在环 | Agent/工具 | 延迟（官方口径） | 开源 |
|---|---|---|---|---|---|---|
| Moshi | Kyutai | 真双流 + Inner Monologue | 无 | 无 | 理论 160ms / 实测约 200ms | ✅ |
| Freeze-Omni | 腾讯优图/西工大等 | 冻结 LLM + chunk 状态预测 | VITA 系列有 | 弱 | 低延迟（论文未给统一值） | ✅ |
| GLM-4-Voice-9B | 智谱 | 流式思考 + 文本参照生成 | 无 | 弱 | 10 token 即可开合成 | ✅（INT4 可跑） |
| Qwen3-Omni | 阿里 | Thinker-Talker MoE | ✅ | ✅ | 音频首包 234ms | ✅ Apache 2.0 |
| Qwen3.5-Omni Realtime | 阿里 | Thinker-Talker Hybrid-MoE + ARIA 文音对齐 | ✅（音视频 400s） | ✅✅ WebSearch/FunctionCall | 官方主打 Realtime API 低延迟（未给统一数值） | Offline 开源 / Realtime API |
| Gander | 腾讯混元语音团队 | 小脑-大脑 + 流式 Thinker-Talker（1s/块，128 块窗口） | ✅ | ✅✅ 任务编排运行时 | 官方未给端到端延迟（1s 为处理单元非延迟） | ✅ 模型+代码+数据 |
| gpt-realtime | OpenAI | 端到端 S2S（Realtime API） | 图片输入 ✅ | ✅✅ MCP/SIP | 官方未给统一值，GA 定价 \$32/\$64 | ❌ API |
| GPT-Live | OpenAI | 全双工架构 + 前台/后台 GPT-5.5 委派 | ❌ | ✅✅ | 官方未给统一值 | ❌ |
| Gemini Live | Google | 原生多模态全双工 | ✅（图片 ≤1FPS） | ✅ | 官方主打低延迟（未给数值） | ❌ API（预览） |
| Seeduplex | 字节 | RL 话轮决策 + 语音语义联合建模 | 无 | ✅ function call | 判停 -250ms / 打断 -300ms | ❌ API |
| SeedRealtime | 字节 | 音视频原生全双工，无外置 VAD | ✅ | ✅ 主动交互 | 建联数百 ms 级 | ❌ |
| 混元 | 腾讯 | 研究侧 Gander 开源全双工（见上）；产品侧 ASR/TTS/数字人组件 + Hy-Realtime 生产系统 | Gander ✅ | Gander ✅✅ | TTS 首包 300ms | Gander 全开源 |

## 七、四个趋势判断

1. **"小脑-大脑"成为全双工 Agent 的标准架构**。GPT-Live（前台语音模型 + 后台 GPT-5.5）与 Gander（Cerebellum-Brain + tool calling runtime）在 2026 年 7 月和 9 月独立给出同构方案：实时交互要轻快要稳，深度推理要强要全，两者通过工具调用连接。Realtime API 的异步函数调用（等结果时对话不断）是同一思想的 API 层表达。
2. **话轮智能从"VAD 开关"变成"模型决策"**。Moshi 双流、Freeze-Omni chunk 状态预测、Seeduplex 用强化学习学判停——竞争焦点已从延迟数字转向"什么时候该插话、什么时候该沉默"的社交节奏，官方评测指标也变成抢话率、误打断率、判停 MOS。
3. **下一个战场是视觉在环与主动交互**。纯语音全双工 2026 年已成标配（OpenAI/Google/字节/智谱/MiniMax/阶跃/NVIDIA/xAI/讯飞全部入场）；拉开差距的是 SeedRealtime、Gemini Live、Gander 代表的"边听边看边说"，以及模型基于画面事件**主动开口**。
4. **数据是新瓶颈**。真实全双工对话（含打断、重叠、附和）语料几乎不存在，DuplexGen 这类"大模型合成话轮 + TTS 渲染"的数据工程路线开始出现，和 RSI 时代"用 AI 造训练数据"的大逻辑一致；Gander 的 270 万条四类数据（含"无指令时保持安静"的负样本）是目前开源侧最完整的全双工数据配方参考。
5. **评测要拆成两根轴：交互节奏 ≠ 任务成功**。Gander 官方 Full-Duplex-Bench v3 结果很说明问题：它接话时机满分（适时接话 100%、抢话 8% 全场最低），但任务 Pass@1 仅 0.400 落后于 GPT-Realtime（0.600）；级联系统抢话率高达 33% 却有 0.450 的任务分、适时接话率 100%。**"会聊天"和"能办事"在全双工时代是两种能力**，小脑管前者、大脑管后者的分工架构（GPT-Live/Gander）正是对这一拆分的工程回应。

## 八、选型建议

- **研究全双工架构**：Moshi（双流 + Inner Monologue 教科书级样板）；
- **中文 + 开源 + 综合全能**：Qwen3-Omni（32 项开源 SOTA、Apache 2.0）；要最新全模态 + 语义打断 + 声音克隆/端到端语音控制且能接受 API，选 **Qwen3.5-Omni Realtime**（256K、113 语言、超越 Gemini-3.1 Pro 官方口径）；
- **本地/端侧中文语音助手**：GLM-4-Voice-9B（INT4）或 MiniCPM-o（手机端）；
- **二次开发怕伤骨干智商**：Freeze-Omni 路线（冻结 LLM，8 卡可训）；
- **做音视频在环产品**：SeedRealtime / Gemini Live API（闭源仅这两家做到音视频原生全双工），开源选 Gander；
- **要最强工具链/电话渠道**：gpt-realtime（MCP + SIP 成熟）；
- **成本敏感的大规模并发**：Qwen3-Omni 自建（RTF <1）或国产 API（智谱/阶跃/MiniMax）。

## 九、系列精读：每个模型一篇技术报告

本文是总览。针对文中的重点模型，我按技术演进时间线写了 9 篇逐篇精读（均为官方论文/博客/文档一手来源）：

| 篇号 | 模型 | 一句话看点 |
| :--: | :--- | :--- |
| ① | [Moshi](/posts/全双工精读1-Moshi-第一个实时全双工语音大模型与双流Inner-Monologue架构) | 全双工鼻祖，双流建模 + Inner Monologue，理论 160ms 延迟 |
| ② | [Freeze-Omni](/posts/全双工精读2-Freeze-Omni-冻结LLM-8张卡6万条数据做出全双工语音对话) | 冻结 LLM 骨干，8 张卡、6 万条数据低成本做出全双工 |
| ③ | [GLM-4-Voice](/posts/全双工精读3-GLM-4-Voice-175bps单码本12.5Hz-INT4可本地跑的中文语音助手) | 175bps 单码本、12.5Hz，INT4 量化后可本地跑的中文语音助手 |
| ④ | [Qwen3-Omni](/posts/全双工精读4-Qwen3-Omni-Thinker-Talker-MoE音频首包234ms开源全模态旗舰) | Thinker-Talker MoE，音频首包 234ms，32 项开源 SOTA |
| ⑤ | [Gander](/posts/全双工精读5-Gander-腾讯混元全双工语音智能体如何把实时对话和长任务执行缝进一个模型) | 腾讯混元"小脑-大脑"，把实时对话与长任务执行缝进一个模型 |
| ⑥ | [Qwen3.5-Omni Realtime](/posts/全双工精读6-Qwen3.5-Omni-Realtime-Hybrid-MoE-ARIA文音对齐与语义打断全模态旗舰) | Hybrid-MoE + ARIA 文音对齐，语义打断/声音克隆全模态旗舰 |
| ⑦ | [OpenAI gpt-realtime / GPT-Live](/posts/全双工精读7-OpenAI-gpt-realtime与GPT-Live-从端到端S2S-API到全双工前台后台委派) | 从端到端 S2S API 到全双工前台/后台委派 |
| ⑧ | [Google Gemini Live](/posts/全双工精读8-Google-Gemini-Live-原生多模态全双工视觉在环与主动开口) | 原生多模态全双工，视觉在环 + 主动开口 |
| ⑨ | [字节 Seeduplex / SeedRealtime](/posts/全双工精读9-字节Seeduplex与SeedRealtime-从RL话轮决策到音视频原生全双工) | RL 话轮决策到音视频原生全双工两步走 |

## 参考链接（一手来源）

1. Moshi 论文：https://arxiv.org/abs/2410.00037 ｜代码：https://github.com/kyutai-labs/moshi
2. Freeze-Omni 论文：https://arxiv.org/abs/2411.00774 ｜项目页：https://freeze-omni.github.io/
3. GLM-4-Voice 官方仓库：https://github.com/THUDM/GLM-4-Voice ｜技术报告：https://arxiv.org/abs/2412.02612
4. Qwen3-Omni 技术报告：https://arxiv.org/abs/2509.17765 ｜论文解读：https://modelscope.cn/papers/190355
5. Qwen3.5-Omni 官方博客（2026-03-30）：https://qwen.ai/blog?id=qwen3.5-omni ｜阿里云百炼 Realtime API：https://www.alibabacloud.com/help/en/model-studio/realtime
6. Gander 技术报告：https://arxiv.org/abs/2609.08977 ｜**官方项目页（混元语音团队）**：https://omni-interaction-gander.github.io/Omni-Interaction-Agent/ ｜代码：https://github.com/Omni-Interaction-Gander/Omni-Interaction-Agent
7. OpenAI gpt-realtime 发布（2025-08-28）：https://openai.com/index/introducing-gpt-realtime/
8. OpenAI GPT-Live 发布（2026-07-08）：https://openai.com/index/introducing-gpt-live/
9. Google Gemini Live API 文档：https://ai.google.dev/gemini-api/docs/live-api
10. 字节 Seeduplex 官方页：https://seed.bytedance.com/seeduplex ｜火山引擎 API 文档：https://docs.volcengine.com/docs/6561/2549778
11. 字节 SeedRealtime 官方页：https://seed.bytedance.com/en/SeedRealtime
12. DuplexGen 数据集：https://huggingface.co/datasets/DuplexGen/duplexgen-spoken
13. 腾讯云对话式 TTS 文档：https://cloud.tencent.com/document/product/647/131300
