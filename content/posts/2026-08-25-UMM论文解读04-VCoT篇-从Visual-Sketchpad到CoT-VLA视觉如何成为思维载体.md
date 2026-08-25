---
title: "UMM论文解读04-VCoT篇：从Visual Sketchpad到CoT-VLA，视觉如何成为思维的载体"
date: 2026-08-25
categories: [多模态, 论文解读]
tags: [VCoT, 视觉思维链, CoVT, Gen-VCoT, Visual-Sketchpad, CoT-VLA, Visual-Aware-CoT, 论文解读]
ogImage: /images/umm-p4-vcot-cover.jpeg
---

> Chain-of-Thought 让 LLM 能用文字"想一遍再答"，但人类在解决空间、几何、导航等问题时，不只在脑中推理——我们会画辅助线、做标记、在纸上打草稿。Visual Chain-of-Thought（VCoT）研究的就是：能不能让多模态模型也用视觉信息做推理中间产物，而不仅限于文字？本文解读五篇代表性论文，它们从连续 token、RGB 图像、外部画板、视觉检查清单、未来帧预测五个方向探索了这个问题。

![UMM论文解读系列-VCoT篇](/images/umm-p4-vcot-cover.jpeg)

## 系列导航

- 01 基础奠基篇：Transformer、CLIP、LLaVA、DDPM、DiT、VQ-VAE、VQGAN
- 02 早期统一模型篇：Chameleon、Emu3、Transfusion、Show-o
- 03 主流模型篇：Janus-Pro、BAGEL、SenseNova U1
- **04 VCoT 篇**（本文）：CoVT、Gen-VCoT、Visual Sketchpad、Visual-Aware CoT、CoT-VLA
- 05 视频与世界模型篇：UniVideo、Emu3.5
- 06 终章：从统一表征到 AGI 终局之战

## 为什么需要 VCoT

当前 VLM（Vision-Language Model）的推理过程几乎全是文字 CoT。模型看一张图，然后输出一段文字推理，最后给出答案。但这种方式在两类任务上表现差：

1. **密集感知任务**：数物体、判读空间关系、理解几何结构——这些需要"看到"细节，而不是"用文字描述"细节。
2. **多步空间推理**：地图导航、棋盘推演、几何证明——这些需要在视觉空间中做变换和推演，纯文字 CoT 容易丢失空间信息。

人类的策略是画图。画辅助线解决几何题，在地图上画路线，在棋盘上标记候选位置。VCoT 的核心问题就是：**模型能不能也生成视觉中间产物来辅助推理？**

五篇论文从五个不同角度回答这个问题，形成了一个完整的技术光谱。

---

## 1. Visual Sketchpad：用外部画板做视觉推理（2024.06）

**论文**：*Visual Sketchpad: Sketching as a Visual Chain of Thought for Multimodal Language Models*
**作者**：Yushi Hu, Weijia Shi, Xingyu Fu 等（华盛顿大学 / AI2）
**链接**：https://arxiv.org/abs/2406.09403
**发表**：NeurIPS 2024

### 核心思路

Visual Sketchpad 给多模态 LM 一个"视觉画板"和一组绘画工具。模型在推理过程中可以画线、画框、做标记，然后根据自己画出来的视觉产物继续推理。关键区别在于：**不是用 text-to-image 模型画写实图像，而是画类似人类草稿的线条、框和标记**——这更接近人类在纸上打草稿的行为。

### 工作机制

1. **工具集**：
   - 基本绘图：画线、画矩形、画点、标记区域。
   - 专家视觉模型调用：可以调目标检测模型画 bounding box、调分割模型画 mask、调深度估计模型生成深度图。
   - 这些工具的输出直接叠加在画板上，作为下一步推理的视觉输入。

2. **推理循环**：
   ```
   观察图像 → 规划要画什么 → 调工具画到画板 → 看画板+原图 → 继续推理或给出答案
   ```

