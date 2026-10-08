---
title: "流式视频理解 VLM 精读⑤：评测与数据——30+ 个 benchmark 看懂门道"
date: 2026-10-08
categories: [技术, 多模态]
tags: [VLM, Benchmark, 评测, 数据集, 流式视频]
series:
  name: "流式视频理解 VLM 精读"
  order: 5
  title: "评测基准与训练数据"
---

> 这是「流式视频理解 VLM 精读」系列的收尾篇。前四篇讲了"开口、记忆、速度、思考"四项技术，但这一切的前提是——**我们要能正确衡量"模型到底懂不懂流式视频"**。这篇把本领域 30+ 个 benchmark 与训练数据集盘一遍，帮你看懂门道。

## 为什么要专门的"流式"评测？

普通视频 QA 评测（如 VideoQA、MovieChat）是**离线**的：给定完整视频 + 问题，评准确率。但流式理解有几个离线评测测不到、却至关重要的维度：

1. **时间性（Timeliness）**：模型是"事件后立刻答"还是"事后马后炮"？离线只看答对没有，看不出时机。
2. **主动行为（Proactivity）**：模型会不会在没人问时主动开口？离线 QA 压根没有"主动"。
3. **长记忆（Memory）**：几小时前的内容还记得吗？离线短视频测不出跨段记忆。
4. **效率（Efficiency）**：同目标准确率下，谁更省显存、更快？工程上同样关键。

所以出现了专门的"流式评测"，核心诉求是**"既要答得准，又要答得及时、答得主动、记得久"**。

## Benchmarks 全景：按评测目标分类

### 1. 综合/通用流式理解（评估"看"得多全面）

| Benchmark | 年份 | 特点 |
|---|---|---|
| **StreamingBench**（THUNLP） | 2024.11 | 最经典的综合流式基准：实时视觉 / 全源 / 上下文理解 |
| **OVO-Bench** | 2025.01 | 三大能力：后向追踪 / 实时理解 / 前向主动响应 |
| **RTV-Bench** | 2025.05 | 连续感知 / 理解 / 推理三条线 |
| **SVBench** | 2025.02 | 时序多轮对话 |
| **StreamingEval**（ACL 2026） | 2026.03 | **统一固定容量协议**，把编码效率/解码延迟/存储/准确率一起评（我最推荐的"工程向"基准） |
| **StreamingVideo Understanding Survey** | 2026.06 | 综述附带全景 |

### 2. 主动交互评测（评估"什么时候开口"）

| Benchmark | 特点 |
|---|---|
| **ProactiveVideoQA** | 网页/第一视角/电视剧/异常检测四类主动问答 |
| **OmniPro** | 2.7K 人工校验样本、9 个任务的主动流式评测，probe + online 双模式 |
| **SPOT-Bench** | **Timeliness-F1**，同时衡"时序精度"和"覆盖率"——用 F1 衡"有没有在正确时机说" |
| **OmniMMI** | 流式上下文中的多模态交互与主动推理 |
| **Eyes Wide Open（EyeWO）** | 显式/隐式/上下文三类主动 |
| **VideoLLM Knows When to Speak** | 视频-文本 duet 交互格式 |

### 3. 实时/干扰/时间敏感评测（针对"快"和"抗打断"）

| Benchmark | 特点 |
|---|---|
| **Don't Pause! / SPOT-Bench** | 多轮主动查询 + Timeliness-F1（同上，重点工程向） |
| **OVIBench** | **在线"被打断"的推理**——模拟全双工场景下被用户打断还能不能接上 |
| **Artic / DeViBench** | 退化敏感 QA（弱网、低清） |
| **RIVER**（OpenGVLab） | 记忆 / 感知 / 预期三合一实时交互 |

### 4. 长时 / 记忆 / 具身 / 垂类评测（针对"记得久"和场景）

| Benchmark | 特点 |
|---|---|
| **NBA_Streaming** | 307.5 小时球赛转播 + 3.5 万时序对齐事件（事件定位/事实锚定/解说质量） |
| **StreamArena** | 243 部长视频（平均 88.8 分钟）、3646 个开放任务（感知/回溯/主动/工具） |
| **StreamEQA** | 具身场景流式理解 |
| **OST-Bench** | 在线时空（Agent 状态 / 可视信息 / 空间关系） |
| **HomeSafe-Bench** | 居家不安全动作检测 + 预警时机 + 严重度 |
| **SVCBench** | 流式计数（时空状态维护） |
| **StreamGaze** | 视线引导的时序推理与主动 |
| **Qualcomm Interactive Cooking** | 实时分步做菜指导 |
| **OVO-S-Bench** | 流式空间智能 |
| **X-Stream** | 多流视频理解（MLLM 当多路复用器） |
| **OnlineSI** | 在线 3D 检测 |

## 关键基准之间的关系（我的判断）

