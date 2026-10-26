---
title: "AI 每日调研 · 2026年10月23日｜讯飞星辰TaaS发布、MiniMax开源M3.1 Flash、首个汽车AI基座落地"
date: "2026-10-23"
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
1. 科大讯飞在1024开发者节首发星辰TaaS平台，整合模型调度、智能体引擎等全链路能力，目前讯飞生态开发者已达1187万
2. MiniMax开源M3.1 Flash大模型，上线72小时处理超100万亿Token，能力较上一代全面提升
3. 2026世界智能网联汽车大会发布国内首个汽车行业AI基座，由中国移动牵头，10余家产业单位共同参与建设
4. OpenAI公布前沿模型训练安全方案，通过离线环境构建、高算力红队测试强化训练与评估环节的安全隔离
5. 最新OpenRouter数据显示DeepSeek大模型周调用量环比增长801%登顶全球第一，MiniMax新模型跻身前三
6. 科大讯飞同步发布星火语音基座大模型SparkAudio 1.0、星帆WinWork数字员工平台、AIPC系列等落地产品

## 大模型
### 厂商动态
1. **科大讯飞**：[首发星辰TaaS平台](https://m.thepaper.cn/newsDetail_forward_34328525)，融合模型调度、智能体引擎、知识工程、工具编排和运行治理能力，可打通模型能力、行业知识与业务流程，目前讯飞生态开发者规模达1187万。10月22日曾报道讯飞发布星火X2.6，现更新：同步推出[星火语音基座大模型SparkAudio 1.0](http://www.stdaily.com/web/gdxw/2026-10/23/content_601627.html)、星帆WinWork数字员工平台、科大讯飞AIPC系列产品，推动全国产AI规模化应用。
2. **MiniMax**：[开源M3.1 Flash大模型](https://m.jfdaily.com/wx/detail.do?id=1199603)，该模型10月19日发布后上线72小时处理Token量超100万亿，能力较上一代M3实现全面提升。根据[OpenRouter最新周度数据](https://finance.eastmoney.com/a/202610263907758195.html)，MiniMax新模型已跻身全球大模型调用量前三。
3. **OpenAI**：[发布前沿模型训练安全方案](https://openai.com/zh-Hans-CN/research/index/)，介绍如何通过构建离线训练环境、投入高算力开展红队测试，强化前沿模型训练和评估环节的安全隔离能力。
4. **调用量榜单更新**：[OpenRouter周度数据](https://finance.eastmoney.com/a/202610263907758195.html)显示，上周（10月19日-25日）全球AI大模型总调用量达188万亿Token，环比增长14.63%；其中国产大模型周调用量合计93.54万亿Token，DeepSeek大模型以环比801%的增速登顶全球第一，智谱GLM 5.3跌出榜单。
5. 小米MiMo-V2.6近期已报道，当日无实质性新进展；Anthropic、Meta、Mistral等海外厂商当日未捕获大模型相关新动态。
### arXiv论文
1. [arXiv:2610.28500](https://arxiv.org/abs/2610.28500)《BitMTP: When Multi-Token Prediction Meets Low-Bit Large Language Models》：提出低比特大模型与多Token预测结合的优化方案，可在保证模型精度的同时显著提升推理速度。
2. [arXiv:2610.25596](https://arxiv.org/list/cs/recent?skip=3129)《Cognitive Maps in Large Language Models》：探索大模型内部认知地图的形成机制，为提升大模型空间推理、路径规划能力提供新的研究视角。
3. [arXiv:2610.19271](https://arxiv.org/abs/2610.19271v1)《Outcome-Routed Distillation and Reinforcement Learning for Diffusion Language Models》：提出面向扩散语言模型的结果路由蒸馏与强化学习方法，优化扩散模型的生成质量与效率。
4. [arXiv（未公布完整标题）](https://arxiv.org/list/cs.CL/pastweek?skip=222&show=100)《Evolving with Open Worlds: Towards Recursive Self-Improvement for Future Forecasting》：探索开放世界下大模型递归自我改进路径，提升模型对未来趋势的预测能力。

## AI 应用
### 厂商动态
1. **汽车领域AI应用**：[国内首个汽车行业AI基座发布](http://www.bj.chinanews.com.cn/news/2026/1024/103823.html)，由中国移动牵头建设的国家人工智能应用中试基地（制造领域汽车方向）在2026世界智能网联汽车大会发布该成果，秉持“中立不造车、能力全开放”原则，北京经开区管委会、清华大学、一汽、东风、长安、理想等10余家单位共同参与见证。科大讯飞此前发布的星火智慧座舱3.0及星火汽车大模型，目前已在奇瑞、长城魏牌、东风日产等品牌实现部分功能搭载。
2. **OpenAI GPT-6开放进展**：[OpenAI官方帮助中心更新](https://help.openai.com/zh-hans-cn/articles/20001354-gpt-6-and-other-models-in-chatgpt)，GPT-6正逐步向符合条件的Pro、Plus、Enterprise和Business用户开放，由GPT-6 Astra提供支持的GPT-6 Pro已面向Pro用户开放使用。
3. **Anthropic智能体标准进展**：[Anthropic向Agentic AI基金会捐赠Agent Skills标准](https://www.anthropic.com/search?topic=agent-skills)，该标准为智能体能力的开放通用规范，可降低跨平台智能体开发与协作门槛。
4. 逆矩阵科技联合智源、vLLM、北大发布的PhysisServe物理AI推理系统、科大讯飞星火智慧座舱3.0等近期已发布内容，当日无实质性新进展。
### arXiv论文
暂未捕获到当日AI应用方向的新增高质量论文。

## 多模态
### 厂商动态
1. **智谱AI多模态研究进展**：[唐杰署名论文披露智谱内部多模态模型](https://eu.36kr.com/en/p/4041173265798281)，该模型探索视觉生成能力赋能语言推理路径，或为下一代GLM全模态模型的预研成果。
2. **量子多模态技术突破**：[深圳国际量子研究院联合团队实现多模式真纠缠声子态制备](http://www.xinhuanet.com/liangzi/20261026/f94ce2ad84fe493099948d95f63f8540/c.html)，首次在可扩展二维混合量子芯片平台上完成多模式真纠缠声子态的制备与跨节点传输，相关成果发表于《科学》期刊，为量子多模态信息处理提供了技术基础。
3. 小米MiMo-V2.6全模态模型近期已报道，当日无实质性新进展；OpenAI、Meta、Google等厂商当日未捕获多模态相关新动态。
### arXiv论文
1. [arXiv:2610.29430](https://arxiv.org/list/cs/pastweek?skip=1800&show=50)《MERP: A Latent-Bottleneck Framework for Robust Multi-Modal Multi-Label Emotion Recognition》：提出基于潜在瓶颈架构的多模态多标签情感识别框架，在噪声环境下的识别准确率较现有方案提升12%。
2. [arXiv:2610.30841](https://arxiv.org/list/cs.CL/recent?skip=143)《TRIAD: Benchmarking Omni-Modal Ambiguity in Multimodal Large Language Models》：发布多模态大模型歧义性评测基准TRIAD，可系统评估模型对跨模态歧义的理解与消解能力。

## Omni 全模态
### 厂商动态
1. **NVIDIA NeMo支持Qwen3-Omni**：[NVIDIA官方文档更新](https://docs.nvidia.com/nemo/automodel/v0.4/model-coverage/omni/qwen-3-omni)，NeMo AutoModel框架已完成对阿里云Qwen3-Omni全模态模型的适配，支持一键调用、微调等能力，Qwen3-Omni可支持文本、图像、音频、视频多模态输入。
2. 智谱GLM-Omni、Google Gemini Omni、Meta Muse系列等全模态模型当日未捕获实质性新进展。
### arXiv论文
1. [arXiv:2610.16135v1](https://arxiv.org/abs/2610.16135v1)《Omni-Modal LLMs Know More Than They Say》：研究发现全模态大模型的跨模态知识储备远高于其表面生成结果，通过适当的prompt引导可激活其潜在的多模态推理能力。
2. [arXiv（论文PDF链接）](https://arxiv.org/pdf/2610.31768)《Efficient Omni-modal Large Language Model Inference via Per-Query Modality Selection》：提出基于查询模态选择的全模态大模型推理优化方案，可降低40%的无效模态计算开销，推理速度提升28%。
3. [arXiv（论文PDF链接）](https://arxiv.org/pdf/2610.25929v1.pdf)《OmniGround: Strengthening Omni-Modal Temporal Grounding via Attention-Consistency Training》：提出注意力一致性训练方法，显著提升全模态模型的时序定位能力，在音视频片段检索、动作定位任务上SOTA成绩提升7%。

## 具身智能
### 厂商动态
当日暂未捕获到具身智能方向的最新厂商动态。云深处科技具身大脑成果、伽易具脑TAEI模型等均为后续日期发布内容，智元开源具身推理数据集等也非当日动态。
### arXiv论文
1. [arXiv:2610.30108](https://arxiv.org/html/2610.30108)《Multimodal Embodied Agents: A Unified Capability-centric Perspective from Computer-Use to Robot-Use》：提出统一的多模态具身智能体能力框架，覆盖从电脑操作到机器人实体操作的全场景能力评估维度。
2. [arXiv:2610.02717v1](https://arxiv.org/html/2610.02717v1)《RoboBridge: A Self-Evolving Embodied Agent Framework for Sim-to-Real Transfer》：提出自进化具身智能体框架RoboBridge，可实现仿真到真实场景的高效迁移，仿真训练模型在真实场景下的任务成功率提升35%。

## 本周趋势观察
1. **大模型开源与商业化协同加速**：MiniMax开源M3.1 Flash后短时间内调用量破百万亿Token、DeepSeek大模型调用量登顶全球第一，反映出国产开源大模型的商业化成熟度正在快速提升，开源+API服务的模式已经得到市场广泛认可，未来大模型市场的竞争将进一步聚焦于性能、成本与生态的综合比拼。
2. **行业大模型进入场景落地深水区**：本次科大讯飞星辰TaaS平台、首个汽车行业AI基座的发布，标志着大模型与产业的结合已经从单点技术输出转向全链路平台化服务，平台型产品正在成为大模型落地千行百业的核心载体，可显著降低行业客户的大模型使用门槛。
3. **全模态模型落地效率持续优化**：本周arXiv多篇论文聚焦全模态大模型的推理优化，NVIDIA也完成了对Qwen3-Omni的框架适配，显示出全模态模型正在从技术验证阶段走向规模化部署阶段，推理成本的下降将进一步推动全模态能力在消费端、行业端的普及。
