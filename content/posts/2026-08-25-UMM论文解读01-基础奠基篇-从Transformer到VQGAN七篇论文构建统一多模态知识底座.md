---
title: "UMM论文解读01-基础奠基篇：从Transformer到VQGAN，七篇论文构建统一多模态的知识底座"
date: 2026-08-25
categories: [多模态, 论文解读]
tags: [UMM, Transformer, CLIP, LLaVA, DDPM, DiT, VQ-VAE, VQGAN, 论文解读]
ogImage: /images/umm-p1-foundation-cover.jpeg
---

> 本系列将 UMM（Unified Multimodal Model，理解与生成统一模型）学习路径中涉及的每一篇论文，逐一读取原文、提炼核心思想、标注关键贡献。第一篇聚焦 2017-2023 年间七篇奠基性工作，它们不是统一模型本身，却共同构成了今天所有统一模型的知识底座。

![UMM论文解读系列-基础奠基篇](/images/umm-p1-foundation-cover.jpeg)

## 系列导航

- **01 基础奠基篇**（本文）：Transformer → CLIP → LLaVA → DDPM → DiT → VQ-VAE → VQGAN
- 02 早期统一模型篇：Chameleon、Emu3、Transfusion、Show-o
- 03 主流模型篇：Janus-Pro、BAGEL、SenseNova U1
- 04 VCoT 篇：CoVT、Gen-VCoT、Visual Sketchpad、Visual-Aware CoT、CoT-VLA
- 05 视频与世界模型篇：UniVideo、Emu3.5

## 为什么要先读这七篇

统一理解与生成模型，本质上是在回答一个问题：**能不能用同一套架构、同一个目标函数，既"看懂"图像又"画出"图像？**

要回答它，你需要先掌握三组语言：

1. **序列建模语言**：Transformer 怎么把任意模态变成 token 序列，注意力机制如何在序列中传递信息。
2. **视觉表征语言**：CLIP 如何用文本监督图像表征，LLaVA 如何把视觉编码器接到 LLM，VQ-VAE/VQGAN 如何把连续像素压缩成离散 token。
3. **生成建模语言**：DDPM 如何用加噪-去噪过程生成图像，DiT 如何把 Transformer 嫁接到扩散模型上。

七篇论文按时间线排列，恰好覆盖这三组语言。下面逐篇解读。

---

## 1. Attention Is All You Need（2017）

**论文**：*Attention Is All You Need*
**作者**：Ashish Vaswani, Noam Shazeer, Niki Parmar 等（Google Brain / Google Research / 多伦多大学）
**链接**：https://arxiv.org/abs/1706.03762
**发表**：NeurIPS 2017

### 解决什么问题

2017 年之前，序列建模的主流是 RNN/LSTM 加注意力。RNN 必须按时间步串行计算，无法并行，长距离依赖也容易衰减。这篇论文提出一个激进的问题：**能不能把循环和卷积全部丢掉，只用注意力？**

### 核心方法

Transformer 是一个纯注意力的 encoder-decoder 架构，数据流向如下：

```
输入 Token 序列
      │
      ▼
┌──────────────────────────────────┐
│  Positional Encoding（注入位置）  │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Multi-Head Self-Attention       │  ← Q/K/V 投影到 h 个子空间
│  ┌────┬────┬────┬────┐           │     并行计算注意力后拼接
│  │Head│Head│Head│... │ 各看各的   │
│  └────┴────┴────┴────┘           │
└──────────────┬───────────────────┘
               │ + Residual + LayerNorm
               ▼
┌──────────────────────────────────┐
│  Feed-Forward Network (FFN)      │
└──────────────┬───────────────────┘
               │ + Residual + LayerNorm
               ▼
          输出概率
```

- **Scaled Dot-Product Attention**：核心公式只有一行——

$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

公式拆成三步理解：

| 步骤 | 数学操作 | 含义 |
|------|----------|------|
| ① 计算相关性 | $QK^\top$ | Query 和 Key 做点积，衡量"谁和谁相关" |
| ② 缩放 | $/\sqrt{d_k}$ | 防止点积过大导致 softmax 饱和、梯度消失 |
| ③ 加权求和 | $\text{softmax}(\cdot)V$ | 相关性归一化为权重，对 Value 加权聚合 |

