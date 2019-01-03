---
layout: post
title: model.eval() and model.train()
date: 2018-11-05 
categories: [torch]
tags: torch
---
<!--more-->

### 首先这两个加与不加差别是很大的，

`model.train()`是在训练的时候加上的，
`model.eval()`是在测试的时候加上的，
加与不加的区别在于有些层的表现是不一样的，特别是bn层和dropout，
这就要细节的理解bn层在训练和测试的时候都是在做什么，
在训练的时候bn层里每次不仅要算当前batch的mean和var, 还要综合之前前面算到的，也就是当前的统计量要综合现在的观察值和之前的获得，所以还有一个参数是weight,这个是指定了之后就会固定，它是衡量之前的统计量和当前的观察值的一个权值，

* 在测试 的时候bn层只用算当前批次的mean 和var，不用结合之前的结果。

