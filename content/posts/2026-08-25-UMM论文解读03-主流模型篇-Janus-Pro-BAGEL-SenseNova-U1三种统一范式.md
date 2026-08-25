---
title: "UMM论文解读03-主流模型篇：Janus-Pro、BAGEL、SenseNova U1的三种统一范式"
date: 2026-08-25
categories: [多模态, 论文解读]
tags: [UMM, Janus-Pro, BAGEL, SenseNova, NEO-unify, MoT, 统一模型, 论文解读]
ogImage: /images/umm-p3-mainstream-cover.jpeg
---

> 如果说 2024 年夏天的四篇论文回答了"统一是否可行"，那么 2025 至 2026 年的三篇代表作——DeepSeek Janus-Pro、字节 BAGEL、商汤 SenseNova U1——回答的是"统一能否匹敌甚至超越专用模型"。三条路线分别选择了解耦编码、MoT 双塔、去 VE/VAE 原生统一，它们的分歧不是工程细节，而是对"统一"这个词的不同哲学理解。

![UMM论文解读系列-主流模型篇](/images/umm-p3-mainstream-cover.jpeg)

## 系列导航

- 01 基础奠基篇：Transformer、CLIP、LLaVA、DDPM、DiT、VQ-VAE、VQGAN
- 02 早期统一模型篇：Chameleon、Emu3、Transfusion、Show-o
- **03 主流模型篇**（本文）：Janus-Pro、BAGEL、SenseNova U1
- 04 VCoT 篇：CoVT、Gen-VCoT、Visual Sketchpad、Visual-Aware CoT、CoT-VLA
- 05 视频与世界模型篇：UniVideo、Emu3.5
- 06 终章：从统一表征到 AGI 终局之战

## 2025 年：统一模型进入主流

2024 年的早期探索有两个共同问题：一是生成质量还打不过顶级扩散模型，二是理解能力和专用 MLLM 有差距。2025 年 1 月到 5 月，三个团队用三种完全不同的方案同时解决了这两个问题：

| 模型 | 团队 | 时间 | 统一策略 | 参数 | 许可证 |
|------|------|------|---------|------|--------|
| Janus-Pro | DeepSeek | 2025.01 | 解耦编码（理解走连续，生成走离散） | 1B/7B | MIT |
| BAGEL | 字节 Seed | 2025.05 | MoT 双塔（GEN+UND 专家共享自注意力） | 7B 激活/14B 总 | Apache 2.0 |
| SenseNova U1 | 商汤 | 2026.04 | NEO-unify 原生统一（去 VE/VAE） | 8B-MoT/A3B-MoT | Apache 2.0 |

三者的共同点是：都在标准 benchmark 上证明了"统一模型可以同时做好理解和生成"，而且都完全开源（代码+权重+技术报告）。这标志着 UMM 从学术探索进入工程可用阶段。

---

## 1. Janus-Pro：解耦编码的极简实用主义

**论文**：*Janus-Pro: Unified Multimodal Understanding and Generation with Data and Model Scaling*
**作者**：Xiaokang Chen, Zhiyu Wu, Xingchao Liu 等（DeepSeek）
**链接**：https://arxiv.org/abs/2501.17811

### 解决什么问题

Janus 初代（2024 年 10 月）已经提出"解耦视觉编码"的思路：理解和生成用不同的视觉编码器，但在 LLM 主干中统一处理。Janus-Pro 在此基础上解决三个问题：训练策略优化、数据扩展、模型规模扩大。

### 核心架构：解耦编码

Janus-Pro 的设计哲学是"输入解耦、输出统一"：

```
图像 ──→ SigLIP-L 编码器 ──→ 连续特征 ──→ 适配层 ──→ LLM 主干（理解）
  │
  └──→ VQ tokenizer ──→ 离散 token ──→ 嵌入层 ──→ LLM 主干（生成）
```