- **Multi-Head Attention**：把 Q/K/V 投影到 h 个子空间并行计算注意力，再拼接。每个头可以关注不同位置的不同表征子空间（比如一个头看语法、另一个头看指代）。
- **Positional Encoding**：因为没有循环/卷积，模型本身对位置无感。论文用正弦/余弦位置编码注入位置信息，后续工作大多改成可学习位置编码或 RoPE。
- **Encoder-Decoder 结构**：Encoder 用自注意力加前馈网络；Decoder 多一层 cross-attention 关注 Encoder 输出，并带因果掩码防止偷看未来。

### 关键结果

- WMT 2014 英德翻译：28.4 BLEU，比当时最佳集成模型高出 2 BLEU 以上。
- WMT 2014 英法翻译：41.8 BLEU，单模型新 SOTA。
- 训练成本：8 GPU 训练 3.5 天，远低于当时的 SOTA 模型。
- 泛化到英语成分句法分析同样成功。

### 为什么是 UMM 的基石

所有 UMM 都是 Transformer。Chameleon、Emu3、Transfusion、Janus-Pro、BAGEL、SenseNova U1——无一例外。原因很简单：**Transformer 把"模态"这个概念消解掉了**。不管你是文字、图像 patch、还是视频帧，只要能变成一串 token，Transformer 就能用同一套机制处理。

更重要的是 Multi-Head Attention 给后来的 MoT（Mixture-of-Transformers）埋下了伏笔：BAGEL 用不同的注意力头分别处理理解和生成任务，本质上是 Multi-Head 思路的工程化延伸。

### 你应该记住的

- 自注意力的计算公式和缩放原因。
- 为什么位置编码是必需的。
- Transformer 为什么能并行（对比 RNN 的串行）。

---

## 2. CLIP：Learning Transferable Visual Models From Natural Language Supervision（2021）

**论文**：*Learning Transferable Visual Models From Natural Language Supervision*
**作者**：Alec Radford, Jong Wook Kim, Chris Hallacy, Aditya Ramesh 等（OpenAI）
**链接**：https://arxiv.org/abs/2103.00020
**发表**：ICML 2021

### 解决什么问题

传统视觉模型在固定类别集合上做监督训练（ImageNet 的 1000 类），每加一个新概念就要重新标注数据、重新训练。CLIP 问的是：**能不能直接从互联网的图文对中学习视觉表征，让自然语言成为"可扩展的监督信号"？**

### 核心方法

CLIP（Contrastive Language-Image Pre-training）的方法异常简洁，核心就是"图文配对"游戏：

```
一个 Batch 中有 N 对图文：

  图像 I₁ ──→ Image Encoder ──→ v₁ ─┐
  图像 I₂ ──→ Image Encoder ──→ v₂ ─┤
  图像 I₃ ──→ Image Encoder ──→ v₃ ─┤    相似度矩阵
   ...                              ├──→ (v_i · t_j)
  文本 T₁ ──→ Text Encoder ──→ t₁ ─┤    对角线✅ 配对成功
  文本 T₂ ──→ Text Encoder ──→ t₂ ─┤    非对角线❌ 拉开距离
  文本 T₃ ──→ Text Encoder ──→ t₃ ─┘
   ...
```

1. **数据**：从互联网收集 4 亿个（图像，文本）对。
2. **模型**：图像编码器（ResNet 或 ViT）+ 文本编码器（Transformer），各自把输入映射到同一维度的嵌入空间。
3. **训练目标**：对比学习。一个 batch 中有 N 个图文对，计算 N×N 个余弦相似度，对角线（图 i 配文 i）是正样本，其余是负样本。让正样本相似度高、负样本相似度低（对称的 image→text 和 text→image 两个方向）。
4. **零样本迁移**：推理时，把任务类别名拼成文本提示（如 "a photo of a {dog}"），用图像嵌入与所有文本嵌入做相似度匹配，无需任何任务特定训练。

### 关键结果

- 在 30+ 个视觉数据集上做零样本迁移，经常与全监督基线持平。
- ImageNet 零样本准确率匹配原始 ResNet-50（不需要那 128 万张训练图）。
- 表征泛化到 OCR、动作识别、细粒度分类、地理定位等多种任务。

### 为什么是 UMM 的基石

CLIP 对 UMM 的影响有三层：

