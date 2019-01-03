---
layout: post
title: RefineDet 论文笔记
date: 2018-09-05 6：55 +0800
categories: [论文笔记]
tags: 论文笔记
---
早已跟不上出论文的速度了！
<!--more-->
### Abstract
abstract 里面把主要内容讲的很清楚，首先是关键词：
- single-shot
- anchor refinement module (ARM)
- object detection module (ODM)
- transfer connection block (TCB)
- train in an end-to-end way

### 主要内容
（个人理解）感觉这个paper里面有ssd的想法，有rcnn系列的想法，也有fpn的想法，基本上是整合了one-stage和two-stage的优缺点。

**Motivation**

目前主流的有两种方式，一种是two-stage的，常见的比如rcnn系列，一种是one-stage的，比如ssd, yolo系列.
two-stage的acc高，但是有些慢，而one-stage的虽然快，但是acc比不上two-stage的，所以自然的想法，应该是能不能更快更好呢？

**分析原因**

one-stage慢的原因是要做proposal，而其acc高的原因，是用了anchor的想法，并且进行了hard-example-mining 使得正负样本的比例不要失衡；
文章中是这么说的：

![avatar](/images/001.png)

即
- use two-stage的结构处理了类别不平衡
- 做了two-step bbox regression
- use two-stage 的featuers describe objects
two-stage的acc不高的原因，文章中是这么说的

![avatar](/images/002.png)

即主要是由类别不平衡造成的。

**解决办法及创新点**
解决办法及本文的网络架构，
如图所示：

![avatar](/images/003.png)

上层结构是ARM,即refine-anchor-module
基本上是ssd的架构，
然后下层是ODM,即物体检测的module，
连接上下层的是TCB-block，

具体的细节的话，我是这样理解的，
data-->进入arm-->(anchor, loc_preds, cls_preds)
然后下面有两支了，
一支是:
(anchor,loc_preds,cls_preds)-->(arm_l1_loss, arm_log_loss)，
具体的过程是利用anchor 和gt给anchor打label，
打完之后就成了训练集，然后训练集结合cls_preds来做arm_log_loss，也结合loc_preds来做arm_smooth_l1_loss

然后下层结构就是ODM了，就是做predict了，比较容易理解。

### questions
- log loss 做softmax了吗？文章中说没有做，但是不做softmax的话两个概率值相加不一定为1，这似乎不是binary-cross-entropy
- arm 的loss是针对refined过的anchors还是说原来产生的anchors，论文中后面好像写的是针对所有的正样本做的binary-cross-entropy
- 不太理解 refined anchors的过程，看代码似乎只是将arm产生的anchor结合arm_loc_preds做了变换。"refined"具体指什么？




