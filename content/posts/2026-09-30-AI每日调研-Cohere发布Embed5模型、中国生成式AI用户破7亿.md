---
title: "AI 每日调研 · 2026年09月30日｜Cohere 发布Embed 5模型、中国生成式AI用户破7亿"
date: "2026-09-30"
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
1. Cohere 于9月30日正式推出Embed 5嵌入模型，相关技术细节已更新至官方Release Notes
2. 中国互联网络信息中心发布报告，截至2026年上半年我国生成式AI用户规模突破7亿，普及率超50%
3. 多模态领域arXiv新增《Gestalt: Large Multimodal Interplay Model》等技术成果，聚焦跨模态交互能力优化
4. 全模态领域最新arXiv论文围绕物理世界推理、Agent规划等方向展开技术探索
5. 具身智能领域新增具身Agent技能复用、自提升等方向的arXiv研究成果

---
## 大模型
### 厂商动态
- 9月30日，Cohere官方发布[Embed 5系列嵌入模型](https://docs.cohere.com/v2/changelog)，相关技术细节与可用性信息已同步至官方更新日志[来源：Cohere]
- 9月29日曾报道OpenAI推出GPT-6.1 Sol模型，现补充：官方明确该模型Token价格不到Astra标准价格的一半，能力接近Astra，可满足高难度编程与专业工作需求[来源：[OpenAI Research](https://openai.com/zh-Hans-CN/research/index/)]
- 小米MiMo-V2.6系列大模型、OpenAI取消GPT-6.1 Astra发布、Anthropic Sonnet 5.5等动态近5天已连续报道，当日无新增信息，暂不展开
### arXiv 论文
- [Hierarchical Continuous Diffusion Language Models](https://arxiv.org/abs/2610.02193)：提出层级连续扩散语言模型架构，探索扩散范式在自然语言生成领域的应用潜力
- [JIT-Agent: Scaling Harness Intelligence via Just-in-Time Harness Evolution](https://arxiv.org/abs/2608.25593)：提出即时编排演化的Agent框架，通过动态优化内存管理、规划策略提升Agent任务执行上限

---
## AI 应用
### 厂商动态
- 中国互联网络信息中心发布[《生成式人工智能应用发展报告（2026）》](https://c.m.163.com/news/a/L83DM6PF04198EVR.html)，截至2026年上半年我国生成式AI用户规模突破7亿，普及率超50%；其中36.1%网民使用手机自带AI助手，35.5%使用移动端AI工具，应用场景从尝鲜转向日常刚需[来源：新华社]
- OpenAI推出面向金融行业的ChatGPT专项解决方案，集成GPT-6 Astra模型与金融专属数据集，可提升研究、分析、运营及客户服务全流程效率[来源：[OpenAI金融行业方案页](https://openai.com/zh-Hans-CN/solutions/industries/financial-services/)]
- Mistral推出OCR 4.1文档理解模型，定价为每1000页4美元，官方称其为当前全球性能最优的文档提取与理解工具[来源：[Mistral定价页](https://mistral.ai/pricing/api/)]
### arXiv 论文
- [Empty Commitments: When Agents Promise What The](https://arxiv.org/abs/2610.01045)：揭示当前AI Agent存在的承诺履约缺陷问题，提出可量化的任务履约度评估框架

---
## 多模态
### 厂商动态
- 9月29日微软研究院发布通用多模态基础模型BEiT-3技术解读，该模型实现文本、图像预训练架构统一，为多模态任务提供统一技术底座[来源：[智算网络联盟](http://zslm.openi.org.cn/index.php?m=content&c=index&a=show&catid=14&id=297)]
- 2026年多模态交互技术已成为汽车座舱核心竞争点，当前主流方案已实现语音、视觉、触控、环境感知能力融合，交互范式从单一指令转向自然协同[来源：[新浪新闻](https://k.sina.com.cn/article_7879849732_1d5acf70406801jl3e.html)]
### arXiv 论文
- [Gestalt: Large Multimodal Interplay Model](https://arxiv.org/pdf/2610.00576)：提出多模态交互大模型架构，模拟人类格式塔认知机制，提升跨模态信息关联理解能力
- [Multimodal Flow: Unified Flow Modeling of Language and Vision in Embedding Spaces](https://arxiv.org/list/cs/recent?show=50&skip=1240)：提出嵌入空间内语言与视觉统一流建模方法，降低多模态任务推理延迟

---
## Omni 全模态
### 厂商动态
- 小米MiMo-V2.6、阿里Qwen3.8-Omni-Flash、斑马AutoOmni2.0等动态近5天已连续报道，当日无新增信息，暂不展开
- NVIDIA更新Nemotron 3 Omni模型训练配方，针对30B参数混合专家模型优化多模态后训练流程，降低全模态模型微调门槛[来源：[NVIDIA官方文档](https://docs.nvidia.com/nemotron/nightly/nemotron/omni3/README.html)]
### arXiv 论文
- [Can MiniMax-H3 Reason About the Physical World? An Evaluation of Omni-Modal Generative Model](https://arxiv.org/html/2609.18323v1)：针对全模态生成模型的物理世界推理能力构建评估基准，覆盖多视角空间推理、音频歧义消解等场景
- [Omni-Decision: Evidence-Ledger Planning for Omni-Modal Agents](https://arxiv.org/html/2607.11433)：提出证据账本规划机制，提升全模态Agent任务决策的可解释性与准确性

---
## 具身智能
### 厂商动态
- 新松公司最新发布的松羿力量版轮式具身智能机器人负载达15千克，可适配搬运、检测、分拣等工业场景，目前已完成底层算法、仿真环境、技能学习框架、多智能体协同全技术栈自研[来源：[北国网](http://news.lnd.com.cn/system/2026/10/03/030578006.shtml)]
- 东土科技全国产化电子架构具身智能机器人、智元具身智能主题乐园等动态近5天已连续报道，当日无新增信息，暂不展开
### arXiv 论文
- [Explore, Execute, Evolve: A Skill Acquisition and Reuse Loop for Embodied Agents](https://arxiv.org/pdf/2609.37810)：提出具身Agent技能获取与复用闭环框架，实现技能跨场景迁移复用，降低新场景训练成本
- [Reconstruct, Practice, Go Real: Guided Self-Improvement for Embodied Agents](https://arxiv.org/abs/2610.02204)：提出引导式自提升训练范式，让具身Agent可通过环境反馈自主优化动作策略，减少人工标注依赖

---
## 本周趋势观察
1. **大模型性价比竞争进入深水区**：继OpenAI推出成本减半的GPT-6.1 Sol之后，Cohere、Mistral等厂商均在近一周更新高性价比模型产品线，前沿能力下探至中等价格区间，大模型商业化从追求参数规模转向“能力-成本”均衡
2. **国内生成式AI渗透进入普及阶段**：7亿用户规模、超50%的普及率标志着生成式AI已完成早期用户教育，接下来应用竞争将从功能创新转向场景深耕，智能助手、生产力工具等高频刚需类产品增长空间明确
3. **具身智能落地场景持续拓宽**：继工业、文旅场景之后，近一周农业采摘、家庭服务、应急救援等场景的落地需求已进入技术攻关阶段，VLA模型、仿真训练平台等工具链逐步成熟，行业从单点落地向规模化复制演进