- **理解侧**：用 SigLIP-L（CLIP 的改进版）提取连续视觉特征，通过一个适配层对齐到 LLM 空间。这和 LLaVA 的思路一致，保留了成熟 MLLM 的理解能力。
- **生成侧**：用 VQ tokenizer（来自 Meta 的 LlamaGen 系列工作）把图像量化成离散 token，用 next-token prediction 生成。这和 Emu3/Chameleon 的自回归生成思路一致。
- **LLM 主干**：DeepSeek-LLM（1.5B 或 7B），两侧的视觉 token 在同一个 Transformer 中处理，共享参数。

### Janus-Pro 的三项改进

相比 Janus 初代，Pro 版本做了：

1. **优化训练策略**：
   - 调整了理解和生成任务的训练比例，避免生成信号过强导致理解能力退化。
   - 改进了训练阶段的过渡策略，从纯文本预训练 → 图文对齐 → 统一微调，更加平滑。

2. **扩展训练数据**：
   - 理解侧：增加了高质量 OCR、图表理解、文档分析数据。
   - 生成侧：用了更大规模的图文对（约 7200 万条），并做了美学质量过滤。
   - 论文特别提到增加了"文本生成图像"指令数据的比例，提升了 prompt following 能力。

3. **模型规模扩大**：
   - 从 1.5B 扩展到 7B。
   - 7B 版本在 GenEval 上达到 80% 的分数，与 SDXL-DPO 和同级别专用模型持平。

### 关键结果

- **GenEval（文生图）**：80%，开源模型第一梯队。
- **多模态理解**：在 MME、MMBench、MMVet、SEED-Bench 等多个 benchmark 上达到同规模模型的 SOTA。
- **文本到图像指令跟随**：在 DPG-Bench 上显著优于 Janus。
- **训练效率极高**：7B 模型仅用 128 张 A100 训练约 1 周，这得益于解耦架构不需要从零训练 LLM 主干。

### 设计哲学

Janus-Pro 是三种路线中最"保守"也最实用的：它不追求架构上的原生统一，而是用成熟的理解模块 + 成熟的生成模块，在 LLM 主干处"拼接"。它的优势是工程风险低、训练快、效果稳；代价是两套编码器有额外参数开销，且"统一"更多发生在输出端而非表征端。

这种思路非常 DeepSeek——用最小的工程改动解决最大的实际问题，不追求理论上的优雅，但在性价比上做到极致。

---

## 2. BAGEL：MoT 双塔的"涌现属性"探索

**论文**：*Emerging Properties in Unified Multimodal Pretraining*
**作者**：Chaorui Deng, Deyao Zhu, Kunchang Li 等（字节跳动 Seed）
**链接**：https://arxiv.org/abs/2505.14683
**项目主页**：https://bagel-ai.org/

### 解决什么问题

Janus-Pro 的解耦方案虽然实用，但两个编码器在 LLM 中"相遇"后，信息交互是否充分？理解和生成的协同能否产生"1+1>2"的涌现能力？BAGEL 要回答的是：**能不能让理解和生成在 Transformer 内部更深层地融合，从而涌现出超越简单拼接的能力？**

### 核心架构：Mixture-of-Transformers（MoT）

BAGEL 的架构关键词是 MoT——不是 MoE（Mixture of Experts），而是 Mixture-of-Transformers：

```
输入 token 序列
    │
    ▼
┌─────────────────────────────────────┐
│  Self-Attention（共享，所有 token）   │  ← 理解和生成在此交互
├─────────────────────────────────────┤
│  FFN:                                │
│    UND 专家（处理理解相关 token）      │
│    GEN 专家（处理生成相关 token）      │
│    通过 router 分配                   │
└─────────────────────────────────────┘
    │
    ▼
输出
```

关键设计：

1. **自注意力层完全共享**：理解 token 和生成 token 在自注意力中无差别交互，这是信息融合的核心。不管你是图像 patch 还是文本 word，都能看到序列中的所有其他 token。

2. **FFN 层分成双塔专家**：
   - GEN 专家（Generation Expert）：专注生成任务，处理图像 token。
   - UND 专家（Understanding Expert）：专注理解任务，处理文本和图像理解相关 token。
   - Router 根据 token 类型将其分配给对应专家，不同专家的 FFN 参数独立。

