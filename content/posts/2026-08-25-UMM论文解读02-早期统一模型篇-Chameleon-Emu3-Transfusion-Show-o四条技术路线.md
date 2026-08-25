---
title: "UMM论文解读02-早期统一模型篇：Chameleon、Emu3、Transfusion、Show-o的四条技术路线"
date: 2026-08-25
categories: [多模态, 论文解读]
tags: [UMM, Chameleon, Emu3, Transfusion, Show-o, 统一模型, 论文解读]
ogImage: /images/umm-p2-early-cover.jpeg
---

> 2024 年 5 月到 9 月，四个团队几乎同时交出了"统一理解与生成"的答卷。Meta 的 Chameleon 走 early-fusion 全离散路线，智源的 Emu3 证明纯 next-token prediction 就能统一图文视频，Meta 的 Transfusion 把 AR 和扩散 loss 加在同一个 Transformer 上，南洋理工的 Show-o 则混合了自回归与离散扩散。四条路线的分歧与共识，定义了此后一年所有 UMM 的设计空间。

![UMM论文解读系列-早期统一模型篇](/images/umm-p2-early-cover.jpeg)

## 系列导航

- 01 基础奠基篇：Transformer、CLIP、LLaVA、DDPM、DiT、VQ-VAE、VQGAN
- **02 早期统一模型篇**（本文）：Chameleon、Emu3、Transfusion、Show-o
- 03 主流模型篇：Janus-Pro、BAGEL、SenseNova U1
- 04 VCoT 篇：CoVT、Gen-VCoT、Visual Sketchpad、Visual-Aware CoT、CoT-VLA
- 05 视频与世界模型篇：UniVideo、Emu3.5
- 06 终章：从统一表征到 AGI 终局之战

## 2024 年夏天：四条路线同时爆发

在 LLaVA 定义的"CLIP + 投影 + LLM"拼接范式统治了一年多之后，2024 年 5 月到 9 月，四篇论文在四个月内密集出现，从截然不同的方向回答同一个问题：**能不能在一个模型里同时做理解和生成？**

| 论文 | 团队 | 时间 | 核心思路 | 视觉表征 |
|------|------|------|---------|---------|
| Chameleon | Meta | 2024.05 | Early-fusion，全离散 token | VQGAN |
| Emu3 | 智源 BAAI | 2024.09 | 纯 next-token prediction | 自研离散 tokenizer |
| Transfusion | Meta | 2024.08 | AR loss + Diffusion loss 共享 Transformer | 连续（扩散） |
| Show-o | NTU Show Lab | 2024.08 | AR（文本）+ 离散扩散（图像） | VQGAN |

四篇论文的分歧，本质上是对两个问题的不同回答：

1. **图像用离散 token 还是连续表征？** Chameleon/Emu3/Show-o 选离散，Transfusion 选连续。
2. **生成用自回归还是扩散？** Emu3 选自回归，Transfusion 选扩散，Chameleon 选自回归，Show-o 选离散扩散。

下面逐篇拆解。

---

## 1. Chameleon：Mixed-Modal Early-Fusion Language Models（2024.05）

**论文**：*Chameleon: Mixed-Modal Early-Fusion Foundation Models*
**链接**：https://arxiv.org/abs/2405.09818

### 核心思路

Chameleon 的口号是"early-fusion"：不像 LLaVA 那样把视觉特征"晚接入"LLM，而是从第一层 Transformer 开始，文本 token 和图像 token 就在同一个序列里、同一个注意力空间中交互。没有独立的视觉编码器，没有投影层，没有跨注意力桥接。

### 技术架构

1. **统一 tokenization**：
   - 文本：BPE tokenizer，与 LLaMA 一致。
   - 图像：一个自研的 image tokenizer，把 512×512 图像编码成 1024 个离散 token（32×32 网格），码本大小 8192。
   - 特殊 token：`<image>` 标记图像片段的起止。

2. **模型架构**：标准 decoder-only Transformer，和 LLaMA 几乎一样。文本和图像 token 在同一个 embedding 空间，共享自注意力。这就是"early-fusion"的含义——模态信息从第一层就混合在一起。

3. **训练**：
   - 预训练：4.4 万亿 token，文本和图像交错数据。
   - 监督微调（SFT）：多模态指令数据。
   - 模型规模：7B 和 34B 两个版本。

4. **图像生成**：自回归逐 token 生成，然后用 image tokenizer 解码回像素。生成一张 512×512 图像需要预测 1024 个 token，比扩散模型慢很多，但 Chameleon 证明了这条路能走通。

### 关键贡献

