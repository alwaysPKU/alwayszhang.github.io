---
title: "全双工语音模型精读④：Qwen3-Omni——Thinker-Talker MoE，音频首包 234ms 的开源全模态旗舰"
date: 2026-09-10
categories: 技术
tags:
  - 全双工
  - 语音大模型
  - Qwen3-Omni
  - 阿里
  - Thinker-Talker
  - MoE
  - 论文精读
  - 技术调研
series:
  name: "全双工语音模型精读"
  order: 4
  title: "Qwen3-Omni"
---

> 全双工语音模型系列精读第 4 篇。本文基于 Qwen3-Omni 技术报告 arXiv:2509.17765 与官方开源仓库，梳理其 Thinker-Talker MoE 架构。配套总览见《全双工语音大模型全景调研》；下一代 Qwen3.5-Omni 见该文第五节。

## 一、定位：首个"全模态不掉点"的开源模型

Qwen3-Omni（阿里通义千问，2025-09-22 提交技术报告）的核心主张是：**用单一多模态模型，在文本、图像、音频、视频四个模态上都达到 SOTA，且相对同尺寸单模态模型没有任何退化**。

- 它能匹配 Qwen 系列同尺寸单模态模型的表现，音频任务尤其突出；
- 在 **36 个音频/音视频基准**上，**32 项取得开源 SOTA、22 项取得总 SOTA**，超过 Gemini-2.5-Pro、Seed-ASR、GPT-4o-Transcribe 等闭源模型；
- 支持 **119 种语言**文本交互、**19 种**语言语音理解、**10 种**语言语音生成；
- 三个开源版本（Apache 2.0）：**Qwen3-Omni-30B-A3B**（全功能 Instruct）、**-Thinking**（显式多模态推理）、**-Captioner**（音频描述，低幻觉）。

## 二、Thinker-Talker MoE 架构

Qwen3-Omni 把"理解/推理"和"流式语音合成"解耦成两部分，且都用 MoE：

| 组件 | 规模 | 职责 |
|---|---|---|
| **Thinker** | 30B 总参 / 3B 激活（MoE） | 处理文本/图像/音频/视频，输出文本与高层语义 |
| **Talker** | 3B 总参 / 0.3B 激活（MoE） | 接收 Thinker 的多模态输入与文本，流式生成语音 |
| **AuT（音频编码器）** | 约 650M | 2000 万小时监督音频训练，12.5Hz token 率 |
| **视觉编码器** | SigLIP2 系约 540M | 图像/视频理解 |
| **MTP** | 约 80M | 预测 RVQ 残差码本 |
| **Code2Wav** | 卷积解码器约 200M | 把 codec 还原成波形 |

- 音视频信号用 **TMRoPE（时间对齐多模态旋转位置编码）**交错编码；
- Thinker 负责全模态感知与文本生成，Talker 据此做上下文语音生成。

## 三、低延迟流式生成的两个关键选择

### 1. 多码本自回归 + 轻量 ConvNet 替代扩散

- Talker 用**多码本方案**自回归预测离散语音 codec：自回归预测 **15 个 RVQ 码本中的主码本**，再由 **MTP** 模块预测残差码本；
- 关键取舍：**用轻量因果 ConvNet（Code2Wav）替代计算繁重的 block-wise 扩散模型**——利用码本的表征能力，从**第一个 codec 帧就能开始流式出声音**；
- 这是它能把首包延迟压到极低的结构性原因。

### 2. 左上下文-only 生成 + Chunked Prefilling

- 生成时**只依赖左侧上下文、不等整块上下文**，配合 **Chunked Prefilling** 异步调度，进一步降低首包延迟；
- 官方冷启动数据：**理论端到端音频首包延迟 234ms**、视频首包 547ms；RTF 0.47（1 并发）~0.66（6 并发）；音质 MOS 4.3。

## 四、Thinking 模型与 Captioner 模型

- **Thinking 版**：引入显式推理，可对**任意模态输入**做思考链推理，强化多模态复杂推理；
- **Captioner 版**：由于研究社区缺乏通用音频字幕模型，作者把 Qwen3-Omni-30B-A3B 微调成音频描述模型，能对任意音频生成**详细、低幻觉**的字幕/描述。

## 五、后训练：SFT → 蒸馏 → 强化学习

报告披露的后训练流程：
1. **SFT**（监督微调）；
2. **Strong-to-Weak 蒸馏**（off-policy + on-policy 结合）；
3. **GSPO 强化学习**（Group 相对策略优化一类的 RL 方法）。

## 六、在全双工版图里的位置

- Qwen3-Omni 是 **Thinker-Talker 派的代表作和开源旗舰**：推理（Thinker）与流式语音合成（Talker，仅 0.3B 激活）解耦，"边想边说"，骨干用 MoE 把总参做大、激活做小，兼顾智能与成本；
- 相比 Moshi（双流、7B、纯语音、英文为主），Qwen3-Omni 是**全模态（音+视+文）+ 多语言 + 工具能力**的全能型，且 Apache 2.0 开源、RTF<1 适合自建并发；
- 它的"文本/语义先行、Talker 轻量流式出语音"与 Moshi Inner Monologue、GLM-4-Voice 流式思考一脉相承，但用 MoE + 多码本 + ConvNet 把规模和延迟都推到新水平。

**局限 / 后续**：Qwen3-Omni 时代上下文 32K、语音理解 19 种语言，且 Realtime 交互能力（语义打断、端到端语音控制、声音克隆）尚不完备——这些在下一代 **Qwen3.5-Omni**（2026-03-30，Hybrid-Attention MoE、256K、113 种语言、ARIA 文音对齐、语义打断/声音克隆/WebSearch）中系统补齐，详见全景文章第五节。

## 参考来源

1. Qwen3-Omni 技术报告：https://arxiv.org/abs/2509.17765
2. 官方仓库：https://github.com/QwenLM/Qwen3-Omni
3. 论文解读（ModelScope）：https://modelscope.cn/papers/190355