3. **双视觉编码器**：
   - VAE：用于图像生成的连续 latent 编码。
   - ViT：用于图像理解的语义特征提取。
   - 两者编码后都通过适配层进入同一个 Transformer。

4. **Next Token Group Prediction（NTGP）**：不是逐 token 预测，而是以"token group"为单位预测（一组连续的图像 token 一起预测），提升了训练和推理效率。

5. **参数规模**：总参数 14B，每个 token 激活 7B（理解或生成塔之一，加上共享注意力）。

### "Emerging Properties"是什么

论文标题叫"Emerging Properties"（涌现属性），BAGEL 展示的涌现能力包括：

1. **自由形式图像操作（Free-form Image Manipulation）**：
   - 给定一张图和自然语言指令，模型能做任意编辑：加物体、删物体、改材质、换视角、改光照。
   - 这不是简单的 inpainting，而是需要理解指令、理解图像、并生成连贯结果——理解和生成必须协同。

2. **未来帧预测（Future Frame Prediction）**：
   - 给定一张或几张图像，预测接下来的帧。这需要模型理解物理动态（物体怎么运动、场景怎么演变），而不仅仅是生成好看的图片。

3. **3D 操控（3D Manipulation）**：
   - 模型能生成同一物体的不同视角，理解 3D 空间结构，支持视角旋转、三维编辑。

4. **世界导航（World Navigation）**：
   - 在 3D 环境中做导航决策，根据当前视觉输入预测移动方向和下一帧结果。这已经接近"世界模型"的能力。

这些能力都不是显式训练的目标，而是大规模交错图文数据预训练后"涌现"出来的。BAGEL 团队认为，这正是统一模型相比拼接模型的根本优势——当理解和生成在共享注意力中深度交互时，模型能学会超越单独任务的联合推理。

### 关键结果

- **多模态理解**：在 MMMU、MMBench、MMVet 等 benchmark 上超过 Qwen2.5-VL 和 InternVL-2.5 等顶级开源 VLM。
- **文生图**：GenEval 88 分，与 SD3 等专用生成模型竞争。
- **图像编辑**：在经典编辑场景中优于所有开源模型。
- **涌现能力**：在自由编辑、未来帧预测、3D 操控、世界导航等任务上展示了之前开源模型不具备的能力。

### 设计哲学

BAGEL 是三种路线中"中间道路"的代表：它不像 Janus-Pro 那样简单拼接（双塔编码器 + 单一 LLM），也不像 U1 那样激进去掉所有外部编码器。它在 Transformer 内部做"注意力共享 + FFN 分离"的 MoT 设计，既保证了跨模态深度交互，又让理解和生成各自有专用的参数空间。

"7B 激活、14B 总参"的设计也很精妙：推理时只激活一个塔，计算量和 7B 模型相当，但训练时两个塔都在学习，总知识容量是 14B。

---

## 3. SenseNova U1：NEO-unify 的原生统一激进路线

**论文**：*SenseNova-U1: Unifying Multimodal Understanding and Generation with NEO-unify Architecture*
**作者**：商汤科技
**发布**：2026 年 4 月 28 日（产品发布+开源）；arXiv 技术报告 2026 年 5 月 12 日
**链接**：https://arxiv.org/abs/2605.12500
**代码**：https://github.com/OpenSenseNova/SenseNova-U1

### 解决什么问题

BAGEL 和 Janus-Pro 仍然保留了独立的视觉编码器（CLIP/SigLIP/ViT/VAE），这意味着理解和生成之间存在"表征鸿沟"——CLIP 的语义空间和 VAE 的像素空间是两套独立的表示。SenseNova U1 的问题是：**能不能彻底去掉 VE（Visual Encoder）和 VAE，让模型直接从像素和文本中学习一个统一的表征空间？**

### NEO-unify 架构

NEO-unify 的核心是"Encoder-free"设计，分为三个层次的突破：

#### 3.1 接口层：近无损视觉接口

传统模型的视觉接口有两套：
- 输入端：CLIP/SigLIP 编码器把图像压缩成语义嵌入（有损，丢失纹理和文字细节）。
- 输出端：VAE 解码器把 latent 还原成像素（同样有损，有重建误差）。

