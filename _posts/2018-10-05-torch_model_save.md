---
layout: post
title: torch 模型的保存与加载
date: 2018-10-05
description: "torch"
tag: torch
---
之前没有注意到这个问题，是在看代码的时候发现了在做推理的时候，pytorch并不是像mxnet那样加载参数，做前向计算就可以了，而是发现它是先导入网络的结构，然后再把参数布到上面去，感觉这样似乎多了一道程序。于是就查了查，才知道 torch其实有两种办法来加载模型参数。

### 法一, 保存训练好的模型，包括整个网络和参数

```
# save model
torch.save(net, "net.pkl")

# load model
model = torch.load("net.pkl")
# to inference
pred = model(input)
```
关于这种做法，文档上是这么说的
However in this case, the serialized data is bound to the specific classes and the exact directory structure used, so it can break in various ways when used in other projects, or after some serious refactors.



### 法二， 只保存网络的参数，不包括网络的结构, 这种是官方推荐的方式，

```
# save params of model
torch.save(net.state_dict(), "net_params.pkl")

# load params of model
# fisrt construct net
net = torch.nn.Sequential(......)
# load parmas 
net.load_state_dict(torch.load('net_params.pkl'))

# to inference
pred = net(input)

```
### 保存的可以是以什么结尾的
因为之前看代码的时候保存的是以.tar结尾的，官方的文档里是以.pt结尾的，还有.pkl结尾的。暂时见到这三种