1. **证明了图文共享嵌入空间可行**。后来的 LLaVA、Janus-Pro 直接用 CLIP/SigLIP 作为理解侧视觉编码器。
2. **对比学习成为视觉预训练范式**。理解和生成的"视觉接口"长期由 CLIP 类编码器提供。
3. **它的局限恰恰催生了 UMM**。CLIP 只能"对齐"不能"生成"，它把图文映射到同一空间却无法从该空间解码回像素。SenseNova U1 的 NEO-unify 干脆去掉 CLIP 类编码器，正是对这一局限的激进回应。

### 你应该记住的

- 对比学习的 batch 内负样本构造。
- 零样本迁移的提示工程（prompt template）。
- CLIP 的两个局限：细粒度空间关系弱、不能生成。

---

## 3. LLaVA：Visual Instruction Tuning（2023）

**论文**：*Visual Instruction Tuning*
**作者**：Haotian Liu, Chunyuan Li, Qingyang Wu, Yong Jae Lee（威斯康星麦迪逊 / 微软）
**链接**：https://arxiv.org/abs/2304.08485
**发表**：NeurIPS 2023 Oral

### 解决什么问题

GPT-4 的指令微调在纯文本领域已经证明有效，但多模态领域还没有人系统地做过"视觉指令微调"。LLaVA 要回答：**能不能用 GPT-4 生成图文指令跟随数据，然后把视觉编码器接到 LLM 上做端到端微调？**

### 核心方法

LLaVA 的架构是后来几乎所有 MLLM 的模板——"CLIP 编码器 + 投影层 + LLM"三件套：

```
  图像 ──→ CLIP ViT ──→ 视觉特征 ──→ 投影层(MLP) ──┐
                                                    ├──→ LLM (LLaMA) ──→ 文本回答
  文本 ─────────────────────────────────Tokenize─────┘
```

1. **视觉编码器**：CLIP ViT-L/14，把图像编码成一串 patch token。
2. **投影层**：一个简单的线性层（或 MLP），把 CLIP 的视觉特征投影到 LLM 的词嵌入空间——这是"翻译官"，把视觉语言翻译成 LLM 听得懂的语言。
3. **LLM**：LLaMA/Vicuna，接收文本 token 和投影后的视觉 token，自回归生成回答。

训练分两阶段：

- **Stage 1 预训练对齐**：冻结视觉编码器和 LLM，只训练投影层，让视觉特征对齐 LLM 的词空间。用 CC3M 图文对。
- **Stage 2 视觉指令微调**：冻结视觉编码器，训练投影层和 LLM，用 GPT-4 生成的 158K 多模态指令跟随数据（包含对话、详细描述、复杂推理三类）。

**数据生成的关键技巧**：不是让 GPT-4 直接看图像（当时 GPT-4V 还没公开），而是把图像的边界框、类别名、字幕等结构化信息编码成文本序列喂给 GPT-4，让它基于这些符号信息生成指令。

### 关键结果

- 合成的多模态指令跟随数据集上，LLaVA 相对 GPT-4 达到 85.1% 的分数。
- Science QA 微调后达到 92.53% 准确率（当时 SOTA）。
- 偶尔展现出类似多模态 GPT-4 的行为。

### 为什么是 UMM 的基石

LLaVA 定义了"拼接架构"的标准形态：CLIP 编码器 + 投影层 + LLM。Janus-Pro、BAGEL 的理解侧都直接继承了这个范式。理解 LLaVA 的局限，才能理解 UMM 为什么要"统一"：

- **只能理解不能生成**。CLIP 编码器是单向的，没有解码回像素的能力。
- **视觉信息有损**。CLIP 把图像压缩成语义嵌入，丢失了纹理、文字、空间细节，这也是为什么 U1.5 要强调"近无损视觉接口"。
- **投影层是瓶颈**。一个线性/MLP 投影层要把连续视觉特征"翻译"成 LLM 能理解的离散 token，这个翻译过程本身就有信息损耗。

### 你应该记住的

- "CLIP + 投影 + LLM"三件套。
- 两阶段训练（对齐预训练 → 指令微调）。
- 用纯文本 GPT-4 生成多模态指令数据的技巧。

---

## 4. DDPM：Denoising Diffusion Probabilistic Models（2020）

**论文**：*Denoising Diffusion Probabilistic Models*
**作者**：Jonathan Ho, Ajay Jain, Pieter Abbeel（UC Berkeley）
**链接**：https://arxiv.org/abs/2006.11239
**发表**：NeurIPS 2020

