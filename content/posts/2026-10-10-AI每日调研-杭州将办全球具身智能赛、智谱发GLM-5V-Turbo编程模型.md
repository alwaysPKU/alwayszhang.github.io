---
title: "AI 每日调研 · 2026年10月10日｜杭州将办全球具身智能赛、智谱发GLM-5V-Turbo编程模型"
date: "2026-10-10"
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
1. 首届全球具身智能应用创新挑战赛10月13日杭州启幕，同期举办ITU具身智能标准全会
2. 智谱发布GLM-5V-Turbo多模态编程基座，支持设计稿/截图直接生成可运行代码
3. DeepSeek被曝拟入局具身智能领域，或自研+投资双线布局
4. 阿里云Qwen3.5-Omni-Flash-Realtime全模态模型正式更新，支持多语种音视频交互
5. 谷歌EmbeddingGemma2多模态嵌入模型发布，可端侧运行跨模态检索

## 大模型
### 厂商动态
1. [智谱发布GLM-5V-Turbo多模态Coding基座模型](https://soft.china.com/article/1053557.html)：预训练阶段深度融合视觉与文本能力，支持设计稿、截图、网页界面输入直接生成可运行代码。核心特性包括原生多模态Coding能力、纯文本编程推理能力不退化、多模态Coding与GUI Agent基准表现领先。
2. [OpenAI开放gpt-oss系列权重模型](https://openai.com/zh-Hans-CN/open-models/)：包含gpt-oss与gpt-oss-safeguard两个系列，均提供120B、20B参数版本，支持本地部署，可自定义安全策略，许可协议宽松。
3. 10月9日曾报道Meta发布Muse Wonder旗舰大模型、OpenAI提升GPT-6.1 Sol上下文至500k，当日无新增进展，暂不展开。
### arXiv论文
1. [arXiv:2610.13330](https://arxiv.org/list/cs/pastweek?skip=256)《Masked Diffusion Language Agents for Tool-Integrated Chemical Reasoning》：提出掩码扩散语言智能体框架，实现化学推理场景下工具调用能力提升。
2. [arXiv:2608.25593](https://arxiv.org/abs/2608.25593)《JIT-Agent: Scaling Harness Intelligence via Just-in-Time Harness Evolution》：提出即时演化的智能体框架，提升复杂任务调度效率。

## AI 应用
### 厂商动态
1. [千问即将发布个人AI助理“千问Go”](https://m.thepaper.cn/list_100743?contId=17267839)：10月9日曾报道相关动态，现更新实测场景：已支持自动申请航班延误理赔、淘宝价保退款，还可执行汽车保养预约、运动场地预定、购物比价等任务。
2. [阿里云推出多款场景化AI应用](https://www.aliyun.com/)：包括HappyHorse影视级视频生成模型、万小智3.0智能建站工具、STAROps智能运维系统，覆盖内容创作、企业服务、技术运维等场景。
3. [OpenAI推出“ChatGPT 工作”企业方案](https://openai.com/zh-Hans-CN/chatgpt-work/)：支持团队协同编辑、模板自定义、工具与文档背景关联，可自动生成文档、演示文稿与分析结果，已覆盖Business和Enterprise套餐。
### arXiv论文
1. [arXiv:2610.07860](https://arxiv.org/list/cs.AI/recent?skip=644)《WorkflowOps: Learning Agent Collaboration Priors for Multi-Agent Workflow Orchestration》：提出多智能体工作流编排的协作先验学习框架，提升复杂任务协同效率。

## 多模态
### 厂商动态
1. [谷歌发布EmbeddingGemma 2多模态嵌入模型](https://www.sohu.com/a/1086863717_114765)：将原文本嵌入能力扩展至图像、音频、视频，支持多模态共享嵌入空间，体积小可在智能手机端运行，可实现本地语音备忘录匹配对应视频片段等端侧跨模态检索能力，无需云端传输数据。
2. [阿里披露多模态模型训练进展](https://www.nfcb.com.cn/wap391075.CSV)：Qwen-Image-3.1性能已逼近GPT-Image系列，下一代视频模型正在训练中。
3. 10月5日曾报道紫东太初ZDTaichu5.0-9B获9大基准8项第一，为10B参数档具身能力最强多模态模型，当日无新增进展。
### arXiv论文
1. [arXiv:2610.11363](https://arxiv.org/list/cs/pastweek?skip=1350)《UniData: Universal Multimodal Instruction Generation Pipeline》：提出通用多模态指令生成流水线，提升多模态模型指令微调数据构建效率。

## Omni 全模态
### 厂商动态
1. [阿里云更新Qwen3.5-Omni-Flash-Realtime全模态模型](https://help.aliyun.com/zh/model-studio/qwen3-5-omni-flash-realtime)：为Qwen3-Omni的进化版本，支持60+种语言音频输入、30+语言语音输出，具备智能语义打断、网页搜索、复杂工具调用能力，可应用于语音助手、多媒体分析等场景。
2. [NVIDIA公开Nemotron 3 Omni训练方案](https://docs.nvidia.com/nemotron/nightly/nemotron/omni3/README.html)：针对30B-A3B混合MoE架构的Nemotron 3 Nano Omni模型，提供多模态后训练流水线，降低全模态模型训练门槛。
3. 9月18日曾报道Qwen3.8-Omni-Flash发布，当日无新增进展。
### arXiv论文
1. [arXiv:2609.25738](https://arxiv.org/html/2609.25738v1)《OmniFysics-Nano-V2 Technical Report: Understanding the Physical World Across Modalities》：提出跨模态物理世界理解模型，提升全模态模型对真实世界物理规则的认知能力。

## 具身智能
### 厂商动态
1. [首届全球具身智能应用创新挑战赛将于10月13-18日在杭州举办](https://www.hangzhou.gov.cn/col/col812266/art/2026/art_5e1f28abd20744d794b3553fb25f5896.html)：同期举办国际电信联盟ITUT具身智能标准焦点组第三次全会，来自43个国家的近400名专家将围绕多模态数据、接口互操作等议题拟定两项关键技术规范。
2. [DeepSeek拟入局具身智能领域](https://news.china.com/socialgd/10000169/20261013/49791365.html)：创始人梁文锋近期密集接触具身智能创业者，目前评估两种路径：一是自建团队研发机器人大模型，二是领投腾讯前AI科学家胡瀚创立的机器人公司Winverse AI种子轮。
3. [安徽省具身智能创新中心正式揭牌](http://news.ustc.edu.cn/info/1056/96558.htm)：在中国科大具身智能产学研融合创新大会上成立，将聚焦人形机器人技术研发、成果转化与产业落地。
4. [宇树科技王兴兴称具身智能临界点1-2年内到来](https://cj.sina.com.cn/articles/view/1644983660/620c756c02001wlwk?froms=ttmp)：团队已将GPT-6部署至机器人测试，任务执行效果符合预期，大模型技术迭代将加速具身智能落地节奏。
5. 10月9日曾报道全国已建成70家具身智能训练场，当日无新增进展。
### arXiv论文
1. [arXiv:2610.10498](https://arxiv.org/html/2610.10498)《EmbodiedRSI: Active Continual Robot Learning Through Hypothesis-Guided Co-Evolution》：提出假设引导的协同进化框架，提升机器人主动持续学习能力。
2. [arXiv:2609.32862](https://arxiv.org/pdf/2609.32862)《RoboFoundry: System-as-Policy Evolution for Self-Learning Embodied Agents》：提出系统即策略的进化方法，实现具身智能体自学习能力升级。

## 本周趋势观察
本周AI领域呈现三大明显趋势：一是具身智能进入产业落地关键期，政策、标准、赛事、资本多端共振，国内从训练场基建到产学研落地的全产业链布局基本成型，头部大模型厂商也开始下场布局，赛道热度持续攀升；二是多模态能力走向场景化深耕，从通用能力竞争转向垂直领域专用能力突破，视觉编程、端侧跨模态检索等实用化功能陆续落地；三是全模态模型的实时交互能力成为迭代重点，智能打断、低延迟音视频交互等特性显著提升了C端场景的可用性，个人AI助理的落地门槛进一步降低。
