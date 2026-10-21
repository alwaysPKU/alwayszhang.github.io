---
title: "全双工语音模型精读⑫：Wan-Streamer——当全双工长出一张脸"
date: 2026-10-21
categories: [技术, 多模态]
tags: [全双工, 音视频, 流式生成, 数字人, FlowMatching, 实时交互, Wan]
series:
  name: "全双工语音模型精读"
  order: 12
  title: "Wan-Streamer：原生流式音视频全双工"
---

> 本文深读阿里 Wan Team 的 [Wan-Streamer v0.1（arXiv 2606.25041）](https://arxiv.org/abs/2606.25041)（[项目页 wan-streamer.com](https://wan-streamer.com/)）。如果说本系列前十一篇解决的是"模型能边听边答"，Wan-Streamer 要回答的是一个更激进的问题：**全双工能不能不止有声音，还有一张会听、会看、会说的脸？**

## 〇、系列衔接到哪了

先把坐标摆清楚。本系列走到现在，全双工的边界一直在往外推：

- **第 9 篇**的字节 Seeduplex / SeedRealtime，已经把全双工从纯语音推进到**音视频原生**——但输出仍停在语音，且 SeedRealtime 至今无技术报告、无开放权重、黑盒上线。
- **第 11 篇**借 Awesome-VLM-Streaming-Video 梳理了"边看边想边开口"的流式视频理解全景——但那条线的输出基本是文字/语音，**视频只是输入，不是输出**。

Wan-Streamer 踩在两条线的交汇点上：它要的是**文本/音频/视频同时在输入和输出两侧**，而且由**单一 Transformer** 端到端完成。换句话说——之前是"模型看片说话"，这次是让**数字人自己长出来、自己看、自己开口**，中间不经过任何外部 ASR/TTS/动画模块。

## 一、它要解决什么：两类现有方案的死穴

论文开篇就把矛头对准了主流做法。

**第一类是级联系统**：VAD → ASR → LLM → TTS → 音驱动动画。问题不在慢，而在**结构性**——模块边界产生等待，识别与同步误差逐级累积；更致命的是响应时机、轮次管理、身份保持、长程一致性这些"行为"，根本无法作为一个整体被学进任何一个模块里。

**第二类是不对称系统**：要么能听能看但只能说文字（多数 omni 模型，如 Qwen-Omni、MiniCPM-o），要么能生成形象但依赖外部对话/语音模块驱动（绝大多数数字人）。这类系统里，**文本常被当成各组件之间的隐藏中间表示**——接口看起来多模态，骨子里还是文本在传话。

Wan-Streamer 的核心论断是：**实时音视频交互不是"多模态理解 + 多模态生成"的并集，而是内生的全双工**——用户说话时 agent 要持续给出可见的倾听行为，agent 回应时还要继续感知用户的打断信号。

## 二、设计哲学：streamability 是建模约束，不是服务优化

这是全文我最想划线的一句话：

> streamability is a modeling constraint rather than a serving optimization.

整个系统围绕一条 **streaming contract** 构建：**每个组件必须因果（causal）；每个新观察单元必须立即可用；每个生成单元必须立即发射并提交回交互历史。**

这条契约看似朴素，却一票否决了大量常见做法——离线编码器、双向视频解码器、轮次对话、事后音视对齐，统统不能用。它把"流式"从部署阶段的加速技巧，提升为架构设计的**第一性约束**。这也是为什么作者敢断言：靠工程把离线模块拼快，永远做不出真正的低延迟全双工。

## 三、架构：单 Transformer 统一"输入输出同流"

### 3.1 全双工的数学本质

Wan-Streamer 把交互建成一条连续因果流。第 k 个流式单元，用户观察 $u_k=(u_k^{\mathrm{t}}, u_k^{\mathrm{a}}, u_k^{\mathrm{v}})$（文本/音频/视频），agent 响应 $y_k=(y_k^{\mathrm{t}}, y_k^{\mathrm{a}}, y_k^{\mathrm{v}})$，整体自回归分解为：

$$p_{\theta}(y_{1:K} \mid u_{1:K}) = \prod_{k=1}^{K} p_{\theta}\left(y_k^{\mathrm{t}}, y_k^{\mathrm{a}}, y_k^{\mathrm{v}} \mid u_{\leq k},\, y_{<k}\right)$$

请注意条件里的 $u_{\leq k}$：**生成第 k 个响应时，模型同时看着第 k 个用户输入**。这就是全双工与"一问一答"的分水岭——不是输入输出交替，而是**边说边看**。每一个生成完毕的 $y_k$ 又会和对应的 $u_k$ 一起追加回历史，成为下一个单元的上下文。

### 3.2 混合生成目标：离散文本 + 连续音视频

三种模态走两条生成路径：

- **文本**：离散 token，next-token 预测 + 交叉熵——承载推理、对话与轮次决策。
- **音频 + 视频**：连续 latent，用**条件 flow matching** 联合生成。噪声插值与速度场定义为：

$$z_{\tau}^{m} = (1-\tau)\, z_0^{m} + \tau\, \epsilon^{m}, \qquad \frac{\partial z_{\tau}^{m}}{\partial \tau} = \epsilon^{m} - z_0^{m}$$

$$\mathcal{L}_{\mathrm{FM}}^{m} = \mathbb{E}_{\epsilon^{m}} \left\| f_{\theta}\left(z_{\tau}^{\mathrm{a}}, z_{\tau}^{\mathrm{v}}, c_k, \tau\right) - \frac{\partial z_{\tau}^{m}}{\partial \tau} \right\|_2^2$$

这里藏着全篇最漂亮的一个设计：**同一个统一 diffusion Transformer $f_\theta$，在同一份干净上下文 $c_k$ 条件下，同时预测音频和视频两个速度场**。因为语音和画面 latent 在**解码之前**就被联合建模，唇动、面部动态、韵律是**原生同步**的——而不是像级联方案那样，先生成语音再用它去对口型，事后补救。

### 3.3 全因果栈

为了满足 streaming contract，整条链路从头做成因果：**严格因果的音视频 VAE**（流式 latent 编码）→ **因果音视频编码器**（输入侧）→ **时间因果 Transformer**（block-causal attention 协调交错的多模态输入/输出 token）→ **因果音视频解码器**（输出侧）。流式单元最短 **160ms @ 25fps**（约 4 帧一个单元）。

## 四、推理：thinker–performer 的流水线艺术

这是我认为工程价值最高、也最值得借鉴的部分。**训练时是单一端到端模型，部署时拆成双 GPU 流水线**，目的是最大化重叠与硬件利用率：

- **thinker**：因果音视频编码器 + 短 token-causal Transformer（语言预测 + 状态更新）+ KV-cache 构建 + 因果音视频解码器。
- **performer**：只跑最贵的 **flow-matching solver**（latent 生成）。

单个流式步骤 k 的调度是巧思所在：

1. thinker 编码当前 $u_k$、更新状态，产出**当前 KV slice**；
2. 在通信边界：thinker 收到 performer 上一步生成的干净音视频 latent，把新 KV slice 发给 performer，并把返回的 latent **解码成画面/声音立即发射**；
3. performer 把收到的 KV slice 追加进自己的全历史 cache，**只为下一个单元跑 flow solver**，生成的 latent 留在本地，下一步发回 thinker。

这样一来，四类工作在相邻单元间**并行重叠**：当前帧感知+状态更新 ∥ 上一帧解码发射 ∥ 下一帧去噪 ∥ KV/latent 通信。**通过 KV-cache 交换，从语义上保住了"一个统一模型"**，又把重计算挪到 performer 上重叠掉。再配合 CUDA graph 捕获、编译优化、定制 kernel。

论文对延迟的拆分很诚实，特意区分了两个常被混为一谈的概念：

- **吞吐条件**：performer 时间 + KV/latent 通信开销 < 一个 160ms 单元，即可实时跑满 25fps。
- **模型侧响应延迟**（signal-to-signal）= 编码 + thinker 状态更新 + performer 生成 + 解码 ≈ **200ms**；叠加 350ms 双向网络预算后，**总交互延迟约 550ms**。

这套"快慢分层 + 异步重叠"的思路，和第 10 篇 Qwen3.8-Omni 的 Thinker-Talker、以及具身端侧的 Jetson-PI 一脉相承——只不过 Wan-Streamer 把它做进了**单一模型的内部**，而非两个独立模型的协作。

## 五、训练：三阶段把"理解-生成-交互"缝合

1. **独立任务预训练**：从语言模型初始化统一 Transformer，理解侧（因果编码器 + Transformer）与生成侧（因果 latent 生成）**混合训练**，让感知、语言推理、latent 生成在同一序列模型里对齐，而非作为孤立模块分别优化。
2. **端到端交互训练**：用双工交互数据，把用户输入与 agent 输出交错进同一条因果流，专门学习**响应时机、主动倾听、打断处理、长程一致性**——且用与推理时完全一致的因果格式。
3. **低延迟蒸馏**：把带 CFG + 更多 solver 步的强 teacher 蒸馏成高效 student（吸收 CFG、减少求解步数）；再用 **rolling distillation**（self-forcing + distribution matching）让 student 在自回归 rollout 的**自有历史**上训练、对齐 teacher 轨迹——专门治自回归视频扩散的两大顽疾：长程退化与 train-test mismatch。

## 六、实验与定位：按测量边界比，不是比最小数字

论文在对比时的严谨程度超出平均水准，反复强调**"按测量边界读表，而非比谁数字最小"**——因为很多系统报的是模型内部、first-packet、first-token、端点或 API TTFB 延迟，跟远程用户真实感知的 signal-to-signal 延迟根本不是一回事。

在两张对比表里，Wan-Streamer 的差异化非常清晰：

- **vs 全双工语音**（Moshi、OmniFlatten、SALM-Duplex、Seeduplex、GPT-4o Realtime）：这些**不生成视觉 agent、不消费视频流**，因此学不到可见倾听、面部/肢体反馈、音视响应时机。
- **vs 交互数字人**（MIDAS、MAViD、M.I.O、X-Streamer）：多为**模块拼装**，duplex 行为靠系统级控制、VAD 或轮次逻辑，且不公布绝对 signal-to-signal 延迟。
- **vs avatar 渲染器**（VASA-1、TalkingMachines、LiveTalk、Hallo-Live、OmniForcing）：只是渲染组件，依赖外部对话/语音模块，公布的 FPS、首帧延迟是**组件级指标**，不含完整对话路径。

Wan-Streamer 的唯一性在于：**文本/音频/视频同时出现在输入和输出两侧，由单 Transformer 端到端学习感知 + 推理 + 说话 + 可见倾听 + 打断 + 同步音视生成**，并且报告的是**完整远程音视响应路径**（550ms），而非某个组件的局部指标。

## 七、深度判断：创新、坐标系与局限

### 真正的创新（值得肯定）

1. **把全双工从语音推进到音视频双向生成**。这是首个让"视频"也作为流式输出、并与语音在同一速度场联合建模的工作——原生唇音同步是杀手锏，也是与第 9 篇 SeedRealtime（输出仅语音）最本质的区别。
2. **"streamability 作为建模约束"的全因果栈**，理念干净彻底，把流式从工程技巧升格为架构公理。
3. **thinker–performer** 是教科书级的系统-算法协同：训练统一、部署分离、KV 交换保状态、流水线重叠压延迟。

### 必须客观指出的局限与存疑

1. **只有 192p 输出分辨率**，v0.1 明确是 proof of concept——离能用的数字人还有相当距离，"扩展到高分辨率很简单"是作者自述、未经验证。
2. **缺理解/生成质量的标准基准**：全文重心在延迟与定性自然度，**没有给出视频理解准确率、生成质量（FID / 人评 win-rate）等硬指标**，能力上限未知。
3. **延迟是自家双 GPU 测量**，无第三方复现；**无开放权重与代码**（Wan Team 走 wan-streamer.com 产品路线）。
4. flow-matching solver 步数、VAE 压缩率、block-causal 的具体块大小等**关键超参未公开**，复现门槛高。

## 八、系列视角：全双工的下一步往哪走

把 Wan-Streamer 放进全双工的演进脉络，能看清一个趋势——**评价一个实时智能体，正从"答得对不对"转向"两句话之间表现得像不像人"**：等待时是否 visibly present、倾听时是否有眼神/点头/微表情、被打断时能否自然收口、该主动开口时能不能接住画面里的显著事件。Wan-Streamer 把这些"非语言行为"和语言一起塞进同一因果流去联合学习，这是它超越"又一个 omni 模型"的地方。

当然，192p 的概念验证距离"可交付的数字人"还有工程长征；而它与 SeedRealtime（字节，体验领先但黑盒）、以及开源的 DuplexOmni / MOSS-VL-Realtime 之间的**"开放度—体验"剪刀差**，短期看仍不会消失。

## 参考与链接

- 论文：[Wan-Streamer v0.1: End-to-end Real-time Interactive Foundation Models](https://arxiv.org/abs/2606.25041)；[项目页](https://wan-streamer.com/)
- 关键方法借鉴：[Self Forcing（自回归视频扩散 train-test gap）](https://arxiv.org/abs/2506.08009)
- 全双工语音对照：[Moshi](https://arxiv.org/abs/2410.00037)
- 系列内呼应：[全双工精读⑨·字节 Seeduplex 与 SeedRealtime](/posts/2026-09-10-全双工精读9-字节Seeduplex与SeedRealtime-从RL话轮决策到音视频原生全双工)、[全双工精读⑪·流式视频理解 VLM 全景](/posts/2026-10-08-全双工精读11-流式视频理解VLM全景-从音频全双工到边看边想边开口)

---

*本文为「全双工语音模型精读」系列第 12 篇。文中架构细节、延迟数据、对比结论均整理自 Wan-Streamer 论文原文（arXiv 2606.25041 v2，2026-06），输出分辨率、开放程度等局限亦以论文自述为准，时效截至 2026-10。*
