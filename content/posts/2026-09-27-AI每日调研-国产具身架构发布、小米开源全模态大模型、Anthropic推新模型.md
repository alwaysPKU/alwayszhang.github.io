---
title: "AI 每日调研 · 2026年09月27日｜国产具身架构发布、小米开源全模态大模型、Anthropic推新模型"
date: "2026-09-27"
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
1. 全球首台搭载全国产化电子架构的具身智能机器人正式亮相，打通AI决策到物理执行全链路
2. 小米开源MiMo-V2.6系列全模态大模型，Pro版本登顶全球开源大模型榜单，兼顾性能与成本
3. Anthropic发布Sonnet 5.5模型，速度优于前代，作为Opus 5.5低成本替代方案
4. 诺因智能发布通用具身智能生成式学习架构GLOW，支持一次演示跨场景复用任务
5. 阿里Qwen3.8-Omni技术报告公开，原生全模态模型向Agent能力落地演进

---

## 大模型
### 厂商动态
- 小米发布并开源新一代[MiMo-V2.6系列大模型](http://kw.beijing.gov.cn/xwdt/kcyx/xwdtyqqy/202609/t20260923_4877361.html)，包含Pro与Flash两款，支持全模态输入，在第一梯队模型中实现性能、速度和价格兼顾，[Pro版本登顶全球开源大模型榜单](https://finance.sina.com.cn/roll/2026-09-29/doc-initmuyp9425011.shtml)，单任务成本低至0.13美元，沿用前代API定价。
- 智谱上线GLM-5.3-FlashX模型[来源](https://www.ncsti.gov.cn/kjdt/kjrd/202609/t20260928_257374.html)。
- OpenAI 9月22日发布[GPT-6 Sol和Luna](https://openai.com/zh-Hans-CN/research/index/)两款模型，以不同能力与成本组合覆盖日常工作场景；9月23日上线[MentalHealthBench](https://openai.com/zh-Hans-CN/research/index/)基准，用于评估AI心理健康对话的实用性与安全性。
- 据报道OpenAI因安全担忧取消发布GPT-6.1 Astra模型[来源](https://tech.ifeng.com/c/8wnzzqRHHtz)。
- Anthropic发布[Sonnet 5.5模型](https://c.m.163.com/news/a/L800VBJV05199NPP.html)，运行速度显著快于Sonnet 5，是Opus 5.5的低成本替代方案，定价为每百万输入token 2美元。
- Meta发布[Muse Spark 1.1](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/)，已在Meta AI app开放“Thinking”模式，同时开放Meta Model API公开预览供开发者调用。
- 万联证券研报指出，当前大模型行业呈现[模型降本与安全治理同步演进](https://finance.sina.com.cn/stock/t/2026-09-28/doc-initktny2899291.shtml)的趋势。
- Google DeepMind发布[私有AI计算技术更新](https://deepmind.google/blog/advancing-private-ai-compute-with-secure-server-side-memory/)，通过安全服务器端内存提升隐私计算能力。

### arXiv论文
- [Differentiable Fuzzy Inference Layer: A Monotone, Compositional Ordinal Reasoning Head for Large Language Models](https://arxiv.org/list/cs.CL/pastweek?skip=333)：提出可微模糊推理层，为大模型提供单调、可组合的序数推理能力。
- [StarWM: Self-Supervised Trained Attention Routing for Robust World Models](https://arxiv.org/list/cs/pastweek?skip=469)：提出自监督训练的注意力路由机制，提升世界模型鲁棒性。
- [DeepSeek Elastic Compute (DSec): A Sandbox Infrastructure for Effective Agentic Training at Scale](https://arxiv.org/abs/2609.22978)：开源面向大规模智能体训练的沙箱基础设施DSec，支持高效Agent训练。
- 公开Qwen系列技术报告[来源](https://arxiv.org/list/cs.CL/recent?show=25&skip=300)。

---

## AI 应用
### 厂商动态
- 高德发布[空间智能AI平台](http://www.xinhuanet.com/tech/20260923/63943f73b15648999552486ddc4ca454/c.html)，构建从空间还原到行业分析再到现实行动的完整链路，推动智慧城市自主进化。
- Meta个人AI助手Muse上线12天下载量达280万次，支持邮件、旅行预订与交易执行，正推进与Shopify支付生态整合，加速消费级智能体商业化[来源](https://www.stcn.com/article/detail/4201797.html)。
- OpenAI推出[ChatGPT Work](https://openai.com/zh-Hant/business/)，面向企业场景提供文件/简报生成、后台自动任务执行、工具插件对接能力，支持企业级管控与治理。
- OpenAI开放[gpt-oss系列开源模型](https://openai.com/zh-Hans-CN/open-models/)，包含120B和20B参数版本，支持桌面、笔记本、数据中心本地部署，可自定义安全策略。
- Manus面向海外发布2.0版本及个人生活场景智能助理Cue，同时正组建团队开发面向国内市场的产品，推进与国产模型厂商生态合作[来源](http://m.toutiao.com/group/7690622417089217064/?upstream_biz=VolcEngine)。
- Gemini API更新[Antigravity Agent 09-2026预览版](https://ai.google.dev/gemini-api/docs/changelog?hl=zh-tw)，替代旧版预览版本，优化远程沙箱执行能力。
- Mistral推出Vibe智能助理，支持长周期任务处理，可对接用户自有知识与工具[来源](https://mistral.ai/fr/products/vibe/)。

### arXiv论文
- [SkillEvoReg: Regularizing Agent Skill Evolution](https://arxiv.org/list/cs.AI/recent?skip=50)：提出智能体技能演化正则化方法，提升智能体技能迁移稳定性。
- [Is Reasoning Always Useful? Rethinking Reasoning Utility in Universal Multimodal Embeddings](https://arxiv.org/list/cs/recent?skip=1070)：重新分析推理能力在通用多模态嵌入中的效用边界，为多模态模型优化提供参考。
- [Cross-Country Code-Mixing for Generative Recommendation](https://arxiv.org/list/cs.AI/recent?skip=426)：提出跨国代码混合方法，提升生成式推荐系统的跨场景适配性。
- [DeepSeek Elastic Compute (DSec): A Sandbox Infrastructure for Effective Agentic Training at Scale](https://arxiv.org/abs/2609.22978)：同大模型板块，为智能体训练提供基础设施支撑。

---

## 多模态
### 厂商动态
- 微软研究院发布通用多模态基础模型[BEiT-3技术更新](http://zslm.openi.org.cn/index.php?m=content&c=index&a=show&catid=14&id=297)，推动文本、图像、多模态预训练技术统一。
- 小米MiMo-V2.6系列大模型支持图片、视频、音频和文本全模态输入，补齐开源Pro级全模态模型短板[来源](http://kw.beijing.gov.cn/xwdt/kcyx/xwdtyqqy/202609/t20260923_4877361.html)。
- 多模态AIGC行业进入新阶段，AI视频从生成素材向完整作品交付演进，技术竞争转向全链路系统能力[来源](http://www.xinhuanet.com/tech/20260918/0478f413f4d049539b8d73b81071ff8f/c.html)。
- 2026年车载多模态交互技术落地，AI语音助手融合视觉、手势、情绪感知能力，可根据驾驶场景主动调整交互策略[来源](https://k.sina.com.cn/article_7879995971_1d5af324306801ox9g.html)。
- 华为发布AI Centric“1+2+3”全系列解决方案，联合信通院推动AI-MOS体验标准从规划走向产业落地[来源](https://www.cnii.com.cn/gxxww/rmydb/202609/t20260927_762423.html)。
- 北京市科委披露[多模态协同感知大模型技术研究成果](https://www.ncsti.gov.cn/kcfw/zcg/kjcgxxxt/cgxq/?id=14423)，已获13项专利，面向自动驾驶场景应用，目前处于实验室研究阶段。
- Mistral Small 4模型支持文本与图像输入，面向多模态场景开源[来源](https://mistral.ai/news/mistral-small-4/)。

### arXiv论文
- [TAC-Time: Texts as Channels For Multimodal Time Series Forecasting](https://arxiv.org/list/cs.MM/recent?skip=4&show=50)：提出将文本作为多模态时间序列预测的信息通道，提升时序预测精度。
- [Multimodal Thinking with Renderable Programs](https://arxiv.org/list/cs/recent?skip=788)：提出可渲染程序的多模态思考框架，提升多模态模型的推理可解释性。
- [THERE AND BACK AGAIN: BIDIRECTIONAL DIFFUSION BRIDGES FOR MULTIMODALITY TRANSLATION](https://arxiv.org/pdf/2608.27885)：提出双向扩散桥架构，实现跨模态内容的双向翻译与生成。
- [Evolution of Multimodal Question Answering: From Modality-Adaptive Extraction to Unified Language Representation](https://arxiv.org/abs/2609.08896)：梳理多模态问答技术演进路径，提出基于统一语言表示的多模态问答优化方向。

---

## Omni 全模态
### 厂商动态
- 阿里千问上线[Qwen3.8-Omni-Flash原生全模态模型](https://www.tmtpost.com/nictation/8144687.html)，支持文本、图像、音频、视频输入，上下文长度达1M，相比上一代30项评测平均得分提升超26%，音视频能力显著增强，API成本最高降幅达98%，核心定位为面向生产力场景的Agent基础模型，目前已在千问AI平台开放使用。
- 斑马智能在云栖大会发布端侧全模态大模型[AutoOmni2.0-23B-A3B](http://www.xinhuanet.com/auto/20260925/f2922c2fbc1a433b84ee485a7291b8b7/c.html)，普通任务处理能力堪比10倍参数量云模型，复杂任务能力达到10倍参数量云模型的80%-90%，面向车载等端侧具身场景优化。
- Google DeepMind Gemini Omni模型开放视频生成与编辑能力，支持多模态输入输出创作[来源](https://deepmind.google/?3574be7b_page=2&5668acee_page=2&bdd1d8a9_page=4)。
- DeepMind 5月发布OmniVision-3全模态模型，实现毫秒级动作识别，面向特定行业场景优化[来源](http://sjzrb.sjzdaily.com.cn/wiki/hot/2026/09/23/wkTaczjf.html)。

### arXiv论文
- [Qwen3.8-Omni: Towards Native Omni-Modal Agents](https://arxiv.org/abs/2609.25611v1)：阿里千问团队公开Qwen3.8-Omni技术细节，阐述原生全模态模型向Agent能力演进的技术路径。
- [Can MiniMax-H3 Reason About the Physical World? An Evaluation of Omni-Modal Generative Model](https://arxiv.org/html/2609.18323v1)：针对全模态生成模型的物理世界推理能力提出评测框架，覆盖多视角空间推理、音频消歧等维度。
- [Omni-Decision: Evidence-Ledger Planning for Omni-Modal Agents](https://arxiv.org/html/2607.11433)：提出基于证据账本的全模态智能体规划框架，提升智能体多模态决策的可靠性。
- [OmniFysics-Nano-V2 Technical Report: Understanding the Physical World Across Modalities](https://arxiv.org/html/2609.25738)：提出跨模态物理世界理解模型OmniFysics-Nano-V2，面向端侧低资源场景优化。

---

## 具身智能
### 厂商动态
- 9月28日，全球首台搭载全国产化电子架构的具身智能机器人在湖北宜昌亮相，由东土科技主导提供底层底座，打通国产AI芯片、鸿道实时操作系统、AUTBUS确定性总线、MaVIEW开发工具四大核心模块，实现实时控制与AI智能计算的隔离融合，构建从AI决策到物理执行的全国产化技术链路，可完整替代国外方案[来源](http://www.zqrb.cn/gscy/qiyexinxi/2026-09-28/A1790581337709.html)。
- 深圳诺因智能发布通用具身智能生成式学习架构[GLOW](http://www.gd.chinanews.com.cn/2026/2026-09-27/449852.shtml)，支持通过一次人类完整演示，让机器人实现跨物体、跨环境的任务复用，无需为新任务重新采集数据或更新模型参数。
- 全球首个大规模具身智能主题乐园在横琴长隆启幕，由智元机器人与长隆集团联手打造，超过300台智元全系机器人在园区常态化上岗，覆盖文娱商演、科普研学、导览导购、互动娱乐等场景，实现具身智能To C场景大规模落地[来源](http://kjj.gz.gov.cn/xydt/content/post_11022969.html)。
- Google DeepMind [Gemini Robotics 2](https://deepmind.google/models/gemini-robotics/) VLA模型开放，作为通用智能层支持控制任意类型机器人，覆盖双足、机械臂等多形态具身设备。
- Meta具身智能平台Habitat持续迭代，支持社交智能机器人训练，面向家庭日常 chores场景优化[来源](https://ai.meta.com/blog/habitat-3-socially-intelligent-robots-siro/)。

### arXiv论文
- [EmbodiedMind: Adaptive Data Curation and Prefix-Tree Reinforcement Learning for Efficient Embodied Intelligence](https://arxiv.org/html/2609.19659v1)：提出自适应数据治理与前缀树强化学习框架，提升具身智能训练效率。
- [Know Your Body: A Harness for Direct and Self-Improving Robot Control with VLMs](https://arxiv.org/pdf/2609.28530)：提出基于视觉语言模型的机器人直接控制框架，支持机器人自主感知本体状态并迭代控制能力。
- [Neurosymbolic Embodied Agents](https://arxiv.org/abs/2608.16794v2)：提出神经符号具身智能体架构，融合符号推理与神经网络能力，提升具身决策的可解释性与鲁棒性。
- [Human Centric Embodied Intelligence for Soft Wearable Robotics](https://arxiv.org/abs/2608.03556)：面向柔性可穿戴机器人场景，提出以人为中心的具身智能设计框架。

---

## 本周趋势观察
1. **大模型迭代呈现“分层化+场景化”特征**：头部厂商同时推出高端旗舰、高性价比端侧等不同定位的模型产品，成本优化与安全治理成为并行的行业核心命题，开源模型性能持续追平闭源第一梯队，中小厂商接入门槛进一步降低。
2. **全模态模型向Agent能力落地迈进**：Qwen3.8-Omni、AutoOmni2.0等产品均将“任务规划、工具调用”作为核心优化方向，全模态能力不再局限于内容理解，开始成为智能体感知物理世界、完成复杂任务的基础支撑。
3. **具身智能进入技术底座与场景落地双重突破期**：全国产化电子架构的发布解决了具身机器人底层供应链“卡脖子”问题，而具身主题乐园的落地则验证了To C场景的商业化可行性，技术迭代与商业闭环形成正向循环。
4. **消费级智能体商业化加速**：Meta Muse、Manus Cue等面向个人场景的智能体产品快速迭代，开始接入支付、日程管理等高频生活服务，“对话即服务”的交互模式逐步从办公场景向日常消费场景渗透。