### 解决什么问题

2020 年，GAN 虽然能生成高质量图像，但训练不稳定、模式崩塌问题长期未解。DDPM 从非平衡热力学借来灵感，问了一个朴素的问题：**如果我不断给图像加高斯噪声直到变成纯噪声，能不能学一个网络把这个过程反过来，从噪声一步步去噪生成图像？**

### 核心方法

整个过程分两步：**前向加噪**（把图像一步步破坏成噪声）和**反向去噪**（学会从噪声恢复图像）。

```
  清晰图像 x₀                                    噪声 x_T
     │                                               ▲
     │  ① 前向：逐步加高斯噪声                        │
     ▼                                               │  ② 反向：学一个网络
   x₁ → x₂ → x₃ → ... → x_{T-1} → x_T               │  逐步去噪
     └───────────────────────────────────────────────┘
                        训练阶段
```

#### ① 前向过程：加噪

每一步给数据加一点高斯噪声，让图像逐渐"融化"：

$$q(x_t\mid x_{t-1})=\mathcal{N}\!\left(x_t;\ \sqrt{1-\beta_t}\,x_{t-1},\ \beta_t\,I\right)$$

> 💡 **直觉理解**：新图像 = 上一张图像缩小一点 + 加一点噪声。经过 T 步后，$x_T$ 变成纯高斯噪声。

关键性质：不需要一步步加噪，可以**一步直接算出任意时刻 $x_t$**（重参数化技巧）：

$$x_t=\sqrt{\bar{\alpha}_t}\,x_0+\sqrt{1-\bar{\alpha}_t}\,\varepsilon,\qquad \varepsilon\sim\mathcal{N}(0,I)$$

其中 $\bar{\alpha}_t=\prod_{s=1}^{t}(1-\beta_s)$，表示"保留了多少原始信号"——随 t 增大，$\bar{\alpha}_t$ 趋近 0，信号被噪声淹没。

#### ② 反向过程：去噪

训练一个神经网络 $\varepsilon_\theta$ 预测每一步加入的噪声，损失函数就是一个简单的 MSE：

$$\mathcal{L}=\mathbb{E}_{x_0,t,\varepsilon}\left[\left\|\varepsilon-\varepsilon_\theta(x_t,t)\right\|^2\right]$$

| 阶段 | 做什么 |
|------|--------|
| **训练** | 随机给图像加噪 → 让网络猜加了什么噪声 → 最小化猜测误差 |
| **推理** | 从纯噪声 $x_T$ 开始，每一步用预测的噪声估计 $x_0$，再采样 $x_{t-1}$，逐步去噪 → 最终生成清晰图像 |

### 关键结果

- CIFAR-10 无条件生成：FID 3.17（当时 SOTA），Inception Score 9.46。
- 256×256 LSUN 教堂/塔楼：质量匹敌 ProgressiveGAN。
- 训练比 GAN 稳定得多（就是一个回归损失）。

### 为什么是 UMM 的基石

DDPM 是今天所有主流图像生成模型的底层数学框架。Transfusion 把扩散 loss 直接和 AR loss 加在同一个 Transformer 上；Show-o 用离散扩散生成图像 token；SenseNova U1 虽然去掉了 VAE，但生成侧仍用 Flow Matching（DDPM 的连续版本）。

理解 DDPM 的关键不是记住公式，而是理解两个直觉：

1. **生成 = 迭代去噪**。不是一步出图，而是从粗到细逐步 refine。
2. **训练目标 = 预测噪声**。这是一个简单的回归任务，稳定且可扩展。

### 你应该记住的

- 前向加噪的闭式采样（repametrization）。
- 反向过程训练噪声预测网络。
- 简单的 MSE loss 为什么能 work。

---

## 5. DiT：Scalable Diffusion Models with Transformers（2022）

**论文**：*Scalable Diffusion Models with Transformers*
**作者**：William Peebles, Saining Xie（UC Berkeley / NYU）
**链接**：https://arxiv.org/abs/2212.09748
**发表**：ICCV 2023

### 解决什么问题

DDPM 及其后续工作（包括 Stable Diffusion）的骨干网络都是 U-Net——一个卷积架构，带跳跃连接。U-Net 在扩散模型上效果好，但可扩展性不如 Transformer。DiT 问：**能不能把 U-Net 整个换成 Transformer，而且让扩散模型也享受 Transformer 的 scaling law？**