- **入门必测**：`StreamingBench` + `OVO-Bench`（打通综合与时序）。
- **测主动/时机**：`ProactiveVideoQA` + `SPOT-Bench`（Timeliness-F1 是硬指标）。
- **工程向必看**：`StreamingEval`（把效率纳入统一协议）+ `RIVER`。
- **垂类/具身**：按业务场景挑（NBA / HomeSafe / 具身 / 多流）。

## 训练数据集：喂给"会流式"的模型

| 数据集 | 特点 |
|---|---|
| **StreamingCoT** | 首个流式多模态 CoT 数据集（层级标注 + 时序问答构造） |
| **VideoChat3** | 617K 通用在线视频数据，I3D-ViT 16x 压缩 |
| **LiveStar** | 实时叙述 / 在线时序定位 / 帧级密集QA / 多轮交互 |
| **LiveCC** | 大规模流式语音转写 |
| **ROMA** | 实时全模态（在线主动 / 叙述 / 反应式QA） |
| **CogStream** | 1088 视频 + 59K 层级QA对 |
| **Harnessing in the Wild** | 多样真实世界流式场景（支持 12 小时上下文） |
| **Streaming Video Instruction Tuning** | 实时叙述 / 事件 / 动作 / 时序定位 / 时间敏感QA |
| **MMDuet2** | 场景分割 + 主动对话构造 |

## 资源索引（Paper / Code / Demo）

**Benchmarks**

