---
layout: post
title: vector的size()与capacity()的区别
date: 2018-10-03 22:55 +0800
categories: [c++]
tags: c++
---
<!--more-->

### 先看代码

![avatar](/images/vector001.png)

### 运行结果

![avatar](/images/vector002.png)

### 解释
size()是求的当前容器中的元素的个数，对应的有resize()，而capacity()是预分配的内存大小，
看上面的运行结果，刚开始时初始化容器中没有对象，所以两个都是0，当用v.reserve(10)申请了10个内存空间时，capacity变成了10，注意这时候容器中没有对象，所以size仍然是0，然后当用resize(10)时，size的大小也变成了10，而当再向容器中放入一元素的时候，capacity变成了20，因为这时候要重新分配一部分内存空间， 至于分配多少，不同的库有不同的实现，这里是加倍。

注意：size（）与resize()对应， capacity()与reserve()对应