- **第一个证明 early-fusion 可行的大规模模型**。在此之前，主流观点认为必须用独立视觉编码器（CLIP）+ 桥接层；Chameleon 证明直接把图像 token 塞进 Transformer 也能 work。
- **图像 tokenizer 质量是关键瓶颈**。Chameleon 在 image tokenizer 上花了大量工程精力，包括 codebook 设计、重建损失、感知损失等。tokenizer 的质量直接决定了生成图像的上限。
- **统一架构带来的能力涌现**：early-fusion 让模型能在生成文本时"参考"图像内容，在生成图像时"理解"文本指令，无需跨模态桥接。

### 局限

- **自回归图像生成慢**：1024 个 token 逐个生成，远慢于扩散模型的并行去噪。
- **离散 tokenization 有损**：精细纹理和文字渲染不如扩散模型。
- **Meta 没有完全开源**：只发布了技术报告，没有开放权重（这也是为什么后续 BAGEL、Janus-Pro 能快速获得社区关注——它们开源了）。

### 对后续的影响

Chameleon 的 early-fusion 思想被 Emu3、BAGEL 直接继承。它证明了"一个 Transformer 处理一切"的可行性，但也暴露了纯自回归离散生成在速度和质量上的瓶颈——这直接催生了 Transfusion 和 Show-o 的混合路线。

---

## 2. Emu3：Next-Token Prediction is All You Need（2024.09）

**论文**：*Emu3: Next-Token Prediction is All You Need*
**作者**：Xinlong Wang, Xiaosong Zhang, Zhengxiong Luo 等（智源 BAAI）
**链接**：https://arxiv.org/abs/2409.18869
**发表**：后续登上 Nature

### 核心思路

如果说 Chameleon 还在标题里写"mixed-modal"，Emu3 更激进：标题直接是"Next-Token Prediction is All You Need"。它的主张是——**不需要扩散、不需要组合架构、不需要任何花哨设计，只用标准的下一个 token 预测，就能统一文本、图像、视频的理解和生成。**

### 技术架构

1. **统一 tokenization**：
   - 文本：BPE。
   - 图像：自研离散视觉 tokenizer，把图像编码成离散 token 序列。
   - 视频：把视频帧当作图像处理，沿时间轴展开成更长的 token 序列。
   - 所有模态的 token 在同一个词表空间中。

2. **模型**：从零训练的单个 Transformer（非基于已有 LLM），在文本/图像/视频混合序列上做标准 next-token prediction。没有修改注意力机制，没有加特殊模态桥接。

3. **训练数据**：大规模多模态交错数据（图像-文本对、交错图文网页、视频帧序列）。

### 关键结果

- 在生成和理解两类任务上超越多个专用模型：
  - 文生图：超越 SDXL。
  - 多模态理解：超越 LLaVA-1.6。
  - 视频生成：能生成高保真视频。
- 用一个模型、一个目标函数、一种生成方式（自回归），同时在多个任务上达到或超过 SOTA。
- 论文最重要的论点是：**next-token prediction 是通往通用多模态智能的可行路径**，不需要扩散或组合架构。

### 为什么重要

Emu3 是纯自回归统一路线的旗帜性工作。它的意义不仅在于性能，更在于证明了一个极简假设：**只要 tokenization 做得好、数据规模够大，next-token prediction 足以统一所有模态。**

这个假设有一个优雅的理论优势：所有模态共享同一个训练目标、同一种推理方式（KV Cache、投机解码等加速技术全部通用），工程上极其简洁。它后来登上 Nature，也是因为这种"极简统一"的思想在 AI 领域有标志性意义。

### 局限

- **和 Chameleon 一样的速度问题**：逐 token 生成图像和视频极慢。这个问题在 Emu3.5 中通过 DiDA（离散扩散适配）部分解决，将推理速度提升约 20 倍。
- **图像质量与顶级扩散模型仍有差距**：尤其是文字渲染和精细纹理。
- **训练从零开始，成本高**：不基于已有 LLM，需要大量文本数据维持语言能力。

### 对后续的影响

Emu3 直接催生了 Emu3.5（本系列第五篇），后者把"next-token"升维到"next-state prediction"，并引入 DiDA 解决速度问题。它也是 SenseNova U1 等原生统一模型的思想先驱——证明了"统一"不需要以牺牲能力为代价。

---

## 3. Transfusion：Diffusion + AR in One Transformer（2024.08）

**论文**：*Transfusion: Compatibility Between Next-token Prediction and Diffusion Models for Multimodal Generative Modeling*
**作者**：Meta FAIR
**链接**：https://arxiv.org/abs/2408.11039

### 核心思路

Chameleon 和 Emu3 都把图像离散化成 token，但 Meta 的另一支团队问了一个不同的问题：**为什么不能让文本用 AR loss、图像用 diffusion loss，两种 loss 在同一个 Transformer 上共存？** 这就是 Transfusion——"Trans"former + Dif"fusion"。

