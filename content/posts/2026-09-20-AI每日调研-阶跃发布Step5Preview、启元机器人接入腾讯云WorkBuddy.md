---
title: "AI 每日调研 · 2026年09月20日｜阶跃发布Step 5 Preview、启元机器人接入腾讯云WorkBuddy"
date: "2026-09-20"
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
1. 阶跃星辰发布600B参数MoE旗舰模型Step 5 Preview，跻身全球开源第三，单任务成本仅为Claude Opus 5的1/8
2. 阿里开源Qwen-Image-Layered图像模型，可实现PS级图层理解与精准图像编辑
3. 剪映发布智能创作Agent“小映”，具备多轨道剪辑能力，配套1.5亿元创作者激励
4. 启元机器人成为首个接入腾讯云WorkBuddy的具身智能企业，落地云端大脑+机器人执行架构
5. 清华大学发布《2026青年最关注的改变未来五大AI技术榜单》，多模态、具身智能等方向入选

## 大模型
### 厂商动态
- [OpenAI发布新一代语音模型GPT-Live](https://soft.china.com/article/1469251.html)，支持同步听与说，对话体验更接近真人交流，目前ChatGPT语音和听写功能周活用户超1.5亿，覆盖免提协助、语言练习、陪伴等场景。[来源：中华网软件]
- [阶跃星辰发布新一代MoE旗舰模型Step 5 Preview](http://finance.sina.cn/2026-09-20/detail-inisnnkw9324395.d.html)，总参数量600B、激活参数27B，支持100万Token上下文窗口，原生支持文本与视觉输入，面向Agentic任务优化，在Artificial Analysis榜单跻身全球开源第三，单任务成本为Claude Opus 5的1/8，价格对标DeepSeek-V4-Pro。[来源：新浪财经、上海证券报]
- [阿里开源Qwen-Image-Layered图像生成模型](https://soft.china.com/article/2844737.html)，首次在模型内实现PS级图层理解与生成，可将图片拆解为独立图层，支持“零漂移”精准图像编辑，解决AI生图一致性难题。[来源：中华网软件]
- [双节前后国内外将有10余款大模型发布](https://finance.sina.com.cn/tech/roll/2026-09-20/doc-inisnhax2520156.shtml)，包括DeepSeek V4.1 Pro、GPT-6、Claude Opus5.2等，OpenAI原计划本周发布的重磅产品已跳票至下周。[来源：新浪科技]
- OpenAI官方页面显示GPT-6 Astra为新一代智能模型，支持金融服务场景专用工具与金融数据接入。[来源：[OpenAI金融行业解决方案页](https://openai.com/zh-Hans-CN/solutions/industries/financial-services/)]
- Anthropic最新旗舰模型Claude Opus 5已推出，Opus 4.8为混合推理模型，支持1M上下文窗口，面向编码与AI Agent场景优化。[来源：[Anthropic官网](https://www.anthropic.com/claude/opus?cb=zapier)]

### arXiv论文
- [arXiv:2609.20121](https://arxiv.org/list/eess.AS/new)：提出对齐路径蒸馏方法，将非流式ASR-LLM的能力迁移到流式语音识别任务，提升实时语音识别效果。
- [arXiv:2609.20754](https://arxiv.org/list/cs/pastweek?skip=30)：动态语义压缩方法，实现大模型潜空间高效推理，降低推理延迟与算力消耗。

## AI 应用
### 厂商动态
- [华为发布新一代AI算力基础设施昇腾960超节点](https://news.bjd.com.cn/2026/09/20/11965964.shtml)，算力卡支持规模从上一代1024卡升级到4096卡，首次采用NPO近封装光学技术，可匹配十万亿参数模型的训练和推理需求，目前昇腾系列超节点已规模商用1000多套，覆盖互联网、运营商、金融等领域。[来源：京报网、搜狐科技]
- 华为全联接大会期间发布《AIDC白皮书2026》《金融数据中心网络高可用性技术规范》及企业AI算力运营解决方案，联合推出莞深、山东港口青岛港人工智能应用中试基地样板点。[来源：[日照新闻网](https://m.bjnews.com.cn/detail/1789896343129070.html)]
- [抖音剪映发布智能创作Agent“小映”](https://www.stcn.com/article/detail/4192109.html)，具备多轨道剪辑能力，剪映同步推出创作者激励计划，每年投入1.5亿元为优质作品提供曝光和收益支持，后续将推进专业内容与AI技能体系建设。[来源：证券时报网]
- Meta发布Muse Image和Muse Video生成模型，Muse Image已在Meta AI应用、美国区Instagram Stories、部分国家WhatsApp上线，后续将扩展至Facebook。[来源：[Meta AI Blog](https://ai.meta.com/blog/introducing-muse-image-muse-video-msl/)]
- Google DeepMind发布AlphaGenome Atlas，可预测90亿种人类DNA单字母变异的分子层面影响，覆盖所有可能的人类基因组单碱基突变。[来源：[Google DeepMind Blog](https://deepmind.google/blog/alphagenome-atlas-a-predictive-map-of-every-possible-dna-letter-change-in-the-human-genome/?ref=implicator.ai)]

### arXiv论文
- [arXiv:2609.17414](https://arxiv.org/list/cs/recent?skip=1706)：提出连续时间语言Agent框架，支持长时交互场景下的状态持续与任务执行。
- [arXiv:2609.19635](https://arxiv.org/list/cs/pastweek?skip=537)：提出检查点切换机制，提升强化学习在Agent任务中的增益稳定性。
- [arXiv:2609.17419](https://arxiv.org/list/cs/pastweek?skip=1681)：提出PIVOT物理接地验证方法，提升AI生成音视频的检测准确率。

## 多模态
### 厂商动态
- [千问发布多模态模型Qwen3.8-Omni-Flash](https://m.ebrun.com/708650.html)，性能追平谷歌Gemini Flash，定价仅为后者的不到20%，支持同步处理音频与视频内容，可自主调用工具完成音视频处理任务，目前已对外开放。[来源：亿邦动力]
- [紫东太初开源ZDTaichu5.0-9B多模态大模型](https://m.sohu.com/a/1077634986_120988576/)，参数量9B，支持单图、多图、长序列视频及任意分辨率视觉输入，重点优化空间感知、跨视角变换、具身任务规划能力，在九项空间理解评测基准中取得领先。[来源：上海证券报]
- 智象未来在服贸会AIGC交流会上表示，国内多模态AIGC行业已进入全链路系统能力竞争阶段，AI视频正从生成素材向完整作品交付演进。[来源：[新华网](http://imgs.xinhuanet.com/tech/20260918/0478f413f4d049539b8d73b81071ff8f/c.html)]
- Mistral AI与NVIDIA达成合作，作为NVIDIA Nemotron联盟创始成员，将贡献多模态训练技术与企业级微调工具。[来源：[Mistral AI官网](https://mistral.ai/news/mistral-ai-and-nvidia-partner-to-accelerate-open-frontier-models/)]

### arXiv论文
- [arXiv:2609.08896](https://arxiv.org/abs/2609.08896)：梳理多模态问答技术演进路径，提出从模态自适应提取到统一语言表示的发展框架。
- [arXiv:2609.13255](https://arxiv.org/list/cs.CV/recent?skip=541)：提出VisCAD多模态工业CAD基础模型套件，支持工业场景下的多模态设计需求。
- [arXiv:2609.09924](https://arxiv.org/list/cs/recent?skip=1490)：面向对话场景的多模态情感识别方法，提升人机交互的情感响应准确率。

## Omni 全模态
### 厂商动态
- [阿里千问正式上线Qwen3.8-Omni-Flash全模态大模型](https://www.donews.com/news/detail/8/6715324.html)，支持文本、图像、音频、视频多模态输入，上下文长度达1M，相比上一代Qwen3.5-Omni-Plus在30项评测中平均得分提升超26%，音视频理解与生成能力显著增强，API成本最高降幅达98%，具备编程、文本知识工作、GUI操作等通用Agent能力，可自主规划任务、调用工具完成创作，目前已在千问AI平台开放使用。[来源：DoNews、钛媒体、新浪新闻]
- Google DeepMind Gemini Omni全模态模型支持高分辨率视频生成与编辑，可通过自然语言交互完成视频修改，例如将角色转换为毛毡玩偶风格等创意需求。[来源：[Google DeepMind官网](https://deepmind.google/models/gemini-omni/)]
- NVIDIA NeMo AutoModel已支持全模态模型的运行与微调，覆盖音频、视频等多模态组合场景。[来源：[NVIDIA官方文档](https://docs.nvidia.com/nemo/automodel/latest/model-coverage/omni/overview)]

### arXiv论文
- [arXiv:2609.18323](https://arxiv.org/pdf/2609.18323)：对MiniMax-H3全模态生成模型的物理世界推理能力进行系统评估，提出全模态模型物理常识评测基准。
- [arXiv:2609.08977](https://arxiv.org/html/2609.08977v1)：发布全模态交互Agent技术报告，提出支持连续多模态交互的Agent编排运行时框架。
- [arXiv:2608.10720](https://arxiv.org/pdf/2608.10720v2)：提出Ex-Omni-2D全模态对话模型，具备原生视觉呈现能力，提升多轮对话的视觉信息交互体验。

## 具身智能
### 厂商动态
- [启元机器人与腾讯云达成合作](https://finance.sina.com.cn/stock/estate/integration/2026-09-20/doc-inismzve6741393.shtml)，启元Q1、T1机器人正式接入WorkBuddy，成为首个接入该平台的具身智能企业，WorkBuddy作为云端大脑负责理解推理与技能调度，机器人作为执行端已具备上百种具身智能原子能力。[来源：新浪财经、搜狐科技]
- [全球首个大型具身智能主题乐园将于9月24日在珠海横琴启幕](http://finance.sina.cn/stock/estate/2026-09-20/detail-inismzva9303372.d.html)，由智元与长隆集团联手打造，开园当日将有超300台智元全系机器人投入运营。[来源：新浪财经]
- [智身科技具身智能机器人销量突破15000台](http://www.xinhuanet.com/finance/20260920/3cce02e135c94761933c389c818e7457/c.html)，并完成数亿元人民币B轮融资，由阿联酋Stone Venture领投，产业投资方包括东软集团、豪鹏科技等，产品已规模化应用于先进制造场景。[来源：新华网]
- [乐享科技完成全球首次户外机器人全自主长时直播](https://m.sohu.com/a/1078472807_121702596/)，搭载以太大模型的多台机器人在开放环境下自主完成点单、任务规划、烧烤到上菜的全流程任务，连续直播1小时，线上观看人数超550万。[来源：搜狐城市]
- [2026全球具身智能开发者大会在杭州举行](https://xsrb.xsnet.cn/epaper/html/2026-09/20/content_79494_19886522.htm)，由北京人形机器人创新中心与西电杭州研究院具身智能创新中心联合主办，聚焦具身智能技术迭代与产业落地。[来源：萧山日报]
- [宇树科技开源具身基座模型](http://finance.sina.cn/tech/2026-09-20/detail-inismvnz1701613.d.html)，在7项评测中领先同类开源模型，基于WMA（世界模型-动作）与VLA（视觉-语言-动作）架构，提升人形机器人对真实物理世界的理解与泛化能力。[来源：新浪科技]
- [自变量机器人完成数亿元A轮融资](https://www.legendstar.com.cn/news/469309796534592021)，采用端到端路径研发通用具身智能大模型，自主开发的「WALL-A」模型支持多模态感知数据、自然语言指令与运动控制信号的端到端映射，在未知新任务场景具备较强泛化能力。[来源：联想之星]
- Google DeepMind发布Gemini Robotics 2具身智能模型，为机器人提供全身智能支持，可将视觉和语言输入转换为机器人动作指令，适配不同形态的机器人平台。[来源：[Google DeepMind Blog](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)]

### arXiv论文
- [arXiv:2609.19659](https://arxiv.org/list/cs.RO/recent?skip=66)：提出EmbodiedMind自适应数据整理与前缀树强化学习框架，提升具身智能体的任务学习效率。
- [arXiv:2608.03556](https://arxiv.org/abs/2608.03556)：提出以人为中心的柔性可穿戴机器人具身智能框架，适配人体辅助场景的交互需求。
- [arXiv:2608.16555](https://arxiv.org/html/2608.16555v1)：提出基于具身感知器表示的神经与肌肉网络协同设计方法，优化仿生机器人的运动控制效果。

## 本周趋势观察
本周AI领域呈现三个明确的发展方向：一是大模型的效率与场景化竞争加剧，阶跃星辰Step 5 Preview与千问Qwen3.8-Omni-Flash均以“性能追平海外旗舰+成本大幅降低”为核心卖点，开源大模型与商用闭源模型的性价比竞争进入白热化阶段；二是具身智能进入规模化落地快车道，从B端制造场景的销量突破、to C消费级产品的云边端架构落地，到文旅场景的大规模商用，具身智能正快速走出实验室，且技术路线上明确了VLA架构与世界模型的核心地位；三是全模态模型从“理解”向“执行”升级，新一代全模态模型普遍集成Agent能力，支持自主调用工具完成创作、处理复杂多模态任务，全模态与智能体技术的融合已成为下一阶段的核心迭代方向。此外清华大学发布的青年关注AI技术榜单显示，多模态、具身智能、智能体协同等前沿方向已成为产业与公众的共识性热点。
