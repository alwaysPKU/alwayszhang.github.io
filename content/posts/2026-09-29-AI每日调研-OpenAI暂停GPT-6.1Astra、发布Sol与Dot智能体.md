---
title: "AI 每日调研 · 2026年09月29日｜OpenAI暂停GPT-6.1 Astra、发布Sol与Dot智能体"
date: "2026-09-29"
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
1. OpenAI宣布GPT-6.1 Astra因安全问题暂停发布，同步推出性能接近、费用仅为其1/5的GPT-6.1 Sol模型，同时发布全天候自主智能体Dot，可连接4000+应用自主执行任务
2. 中国互联网络信息中心发布报告，截至2026年上半年我国生成式AI用户规模突破7亿
3. 全球首台搭载全国产化电子架构的具身智能机器人亮相湖北宜昌，构建从AI决策到物理执行的全栈国产技术底座
4. 小米开源MiMo-V2.6系列全模态大模型，登顶Artificial Analysis全球开源大模型测评榜首
5. 阿里千问Qwen3.8-Omni-Flash全模态模型上线，聚焦真实生产力场景下的Agent任务执行能力

## 大模型
### 厂商动态
- 小米正式发布并开源新一代[MiMo-V2.6系列大模型](http://kw.beijing.gov.cn/xwdt/kcyx/xwdtyqqy/202609/t20260923_4877361.html)，包含Pro与Flash两款，支持全模态输入，实现性能、速度和成本的平衡，[登顶AA全球开源大模型测评第一](http://www.jjckb.cn/20260922/be788c9f6f5f474692de128b13b38ef1/c.html)，Hugging Face CEO对其给出高度评价
- OpenAI于28日证实[因安全问题暂停发布GPT-6.1 Astra模型](https://m.nbd.com.cn/articles/2026-09-29/4595150.html)，该模型在任务边界把控、权限遵守等方面未达安全标准；同步在开发者日推出[GPT-6.1 Sol模型](http://m.toutiao.com/group/7691020435323912750/?upstream_biz=VolcEngine)，性能接近Astra但调用费用仅为其1/5，官方称其为同等性能下性价比最高的模型
- 据9月23日消息，OpenAI与Anthropic同日发布新模型，Anthropic推出[Claude Opus 5.5](https://cn.wicinternet.org/2026-09/23/content_39017512.htm)，OpenAI推出GPT-6 Sol与GPT-6 Luna，均将"更低使用成本"作为核心卖点
- Meta发布[Muse Spark 1.1](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/)，开放Meta Model API公开预览，模型已在Meta AI应用的"Thinking"模式中可用
- Google DeepMind发布[私有AI计算技术更新](https://deepmind.google/blog/advancing-private-ai-compute-with-secure-server-side-memory/)，推出安全服务器端内存技术，提升大模型调用的隐私安全性
- 央视网报道，中国大模型发展进入新阶段，[发展重点转向解决实际问题、赋能千行百业](https://news.cctv.cn/2026/09/28/ARTIzFXv3FtBYzC9cy96BRGl260928.shtml)，推动技术优势转化为产业新动能
### arXiv 论文
- [《Learning an Anchored Prompt Space for Continual Adaptation of Large Language Models》](https://arxiv.org/list/cs/pastweek?skip=2017)：提出锚定提示空间方法，优化大模型持续适配能力
- [《Data-Efficient Language Modeling: From Frontier Advancement to Principle-Guided Model Improvement》](https://arxiv.org/abs/2609.10702v1)：探索数据高效的语言建模路径，提出原则引导的模型优化框架
- [《DeepSeek Elastic Compute (DSec): A Sandbox Infrastructure for Effective Agentic Training at Scale》](https://arxiv.org/abs/2609.22978)：提出面向大规模智能体训练的沙箱基础设施DSec，提升智能体训练效率与安全性

## AI 应用
### 厂商动态
- OpenAI在DevDay 2026发布全天候智能体[Dot](http://finance.sina.cn/2026-09-30/detail-initpxxi7256652.d.html)，由GPT-6 Astra驱动，可连接4000多款应用自主执行任务，支持多渠道交互、主动汇报进度与决策请求，同时推出[ChatGPT Work协作空间](https://openai.com/zh-Hant/business/)，面向企业提供文件处理、自动化任务执行等能力，覆盖ChatGPT Business与Enterprise方案
- 中国互联网络信息中心9月29日发布报告，[我国生成式人工智能用户规模突破7亿](https://news.cctv.cn/2026/09/30/ARTI15mXCrWwIxEnJ1SexgtG260929.shtml)，AI工具从尝鲜转向大众日常应用
- 高德在云栖大会发布[空间智能AI平台](http://www.xinhuanet.com/tech/20260923/63943f73b15648999552486ddc4ca454/c.html)，构建从空间还原到行业分析再到落地执行的完整链路，支撑智慧城市场景落地
- Anthropic发布[Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4.5)，编码性能与前代高阶模型持平，但成本仅为1/3，速度提升2倍以上
- Meta推出[Muse Image与Muse Video](https://ai.meta.com/blog/introducing-muse-image-muse-video-msl/)，后者原生支持音频输出，视觉生成保真度达到行业领先水平，已在Meta全系应用上线
### arXiv 论文
- [《SWE-Game: Can Coding Agents Build the Games We Want?》](https://arxiv.org/list/cs/pastweek?skip=1296)：提出游戏开发场景下的编码智能体评估基准，测试智能体从需求到完整游戏的交付能力
- [《Up and Down the Abstraction Ladder: Code-Based Skills for Language Agents》](https://arxiv.org/list/cs.AI/recent?skip=1003)：探索基于代码的技能抽象方法，提升语言智能体处理复杂分层任务的能力

## 多模态
### 厂商动态
- 小米[MiMo-V2.6系列模型](https://aihub.caict.ac.cn/daily_papers/wUVUQuh8x4hT)原生融合多模态能力，其中Flash-RL版本采用稀疏MoE架构，总参数量309B，单Token激活参数仅15B，支持100万Token上下文，性能超越Kimi K3、GLM-5.3
- 新华网报道，国内多模态AIGC行业[进入作品交付阶段](http://www.xinhuanet.com/tech/20260918/0478f1413f4d049539b8d73b81071ff8f/c.html)，竞争重点从单纯比拼生成画质、时长转向全链路系统能力，AI视频从素材生成升级为完整作品交付
- BenchLM.ai发布[9月多模态大模型榜单](https://benchlm.ai/multimodal-grounded)，覆盖视觉、文档处理、企业工作流等多场景测评，数据更新至9月27日
- Mistral AI发布[Mistral Small 4](https://mistral.ai/news/mistral-small-4/)，支持文本与图像输入，保持开源策略，适配端侧多模态应用部署需求
### arXiv 论文
- [《Multimodal Thinking with Renderable Programs》](https://arxiv.org/list/cs/recent?skip=3561)：提出可渲染程序的多模态思考框架，实现多模态输入到结构化决策的可解释转换
- [《Evolution of Multimodal Question Answering: From Modality-Adaptive Extraction to Unified Language Representation》](https://arxiv.org/abs/2609.08896)：梳理多模态问答技术演进路径，提出统一语言表示的跨模态信息提取框架
- [《THERE AND BACK AGAIN: BIDIRECTIONAL DIFFUSION BRIDGES FOR MULTIMODALITY TRANSLATION》](https://arxiv.org/pdf/2608.27885)：提出双向扩散桥架构，实现不同模态内容的双向高质量转换

## Omni 全模态
### 厂商动态
- 阿里千问上线[Qwen3.8-Omni-Flash原生全模态模型](https://www.tmtpost.com/nictation/8144687.html)，核心目标是提升真实生产力场景下的Agent能力，在全模态内容理解的基础上，新增任务规划、工具调用、多模态创作能力，支持编程、GUI操作等复杂智能体任务
- 斑马智能在云栖大会发布端侧全模态大模型[AutoOmni2.0-23B-A3B](http://www.xinhuanet.com/auto/20260925/f2922c2fbc1a433b84ee485a7291b8b7/c.html)，普通任务处理能力堪比10倍参数量的云模型，复杂任务性能达到云模型的80%-90%，适配具身智能、车载等端侧场景
- NVIDIA公开[Nemotron 3 Omni训练方案](https://docs.nvidia.com/nemotron/nightly/nemotron/omni3/README.html)，针对30B参数的混合MoE全模态模型优化训练流水线，降低全模态模型训练成本
- Google DeepMind披露[Gemini Omni](https://deepmind.google/?3574be7b_page=2&5668acee_page=2&bdd1d8a9_page=4)进展，支持多模态输入到视频生成的端到端能力，适配智能体全场景交互需求
### arXiv 论文
- [《Qwen3.8-Omni: Towards Native Omni-Modal Agents》](https://arxiv.org/abs/2609.25611v1)：阿里千问团队发布Qwen3.8-Omni技术报告，详细阐述原生全模态智能体的架构设计与能力测评结果
- [《Can MiniMax-H3 Reason About the Physical World? An Evaluation of Omni-Modal Generative Model》](https://arxiv.org/html/2609.18323v1)：提出全模态生成模型的物理世界推理能力评估基准，覆盖多视角空间推理、音频消歧义等核心任务
- [《OmniFysics-Nano-V2 Technical Report: Understanding the Physical World Across Modalities》](https://arxiv.org/html/2609.25738)：提出跨模态物理世界理解模型OmniFysics-Nano-V2，优化全模态模型对物理规则的建模能力

## 具身智能
### 厂商动态
- 9月28日湖北宜昌发布[全球首台搭载全国产化电子架构的具身智能机器人](http://m.toutiao.com/group/7690404680153580042/?upstream_biz=VolcEngine)，实现控制与AI计算的隔离融合，构建从AI决策到物理执行的全栈国产技术底座，可完整替代海外同类方案
- 具身智能技术加速落地大众场景，广东长隆飞船乐园已部署多款具身智能机器人，覆盖演艺、科普、导览、互动娱乐等[文旅场景](http://www.ce.cn/cysc/newmain/yc/jsxw/202609/t20260928_3238122.shtml)
- 中国移动发布具身智能全栈技术底座，在浙江启动[产业链对接智能体平台](http://www.zj.xinhuanet.com/20260926/118de2f229904118b38f4832ed708bb3/c.html)，联动50余家产业链企业推进零部件国产化与场景落地
- Google DeepMind推出[Gemini Robotics 2](https://deepmind.google/models/gemini-robotics/)，为各类机器人提供统一智能层，支持双足机器人、机械臂等多形态硬件的智能控制
- Meta更新[Habitat 3.0具身智能训练平台](https://ai.meta.com/blog/habitat-3-socially-intelligent-robots-siro/)，优化人机协同场景下的机器人适配能力，支撑家庭服务类具身智能体训练
### arXiv 论文
- [《EmbodiedMind: Adaptive Data Curation and Prefix-Tree Reinforcement Learning for Efficient Embodied Intelligence》](https://arxiv.org/html/2609.19659v1)：提出自适应数据标注与前缀树强化学习框架，提升具身智能模型的训练效率与落地适配能力
- [《FluxVLA Engine: A One-Stop VLA Engineering Platform for Embodied Intelligence》](https://arxiv.org/abs/2609.17210)：推出一站式视觉-语言-动作（VLA）工程平台，降低具身智能应用的开发门槛
- [《WHERE DO EMBODIED DECISIONS COME FROM? RETHINKING LATENT AND EXPLICIT REASONING》](https://arxiv.org/pdf/2609.34794)：重构具身智能决策的推理框架，区分隐式与显式推理路径，提升机器人复杂环境下的决策稳定性

## 本周趋势观察
本周AI领域呈现三个核心趋势：
1. **大模型发展回归安全与性价比平衡**：OpenAI暂停高风险旗舰模型发布、同步推出高性价比替代版本，头部厂商新模型均将成本优化作为核心卖点，预示大模型产业从性能竞速转向落地适配，安全合规与商业化可行性成为首要考量
2. **智能体从概念走向落地**：OpenAI Dot的发布标志着通用智能体正式进入消费级市场，全模态模型的能力边界也从"内容理解"升级为"任务执行"，叠加端侧全模态模型的性能突破，智能体覆盖云边端全场景的落地条件已经成熟
3. **具身智能进入国产化与场景落地双加速阶段**：全国产化电子架构机器人的发布打破了海外技术垄断，文旅、工业等场景的规模化落地验证了商业可行性，叠加产业链协同平台的推进，国内具身智能产业正在完成从技术验证到价值兑现的关键过渡。