### 核心方法

DiT 的设计非常直接——把扩散模型的骨干网络从 U-Net 换成 Transformer：

```
  图像 ──→ VAE Encoder ──→ Latent Map ──→ Patchify ──→ Token序列
                                                          │
                                                          ▼
              ┌──── DiT Block × N ────────────────────────┐
              │  ┌──────────┐    ┌──────────────────┐     │
              │  │AdaLN-Zero│    │  AdaLN-Zero      │     │
  时间步 t ──→│  │调制γ,β,α│→MSA→│调制γ,β,α       │→FFN│→ 输出(预测噪声)
  类别 c  ──→│  └──────────┘    └──────────────────┘     │
              └──────────────────────────────────────────┘
                                                          │
                                                          ▼
  生成图像 ←── VAE Decoder ←── 去噪Latent ←── 迭代去噪 ←──┘
```

1. **Latent Space**：先用 VAE 把图像压缩到 latent space（和 Stable Diffusion 一样），降低 token 数量。
2. **Patchify**：把 2D latent feature map 切成 patch，每个 patch 线性投影成 token，类似 ViT。
3. **DiT Block**：标准 Transformer block 加条件注入，核心创新是 **adaLN-Zero**——用时间步 t 和类别 c 通过 MLP 生成 LayerNorm 的缩放（γ）、偏移（β）和残差缩放（α）参数，且 α 初始化为零使训练更稳。
4. **Scaling**：通过调整深度（layers）、宽度（hidden size）、输入 token 数（patch size）来控制 Gflops。

### 关键结果

- DiT-XL/2 在 ImageNet 256×256 类条件生成上 FID 2.27，刷新 SOTA。
- 高 Gflops 的 DiT  consistently 有更低 FID，证明了扩散模型也有 Transformer 的 scaling law。
- 计算量-性能曲线平滑可预测。

### 为什么是 UMM 的基石

DiT 是把"Transformer 统治扩散模型"这件事坐实的论文。它的影响在 UMM 中随处可见：

- Transfusion 的图像生成侧就是 DiT 架构的 Transformer。
- BAGEL 的 MMDiT、UniVideo 的 MMDiT 直接继承 DiT 设计。
- adaLN-Zero 成为条件注入的标准手法，被 Sora、Flux 等几乎所有现代扩散 Transformer 采用。

更重要的是，DiT 证明了**理解侧和生成侧可以共用同一种骨干网络**——都是 Transformer。这为统一架构扫清了最后的工程障碍。

### 你应该记住的

- Patchify + Transformer 替代 U-Net。
- adaLN-Zero 条件注入。
- Gflops 与 FID 的 scaling 关系。

---

## 6. VQ-VAE：Neural Discrete Representation Learning（2017）

**论文**：*Neural Discrete Representation Learning*
**作者**：Aaron van den Oord, Oriol Vinyals, Koray Kavukcuoglu（DeepMind）
**链接**：https://arxiv.org/abs/1711.00937
**发表**：NeurIPS 2017

### 解决什么问题

VAE 的连续 latent space 有个臭名昭著的问题叫"后验崩塌"（posterior collapse）：当解码器太强时，latent 变量被忽略，模型退化成无条件语言模型。VQ-VAE 问：**如果把连续 latent 换成离散的 codebook lookup，能不能避免后验崩塌，还能学到更好的表征？**

### 核心方法

VQ-VAE 做的事情可以用一张图概括：

```
  图像 x
    │
    ▼
┌────────┐   连续特征    ┌──────────────┐   离散 token   ┌────────┐
│ Encoder│ ──────────→  │ Codebook 查表 │ ────────────→ │ Decoder│ → 重建 x̂
└────────┘   z_e(x)     │ 找最近的码字  │   z_q(x)=e_k  └────────┘
                        └──────────────┘
                              ▲
                              │
                     Codebook: K 个码字
                     [e₁, e₂, ..., e_K]
```

整个流程分三步：

| 步骤 | 组件 | 做什么 |
|------|------|--------|
| ① | **Encoder** | 把输入 $x$ 编码成连续特征 $z_e(x)$ |
| ② | **Codebook 量化** | 在 $K$ 个码字中找最近邻，把连续特征" snapping"到离散码字 |
| ③ | **Decoder** | 从离散表征 $z_q$ 重建输入 $\hat{x}$ |