3. **训练方式**：
   - 用 GPT-4o 等强模型生成"绘图轨迹"数据（什么时候该画线、画什么线）。
   - 微调模型学会在合适的时候调用绘图工具。

### 关键结果

- 数学任务（几何、函数图像、棋盘）：平均提升 12.7%。
- 视觉推理任务：平均提升 8.6%。
- GPT-4o + Sketchpad 在多个 benchmark 上创新 SOTA：
  - V*Bench：80.3%
  - BLINK 空间推理：83.9%
  - Visual Correspondence：80.8%

### 意义与局限

Visual Sketchpad 是 VCoT 方向的开山之作之一，它确立了"视觉中间产物辅助推理"这个范式。但它的局限也很明显：

- **依赖外部工具**：画线可以自己画，但 bbox、mask、深度图需要调外部专家模型，不是端到端的。
- **不是模型自己生成视觉内容**：画板上的标记是"几何操作"而非"模型生成的图像"。
- **推理链变长**：多轮工具调用增加了延迟和出错概率。

后续的 CoVT 和 Gen-VCoT 正是要解决"让模型自己生成视觉中间产物"的问题。

---

## 2. CoVT：连续视觉 token 作为思维载体（2025.11）

**论文**：*Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens*
**作者**：Yiming Qin, Bomin Wei, Jiaxin Ge 等（北大 / 伯克利 / UT Austin）
**链接**：https://arxiv.org/abs/2511.19418

### 核心思路

CoVT 的问题很精确：Visual Sketchpad 用的是外部工具，能不能让 VLM 在自己的 token 空间中生成"视觉思维"？CoVT 的答案是用**连续视觉 token**（continuous visual tokens）——不是离散的文字 token，也不是 RGB 图像，而是紧凑的 latent 表征。

### 技术架构

1. **视觉 token 的形态**：
   - 每个"视觉思维步骤"只有约 20 个连续 token，非常紧凑。
   - 这些 token 编码了密集的感知线索：2D 外观、3D 几何、空间布局、边缘结构等。

2. **训练时——知识蒸馏**：
   - 用轻量级视觉专家模型（深度估计、分割、边缘检测、DINO 特征等）生成密集预测。
   - 训练 VLM 自回归地预测这约 20 个连续 token，使这些 token 能重建专家模型的密集输出。
   - 损失函数：连续 token 的预测值与目标之间的回归损失 + 重建损失。

3. **推理时——直接在 token 空间推理**：
   - 模型在推理过程中先生成连续视觉 token（在 latent 空间"想一想"），再生成文字答案。
   - 这些 token 不需要解码成图像就能被模型自身读取（因为它们就是模型自己的中间隐状态）。
   - 可选：把连续 token 解码成深度图、分割图等，供人类检视（可解释性）。

### 关键结果

在 10+ 个感知 benchmark 上评测，包括 CV-Bench、MMVP、RealWorldQA、MMStar、WorldMedQA、HRBench：

- 集成到 Qwen2.5-VL 和 LLaVA 后，性能一致提升 3%~16%。
- 空间推理和几何感知任务提升最显著。
- 推理开销极小——只有约 20 个额外 token，不生成图像。

### 为什么重要

CoVT 的价值在于它找到了一个"甜点"：

- **比文字 CoT 信息密度高**：连续 token 能编码空间和几何信息，文字描述会丢失这些。
- **比生成 RGB 图像快**：不需要运行扩散模型，20 个 token 的自回归生成几乎零额外开销。
- **比调外部工具端到端**：视觉 token 是模型自己生成的，不需要 SAM/Marigold 等外部依赖。

它的局限是：连续 token 对人类不可直接解释（虽然可解码），且"20 个 token 能编码多少视觉信息"这个问题仍有上限。对于需要高分辨率视觉细节的推理，可能不够用。Gen-VCoT 正是从另一个方向回应了这个局限。

---

## 3. Gen-VCoT：用扩散模型生成 RGB 图像作为推理中间产物（2026.06）

