---
layout: post
title: SenseNova-U1 与 SenseNova-Vision 深度对比
date: 2026-07-14
categories: [大模型]
tags: 大模型, 多模态, 计算机视觉, SenseNova
---

## 项目概览

| 维度 | SenseNova-U1 | SenseNova-Vision |
|---|---|---|
| 全称 | Unifying Multimodal Understanding and Generation | Vision as Unified Multimodal Generation |
| 发布方 | OpenSenseNova | OpenSenseNova |
| 首发时间 | 2026.04.27 | 2026.07.08 |
| 核心模型 | 8B-MoT / A3B-MoT | 7B-MoT |
| 许可证 | Apache 2.0 | Apache 2.0 |
| 项目地址 | [GitHub](https://github.com/OpenSenseNova/SenseNova-U1) | [GitHub](https://github.com/OpenSenseNova/SenseNova-Vision) |

## 核心定位差异

### SenseNova-U1：原生多模态统一

U1 的核心目标是 **从像素到语言的端到端统一**。它提出了 NEO-unify 架构，同时去掉了传统的视觉编码器（Visual Encoder）和变分自编码器（VAE），让语言与视觉信息在一个单体架构中深度融合。

核心理念可以概括为：

- 不再依赖适配器在模态之间做"翻译"，而是让模型原生地跨语言与视觉进行思考和行动
- 统一理解、推理与生成三大能力
- 支持图文交错生成（interleaved generation）

### SenseNova-Vision：计算机视觉即生成

Vision 项目则走了一条更聚焦的路线：**将所有计算机视觉任务统一表达为多模态生成问题**。

它的核心思路是：

- 用自然语言指令定义任务（检测、分割、深度估计、关键点等）
- 文本输出表达符号化视觉记录（类别、bbox、OCR、关键点坐标等）
- 图像输出表达密集空间目标（分割 mask、深度图、法线图、点云图等）
- 混合输出支持组合型任务

## 架构关联

两个项目都采用了 **MoT（Mixture of Transformers）** 架构，这是它们最核心的技术共性：

```
SenseNova-U1 (NEO-unify)
  ├── 统一理解 + 生成
  ├── 去掉 VE + VAE
  └── 8B / A3B 参数规模
        │
        │  (UMM 基座)
        ▼
SenseNova-Vision
  ├── CV 任务 → 指令-响应格式
  ├── 去掉任务特定 head / decoder
  └── 7B 参数规模
```

从架构演进来看，**U1 是基座，Vision 是在 U1 的统一多模态模型（UMM）之上，针对计算机视觉场景的专项扩展**。Vision 项目明确提到"Starting from an off-the-shelf pretrained UMM"，这个 UMM 大概率就是 U1 系列模型。

## 能力对比

### 任务覆盖范围

| 能力维度 | U1 | Vision |
|---|---|---|
| 图像理解 | ✅ | ✅ |
| 文本生成图像（T2I） | ✅ | ❌ |
| 图文交错生成 | ✅ | ❌ |
| 信息图/海报生成 | ✅ | ❌ |
| 图像编辑 | ✅ | ❌ |
| 目标检测 | ❌ | ✅ |
| OCR | ❌ | ✅ |
| 语义/实例/全景分割 | ❌ | ✅ |
| 深度估计 | ❌ | ✅ |
| 法线估计 | ❌ | ✅ |
| 关键点检测 | ❌ | ✅ |
| 多视图几何重建 | ❌ | ✅ |
| 相机位姿估计 | ❌ | ✅ |

### 输出形态

- **U1**：输出以自然语言文本和 RGB 图像为主，侧重"创作"
- **Vision**：输出以结构化数据（bbox、mask、深度图、点云等）为主，侧重"分析"

## 数据与训练

### U1 的训练流程

U1 采用四阶段渐进训练：

1. **Understanding Warmup** — 理解能力预热
2. **Generation Pre-training** — 生成预训练
3. **Unified Mid-training** — 统一中间训练
4. **Unified SFT** — 统一监督微调
5. 最终模型经过 **T2I RL（文本到图像强化学习）** 进一步优化

### Vision 的数据构建

Vision 项目的核心贡献之一是 **SenseNova-Vision Corpus（50M）**：

- 将各种异构 CV 标注统一转换为指令-响应格式
- 涵盖可解码文本、图像、混合文本-图像目标
- 在此基础上训练，不需要任何任务特定的预测头或解码器

## 核心关联总结

1. **同源团队**：两个项目均来自 OpenSenseNova，技术路线一脉相承
2. **架构共享**：都基于 MoT 架构，Vision 以 U1 的统一多模态模型为基座
3. **互补定位**：U1 解决"生成"问题（创作图像/文本），Vision 解决"分析"问题（理解视觉场景）
4. **统一范式**：两者共同验证了一个核心假设——**用统一的多模态生成框架可以覆盖从创作到分析的完整视觉智能**
5. **演进关系**：U1（2026.04）→ Vision（2026.07），Vision 是在 U1 基础上的领域特化扩展

## 展望

两个项目的组合指向一个清晰的趋势：**未来的视觉 AI 不再需要为每个任务训练独立模型**，而是用一个统一的多模态模型，通过自然语言指令来驱动所有视觉任务——从生成一张海报到检测一张 X 光片中的病灶。

U1 和 Vision 分别在"创作"和"分析"两个方向验证了这条路线的可行性，下一步的合流（一个模型同时具备两种能力）是可以预期的方向。