量化操作的数学表达：

$$z_q(x)=e_k,\qquad k=\arg\min_j \left\|z_e(x)-e_j\right\|$$

> ⚠️ **不可微怎么办？** argmin 无法求导。VQ-VAE 使用 **straight-through estimator**：前向传播用量化结果，反向传播直接把梯度"抄"给 encoder（假装量化不存在）。

损失函数有三项，各自有明确分工：

$$\mathcal{L}=\underbrace{\|x-\hat{x}\|^2}_{\text{重建损失}}+\underbrace{\|sg[z_e]-e\|^2}_{\text{Codebook损失}}+\beta\underbrace{\|z_e-sg[e]\|^2}_{\text{Commitment损失}}$$

| 损失项 | 作用 | 通俗理解 |
|--------|------|----------|
| 重建损失 | 让解码结果接近原图 | "画得要像" |
| Codebook 损失 | 码字向 encoder 输出靠拢 | "码字要跟上" |
| Commitment 损失 | encoder 输出别在码字间乱跳 | "encoder 别晃" |

其中 $sg[\cdot]$ 表示 stop-gradient（截断梯度）。

生成时，VQ-VAE 本身只有编码器/解码器，需要再训练一个自回归先验（PixelCNN）在离散 latent 上生成新的 code 序列。

### 关键结果

- 图像、视频、语音生成质量高，避免了后验崩塌。
- 学出的离散表征能做说话人转换、无监督音素学习。
- 证明了离散表征在深度生成模型中的有效性。

### 为什么是 UMM 的基石

VQ-VAE 是"把图像变成离散 token"这条路线的源头。Emu3、Chameleon、Show-o 这些纯自回归或离散扩散的统一模型，视觉 tokenizer 本质上都是 VQ-VAE 的后代。

理解 VQ-VAE 的关键意义：

- **它让图像可以和文本共用同一个 softmax**。一旦图像被量化成 K 个码字中的一个索引，它就和文字 token 在数学上完全等价——都可以用 cross-entropy 预测下一个。
- **它的局限也很明显**：离散化有信息损失，codebook 可能坍缩（部分码字从不被使用），这些问题后来由 VQGAN、FSQ、LFQ 等改进。

### 你应该记住的

- 连续 → 离散的最近邻量化。
- Straight-through estimator 如何绕过不可微操作。
- 三个损失项各自的作用。

---

## 7. VQGAN：Taming Transformers for High-Resolution Image Synthesis（2020）

**论文**：*Taming Transformers for High-Resolution Image Synthesis*
**作者**：Patrick Esser, Robin Rombach, Björn Ommer（海德堡大学 / CompVis）
**链接**：https://arxiv.org/abs/2012.09841
**发表**：CVPR 2021

### 解决什么问题

VQ-VAE 能学离散视觉 token，但重建质量和感知质量不够好，尤其在高分辨率图像上。直接用 Transformer 在像素级做自回归又太慢。VQGAN 问：**能不能结合 CNN 的局部归纳偏置和 Transformer 的长程建模能力，用离散 token 合成高分辨率图像？**

### 核心方法

VQGAN = VQ-VAE 的感知增强版 + Transformer 自回归先验。架构分两阶段：

```
  ═══════════════ 第一阶段：Tokenizer（训练） ═══════════════

  图像 ──→ CNN Encoder ──→ z_e ──→ Codebook量化 ──→ z_q ──→ CNN Decoder ──→ 重建图像
                                ↑                            │
                          最近邻查找                    ┌───┴───┐
                                                       │       │
                                                  VGG感知损失  PatchGAN
                                                  (特征空间)  判别器(对抗)

  ═══════════════ 第二阶段：Transformer Prior（生成） ═══════════════

  条件token ──→ Transformer (GPT架构) ──→ 自回归预测code序列
                                              │
                                              ▼
                                         CNN Decoder ──→ 生成图像
```

1. **CNN Encoder/Decoder**：和 VQ-VAE 类似，但用了带注意力的 CNN，保留局部归纳偏置。
2. **Codebook**：同样的向量量化，但加了两个关键改进：
   - **感知损失（Perceptual Loss）**：重建损失不只看像素级 MSE，还在预训练 VGG 的特征空间算距离，提升感知质量。
   - **PatchGAN Discriminator**：加一个判别器，用对抗训练让重建更逼真。这就是"GAN"后缀的来源。