**论文**：*Gen-VCoT: Generative Visual Chain-of-Thought Reasoning via Diffusion-Based RGB Intermediate Representations*
**作者**：Zhiqiang Zhou, Junliang Dai, Xu Ling
**链接**：https://arxiv.org/abs/2606.16783

### 核心思路

如果 CoVT 的连续 token 太紧凑、信息容量有限，那能不能直接生成**完整的 RGB 图像**作为推理中间产物？Gen-VCoT 的回答是：可以，而且用专家视觉模型生成的 RGB 图像（分割图、深度图等）比不透明的 token 更可解释。

### 三阶段流程

Gen-VCoT 把视觉推理分成三个阶段，每个阶段用一个专门的视觉模型：

1. **视觉定位（Visual Grounding）**：
   - 用 SAM（Segment Anything Model）生成分割图，把图像中的物体和区域分离出来。
   - 解决"在哪里"的问题。

2. **几何推理（Geometric Reasoning）**：
   - 用 Marigold（单目深度估计模型）生成深度图。
   - 解决"多远、空间关系如何"的问题。

3. **语义推理（Semantic Reasoning）**：
   - 把分割图、深度图和原图一起输入 Qwen2-VL，进行最终推理。
   - 解决"是什么、意味着什么"的问题。

4. **自适应路由器（Adaptive Router）**：
   - 不是所有问题都需要三阶段。路由器根据问题类型决定推理深度：
     - 简单事实查询 → 直接回答，不生成视觉中间产物。
     - 空间问题 → 用深度图。
     - 复杂多物体问题 → 分割 + 深度 + 语义全上。

### 关键发现

- 空间问题：提升 25%。
- 深度相关问题：提升 50%。
- 但简单事实查询：生成视觉中间产物反而可能降低性能（增加了干扰信息）。
- 在 CLEVR 这类组合推理任务上，文字 CoT（91.2%）明显优于视觉中间产物（62.5%），说明视觉 CoT 不是万能的。

### 与 CoVT 的对比

| 维度 | CoVT | Gen-VCoT |
|------|------|----------|
| 视觉中间产物 | 连续 token（~20个） | RGB 图像（分割图/深度图） |
| 生成方式 | 模型自回归预测 | 外部专家模型（SAM/Marigold） |
| 额外开销 | 极小（20 token） | 大（需运行多个视觉模型） |
| 可解释性 | 需解码才可看 | 直接可见 |
| 适用任务 | 广泛感知推理 | 深度/空间类任务 |
| 端到端 | 是 | 否（多模型流水线） |

两篇论文形成有趣的互补：CoVT 追求效率和端到端，Gen-VCoT 追求信息完整和可解释。它们没有互相否定，而是指出了 VCoT 设计空间中"效率 vs 信息量"的权衡。

---

## 4. Visual-Aware CoT：让生成模型也保持视觉一致性（2025.12）

**论文**：*Visual-Aware CoT: Achieving High-Fidelity Visual Consistency in Unified Models*
**作者**：Zixuan Ye, Quande Liu, Cong Wei 等（港科大 / 快手可灵团队）
**链接**：https://arxiv.org/abs/2512.19686

### 核心思路

CoVT 和 Gen-VCoT 关注的是"理解任务中的视觉推理"。但统一模型还涉及生成任务——当模型根据参考图像做生成或编辑时，它的 CoT 推理过程也应该"看到"参考图像的视觉特征，而不是只和文字 prompt 对齐。Visual-Aware CoT（VA-CoT）解决的就是这个问题：**让统一模型在生成推理过程中保持视觉上下文一致性。**

### 解决什么问题

当前统一模型（如 BAGEL、U1）在多参考图生成、图像编辑等任务中，CoT 推理过程主要关注文本一致性（"我要生成一只猫"），而忽略了视觉一致性（"这只猫要和参考图中的猫长得一样"）。结果就是：人物 ID 漂移、物体属性丢失、风格不一致。

### 技术方法

VA-CoT 引入两个核心机制：

