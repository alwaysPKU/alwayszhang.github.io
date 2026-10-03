---
title: "AI 每日调研 · 2026年10月02日｜OpenAI发布GPT-Live、阿里开源PS级图像编辑模型"
date: "2026-10-02"
categories: ["技术调研"]
tags:
  - AI每日调研
  - 大模型
  - 多模态
  - Omni
  - 具身智能
  - 技术趋势
series:
  name: "AI 每日调研"
  order: 0
---
## 今日速览
1. OpenAI发布GPT-Live语音交互模型，支持同步听与说，对话体验接近真人
2. 阿里开源Qwen-Image-Layered图像模型，可实现PS级图层理解与精准编辑
3. 新松发布松羿力量版具身智能机器人，负载15千克适配工业搬运分拣场景
4. 多模态arXiv新增《Gestalt: Large Multimodal Interplay Model》，聚焦跨模态交互优化
5. 具身智能arXiv新增具身Agent自提升、技能复用方向技术成果

## 大模型
### 厂商动态
- 9月29日曾报道，现确认：OpenAI [GPT-6.1 Sol](https://openai.com/zh-Hans-CN/research/index/release/) 定价为Token价格不到Astra标准价格的一半，能力接近Astra，可支撑高难度编程与专业工作场景需求。
- 其余厂商动态如小米MiMo-V2.6系列、Cohere Embed 5、MiniMax 3发布预告等近5天已报道，当日无实质性新进展，暂不展开。
### arXiv论文
- [Hierarchical Continuous Diffusion Language Models](https://arxiv.org/abs/2610.02193)：提出层级连续扩散语言模型架构，探索扩散范式在自然语言生成领域的落地潜力。
- [JIT-Agent: Scaling Harness Intelligence via Just-in-Time Harness Evolution](https://arxiv.org/abs/2608.25593)：提出即时演化的智能体框架，优化记忆管理、规划策略等核心模块，提升智能体复杂任务处理能力。

## AI应用
### 厂商动态
- [OpenAI发布GPT-Live语音模型](https://soft.china.com/article/1469251.html?f=000713)：打破传统回合制语音交互限制，支持AI同步听与说，对话流畅度接近真人交流。目前ChatGPT语音和听写功能周活用户超1.5亿，覆盖免提辅助、语言练习、通勤陪伴等场景。
- [阿里开源Qwen-Image-Layered图像生成模型](https://soft.china.com/article/2844737.html)：首次在模型内实现PS级图层理解与生成能力，可将图片拆解为独立图层，实现“零漂移”精准图像编辑，解决传统AI生图一致性差的痛点，可直接适配设计师专业修图需求。
- 9月30日曾报道我国生成式AI用户破7亿，现补充：[《生成式人工智能应用发展报告（2026）》](https://www.digitalchina.gov.cn/2026/xwzx/spbb/202609/t20260930_5377625.htm)显示，36.1%的网民使用手机自带AI助手，35.5%使用移动应用内置AI功能，AI已从尝鲜工具转变为日常应用。
- Anthropic发布[Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4.7)：在文档、演示文稿生成质量上优于Opus 4.6，是低成本高生产力场景的可选方案。
### arXiv论文
- [Empty Commitments: When Agents Promise What They Cannot Do](https://arxiv.org/abs/2610.01045)：聚焦智能体任务承诺可信度问题，提出评估框架识别智能体的“空承诺”行为，提升Agent落地可靠性。

## 多模态
### 厂商动态
- [新浪科技报道](https://k.sina.com.cn/article_7879849732_1d5acf70406801jl3e.html)：2026年多模态交互已成为AI应用核心竞争焦点，汽车座舱是典型落地场景，交互范式正从单一语音向“语音+视觉+触控+环境感知”融合方向重构。
- 其余厂商动态近5天已报道，当日无新增信息，暂不展开。
### arXiv论文
- [Gestalt: Large Multimodal Interplay Model](https://arxiv.org/pdf/2610.00576)：提出多模态交互新架构，模拟人类格式塔感知逻辑，提升跨模态内容理解的连贯性与一致性。
- [Multimodal Flow: Unified Flow Modeling of Language and Vision in Embedding Spaces](https://arxiv.org/list/cs/recent?show=50&skip=1240)：提出语言与视觉在嵌入空间的统一流建模方法，降低跨模态任务的训练与推理成本。

## Omni 全模态
### 厂商动态
- 当日暂未捕获到头部厂商全模态模型的新发布与实质性更新，近5天已报道的Qwen3.8-Omni-Flash、AutoOmni2.0、Gemini Omni等动态无新增信息。
### arXiv论文
- [Can MiniMax-H3 Reason About the Physical World? An Evaluation of Omni-Modal Generative Model](https://arxiv.org/html/2609.18323v1)：针对全模态模型的物理世界推理能力构建评估基准，覆盖多视图空间推理、音频消歧等核心任务。
- [Omni-Decision: Evidence-Ledger Planning for Omni-Modal Agents](https://arxiv.org/html/2607.11433)：提出全模态智能体的证据账本规划框架，提升多模态输入下的任务决策准确性与可解释性。

## 具身智能
### 厂商动态
- [新松发布松羿力量版具身智能机器人](http://news.lnd.com.cn/system/2026/10/03/030578006.shtml)：采用仿人躯干+灵巧机械臂+轮式底盘设计，负载可达15千克，适配工业搬运、检测、分拣等场景，支持“即插即用”与多机协同作业。
- 10月1日曾报道国内首个通用具身智能训练平台上线，现无新增信息。
### arXiv论文
- [Reconstruct, Practice, Go Real: Guided Self-Improvement for Embodied Agents](https://arxiv.org/abs/2610.02204)：提出具身智能体引导式自提升框架，通过环境重建、仿真练习、真机迭代三步流程，降低机器人技能落地的真人示教成本。
- [Explore, Execute, Evolve: A Skill Acquisition and Reuse Loop for Embodied Agents](https://arxiv.org/pdf/2609.37810)：构建具身Agent技能获取与复用闭环，支持已学习技能跨场景迁移，提升机器人泛化能力。

## 本周趋势观察
本周AI领域呈现三个明确方向：一是交互体验升级，OpenAI GPT-Live等产品打破传统回合制交互限制，AI与人的交流正逐步向真人级自然度靠拢；二是专业场景渗透加速，阿里Qwen-Image-Layered等工具类模型直接对接设计师、工程师等专业群体的生产需求，AI从辅助工具向生产系统核心组件演进；三是具身智能落地加速，工业级机器人产品与通用训练平台同步成熟，工业搬运、分拣等场景已进入规模化落地验证阶段。
