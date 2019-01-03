---
layout: post
title: cornerNet论文笔记
date: 2018-12-07
categories: [论文笔记]
tags: 论文笔记
---
<!--more-->

感觉这篇文章写的非常好！

### 初步认识

这个paper用的检测目标的方法和之前用的很不一样，之前基本采用的是'rcnn'系列或者是'ssd,yolo'系列，但是这些基本上都用了anchor的思想，（好像yolo1是没有用anchor的，记不太清了），而这个paper里面采用的是keypoints里面的heatmap的想法，之前用anchor的时候要检测bbox的4个点，而现在只需要检测对角就可以了，所以叫corner-Net,名字得于此。但是问题立马就来了，如何确定一个点就是物体所在的某个框的角呢，这里用的方法是`corner pooling`（又学到了一种pooling）,`corner pooling`的大致想法是，如果想要判断一个点是不是物体的左上角的话，就看这个点的右边和下边，往右看到边，往下看到底，这样看了之后就，就大致知道这个点是不是左上角了，（为啥不斜着pooling呢，估计是因为不知道具体该怎么斜吧，或许也可以用几个斜的poolign放一块儿，比如在0,30,60,90度的地方放4个pooling）。
问题不光如此，既然这种方法是从Pose-estimation中提出的，那么在multi-pose-estimation中遇到的问题，这里同样地会出现，比如一张图中有多个objects，那么理论上就会有多对corners，那么如何确定这对corners就是这个物体对应的corners呢，即需要`Grouping corners`.


### Introduction

刚才提到，主流的目标检测算法基本上都有`anchor`的思想在里头，但是其实使用`anchor`是有缺陷的，第一个易想到的就是要产生的`anchor`实在是太多了，比如在`DSSD`中有`4w`个anchors，而在`retinaNet`中有`10w`多的anchors，因为这些检测器学到的是`gt-bbox`与`anchor`之间是否能够足够重叠的能力，这样其实只要anchor稍微动一动，仍然会与`gt-bbox`有可观的重叠，那么这些`anchor`基本上都会被作为正样本拿去让检测器学习，从而出现正负样本失衡的问题。

其次使用anchor有许多的超参数需要设置，比如每个地方要产生多少个anchor，隔多少个像素产生anchor，产生anchor的size和ratio是多少，等等这些不太确定的参数再加上常常会用到多个scales的features，会使得任务非常的复杂。

### 重点与困难

* 检测角

检测角是个新的想法，但是像下图这样其实很难判断是不是该物体的一个角

![avator](/images/cornernet1.png)

因为其两个角和其自身的像素值似乎关系不太大。

* corner-pooling

corner-pooling就是为了解决上面的问题而提出的，如下图所示，

![avator](/images/cornernet2.png)

从该点（左上角）沿下，沿右都做pooling,应该就会有物体中的点了吧，实在不行，就把这两个方向的pooing值加起来。

比如 下图就是具体的做法

![avator](/images/cornernet3.png)

很显然这个算法可以用DP来做，因为很容易写出状态转移方程。即

![avator](/images/cornernet4.png)

* det loss

det loss是focal loss的一个变型，大致的意思是多处罚那些没有对的点，让网络将注意力集中在那些错误的上面，对于基本上已经百分之百会的就不要学了。

![avator](/images/cornernet5.png)


* offset loss
这个loss在rcnn系列和ssd中都用到过，但是现在是这样的,作者在这里分析了用downsampling的好与坏，好处是减少memory,让feature更具有把控全局的能力，但是不好的地方就是会损失一些精度，这在maskrcnn中也分析了这个现象。而这个精度就是由于取整函数带来的，那么损失的精度就是其小数部分
![avator](/images/cornernet6.png)
所以作者在这里就提出了优化这一部分
![avator](/images/cornernet7.png)

* push loss and pull loss

刚才也提到，如果有多个物体的话，就有一个'group corner'的问题，这在多人姿态估计中对应着检测到的关节点应该如何归类的问题，即哪些关键点是属于同一个人的。

![avator](/images/cornernet8.png)

即是同一个物体的就'pull'，不是的就'push'，这有些像人脸识别里面的加各种'margin'的想法，即使得同类紧，不同类的分离。

最终的loss是这些的加权求和

![avator](/images/cornernet9.png)