1. **自适应视觉规划（Adaptive Visual Planning）**：
   - 在生成 CoT 推理文本之前，先生成结构化的"视觉检查清单"：明确列出需要保持一致的视觉特征（人物面部、服装颜色、物体形状、材质风格等）。
   - 这个清单不是文字泛泛而谈，而是从参考图像中提取的具体视觉约束。

2. **Flow-GRPO 强化学习**：
   - 用 Group Relative Policy Optimization（GRPO）训练模型，奖励函数同时考量：
     - 文本一致性（是否符合 prompt）。
     - 视觉一致性（是否保持了参考图的关键特征）。
   - 通过在线 RL，模型学会在生成过程中"回头看"参考图，而不是只按文字描述生成。

### 关键贡献

- 首次把 VCoT 从"理解侧推理"扩展到"生成侧一致性控制"。
- 视觉检查清单 + flow-GRPO 的组合，在多参考图生成和图像编辑任务上显著提升一致性。
- 和 CoVT/Gen-VCoT 不同，VA-CoT 不生成额外的视觉中间产物，而是让模型的"思维过程"本身更具视觉意识。

### 在 UMM 版图中的位置

VA-CoT 对 BAGEL、SenseNova U1 这类统一模型尤其有价值：它们已经有生成能力，缺的不是"能不能生成"，而是"生成时能不能记住参考图长什么样"。VA-CoT 提供的是一种后训练（post-training）增强方案，不需要改架构。

---

## 5. CoT-VLA：预测未来帧作为机器人的视觉思维（2025.03）

**论文**：*CoT-VLA: Visual Chain-of-Thought Reasoning for Vision-Language-Action Models*
**作者**：Qingqing Zhao, Yao Lu, Moo Jin Kim 等（NVIDIA / Stanford / MIT）
**链接**：https://arxiv.org/abs/2503.22020
**发表**：CVPR 2025

### 核心思路

CoT-VLA 把 VCoT 推到了最具体的应用场景：机器人操作。它的洞察是：**机器人在行动之前，如果能先"想象"行动后的视觉结果（未来帧），就能更好地规划动作序列。** 预测的未来图像帧就是机器人的"视觉思维链"。

### 技术架构

1. **统一 token 空间**：
   - 模型能理解和生成三种 token：视觉 token（观察图像）、语言 token（指令）、动作 token（机器人动作序列）。
   - 7B 参数，基于预训练 VLM。

2. **视觉 CoT 推理**：
   - 给定当前观察和语言指令（如"把杯子放到盘子上"），模型先自回归生成"子目标图像"（subgoal image）——预测执行动作后场景应该长什么样。
   - 然后基于这个想象的子目标图像，生成一小段动作序列来实现它。
   - 执行后再看新观察，再想象下一帧，再生成动作——形成闭环。

3. **训练数据**：
   - 机器人演示数据：观察-动作对。
   - 非机器人视频数据：用于训练未来帧预测能力（互联网视频包含大量物理交互）。
   - 图像-文本数据：维持视觉理解和语言能力。

### 为什么"想象未来帧"能帮助规划

传统 VLA（Vision-Language-Action）模型是直接从观察映射到动作：`观察 + 指令 → 动作`。这种"反射式"映射在简单任务上够用，但在多步复杂操作中容易走偏——模型不知道最终目标长什么样。

CoT-VLA 的 `观察 + 指令 → 想象子目标 → 动作` 流程有两个好处：

1. **子目标图像提供了明确的视觉锚点**：动作不再是盲目输出，而是朝着一个具体的视觉状态收敛。
2. **未来帧预测迫使模型理解物理因果**：要预测"杯子放到盘子上后长什么样"，模型必须理解重力、接触关系、空间布局。

### 关键结果

- 真实机器人操作任务：比 SOTA VLA 模型提升 17%。
- 仿真 benchmark：提升 6%。
- 证明了视觉 CoT 在具身智能中的有效性——"先想后做"比"直接做"好。

### 与统一模型的关系

