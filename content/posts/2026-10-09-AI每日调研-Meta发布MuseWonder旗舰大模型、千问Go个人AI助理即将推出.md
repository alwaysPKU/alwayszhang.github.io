---
title: "AI 每日调研 · 2026年10月09日｜Meta发布Muse Wonder旗舰大模型、千问Go个人AI助理即将推出"
date: "2026-10-09"
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
1. Meta推出Muse Wonder旗舰大模型，14个月攻坚后跻身前沿梯队
2. 千问即将发布个人AI助理“千问Go”，可自动申请理赔、价保退款
3. 紫东太初ZDTaichu5.0-9B正式对外确认10B参数档多模态具身能力第一
4. Cloudflare发布Clef-omni全模态模型，同步推出更高速低成本的Clef系列版本
5. 我国已建成70家具身智能训练场，首届全球具身智能挑战赛将在杭州举办
## 大模型
### 厂商动态
1. [Meta发布新一代旗舰大模型Muse Wonder](http://m.toutiao.com/group/7695994569251160576/?upstream_biz=VolcEngine)：这是Meta重组AI团队14个月后首次推出自称达到“前沿水平”的旗舰大模型，包含主打快速性能的Muse Wonder与完整版本Muse Wonder Full，扎克伯格称其是公司朝着“个人超级智能”目标的重要一步，官方跑分显示其在多项基准测试中超越Anthropic同期模型。
2. [OpenAI上线开放模型页面](https://openai.com/zh-Hans-CN/open-models/)：推出gpt-oss与gpt-oss-safeguard两个系列开放权重模型，均提供120B和20B参数版本，支持在台式机、笔记本和数据中心本地运行，支持自定义安全策略，许可协议宽松。
3. [OpenAI提升GPT-6.1 Sol上下文长度升级至500k](https://finance.sina.com.cn/tech/roll/2026-10-12/doc-iniuxrzn0474192.shtml)：Codex和Work环境下该模型默认上下文长度从272k提升至500k，增幅约80%，官方称可显著降低长文档处理的分段成本。
4. 小米MiMo-V2.6、GPT-6全量上线、Anthropic Claude Opus 5等近5天已报道，当日无新增进展，暂不展开。
### arXiv论文
1. [arXiv:2610.13330](https://arxiv.org/list/cs/pastweek?skip=256)《Masked Diffusion Language Agents for Tool-Integrated Chemical Reasoning》：提出掩码扩散语言智能体框架，实现工具集成的化学推理任务性能较现有方案提升42%。
2. [arXiv:2610.11573](https://arxiv.org/list/cs/recent?skip=1243)《Memory Type》：聚焦大模型记忆类型体系优化，针对长上下文场景的记忆召回准确率提升27%。
3. [arXiv:2608.25593](https://arxiv.org/abs/2608.25593)《JIT-Agent: Scaling Harness Intelligence via Just-in-Time Harness Evolution》：提出即时线束演化智能体框架，工具调用成功率较基线提升61%。
## AI 应用
### 厂商动态
1. [千问即将发布个人AI助理“千问Go”](https://m.thepaper.cn/list_100743?contId=17267839)：可自动执行航班延误理赔、淘宝价保退款、汽车保养预约、运动预约、购物比价等任务，目前已有的测试用户已成功拿到70元航班理赔款、52元价保退款，是全球首个可直接为用户完成实际事务的个人AI助理。
2. [阿里云上线多款AI应用免费体验服务](https://www.aliyun.com/)：包含千问Qwen3.8系列原生多模态大模型、HappyHorse影视级视频生成模型、万小智3.0智能建站工具、STAROps智能运维工具，覆盖多模态创作、企业建站、运维等场景。
3. [阿里云发布语音大模型系列](https://www.aliyun.com/benefit/scene/voice-h5)：千问3-TTS-Flash离线语音合成模型支持17种拟人音色、多语言方言支持，低延迟高稳定；千问3-ASR-Flash语音识别模型支持多场景识别准确率达98.7%，可应用于智能座舱、会议纪要、客服外呼等场景。
4. [OpenAI推出“ChatGPT 工作”企业服务](https://openai.com/zh-Hans-CN/chatgpt-work/)：支持团队可自定义模板和格式，集成工具与文件背景信息生成文档、演示文稿和分析结果；团队可在资料空间与AI共同创建交互式页面，实时编辑、评论，支持@AI修改，已向Business和Enterprise方案用户开放。
5. “人工智能+”行动全面实施相关政策近5天已报道，当日无新增进展，暂不展开。
### arXiv论文
1. [arXiv:2610.11384](https://arxiv.org/list/cs/recent?skip=1370)《Environmental Feedback Modeling Matters: Rethinking Feedback Treatment in Agentic Hindsight》：提出智能体事后经验回放的环境反馈建模新方法，复杂任务完成率提升35%。
2. [arXiv:2610.07860](https://arxiv.org/list/cs.AI/recent?skip=644)《WorkflowOps: Learning Agent Collaboration Priors for Multi-Agent Workflow Orchestration》：提出多智能体工作流编排框架，复杂协同效率较现有方案提升48%。
3. [arXiv:2610.11663](https://arxiv.org/list/cs/pastweek?skip=1214)《Constrained Command-Conditioned Reinforcement Learning with Bandit Stra》：提出受限命令条件强化学习方法，智能体指令遵循准确率提升32%。
## 多模态
### 厂商动态
1. 10月4日曾报道紫东太初开源ZDTaichu5.0-9B多模态大模型登榜，现更新：武汉市科技局官方[官方通报该模型正式通过10B参数档位空间具身能力最强的通用多模态大模型，支持单图、多图、长序列视频及任意分辨率视觉输入，九大国际权威空间理解基准中拿下8项通用组别第一，目前已开放开源。
2. [谷歌发布EmbeddingGemma 2多模态嵌入模型](https://www.sohu.com/a/1086863717_114765)：体积小到可在智能手机上运行，能力从文本扩展到图像、音频、视频，支持跨模态统一嵌入空间，可实现本地语音备忘与本地视频片段匹配，无需上传数据至云端。
3. [模思智能完成超10亿元Pre-A轮融资](http://www.stdaily.com/web/gdxw/2026-10/12/content_594897.html)：资金将用于全模态实时交互智能研发与商业化落地，聚焦下一代AI实时交互入口。
4. [阿里披露多模态模型进展](https://www.nfcb.com.cn/wap391075.CSV)：Qwen-Image-3.1性能有望逼近GPT-Image系列，下一代视频模型已在训练中。
### arXiv论文
1. [arXiv:2610.11363](https://arxiv.org/list/cs/pastweek?skip=1350)《UniData: Universal Multimodal Instruction Generation Pipeline》：提出通用多模态指令生成流水线，覆盖12类模态任务，指令质量较现有方案提升53%。
2. [arXiv:2607.08497v1](https://arxiv.org/abs/2607.08497v1)《Cognitive-structured Multimodal Agent for Multimodal Understanding, Generation, and Editing》：提出认知结构多模态智能体，同时支持理解、生成、编辑三类多模态任务。
## Omni 全模态
### 厂商动态
1. [Cloudflare发布Clef-omni全模态模型](https://blog.cloudflare.com/clef-faster-cheaper-multimodal/)：同时支持文本、图像、音频、视频输入输出，同步推出速度更快的Clef版本与成本更低的Clef-flash版本，已在Workers AI平台上线。
2. [阿里云更新Qwen3.5-Omni-Flash-Realtime模型](https://help.aliyun.com/zh/model-studio/qwen3-5-omni-flash-realtime)：支持60+种语言音频输入、30+语言语音输出，具备智能语义打断、Web搜索与复杂工具调用能力，应用于语音助手、多媒体分析等场景。
3. [NVIDIA公布Nemotron 3 Omni训练方案](https://docs.nvidia.com/nemotron/nightly/nemotron/omni3/README.html)：针对30B-A3B混合专家全模态模型，提供多模态后训练流水线，支持端到端微调。
4. Gemini Omni Flash、Qwen3.8-Omni-Flash等近5天已报道，当日无新增进展，暂不展开。
### arXiv论文
1. [arXiv:2609.25738v1](https://arxiv.org/html/2609.25738v1)《OmniFysics-Nano-V2 Technical Report: Understanding the Physical World Across Modalities》：提出跨模态物理世界理解全模态模型，物理推理任务准确率提升41%。
2. [arXiv:2607.11433](https://arxiv.org/html/2607.11433)《Omni-Decision: Evidence-Ledger Planning for Omni-Modal Agents》：提出证据账本规划框架，全模态智能体决策准确率提升37%。
## 具身智能
### 厂商动态
1. [我国具身智能产业加速落地](http://gxt.jiangxi.gov.cn/jxsgyhxxht/mtjj244/content/content_2108379735550132224.html)：全国已建成启用70多家具身智能训练场，在建、规划40余家，形成长三角、珠三角等产业集群；中关村企业具身智能数据平台已交付150万小时人类视频数据，量级全球领先。
2. [首届全球具身智能应用创新挑战赛即将举办](https://www.hangzhou.gov.cn/col/col812266/art/2026/art_5e1f28abd20744d794b3553fb25f5896.html)：10月13日至18日在杭州举办，同期召开国际电信联盟ITUT具身智能标准焦点组第三次全会，来自43个国家的近400名专家将围绕多模态数据、接口互操作等议题拟定两项关键技术规范。
3. [安徽省具身智能创新中心揭牌成立](http://news.ustc.edu.cn/info/1056/96558.htm)：在中国科学技术大学具身智能产学研融合创新大会上成立，将聚焦人形机器人技术创新与成果转化。
4. [宇树科技王兴兴称具身智能临界点最快1-2年到来](https://cj.sina.com.cn/articles/view/1644983660/620c756c02001wlwk?froms=ttmp)：团队已将GPT-6部署至机器人测试，效果表现良好，大模型技术进步将加速具身智能落地。
5. [DeepSeek拟入局具身智能领域](https://news.china.com/socialgd/10000169/20261013/49791365.html)：创始人梁文锋近期密集接触具身智能创业者，方案包括组建团队自研或投资相关企业，计划领投机器人公司Winverse AI种子轮融资。
### arXiv论文
1. [arXiv:2609.32862](https://arxiv.org/pdf/2609.32862)《RoboFoundry: System-as-Policy Evolution for Self-Learning Embodied Agents》：提出具身智能体系统即策略演化框架，自学习效率提升2.3倍。
2. [arXiv:2610.10498](https://arxiv.org/html/2610.10498)《EmbodiedRSI: Active Continual Robot Learning Through Hypothesis-Guided Co-Evolution》：提出假设引导的协同进化主动持续学习方法，机器人新技能学习速度提升65%。
3. [arXiv:2609.09158v1](https://arxiv.org/abs/2609.09158v1)《TANGO: Humanoid Navigation in Cluttered Environments with a Whole-Body Vision-Language-Action Model》：提出全身视觉-语言-动作模型，人形机器人在杂乱环境下导航成功率提升58%。
## 本周趋势观察
本周AI领域呈现三大核心趋势：一是大模型竞争从“性能追赶”进入“场景落地”阶段，Meta发布Muse Wonder打破原有头部格局，同时OpenAI开放本地可部署模型，行业从云端垄断向云侧、端侧多场景部署发展；二是Agent应用从企业级向消费级渗透，千问Go等个人AI助理可直接完成实际事务，标志着智能体从“辅助工具”向“事务执行者”升级；三是具身智能产业从技术研发进入规模化落地前夜，基础设施、标准制定、资本投入同步加速，大模型厂商开始布局具身智能领域，上下游产业链协同效应开始显现。
