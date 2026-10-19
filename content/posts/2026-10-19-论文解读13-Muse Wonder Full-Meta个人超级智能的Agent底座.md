---
title: "论文解读⑬：Muse Wonder Full——Meta 的「个人超级智能」Agent 底座"
date: 2026-10-19
categories: [技术, 大模型]
tags: [Meta, Muse Wonder, 大模型, AI Agent, Active Memory, 个人超级智能]
series:
  name: "论文解读"
  order: 13
  title: "Muse Wonder Full"
---

> 2026 年 10 月 12 日，Meta 发布 **Muse Wonder 系列**——Muse Wonder 与更强的 Muse Wonder Full，官方称其为「迄今为止最具能力的模型」，在个人与专业 Agent 任务上达到 SOTA，并把这一步定义为迈向「个人超级智能（Personal Superintelligence）」的关键一跃。本文基于 [Meta 官方研究博客](https://research.meta.ai/blog/muse-wonder)、模型文档与第三方评测，做一次尽量客观的深度梳理：**它到底强在哪、输在哪，以及 Meta 这套叙事里哪些是事实、哪些还停在发布稿上。**

## 一、它是什么：重组 14 个月后，Meta 交出的第一份前沿答卷

理解 Muse Wonder，要先理解它的「出身」。

- **时间线**：约 14 个月前，Meta 对 AI 业务做了「从第一性原理彻底重建」，由 Alexandr Wang 主导重组为 **Meta Superintelligence Labs（MSL）**。Muse Wonder 是这条「scaling ladder（scaling 阶梯）」上的最新一级，也是 MSL 第一次拿出能与 Anthropic / OpenAI / Google 正面掰手腕的前沿模型。
- **训练底座**：在 Meta 位于俄亥俄州的 **千兆瓦级 Prometheus 数据中心**训练，方法论上延续 Muse Spark 定下的「可预期、严谨的 scaling」路线，覆盖预训练与强化学习两个阶段。
- **定位**：不是通用聊天模型，而是为「**长时程的个人与专业 Agent**」而生——保险理赔、租约解读、金融/健康事务、持续数小时的软件工程，这些需要跨会话记忆、且任务卡住时仍要推进的场景。

一句话：**这是 Meta 从「开源 Llama 派」转向「闭源前沿 + 个人超级智能」路线的宣言之作。**

## 二、先理清 Muse 家族：别再把它们混为一谈

Meta 现在把「Muse」这个名字用在了太多地方，先帮读者画一张图谱，后文才不会乱：

| 名称 | 性质 | 说明 |
| --- | --- | --- |
| **Muse** | 消费级个人智能体 App | 9 月 8 日发布，曾登顶美区 App Store；美国 18+，iOS/Android/muse.ai/WhatsApp 可用 |
| **Muse Spark** | 模型系列 | 4 月首发，1.3 版（9 月）当前驱动 Muse 智能体 |
| **Muse Spark Open** | 开源编码模型 | 10 月 15 日发布，针对 agentic coding 优化 |
| **Muse Glimmer** | 开源本地模型 | 8 月发布，30B 参数、Apache 2.0，单卡/Mac 可跑的常驻 Agent |
| **Muse Image / Muse Video** | 媒体生成模型 | 7 月 7 日发布，Agentic 图像/视频生成 |
| **Muse Code** | 编程 Agent 产品 | 模型运行其中的编码工具 |
| **Muse Wonder / Wonder Full** | **本文主角** | 10 月 12 日发布的闭源前沿模型 |

关键区分：**Wonder 系列是闭源前沿线**，与开源的 Spark Open、Glimmer 是两条平行路线——Meta 一手做闭源前沿抢高端，一手放开源权重占生态。

## 三、Wonder 与 Wonder Full：两个版本，以及一个常见的坑

这是最容易踩坑、也最值得先说清的一点：

| 维度 | Muse Wonder | Muse Wonder Full |
| --- | --- | --- |
| 定位 | 前沿性能、可公开调用 | 更强的完整版 |
| 获取方式 | Meta Model API + Muse Code | **仅 Muse Code 订阅**（Power / Maximum Usage 档） |
| API ID | `muse-wonder-1.0` | `muse-wonder-full-1.0`（**不走按量付费 API**） |
| 计费 | 按 token | 绑订阅，不按 token |

**一个高频误区**：把 Muse Wonder 的 `reasoning effort` 调到 `max`，**并不会**变成 Wonder Full——它们是两个独立的模型，不是同一模型的高低档。也不要去编造 `muse-wonder-full` 的按量 API ID。如果你的目标就是 Full，正确路径是检查 Muse Code 的订阅档位和模型选择器。

**地区限制**：Meta 10 月 12 日更新的 Geographic Use Policy 将**中国（含香港、澳门）与俄罗斯**列入限制地区，且禁止绕过地域控制。身处其他地区的读者仍需核对自己的账户、支付与订阅权益。

## 四、两大核心机制：Active Memory 与 Active Focus

官方把 Wonder 的能力收敛到两个新概念上，这也是它区别于「又大了一点」的关键叙事。

### Active Memory：会「记住对你重要的事」的记忆

> 跨对话携带关于你的重要上下文，并在相关细节重新变得相关时**主动取回**。

官方给的例子很直白：你 3 月把家装预算定为 \$3,000，4 月改成 \$4,000，5 月让它推荐家具清单——好的记忆是不需要你提醒，它就主动用 4 月那个数。Meta 用自建的 **MemoryBench**（测长对话中事实被更新的场景）来评，Wonder 得分 85.6、Full 得分 85.5。

### Active Focus：任务卡住时仍然推进的「专注力」

> 持续朝一个艰难目标推进：尝试替代方案、绕过阻塞、适应新信息；需要时主动澄清，重要动作前先确认。

对照例子：一个 30 个测试全挂的代码迁移——**聚焦的 Agent 会修代码再重跑测试，弱的 Agent 会直接把测试改成能通过**。Meta 用 **FocusBench** 测专注力、用 **SWE-Marathon** 测在长时软件项目上的持续执行。

这两个机制对应的正是「个人/专业 Agent 最难的两件事」：**记得住**，和**扛得住**。

## 五、技术规格与定价

- **上下文窗口**：1M token（文档精确值 1,048,576）。
- **输入**：文本、图像、视频、音频、PDF；**输出：仅文本**。注意——多模态是「理解」而非「生成」，它不是图像/视频生成模型。
- **能力形态**：规划、委派子 Agent、并行调工具、错误恢复；可操作浏览器与桌面/移动应用；可跨多文件在现有代码库上修改并验证。
- **参数规模**：未公开；**无开放权重**。
- **API**：Base URL `https://api.meta.ai/v1`，提供 Responses / Chat Completions / Messages 接口。
- **定价**（据 OpenRouter 与媒体披露）：输入 **\$4 / 百万 token**、输出 **\$20 / 百万 token**，缓存输入 **\$0.20 / 百万 token**——与 Claude Opus 5.5 同价。Muse Code Power 档订阅约 \$50/月；Muse 消费端付费版为 \$20 与 \$100 两档。

## 六、基准全景：赢在哪，输在哪

以下数据来自官方 model card（经媒体转述汇总），评测设置与评分标准未完全公开，**跨模型直接比较需谨慎**。挑重点看：

| 基准 | Wonder Full | Wonder | Claude Opus 5.5 | GPT-6 Astra | 说明 |
| --- | --- | --- | --- | --- | --- |
| DeepSWE 1.1 | **79.0** | 78.8 | 74.2 | 74.1 | 编码 Agent，Wonder 系领先 |
| SWE-Marathon | **57.5** | 53.1 | 46.3 | 42.5 | 长时软件项目，Wonder 系明显领先 |
| MemoryBench（内部） | 85.5 | **85.6** | — | — | 记忆，Wonder 系主打 |
| ProgramBench | 59.0 | 50.0 | **70.5** | — | 输 Opus 5.5 |
| Terminal-Bench 4.0-AA | 57.1 | 52.0 | **59.6** | — | 命令行操作，输 Opus 5.5 |
| OSWorld V2.1（部分） | 78.4 | 72.6 | **81.8** | — | 操作系统级任务，输 Opus 5.5 |
| Harvey LAB-AA | **13.1** | 10.0 | — | — | 法律 Agent，全员低分 |
| Personal SI Index（内部） | **59.1** | 54.3 | 55.2 | 54.5 | Meta 内部综合指标 |
| AA Intelligence Index v4.3（第三方） | 56 | 52 | **58** | — | 第三方，Wonder 系落后 |

**怎么读这张表**：

- **赢的地方很硬**：DeepSWE 1.1 与 SWE-Marathon 这两个「长时程编码 Agent」基准上，Wonder 系（尤其 Full）确实压过 Opus 5.5 与 GPT-6 Astra，契合它「扛得住长任务」的叙事。
- **输的地方也明显**：在 Meta 自己公布的约 14 个基准里，多数仍落后 Opus 5.5（ProgramBench、Terminal-Bench、OSWorld 等），第三方 AA 综合指数也是 Full 56 < Opus 5.5 58。
- **内部指标要打折看**：Personal Superintelligence Index、MemoryBench 是 Meta 自建基准，评测方法未公开，与公开基准的可比性未知。
- **Harvey LAB 全员低分**（13.1 / 10.0）反而透露一个信号：法律这类强流程约束的 Agent 任务，对当前所有模型都还很困难。

## 七、最有深度的一段：能力如何「泛化」到没训过的任务

官方研究博客里真正有技术含量的，是「Capabilities That Generalize」这一节——它正面回应了社区里 **benchmaxxing（刷榜）** 与 **big model smell（大模型味儿）** 这对矛盾：两个模型基准分相近，为何其中一个明显更能搞定没见过的真实任务？

Meta 的做法是把任务分成两类来量化：

- **In-distribution**：post-training 阶段针对性训练过的任务（横轴）；
- **Out-of-distribution**：post-training 没针对过的陌生任务（纵轴）。

然后观察「随 test-time compute 增加，两者的关系」。结论是：两个模型在 OOD 任务上都会随推理算力提升而变好，**但在给定 in-distribution 水平下，Wonder Full 在陌生任务上的表现比 Muse Spark 1.3 的趋势线预测得更好——出现整体向上偏移**。

Meta 给出的解释是：**更强、更大的 base model，让 post-training 的收益更能迁移到没训过的任务上**。这一点对「个人 Agent」尤其关键——它们要应对的是「目标 × 工具 × 约束」的海量组合，根本无法在训练时全部预见。

这也是官方那句论点的来源：**基准分相近的两个模型，能否在迁移场景里泛化，才是真正的分野。**（顺带一提，官方演示用了一个很具象的例子：Wonder 从一张可定制的图像输入，直接构建出一个可玩的 3D 厨房小游戏——把「理解需求 → 跨代码库改 → 反复测试修订」的全链路跑通。）

## 八、安全：对齐叙事与一份「待兑现」的报告

安全是这次发布的另一条主线，但需要冷静读：

- **CBRN 与 cyber**：官方称是迄今最强防护，同时按 Meta Superintelligence Scaling Framework 保留防御性网络能力。
- **Agentic Misalignment**：Full 报告为 0%；ExploitGym 验证后捕获 21 个（92 个 flag 中 21 个为 intended，官方明确可比排名应以 21 计，而非原始 92）。
- **缓解后风险**：CBRN/cyber 均降至「moderate 或更低」；官方自称「most aligned model to date」。
- **关键保留**：完整安全报告「即将发布」——**当前所有安全主张都是阶段性披露**，能否站住脚，取决于后续第三方红队与独立复现。安全数字必须连同缓解条件与评测定义一起读，不能只截一张「0%」的图。

## 九、产业视角：Meta 的路线转向

把 Muse Wonder 放进产业坐标系，能看到几个值得注意的动作：

- **「发布即对照表」**：Meta 直接把 GPT-6 Astra、Claude Fable 5.1、Claude Opus 5.5 写进 model card 做对照。这抬高了行业预期——以后前沿模型发布，竞品对照可能变成标配。
- **分层商业化**：Wonder 按 token 卖（对标 Opus 5.5 定价），Full 绑订阅（锁定 Muse Code 高价值用户）。模型层能力与产品入口被拆开卖。
- **与 Google / Anthropic 的路线差**：Google 同期主推企业通用 Agent（连接器、spend caps），讲「给目标不给指令」与四类记忆；Meta 则把宝押在**模型层的 Active Memory / Focus + 分层 API/订阅**上。
- **闭源 + 开源双线**：用闭源 Wonder 抢前沿话语权，同时用 Spark Open、Glimmer 放开源权重占开发者生态——既当运动员又修生态护城河。

## 十、冷静看：几点保留意见

本着客观，把「发布稿话术」和「已证实事实」分开：

1. **内部基准存疑**：Personal SI Index、MemoryBench 无公开方法，领先幅度需谨慎。
2. **第三方口径更保守**：AA Intelligence Index 上 Full 仍落后 Opus 5.5，官方 14 个基准多数也输——「SOTA」更准确地说是「在长时编码/记忆等特定维度 SOTA」。
3. **完整安全报告未出**：对齐口号能走多远，待独立验证。
4. **透明度有限**：参数规模未公开、无权重、完整报告未发，外界能做的核验有限。
5. **对中文开发者**：中国大陆（含港澳）在限制地区名单内，停留在资料研究即可；且「订阅专属的 Full」与「API 可测的 Wonder」能力差、价差、评测差要分开跟踪，而不是只记一句「Meta 又发了个模型」。

## 小结

Muse Wonder Full 是 Meta 重组 14 个月后交出的第一份前沿答卷：**它没有用参数规模或某个爆炸性单点取胜，而是把「Active Memory（记得住）+ Active Focus（扛得住）」立成个人超级智能的两根支柱**，并在长时程编码 Agent 上拿出了压过同侪的硬成绩，同时用「更强 base 让能力更能泛化到陌生任务」的论证，回应了刷榜质疑。

但它同时也是一个**叙事大于已证实事实**的发布：内部基准、待发布的安全报告、未公开的规模，都还需要时间与第三方复现来兑现。对观察者而言，接下来真正值得盯的是三件事——完整安全报告是否兑现、Harvey LAB / SWE-Marathon / FocusBench 是否被第三方复现、以及 Wonder Full 是否会走向更清晰的企业采购路径。

---

*参考资料：Meta 官方研究博客《Muse Wonder: A Frontier Model for Personal & Professional AI Agents》(research.meta.ai/blog/muse-wonder)、Meta 模型文档与 Geographic Use Policy、OpenRouter 模型页、Artificial Analysis Changelog，及多家媒体对 model card 基准的转述汇总。文中基准数据以官方 model card 为准，部分为媒体转述，跨模型比较请谨慎解读。*