U1 把两者都去掉了：

- **输入端**：用两层卷积 + GELU 激活，把图像切成 32×32 的 patch，每个 patch 直接映射成 token。没有预训练权重，全部从零学习。
- **输出端**：用 MLP 直接预测原始像素 patch，不经过 VAE 解码。

消融实验显示，NEO-unify（2B）在 MS COCO 2017 上的图像重建 PSNR 达 31.56、SSIM 达 0.85，接近 Flux VAE 的 32.65/0.91。这证明了一个关键假设：**不需要预训练编码器，模型可以自己学到既支持语义理解又保留像素精度的统一表征。**

#### 3.2 训练层：动态分辨率信噪比平衡

统一架构需要处理从 256×256 到 2048×2048 的大跨度动态分辨率（U1 开源版最高支持 2048×2048；后续 U1.5 升级到原生 4K）。传统扩散模型/Flow Matching 用固定噪声先验，分辨率变化时像素点数量级差异会导致信噪比失衡——低分辨率区域噪声过多、高分辨率区域信号被淹没。

U1 设计了分辨率自适应的噪声调度策略：根据输入分辨率动态调整噪声水平和训练目标权重，保证不同分辨率下训练信号均衡。

#### 3.3 参数层：MoT 协同

和 BAGEL 类似，U1 也用了 MoT（Mixture-of-Transformers）设计，但细节不同：

- 推出两个版本：
  - **U1-8B-MoT**：基于 8B dense 理解基线。
  - **U1-A3B-MoT**：基于 30B MoE 基线（激活 3B），理解能力更强。
- 理解和生成通过不同的 FFN 专家处理，但自注意力完全共享。
- 后续 U1.5 版本进一步引入 MOPD（Multi-expert Online Policy Distillation，多专家在线策略蒸馏），让训练时的多个专家在交付时融合为单体模型，提升参数效率。

#### 3.4 训练数据

- **3.9 亿条图文对**：高质量、经过精细过滤的多模态数据。
- **数据策略**：强调"数据质量 > 数据数量"，通过多维度评分（美学、语义、OCR 准确度等）筛选。
- **分辨率**：U1 开源版支持最高 2048×2048 的多尺度训练；U1.5 升级到原生 4K。

### 关键能力

1. **高分辨率图像生成**：U1 开源版最高支持 2048×2048，文字渲染锐利、细节保留好——这直接得益于"去 VAE"的近无损接口。U1.5 进一步升级为原生 4K。

2. **精准编辑（bbox/marker-based editing）**：
   - 给定边界框，精确编辑框内区域（换物体、改属性），框外区域保持不变。
   - 支持 marker 编辑：在图像上画点/线/圈，模型理解这些标记并做对应修改。
   - 注：bbox/marker 编辑能力在 U1.5 版本中得到显著增强。

3. **理解能力匹敌顶级 VLM**：在文本理解、视觉感知、知识推理、Agent 决策、空间智能等多个维度上与专门的理解-only VLM 竞争。

4. **统一的推理接口**：理解和生成用同一个模型、同一种对话格式，不需要切换模型或加载额外权重。

5. **连续性图文创作**（U1 首创）：业内首个实现连续性图文交错输出的模型——单次单模型调用即可分步图文创作，图像间风格高度一致。

### 设计哲学

U1 是三种路线中最激进的：它不满足于在已有模块上做融合，而是回到第一性原理——"语言和视觉是对同一现实世界的不同编码"——重新设计了整个视觉接口。它的赌注是：只要统一表征空间学得足够好，理解和生成都能受益，而且效果会超过任何拼接方案。

这种激进设计的代价是训练难度极大：没有预训练视觉编码器的引导，模型从零开始学视觉表征，需要更多数据和更精心的训练策略。但 U1 证明了这条路走得通，而且在图像精细度（尤其是文字渲染）上确实有优势。

---

## 三种范式的系统对比

### 架构对比