| Benchmark | Paper | Code / Project |
|---|---|---|
| StreamingBench | [2411.03628](https://arxiv.org/pdf/2411.03628) | [THUNLP-MT/StreamingBench](https://github.com/THUNLP-MT/StreamingBench) |
| OVO-Bench | [2501.05510](https://arxiv.org/pdf/2501.05510) | [JoeLeelyf/OVO-Bench](https://github.com/JoeLeelyf/OVO-Bench) |
| RTV-Bench | [2505.02064](https://arxiv.org/pdf/2505.02064) | [LJungang/RTV-Bench](https://github.com/LJungang/RTV-Bench) |
| SVBench | [2502.10810](https://arxiv.org/pdf/2502.10810) | [sotayang/SVBench](https://github.com/sotayang/SVBench) |
| StreamingEval | [ACL 2026 Findings](https://aclanthology.org/2026.findings-acl.295.pdf) | [wwgTang-111/StreamingEval1](https://github.com/wwgTang-111/StreamingEval1) |
| ProactiveVideoQA | [2507.09313](https://arxiv.org/pdf/2507.09313) | [yellow-binary-tree/ProactiveVideoQA](https://github.com/yellow-binary-tree/ProactiveVideoQA) |
| OmniPro | [2605.18577](https://arxiv.org/pdf/2605.18577) | [RuixiangZhao/OmniPro](https://github.com/RuixiangZhao/OmniPro) |
| SPOT-Bench（Don't Pause!） | [2604.24317](https://arxiv.org/pdf/2604.24317) | [dibschat/SPOT-Bench](https://github.com/dibschat/SPOT-Bench) |
| OmniMMI | [2503.22952](https://arxiv.org/pdf/2503.22952) | [OmniMMI/M4](https://github.com/OmniMMI/M4) |
| Eyes Wide Open（EyeWO） | [2510.14560](https://arxiv.org/pdf/2510.14560) | [zhangyl4/EyeWO](https://github.com/zhangyl4/EyeWO) |
| MMDuet（When to Speak） | [2411.17991](https://arxiv.org/pdf/2411.17991) | [yellow-binary-tree/mmduet](https://github.com/yellow-binary-tree/mmduet) |
| OVIBench | [2608.22279](https://arxiv.org/pdf/2608.22279) | — |
| Artic（DeViBench） | [2602.12641](https://arxiv.org/pdf/2602.12641) | [pku-netvideo/DeViBench](https://github.com/pku-netvideo/DeViBench) |
| DeViBench（Chat with AI） | [2507.10510](https://arxiv.org/pdf/2507.10510) | [JiangkaiWu/DeViBench](https://github.com/JiangkaiWu/DeViBench) |
| RIVER | [2603.03985](https://arxiv.org/pdf/2603.03985) | [OpenGVLab/RIVER](https://github.com/OpenGVLab/RIVER) |
| NBA_Streaming | [2608.09200](https://arxiv.org/pdf/2608.09200v2) | — |
| StreamArena | [2608.05703](https://arxiv.org/pdf/2608.05703) | — |
| StreamEQA | [2512.04451](https://arxiv.org/pdf/2512.04451) | [MrYF-Wang/StreamEQA](https://github.com/MrYF-Wang/StreamEQA) |
| OST-Bench | [2507.07984](https://arxiv.org/pdf/2507.07984) | [InternRobotics/OST-Bench](https://github.com/InternRobotics/OST-Bench) |
| HomeSafe-Bench | [2603.11975](https://arxiv.org/pdf/2603.11975) | [pujiayue/HomeSafe-Bench](https://github.com/pujiayue/HomeSafe-Bench) |
| SVCBench | [2603.12703](https://arxiv.org/pdf/2603.12703) | [项目主页](https://buaa-colalab.github.io/SVCBench/) |
| StreamGaze | [2512.01707](https://arxiv.org/pdf/2512.01707) | [daeunni/StreamGaze](https://github.com/daeunni/StreamGaze) |
| Qualcomm Interactive Cooking | [2511.21998](https://arxiv.org/pdf/2511.21998) | [Qualcomm-AI-research](https://github.com/Qualcomm-AI-research/qualcomm_interactive_cooking_eval) |
| OVO-S-Bench | [2606.03890](https://arxiv.org/pdf/2606.03890) | [项目主页](https://internlm.github.io/OVO-S-Bench/) |
| X-Stream | [2606.02482](https://arxiv.org/pdf/2606.02482) | [项目主页](https://peiwensun2000.github.io/xstream/) |
| OnlineSI | [2601.16538](https://arxiv.org/pdf/2601.16538) | [StoreBlank/online-spatial-intelligence](https://github.com/StoreBlank/online-spatial-intelligence) |
| MovieChat | [2307.16449](https://arxiv.org/pdf/2307.16449) | [rese1f/MovieChat](https://github.com/rese1f/MovieChat) |
| Survey | [sotayang.github.io PDF](https://sotayang.github.io/Streaming_Video_Understanding_Survey.pdf) | — |

**Training Datasets**

| 数据集 | Paper | Code |
|---|---|---|
| StreamingCoT | [2510.25332](https://arxiv.org/pdf/2510.25332) | [Fleeting-hyh/StreamingCoT](https://github.com/Fleeting-hyh/StreamingCoT) |
| VideoChat3 | [2607.14935](https://arxiv.org/pdf/2607.14935) | [MCG-NJU/VideoChat3](https://github.com/MCG-NJU/VideoChat3) |
| LiveStar | [2511.05299](https://arxiv.org/pdf/2511.05299) | [sotayang/LiveStar](https://github.com/sotayang/LiveStar) |
| LiveCC | [2504.16030](https://arxiv.org/pdf/2504.16030) | [showlab/livecc](https://github.com/showlab/livecc) |
| ROMA | [2601.10323](https://arxiv.org/pdf/2601.10323) | [Eureka-Maggie/ROMA](https://github.com/Eureka-Maggie/ROMA) |
| CogStream | [2506.10516](https://arxiv.org/pdf/2506.10516) | [LiamZhao326/CogStream](https://github.com/LiamZhao326/CogStream) |
| Harnessing in the Wild | [2606.08615](https://arxiv.org/pdf/2606.08615v1) | — |
| Streamo（Streaming Video Instruction Tuning） | [2512.21334](https://arxiv.org/pdf/2512.21334) | [maifoundations/Streamo](https://github.com/maifoundations/Streamo) |
| MMDuet2 | [2512.06810](https://arxiv.org/pdf/2512.06810) | [yellow-binary-tree/MMDuet2](https://github.com/yellow-binary-tree/MMDuet2) |

## 评测的盲区 / 机会（客观提醒）

1. **"该沉默"评价偏弱**：绝大多数 benchmark 只评"该答时答了没、准不准"，很少评"不该答时有没有忍住"。而人类体验恰恰很在意后者。这是评测缺口，也是写论文的机会。
2. **时机与准确率常互相打架**：答得早可能牺牲准确率（信息不全），当下的 Timeliness 指标还没完全想清楚权衡。SPOT/OmniPro 在尝试但不成熟。
3. **效率指标飘忽**：StreamingEval 想统一但目前生态小，各家自报显存/延迟口径不一，横向可比性有限。
4. **中文/本土场景缺失**：多数 benchmark 是英文/通用场景，中文直播、中文监控等贴合本土业务的评测仍空白。

## 系列总结（收尾）

到此，「流式视频理解 VLM 精读」六篇全部完成：

| | 主题 | 一句话 |
|:---:|---|---|
| 0 | 领域地图 | 三阶段演进：会打断→记得住→够快又能想 |
| 1 | 主动交互 | 六路线回答"何时开口"，从辅助头到RL |
| 2 | 长时记忆 | 九方案回答"怎么记住"，从滑窗到TTT |
| 3 | 实时推理 | 四手段回答"怎么够快"，并行+选择性+削减+KV |
| 4 | 边看边想 | 把 o系列深思带进实时，想多久也是策略 |
| 5 | 评测与数据 | 30+ benchmark 看懂门道，也看清盲区 |

**给研究/工程朋友的三句话**：
- 想做**工程落地**：抄 `StreamingVLM`（恒定显存）+ `Think-as-You-See`（近零TTFT）+ `SimpleStream`（用最简单方案做对标）。
- 想做**研究**：盯 `StreamingEval`（统一评估缺标准）、"该沉默"评测、`StreamingCoT`（CoT数据稀缺）、`StreamTTT`（参数化记忆）。
- 想**复现**：仓库里所有带 GitHub 链接的项目（HERMES、StreamingVLM、TimeChat-Online、VideoLLM-online、Dispider、ThinkStream…）都是可直接跑的开源实现。

祝各位在"让模型真正看懂并陪你看世界"这条路上顺利。系列完。