---
layout: post
title: 用torch写自己的层
date: 2018-10-13
description: "torch"
tag: torch
---   


在实际中可能有这种情况，就是有些层是不需要学习的，但是它放在一些可以学习的层之间，比如在两个block之间加上一个FourierTransform,这种是可以用torch来实现的，
下在是例子。

```
import torch

from torch.autograd import Function

from numpy.fft import rfft2, irfft2


class MyFun(Function):
    
    def forward(self, input):
        numpy_input = input.detach().numpy()
        result = abs(rfft2(numpy_input))
        return input.new(result)

    
    def backward(self, grad_output):
        numpy_go = grad_output.numpy()
        result = irfft2(numpy_go)
        return grad_output.new(result)


def run(input):
    return MyFun()(input)



## test

input = torch.randn(8, 8, requires_grad=True)

result = run(input)

print(result)

result.backward(torch.randn(result.size()))

print(input)


```

因为这个层是不用学习的，所以直接是Function的子类，而是不是Module的子类，另外必须实现的两个函数是 forward和backward，
这样如果碰到了需要自己写的情况，可以以这个为例子来进行写。