```
Janus-Pro:
  图像 → SigLIP(连续) ─┐
                       ├→ LLM 主干 → 输出
  图像 → VQ(离散) ─────┘

BAGEL:
  图像 → VAE ──────────┐
  图像 → ViT ──────────┼→ 共享Self-Attn + UND/GEN双FFN → 输出
  文本 ────────────────┘

SenseNova U1:
  图像 → 2层Conv(patchify) ─┐
                            ├→ MoT Transformer (无外部VE/VAE) → MLP直接预测像素
  文本 ─────────────────────┘
```

### 关键指标对比

| 维度 | Janus-Pro | BAGEL | SenseNova U1 |
|------|-----------|-------|-------------|
| 视觉编码器 | SigLIP + VQ | VAE + ViT | 无（2层 Conv 从零学） |
| 统一层次 | LLM 主干输出层统一 | Transformer 内部 MoT | 表征空间原生统一 |
| 总参数 | 7B | 14B（激活 7B） | 8B / 30B-A3B |
| 生成方式 | 自回归离散 token | 连续扩散（Flow Matching） | 连续扩散（Flow Matching） |
| 生成分辨率 | 1024 级 | 1024+ 级 | 最高 2048（U1）；U1.5 原生 4K |
| 训练成本 | 128×A100×1周 | 未公开（大规模） | 未公开 |
| 许可证 | MIT | Apache 2.0 | Apache 2.0 |
| 核心优势 | 简洁、训练快、性价比高 | 涌现能力、世界模型潜力 | 近无损视觉、高保真生成 |

### 选型建议

- **研究/快速实验**：选 Janus-Pro。MIT 协议最宽松，训练成本低，代码简洁易改。
- **产品级应用/需要编辑能力**：选 BAGEL。自由编辑和世界模型能力最成熟，社区生态好。
- **高清生成/文字渲染/精细编辑**：选 SenseNova U1。去 VAE 的近无损接口在细节上有明显优势。

### 一个共同趋势

三者虽然路线不同，但有一个共同趋势：**MoT 正在成为统一模型的标准架构**。Janus-Pro 是"软 MoT"（通过不同输入编码器隐式分流），BAGEL 和 U1 是"硬 MoT"（显式的 UND/GEN FFN 专家 + 共享注意力）。理解和生成在共享注意力中融合、在专用 FFN 中各自专精，这个设计模式很可能在后续模型中继续沿用。

---

## 从三篇论文看 UMM 的发展方向

1. **从"能不能统一"到"统一后有什么新能力"**：Janus-Pro 证明统一不降低性能，BAGEL 证明统一能带来涌现能力，U1 证明统一能在精细度上超越拼接方案。

2. **视觉 tokenizer 是下一个主战场**：Janus-Pro 用成熟的 SigLIP+VQ，BAGEL 用 VAE+ViT 双编码器，U1 直接去掉 tokenizer。哪种方案最终胜出还没有定论，但"近无损统一表征"显然是方向。

3. **开源生态加速迭代**：三个模型都用宽松许可证开源，这意味着研究社区可以在它们基础上快速实验。BAGEL 的 WorldBagel、U1 的 Infographic/Interleaved 变体已经展示了社区迭代的速度。

4. **从图像统一走向视频/世界模型**：BAGEL 的未来帧预测和世界导航能力、U1 的近无损视觉接口（后续 U1.5 升级到 4K），都在为视频和世界模型做铺垫。这正是本系列第五篇的主题。

下一篇我们转向一个更细但同样重要的方向：Visual Chain-of-Thought（VCoT）。统一模型不仅要"看"和"画"，还要"边看边想边画"——用视觉信息辅助推理过程。

---

## 参考链接

1. Janus-Pro: https://arxiv.org/abs/2501.17811
2. BAGEL: https://arxiv.org/abs/2505.14683
3. SenseNova U1: https://arxiv.org/abs/2605.12500
4. 代码与项目：
   - Janus-Pro: https://github.com/deepseek-ai/Janus
   - BAGEL: https://github.com/bytedance-seed/BAGEL
   - SenseNova U1: https://github.com/OpenSenseNova/SenseNova-U1
