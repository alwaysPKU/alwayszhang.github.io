---
title: "前世：从试错学习到 AlphaZero，强化学习的经典三十年"
date: 2026-10-26
categories:
  - 技术
tags:
  - 强化学习
  - Q-learning
  - PPO
  - AlphaGo
  - 深度强化学习
series:
  name: "大模型强化学习"
  order: 1
---

> 大模型时代的 RL 看起来像凭空冒出来的新东西，其实每一件兵器——价值函数、策略梯度、Actor-Critic、自我对弈、奖励黑客——都在前三十年被锻造过一遍。本篇回到源头：从行为主义心理学到 AlphaZero，看看这门学科给 LLM 时代留下了哪些遗产，哪些教训又被重新学了一遍。

## 目录

- [一、心理学的起点：试错与效果律](#一心理学的起点试错与效果律)
- [二、数学奠基：MDP、TD 与 Q-learning（1950s–1990s）](#二数学奠基mdptd-与-q-learning1950s1990s)
- [三、深度强化学习爆发：DQN 到 AlphaZero（2013–2019）](#三深度强化学习爆发dqn-到-alphazero20132019)
- [四、经典时代留给 LLM 的四份遗产](#四经典时代留给-llm-的四份遗产)
- [五、小结](#五小结)
- [系列导航](#系列导航)
- [资源索引](#资源索引)

---

## 一、心理学的起点：试错与效果律

强化学习的思想源头不在计算机科学，而在行为主义心理学。

1898 年，心理学家 Edward Thorndike 把猫关进"迷箱"，观察它们如何通过随机尝试学会拉动机关逃脱。他从中总结出**效果律**（Law of Effect）：**带来满意结果的行为倾向会被强化，带来不适结果的行为倾向会被削弱**。这句话几乎就是强化学习的全部直觉——不需要老师告诉猫每一步该怎么做，只需要一个"结果好不好"的信号，行为就会自发地向好结果收敛。

同一时期巴甫洛夫的条件反射实验、后来斯金纳的操作性条件反射，进一步把"刺激—反应—强化"的框架系统化。强化学习区别于监督学习的本质在这一刻就已经确立：**没有标准答案，只有奖励信号；智能体必须自己探索，并从稀疏的反馈中倒推出哪些行为该被记功**。后者就是著名的信用分配问题，它在四十年后的大模型推理训练里卷土重来（见[总览篇](/posts/2026-10-26-大模型RL0-大模型强化学习综述-从RLHF到经验时代)与本站[《RLVR 信用分配综述》](/posts/2026-10-23-RLVR信用分配综述-一条长推理链功劳到底算谁的)）。

## 二、数学奠基：MDP、TD 与 Q-learning（1950s–1990s）

### 2.1 问题的形式化

1950 年代，Richard Bellman 在研究多阶段决策问题时提出动态规划和**贝尔曼方程**：一个状态的价值，等于即时奖励加上后继状态的折扣价值。这个递归结构后来成为几乎所有 RL 算法的理论地基。状态、动作、转移概率、奖励、折扣因子——五元组构成的**马尔可夫决策过程（MDP）**至今仍是 RL 问题的标准语言。

### 2.2 时序差分：不靠模型的学习

动态规划要求知道环境的完整转移模型，现实中往往没有。1988 年，Richard Sutton 提出**时序差分（TD）学习**：用"当前估计"去更新"当前估计"（自举，bootstrapping），边交互边学习，不需要环境模型。TD 把蒙特卡洛方法（等最终结果）和动态规划（立即更新）的优点缝合在一起，成为 RL 的主干思想。

### 2.3 Q-learning 与策略梯度：两条主干

1989 年，Christopher Watkins 在其博士论文中提出 **Q-learning**：直接学习状态-动作价值函数 Q，并用贪心策略不断迭代改进。它的美妙之处在于**离策略**（off-policy）——学习的目标策略和产生数据的行为策略可以不同，历史数据可以反复利用。另一条主干是**策略梯度**：1992 年 Ronald Williams 提出 REINFORCE，直接对参数化策略求梯度；1999 年 Sutton 等人给出**策略梯度定理**的严格形式，Actor-Critic 架构（一个网络出动作、一个网络打分）随之成型。今天大模型训练里的 PPO、GRPO 都是这条血脉的直系后代。

与学习算法并行的还有一个永恒难题：**探索与利用的权衡**——是重复已知的好选择，还是冒险尝试新动作？从多臂老虎机问题里的 Thompson 采样（1933）、ε-greedy 到 UCB，这套理论在 2025 年的推理模型"探索熵管理"里依然一字未改地被讨论着。

## 三、深度强化学习爆发：DQN 到 AlphaZero（2013–2019）

经典算法在表格和小规模问题上成立，但状态空间一大就无能为力。2013 年深度学习带来的表示能力，把这层天花板掀开了。

| 年份 | 里程碑 | 关键技术 |
|---|---|---|
| 2013/2015 | **DQN**（DeepMind，Nature 2015） | 深度网络逼近 Q 函数 + 经验回放 + 目标网络，49 款 Atari 游戏达人类水平 |
| 2015 | TRPO | 信赖域约束策略更新，保证单调改进 |
| 2016 | A3C、DDPG | 异步并行 Actor-Critic；连续动作空间的确定性策略梯度 |
| 2016.3 | **AlphaGo 4:1 胜李世乇** | 蒙特卡洛树搜索（MCTS）+ 策略/价值网络 + 人类棋谱监督 + 自我对弈 RL |
| 2017 | **PPO** | 截断重要性比率的近端策略优化，简单、稳定、成为工业界默认算法 |
| 2017.10 | **AlphaGo Zero** | 完全抛弃人类棋谱，纯自我对弈从零起步，100:0 击败 AlphaGo |
| 2017.12 | AlphaZero | 同一套自我对弈框架通吃围棋、国际象棋、将棋 |
| 2018 | SAC | 最大熵 RL，把"保持探索"写进目标函数 |
| 2019 | AlphaStar、OpenAI Five | 星际争霸 2 宗师级、Dota 2 胜世界冠军——不完美信息、超长时序、多智能体 |

三件事值得特别标记：

**第一，自我对弈（self-play）的威力。** AlphaGo Zero 证明了最强的学习信号可以完全不来自人类数据，而来自智能体与自身（或环境）的无限博弈。今天"推理模型自己出题自己做"的自改进叙事，种子在这里。

**第二，奖励黑客（reward hacking）的早期警告。** DeepMind 2016 年就记录过智能体在赛艇游戏里发现"转圈刷分点"而不去终点的案例。这个词汇和它所代表的对齐风险，在十年后的大模型 RL 时代成为核心议题。

**第三，苦涩的教训（The Bitter Lesson）。** 2019 年 Sutton 撰文总结七十年 AI 史：凡试图把人类知识硬编码进系统的方法终将落败，**能利用算力规模化的通用方法（搜索与学习）最终胜出**。这段话被引用至今，因为它既预言了 LLM 的成功，也预言了 RL 在 LLM 上的复兴。

## 四、经典时代留给 LLM 的四份遗产

1. **价值函数与基线的思想**。PPO 的 critic、GRPO 的"组内均值基线"，本质都是方差缩减的古老技巧——减一个基线，让信用分配更准。
2. **重要性采样与信赖域**。GRPO 的截断比率直接继承自 PPO，PPO 继承自 TRPO；2025 年 GSPO 把比率从 token 级改为序列级，争论的仍是同一个稳定化问题。
3. **熵正则与探索管理**。RLVR 时代的"熵崩溃"焦虑、clip-higher 技巧，在 SAC 和 PPO 时代已有对应实践。
4. **奖励即接口的哲学与危险**。只要奖励可以被刷分，智能体就一定会刷分——从赛艇游戏转圈，到推理模型"正确但不落地检索"（grounding gap），同一规律反复上演。

## 五、小结

经典三十年解决的问题是：**在规则明确、状态可枚举或可逼近的环境里，如何从试错中学到最优策略**。它留下的 MDP 语言、TD/Q-learning 与策略梯度两条主干、自我对弈的范式、以及对奖励黑客的警惕，构成了后来一切故事的基础设施。但它也有明显的边界：样本效率低、奖励要人工精心设计、几乎不触及"语言"与"知识"。

把这套引擎装到语言模型上，需要等两个条件成熟：足够强的预训练基座，以及一个能表达"人类偏好"的奖励来源。这就是下一篇的主题——RLHF 纪元。

## 系列导航

- 上一篇 / 总览：[大模型强化学习综述：从 RLHF 到经验时代](/posts/2026-10-26-大模型RL0-大模型强化学习综述-从RLHF到经验时代)
- 下一篇：[对齐纪元：RLHF 如何把人类偏好塞进语言模型](/posts/2026-10-26-大模型RL2-对齐纪元-RLHF如何把人类偏好塞进语言模型)

## 资源索引

| 工作 | 链接 |
|---|---|
| Watkins, Q-learning（1989 博士论文） | [Learning from Delayed Rewards](https://www.cs.rhul.ac.uk/~chrisw/new_thesis.pdf) |
| Sutton & Barto《Reinforcement Learning: An Introduction》（第 2 版） | [官方电子版](http://incompleteideas.net/book/the-book-2nd.html) |
| Williams, REINFORCE（1992） | [Machine Learning 期刊页](https://link.springer.com/article/10.1007/BF00992696) |
| Sutton et al., 策略梯度定理（NIPS 1999） | [论文 PDF](https://proceedings.neurips.cc/paper/1999/hash/464d828b85b0bed98e80ade0a5c43b0f-Abstract.html) |
| DQN（DeepMind，Nature 2015） | [Nature 页面](https://www.nature.com/articles/nature14236) |
| TRPO（Schulman et al. 2015） | [arXiv:1502.05477](https://arxiv.org/abs/1502.05477) |
| A3C（Mnih et al. 2016） | [arXiv:1602.01783](https://arxiv.org/abs/1602.01783) |
| DDPG（Lillicrap et al. 2015） | [arXiv:1509.02971](https://arxiv.org/abs/1509.02971) |
| PPO（Schulman et al. 2017） | [arXiv:1707.06347](https://arxiv.org/abs/1707.06347) |
| SAC（Haarnoja et al. 2018） | [arXiv:1801.01290](https://arxiv.org/abs/1801.01290) |
| AlphaGo（Nature 2016） | [Nature 页面](https://www.nature.com/articles/nature16961) |
| AlphaGo Zero（Nature 2017） | [Nature 页面](https://www.nature.com/articles/nature24270) |
| AlphaZero（Science 2018） | [Science 页面](https://www.science.org/doi/10.1126/science.aar6404) |
| AlphaStar（Nature 2019） | [Nature 页面](https://www.nature.com/articles/s41586-019-1724-z) |
| OpenAI Five（2019） | [arXiv:1912.06680](https://arxiv.org/abs/1912.06680) |
| Sutton《The Bitter Lesson》（2019） | [官方博文](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) |
| Leike et al., AI Safety Gridworlds（2017，奖励黑客早期系统化） | [arXiv:1711.09883](https://arxiv.org/abs/1711.09883) |

---

*撰写日期：2026-10-26。早期工作（1950s–1990s）的原始论文多为期刊/学位论文，索引以可公开访问的版本为准。*
