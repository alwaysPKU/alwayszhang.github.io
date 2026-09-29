---
title: "AI 每日调研 · 2026年09月25日｜斑马AutoOmni2.0发布、具身机器人国产架构落地、小米MiMo开源"
date: "2026-09-25"
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
1. 斑马智能发布端侧全模态大模型AutoOmni2.0-23B-A3B，任务处理能力对标10倍参数量云模型
2. 全球首台搭载全国产化电子架构的具身智能机器人正式亮相，实现控制与AI计算隔离融合
3. 小米开源MiMo-V2.6系列大模型，支持全模态输入，兼顾性能、速度与成本
4. 阿里千问Qwen3.8-Omni技术报告公开，主打原生全模态智能体能力
5. Meta Muse Spark 1.1开放API预览，个人AI助手上线12天下载量达280万次

## 大模型
### 厂商动态
- 小米正式发布并开源新一代[MiMo-V2.6系列大模型](http://kw.beijing.gov.cn/xwdt/kcyx/xwdtyqqy/202609/t20260923_4877361.html)，包含Pro与Flash两款，支持全模态输入，在第一梯队模型中实现性能、速度和价格兼顾，Pro版本登顶全球开源大模型榜单，单任务成本低至0.13美元[来源：新浪财经]
- Anthropic发布[Sonnet 5.5模型](https://c.m.163.com/news/a/L800VBJV05199NPP.html)，运行速度显著快于Sonnet 5，是Opus 5.5的低成本替代方案，定价为每百万输入token 2美元
- OpenAI推出GPT-6 Sol和Luna两款模型，以不同能力与成本组合覆盖日常工作场景，同时上线[MentalHealthBench基准](https://openai.com/zh-Hans-CN/research/index/)，用于评估AI在心理健康对话中的实用性与安全性
- 智谱GLM-5.3-FlashX正式上线[来源：北京国际科技创新中心微信公众号]
- Meta发布[Muse Spark 1.1](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/)，开放Meta Model API公开预览，模型支持"Thinking"模式，已在Meta AI app和meta.ai上线
- 行业研报显示，当前大模型领域呈现降本与安全治理同步演进的趋势[来源：万联证券]

### arXiv 论文
- [Differentiable Fuzzy Inference Layer: A Monotone, Compositional Ordinal Reasoning Head for Large Language Models](https://arxiv.org/list/cs.CL/pastweek?skip=333)：提出可微分模糊推理层，为大模型提供具备单调性、组合性的序数推理能力
- [DeepSeek Elastic Compute (DSec): A Sandbox Infrastructure for Effective Agentic Training at Scale](https://arxiv.org/abs/2609.22978)：公开面向大规模智能体训练的沙箱基础设施DSec，支撑智能体训练的效率与安全性
- 公开Qwen系列模型技术报告[来源：arXiv]

## AI 应用
### 厂商动态
- 高德发布[空间智能AI平台](http://www.xinhuanet.com/tech/20260923/63943f73b15648999552486ddc4ca454/c.html)，以空间智能为基座，构建从空间还原到行业分析再到现实行动的完整链路，推动智慧城市自主进化
- Meta个人AI助手Muse上线12天下载量达280万次，支持邮件、旅行预订与交易执行，正推进与Shopify支付生态整合，加速消费级智能体商业化[来源：中信建投]
- Manus面向海外发布2.0版本及个人生活场景智能助理Cue，同时正组建团队开发面向国内市场的产品，与国产模型厂商的合作稳步推进[来源：新黄河]
- OpenAI推出ChatGPT Work企业方案，具备企业级管控治理能力，支持文件/简报制作、后台自动任务执行，兼容常用工具与插件[来源：OpenAI]
- Google更新Gemini API，发布antigravity-preview-09-2026智能体版本，替换此前的05-2026预览版[来源：Google AI for Developers]

### arXiv 论文
- [SkillEvoReg: Regularizing Agent Skill Evolution](https://arxiv.org/list/cs.AI/recent?skip=50)：提出智能体技能演化正则化方法，提升智能体长期任务执行的稳定性
- [Cross-Country Code-Mixing for Generative Recommendation](https://arxiv.org/list/cs.AI/recent?skip=426)：针对跨国场景下的混合代码生成推荐问题提出优化方案
- [Agent Survival Micro-benchmark for Long-Horizon LLMs: Social Exposure, Personas, and Tool Use Budgets](https://arxiv.org/list/cs/pastweek?skip=1100&show=50)：发布长上下文大模型智能体生存微基准，覆盖社交暴露、角色设定、工具使用预算等评估维度

## 多模态
### 厂商动态
- 微软研究院公开通用多模态基础模型BEiT-3的技术进展，推动文本、图像、多模态预训练技术走向大一统[来源：智算网络联盟]
- 国内多模态AIGC行业进入新阶段，AI视频从生成素材向完整作品交付演进，技术竞争转向全链路系统能力[来源：新华网]
- 2026年AI语音助手实现多模态交互革新，融合视觉、手势、情绪感知能力，可根据驾驶场景主动调整交互策略，重塑座舱体验[来源：新浪新闻]
- 北京市科委披露[多模态协同感知大模型技术研究及在自动驾驶中的应用](https://www.ncsti.gov.cn/kcfw/zcg/kjcgxxxt/cgxq/?id=14423)成果，属原始创新，目前处于实验室研究阶段，已获13项相关专利

### arXiv 论文
- [TAC-Time: Texts as Channels For Multimodal Time Series Forecasting](https://arxiv.org/list/cs.MM/recent?skip=4&show=50)：提出将文本作为多模态时间序列预测的信息通道，提升预测精度
- [Multimodal Thinking with Renderable Programs](https://arxiv.org/list/cs/recent?skip=788)：提出基于可渲染程序的多模态思考框架，增强多模态模型的推理可解释性
- [THERE AND BACK AGAIN: BIDIRECTIONAL DIFFUSION BRIDGES FOR MULTIMODALITY TRANSLATION](https://arxiv.org/pdf/2608.27885)：提出双向扩散桥架构，实现不同模态之间的双向高效转换
- [Evolution of Multimodal Question Answering: From Modality-Adaptive Extraction to Unified Language Representation](https://arxiv.org/abs/2609.08896)：梳理多模态问答技术演进路径，提出从模态自适应提取到统一语言表示的发展方向

## Omni 全模态
### 厂商动态
- 斑马智能在云栖大会发布新一代端侧全模态大模型[AutoOmni2.0-23B-A3B](http://www.xinhuanet.com/auto/20260925/f2922c2fbc1a433b84ee485a7291b8b7/c.html)，普通任务处理能力堪比10倍参数量云模型，复杂任务处理能力达到10倍参数量云模型的80%-90%，主打具身智能场景适配
- 阿里千问上线[Qwen3.8-Omni-Flash全模态模型](https://www.donews.com/news/detail/8/6715324.html)，支持文本、图像、音频、视频输入，上下文长度达1M，相比上一代30项评测平均得分提升超26%，音视频能力显著增强，API成本最高降幅达98%，主打原生全模态智能体能力，已在千问AI平台开放使用
- Google DeepMind公开Gemini Omni模型进展，支持以视频为起点的任意模态内容生成[来源：Google DeepMind]

### arXiv 论文
- [Qwen3.8-Omni: Towards Native Omni-Modal Agents](https://arxiv.org/abs/2609.25611v1)：阿里千问团队公开Qwen3.8-Omni的技术细节，阐述原生全模态智能体的设计思路与性能表现
- [Can MiniMax-H3 Reason About the Physical World? An Evaluation of Omni-Modal Generative Model](https://arxiv.org/html/2609.18323v1)：针对全模态生成模型的物理世界推理能力提出系统性评估框架，覆盖多视图空间推理、音频消歧等维度
- [OmniFysics-Nano-V2 Technical Report: Understanding the Physical World Across Modalities](https://arxiv.org/html/2609.25738)：发布跨模态物理世界理解模型OmniFysics-Nano-V2的技术报告，优化端侧全模态模型的物理推理性能

## 具身智能
### 厂商动态
- 全球首台搭载[全国产化电子架构的具身智能机器人](http://www.zqrb.cn/gscy/qiyexinxi/2026-09-28/A1790581337709.html)在湖北宜昌正式发布，由东土科技主导提供底层底座，整合鸿道实时操作系统、AUTBUS总线、国产AI计算芯片等核心模块，实现实时控制与AI智能计算的隔离融合，打通从AI决策到物理执行的全国产技术链路，可完整替代国外方案
- 智元与长隆集团联手打造的[全球首个大规模具身智能主题乐园](http://kjj.gz.gov.cn/xydt/content/post_11022969.html)在横琴启幕，超过300台智元全系机器人常态化上岗，覆盖文娱商演、科普研学、导览导购、互动娱乐等场景，落地全球最大规模常态化"人机共演"、机器人空中飞人表演等项目
- 深圳诺因智能发布通用具身智能生成式学习架构[GLOW技术](http://www.gd.chinanews.com.cn/2026/2026-09-27/449852.shtml)，支持通过一次人类完整演示，让机器人实现跨物体、跨环境的任务复用，无需为新任务重新采集数据或更新模型参数
- Google DeepMind公开Gemini Robotics 2进展，作为通用机器人智能层，可智能控制各类形态的机器人系统[来源：Google DeepMind]

### arXiv 论文
- [EmbodiedMind: Adaptive Data Curation and Prefix-Tree Reinforcement Learning for Efficient Embodied Intelligence](https://arxiv.org/html/2609.19659v1)：提出EmbodiedMind框架，通过自适应数据治理与前缀树强化学习，提升具身智能的训练效率
- [Know Your Body: A Harness for Direct and Self-Improving Robot Control with VLMs](https://arxiv.org/pdf/2609.28530)：提出基于视觉语言模型的机器人自改进控制框架，让机器人实现对自身本体的感知与控制优化
- [Neurosymbolic Embodied Agents](https://arxiv.org/abs/2608.16794v2)：提出神经符号具身智能体架构，结合神经网络的感知能力与符号系统的推理能力，提升复杂场景下的任务执行可靠性

## 本周趋势观察
本周AI领域呈现三大清晰趋势：一是全模态模型向端侧下沉加速，斑马AutoOmni2.0等端侧全模态模型的能力已经逼近大参数量云模型，结合成本优势将进一步推动具身智能、智能座舱等端侧场景的落地；二是具身智能的国产化替代取得核心突破，全国产电子架构的落地打通了从底层芯片、操作系统到上层AI决策的全链路，摆脱了对国外技术方案的依赖，同时文旅场景已经实现具身智能的大规模商业化落地，验证了To C场景的商业化可行性；三是大模型市场竞争进一步分化，开源模型如小米MiMo-V2.6在性能追平第一梯队的同时成本大幅降低，闭源模型则通过分层产品矩阵（如Sonnet 5.5、GPT-6系列）覆盖不同性价比需求，同时安全治理已经成为大模型迭代的核心前置指标。