3. **Transformer Prior**：冻结 VQGAN 的 encoder/decoder，在离散 code 序列上训练一个自回归 Transformer（GPT 架构），学习 code 的长程依赖。条件信息（类别、分割图等）也作为 token 输入。

这个"CNN 学局部 + Transformer 学全局"的分工是论文的核心洞察：CNN 的归纳偏置让它高效处理局部纹理，Transformer 没有归纳偏置但能建模任意长程关系。

### 关键结果

- 第一个用 Transformer 合成百万像素级语义引导图像的工作。
- ImageNet 类条件生成在自回归模型中达到 SOTA。
- 后续的 Stable Diffusion 第一版就建立在 VQGAN（及其改进 LDM）的 latent space 上。

### 为什么是 UMM 的基石

VQGAN 是 Chameleon、Emu3、Show-o 视觉 tokenizer 的直接技术源头。它把 VQ-VAE 从"表征学习工具"升级为"高质量图像编解码器"，让离散视觉 token 真正能支撑生成任务。

VQGAN 的另一层贡献是方法论：**它第一次清晰展示了"压缩 + 自回归"的两阶段范式**——先用一个 tokenizer 把像素压缩成离散 token，再在 token 空间用 Transformer 建模。这个范式被 Emu3 推到极致：不需要扩散、不需要 VAE decoder 之外的任何东西，next-token prediction 就够了。

但 VQGAN 也暴露了纯离散化路线的根本张力：**codebook 大小与重建质量的矛盾**。码本越大，重建越好，但 softmax 开销越大；码本越小，效率越高，但细节损失越多。后来的 SenseNova U1 干脆去掉整个 tokenizer，正是对这一张力的激进回应。

### 你应该记住的

- VQ-VAE + 感知损失 + 对抗训练 = VQGAN。
- CNN 局部 + Transformer 全局的分工。
- "压缩 + 自回归"两阶段范式。

---

## 七篇论文的知识图谱

把七篇论文放在一起，你会发现 UMM 的每一个组件都有出处：

| UMM 组件 | 奠基论文 | 传承关系 |
|---------|---------|---------|
| 骨干架构 | Transformer (2017) | 所有 UMM 的 backbone |
| 理解侧视觉编码 | CLIP (2021) | LLaVA → Janus-Pro 理解侧 |
| MLLM 拼接范式 | LLaVA (2023) | Janus-Pro 的 baseline |
| 生成侧数学框架 | DDPM (2020) | Transfusion/Show-o/U1 的生成 loss |
| 生成侧骨干 | DiT (2022) | Transfusion/MMDiT 的架构 |
| 离散视觉 token | VQ-VAE (2017) | Chameleon/Emu3/Show-o tokenizer |
| 高质量离散 tokenizer | VQGAN (2020) | Chameleon/Emu3 视觉 tokenizer |

三条主线在此交汇：

- **自回归主线**：Transformer → VQ-VAE → VQGAN → Emu3（next-token 统一一切）
- **扩散主线**：DDPM → DiT → Transfusion（AR + Diffusion 混合）
- **对齐主线**：CLIP → LLaVA → Janus-Pro（解耦编码，理解走连续、生成走离散）

读懂这七篇，你就有了理解后续所有 UMM 论文的"词汇表"。下一篇我们进入 2024 年——Chameleon、Emu3、Transfusion、Show-o 四篇论文几乎同时出现，从不同方向回答了"能不能统一"这个问题。

---

## 参考链接

1. Attention Is All You Need: https://arxiv.org/abs/1706.03762
2. CLIP: https://arxiv.org/abs/2103.00020
3. LLaVA: https://arxiv.org/abs/2304.08485
4. DDPM: https://arxiv.org/abs/2006.11239
5. DiT: https://arxiv.org/abs/2212.09748
6. VQ-VAE: https://arxiv.org/abs/1711.00937
7. VQGAN: https://arxiv.org/abs/2012.09841
8. 代码与项目：
   - https://github.com/tensorflow/tensor2tensor
   - https://github.com/OpenAI/CLIP
   - https://llava-vl.github.io/
   - https://github.com/hojonathanho/diffusion
   - https://www.wpeebles.com/DiT
   - https://github.com/deepmind/sonnet
   - https://github.com/CompVis/taming-transformers