### 技术架构

```
  ┌──────────────────────────────────────────────────────────┐
  │              同一个 Transformer（共享自注意力）             │
  │  文本 token 与 图像 token 在同一序列中 early-fusion         │
  └───────────────┬──────────────────────┬───────────────────┘
                  │                      │
          文本位置输出             图像位置输出
                  │                      │
                  ▼                      ▼
          ┌──────────────┐      ┌──────────────────┐
          │ Softmax 分类头│      │ Diffusion Head   │
          │ 预测下一个token│      │ 预测噪声 ε_θ      │
          └──────┬───────┘      └────────┬─────────┘
                 │                       │
                 ▼                       ▼
          Cross-Entropy Loss       Diffusion MSE Loss
              (文本 AR)              (图像连续扩散)
```

| 路径 | 输入形式 | 输出头 | 损失函数 | 推理方式 |
|------|----------|--------|----------|----------|
| **文本路径** | 离散 token | Softmax 分类 | 交叉熵 CE | 自回归采样 |
| **图像路径** | 连续 latent | 回归（预测噪声） | 扩散 MSE | 迭代去噪 |

两种路径的总损失：

$$\mathcal{L}_{\text{Transfusion}}=\underbrace{\sum_{i\in\text{text}}\text{CE}(x_i,\hat{x}_i)}_{\text{文本：自回归交叉熵}}+\underbrace{\sum_{j\in\text{image}}\mathbb{E}_{t,\epsilon}\|\epsilon-\epsilon_\theta(x_t,t)\|^2}_{\text{图像：扩散MSE}}$$

推理时两条路径可以交错进行：先生成一段文字描述，再在文字条件下扩散生成图像。

### 关键洞察

Transfusion 的核心洞察是：**AR 和 Diffusion 不是竞争关系，它们可以在同一个 Transformer 中各司其职。** 文本天然适合离散自回归（语言是符号系统），图像天然适合连续扩散（像素是连续信号）。强行把图像离散化反而是在制造不必要的麻烦。

这个洞察非常务实：保留 LLM 的全部文本能力（不做任何妥协），同时"插入"扩散生成能力，不需要统一 token 空间。

### 优势与局限

**优势**：
- 图像质量继承扩散模型的优势（比纯 AR 离散生成好）。
- 文本能力完全保留（不受图像 tokenization 影响）。
- 推理时图像生成可以并行去噪，比逐 token 自回归快。

**局限**：
- 架构上仍有"两套逻辑"：两个 loss、两个输出头、两种推理方式。不如 Emu3 那样极简。
- 图像和文本在表征层是否真正"统一"了？共享注意力是统一了，但输出层仍是分离的。后续 SenseNova U1 的 NEO-unify 正是要进一步消除这种分离。

### 对后续的影响

Transfusion 的"AR + Diffusion 混合"思想影响了 Show-o（离散扩散版）和后续多个工业模型。更重要的是，它提供了一种"渐进统一"的工程路径：先在已有 LLM 上加扩散头，不需要从零训练。这对资源有限的团队尤其有吸引力。

---

## 4. Show-o：AR + 离散扩散的 One Single Transformer（2024.08）

**论文**：*Show-o: One Single Transformer to Unify Multimodal Understanding and Generation*
**作者**：Jinheng Xie, Weijia Mao, Zechen Bai 等（南洋理工 Show Lab）
**链接**：https://arxiv.org/abs/2408.12528
**发表**：ICLR 2025

### 核心思路

Show-o 和 Transfusion 几乎同时出现，思路相似但有一个关键区别：**Show-o 的扩散不是在连续空间做，而是在离散 token 空间做（离散扩散）。** 文本用自回归，图像用离散扩散，两者在同一个 Transformer 中自适应切换。

### 技术架构

1. **离散视觉 token**：用 VQGAN 把图像编码成离散 token（和 Chameleon 类似）。

2. **文本：自回归**：文本 token 用标准 causal attention + next-token prediction。

3. **图像：离散扩散**：
   - 前向：随机把图像 token mask 掉（替换为 `[MASK]`），mask 比例按噪声调度变化。
   - 反向：Transformer 预测被 mask 的 token，用类似 BERT 的 bidirectional attention（但只在图像区域内）。
   - 这就是"离散扩散"：不是在连续空间加高斯噪声，而是在离散空间做 token mask 和恢复。

4. **自适应混合**：同一个 Transformer，处理文本时用 causal mask，处理图像 token 时用 bidirectional mask，通过注意力 mask 灵活切换。不需要两个独立模型。

### 支持的任务

Show-o 在一个模型中灵活支持：