CoT-VLA 虽然是一个 VLA 模型，但它的架构本质上就是一个统一多模态模型——同时理解视觉、生成视觉、生成动作。它代表了 UMM 向"具身智能"和"世界模型"方向的自然延伸。BAGEL 的世界导航能力、Emu3.5 的世界探索能力，和 CoT-VLA 的子目标预测，底层逻辑是相通的：**生成未来视觉状态 = 理解世界运行规律。**

---

## 五篇论文的技术光谱

把五篇论文放在一起，VCoT 的设计空间变得清晰：

| 论文 | 视觉中间产物形态 | 生成方式 | 应用场景 | 是否端到端 |
|------|----------------|---------|---------|-----------|
| Visual Sketchpad | 线条/框/标记 | 工具调用 | 通用视觉推理 | 否（需外部模型） |
| CoVT | 连续 latent token（~20个） | 模型自回归 | 感知/空间推理 | 是 |
| Gen-VCoT | RGB 图像（分割/深度图） | 外部专家模型 | 深度/空间推理 | 否 |
| Visual-Aware CoT | 视觉检查清单（文本） | 模型生成 + RL | 生成一致性 | 是 |
| CoT-VLA | 未来帧图像 | 模型自回归 | 机器人规划 | 是 |

### 两个维度的分类

**维度一：视觉中间产物是"模型自己生成"还是"外部工具提供"？**
- 模型自生成：CoVT、VA-CoT、CoT-VLA
- 外部工具：Visual Sketchpad、Gen-VCoT

趋势很明显：研究正在从"调工具"走向"模型自己生成视觉内容"。这和 UMM 的大方向一致——当模型本身就能生成图像时，为什么还要调外部 SAM？BAGEL/U1 自生成 VCoT 是最自然的路径。

**维度二：视觉中间产物的"显式程度"？**
- 最隐式：CoVT 的连续 token（人类不可直接读）
- 中间态：VA-CoT 的视觉检查清单（文本但描述视觉）
- 最显式：Gen-VCoT 的 RGB 图像、CoT-VLA 的未来帧、Sketchpad 的绘画

显式的好处是可解释、信息量大；隐式的好处是高效、端到端。具体选哪种取决于任务需求。

---

## VCoT 与 UMM 的结合：最大的机会

当前 VCoT 论文大多在传统 VLM（LLaVA、Qwen-VL）上验证，还没有在 BAGEL/U1 这类统一模型上充分探索。但两者的结合是最有想象力的方向：

1. **统一模型天然能生成视觉内容**：不需要外挂扩散模型或 SAM，模型本身就能输出图像 token 并解码。CoT-VLA 的"想象未来帧"在 BAGEL 上可以直接实现。

2. **理解和生成共享注意力**：模型生成视觉中间产物后，这些 token 就在同一个上下文中，理解分支可以直接读取——不需要重新编码。LatentUM 的双分支共享语义空间已经验证了这一点（迷宫导航 97% 准确率）。

3. **自生成 VCoT 的飞轮效应**：模型用自己的生成能力辅助理解，理解能力提升后又能生成更好的视觉中间产物——形成正反馈循环。

本系列前一篇提到的 SenseNova U1 借鉴 VCoT 的三个方向（外挂方案、自生成深度图、自生成完整视觉推理链），正是基于这些论文的分析。VCoT 不是独立于 UMM 的研究方向，而是 UMM 能力涌现的关键机制之一。

---

## 参考链接

1. Visual Sketchpad: https://arxiv.org/abs/2406.09403
2. CoVT: https://arxiv.org/abs/2511.19418
3. Gen-VCoT: https://arxiv.org/abs/2606.16783
4. Visual-Aware CoT: https://arxiv.org/abs/2512.19686
5. CoT-VLA: https://arxiv.org/abs/2503.22020
6. 项目主页：
   - Visual Sketchpad: https://visualsketchpad.github.io/
   - CoVT: https://wakalsprojectpage.github.io/covt-website/
   - CoT-VLA: https://cot-vla.github.io/
