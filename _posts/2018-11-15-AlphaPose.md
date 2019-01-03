---
layout: post
title: AlphaPose论文笔记
date: 2018-11-15
categories: [论文笔记]
tags: 论文笔记
---
<!--more-->

### Introduction

看网上的介绍说这个结果直接高于Mask-rcnn8个百分点，所以非常想看一下里面的思想。这个是上海交大和腾讯优图合作的一个paper.

### abstract

当前姿态估计仍然很具有挑战性，尽管人的检测器已经很不错了，但是误差仍然不可避免地会有，特别是这些error会给SPPE带来错误，尤其是先用human detector来检测到人的方法来做的时候。这个paper主要提出了RMPE（region multi-person pose estimation）的框架来处理当human bbox没有检测对的时候。主要分为三个部分，SSTN, NMS, PGPG.特点是能够处理human bbox不太精确的时候以及多余的检测。

### introduction

目前主流的有两种方法，two-step 和 part-based。

* two-step framework

这种方法是先检测人的bbox然后在bbox内部再做SPPE。
那么自然地这种方法的准确性很依赖于人的bbox的检测，如果这个不对，后面就不好做。这个paper里用的是这个方法。

* part-based

这种方法是先检测parts然后再处理这些parts。但是当几个人靠的太近的时候这种方法效果不是太好。并且这种方法并没有从整个图的宏观来去看，再检测完了parts之后，后面仅仅使用了这些parts之间的关系。

paper中说""Our paper aims to solve the problem of impect human 
detection in the two-step framework in order to maximize the power of SPPE.""

网络的整个流程图如下

![avator](/images/alphapose1.png)

即前面是human bbox的获得的部分，然后把human bboxs送给
“Symmetric STN+SPPE”模块，然后产生pose proposals，然后产生的pose proposals经过 parametric Pose NMS的refine得到human poses。
即在SPPE之前和之后分别有STN和SDTN。
下面加的并行的SPPE是为了避免局部最小并且平衡SSTN的能力。
为了数据增强， 用了pose-guided proposals generator (PGPG).

### parametric Pose NMS
- 为什么要用NMS，

因为human detectors 可能会产生多余的检测，那么自然的也会有多余的pose estimations,NMS就是为了去除这些冗余。
和通常的NMS差不多的过程，就是先在里面选择score最高的那个，然后删除掉和其离的比较近的，一直重复这个过程直到没有。

- 删除准则

什么样的才算离的近，这里就有一个距离的定义问题，或者相似度的一个充度量，按Paper里面是

![avator](/images/alphapose2.png)

\eta 是个阈值，距离小于\eta的时候f取1，代表pi应该被deleted， 否则取0， \Lambda是d的参数

- pose distance

![avator](/images/alphapose3.png)

- parts之间的空间的距离也要考虑

![avator](/images/alphapose4.png)

- optimization

![avator](/images/alphapose5.png)

因为有4个参数，一起优化的太难了，所以现在的方法是每次优化两个参数，固定其他两个，直至convergence.

- PGPG 

对于SST-SPPE模块而言，因为需要网络来适应由human detector 产生的 可能并不太完美的bbox proposals，所以很有必要来做数据增强。否则的话，因为测试阶段仍然是需要human detector的，可能会导致效果不太好。一个自然的想法是，训练时直接使用human detector产生的bbox。
现在有了gt的pose，再加上human detector又会对每个人产生bbox， 这样的话就会有很多的training proposals了，并且因为它们都是human detector的输出，

- Q：gt的pose包括什么？

paper中是这样解释的

![avator](/images/alphapose7.png)

即希望学得那个分布P，是proposals与gt-bbox之间的偏移相对于gt pose的条件分布。

- atom(P)？


### STN 和SDTN

这个可以参考我之前写的blog。能从网络的结构中看出来，在SPPE之前用了STN，而在SPPE之后用了SDTN，这样做是因为STN把图像中原本的东西变换之后 送到SPPE，那从SPPE出来之后想要得到在原图的信息怎么办？做一个STN的inversse就可以了，SDTN就是STN的inverse.

二者之间的关系以及梯度的回传计算在paper中都很详细。

### parallel SPPE

在STN的论文中就曾提到过在一些任务上可能并行的加上STN，这里就是一个例子，在训练的时候加这个并行的SPPE的目的是帮助STN 得到一个较好的human-dominant regions,这个STN和原始的SPPE是share 参数的，但是下面这一层把SDTN给去掉了，
如下图

![avator](/images/alphapose8.png)

现在来看看到底这个并行的SPPE是如何帮助原始的SPPE的。感觉这一点应该是这个Paper里的重点。初步的感觉是并行的SPPE是个监督的感觉用来监督原始的SPPE好不好。具体的细节还要根据代码来理解。