- 视觉问答（VQA）：理解图像 + 生成文本答案。
- 文生图：文本条件下离散扩散生成图像。
- 文本引导的图像修复/外推：部分图像 token 已知，mask 区域用扩散填充。
- 混合模态生成：文本和图像交错输出。

### 与 Transfusion 的对比

| 维度 | Transfusion | Show-o |
|------|-------------|--------|
| 图像表征 | 连续 latent | 离散 token |
| 生成方式 | 连续扩散（高斯噪声） | 离散扩散（token mask） |
| 注意力 | 统一 causal | causal（文本）+ bidirectional（图像） |
| tokenizer | 需要 VAE | 需要 VQGAN |
| 开源 | 否 | 是（代码+权重） |

Show-o 选择离散扩散的一个重要好处是：**所有模态最终都在同一个离散 token 空间中**，这比 Transfusion 的"连续+离散混合"更接近"统一"的理想。而且离散扩散的每一步可以并行预测所有 mask token，比逐 token 自回归快。

### 关键贡献

- 第一个在单个 Transformer 中同时结合自回归和离散扩散的统一模型。
- 灵活的注意力 mask 机制，让同一套参数自适应不同模态和任务。
- 在参数量相当或更小的情况下，性能匹配或超越专用理解/生成模型。
- 完全开源（代码+权重），推动了后续学术研究。

### 对后续的影响

Show-o 的离散扩散思路被 Janus-Pro 等模型借鉴。它的"自适应注意力 mask"也启发了后续 MoT（Mixture-of-Transformers）的设计——不同任务用不同的注意力模式，但共享参数。

---

## 四条路线的比较与启示

### 技术谱系

```
                     统一理解与生成
                    /            \
              全离散              混合
             /      \           /    \
       Chameleon   Emu3   Transfusion  Show-o
       (AR)       (AR)    (AR+连续扩散) (AR+离散扩散)
```

### 核心设计选择对比

| 维度 | Chameleon | Emu3 | Transfusion | Show-o |
|------|-----------|------|-------------|--------|
| 视觉表征 | 离散 | 离散 | 连续 | 离散 |
| 文本生成 | AR | AR | AR | AR |
| 图像生成 | AR | AR | 连续扩散 | 离散扩散 |
| 视频生成 | 否 | 是 | 否 | 否 |
| 注意力 | causal | causal | causal | causal + bidirectional |
| 是否从零训练 | 是 | 是 | 否（基于 LLM） | 否（基于 LLM） |
| 开源权重 | 否 | 部分 | 否 | 是 |
| 参数规模 | 7B/34B | 8B+ | 7B+ | ~1.3B |

### 三条共识

尽管路线不同，四篇论文在三个关键点上达成了共识：

1. **一个 Transformer 就够了**。不需要独立的理解模型和生成模型，不需要复杂的跨模态桥接。Transformer 的注意力机制足以处理多模态信息。

2. **视觉 tokenizer 是关键瓶颈**。无论离散还是连续，视觉信号如何被编码成模型可处理的形式，直接决定了生成质量和理解精度。后续 SenseNova U1 干脆去掉 tokenizer，正是因为这个瓶颈太难突破。

3. **交错图文数据至关重要**。四篇论文都强调了大规模交错图文数据（interleaved data）的重要性——不是图像-文本对，而是图文交错的长序列（像网页那样）。这种数据让模型学会在理解和生成之间自由切换。

### 未解决的问题

四篇论文也留下了同样的问题：

- **速度 vs 质量的权衡**：AR 慢但简单，扩散快但复杂。这个问题到 Emu3.5 用 DiDA 才部分解决。
- **视觉表征的离散 vs 连续之争**：离散统一但有损，连续高质量但"不够统一"。BAGEL 用双塔 MoT 绕开，U1 用去 tokenizer 激进回应。
- **理解能力是否受生成拖累**：统一后理解侧是否比专用 MLLM 差？这需要 BAGEL、Janus-Pro 等后来者用 benchmark 数据回答。

这些问题的答案，就是本系列第三篇的内容——Janus-Pro、BAGEL、SenseNova U1 三篇 2025 至 2026 年的代表作，把统一模型从"证明可行"推进到了"性能匹敌甚至超越专用模型"。

---

## 参考链接

1. Chameleon: https://arxiv.org/abs/2405.09818
2. Emu3: https://arxiv.org/abs/2409.18869
3. Transfusion: https://arxiv.org/abs/2408.11039
4. Show-o: https://arxiv.org/abs/2408.12528
5. 代码与项目：
   - Chameleon: https://github.com/facebookresearch/chameleon
   - Emu3: https://emu.baai.ac.cn/
   - Transfusion: https://github.com/facebooksearch/transfusion
   - Show-o: https://github.com/showlab/Show-o
