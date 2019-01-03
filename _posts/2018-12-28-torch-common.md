---
layout: post
title: torch常用总结（不断更新）
date: 2018-12-28
categories: [torch]
tags: torch
---
<!--more-->


#### torch.chunk()


```
>>> a = torch.randn(10,10)

>>> a,b,c,d = a.chunk(4, dim=1)
>>> a
tensor([[-0.1161, -1.1078,  0.0536],
        [ 0.0428, -0.2843,  0.4174],
        [-1.6897,  0.0662, -2.1043],
        [-1.9352,  0.4618, -0.2195],
        [ 0.0203, -0.4590,  0.4475],
        [-0.5266, -0.5123, -1.2169],
        [-0.5326, -0.1897,  1.3600],
        [-0.5801, -0.0573, -0.9565],
        [ 0.1664, -0.1459,  0.3236],
        [-0.3293,  1.5720,  0.1008]])
>>> a.shape
torch.Size([10, 3])
>>> a.size
<built-in method size of Tensor object at 0x7f1bbd30fdc8>
>>> 
>>> 
>>> a.size()
torch.Size([10, 3])
>>> b.shape
torch.Size([10, 3])
>>> c.shape
torch.Size([10, 3])
>>> d.shape
torch.Size([10, 1])


```

意思就是把一个array分成几个块儿, 如果不整除的话，最后一个是不够的。

### torch.clamp(input, min, max, out=None)  
这个最初是在bbox上面看到的，即bbox预测出来之后要调一下，

```

class ClipBoxes(nn.Module):

    def __init__(self, width=None, height=None):
        super(ClipBoxes, self).__init__()

    def forward(self, boxes, img):   # img 是原图。

        batch_size, num_channels, height, width = img.shape   # 就是为了传入shape.

        boxes[:, :, 0] = torch.clamp(boxes[:, :, 0], min=0)   # 要把xmin和ymin最小弄到0，xmax和ymax弄到width, height
        boxes[:, :, 1] = torch.clamp(boxes[:, :, 1], min=0)

        boxes[:, :, 2] = torch.clamp(boxes[:, :, 2], max=width)
        boxes[:, :, 3] = torch.clamp(boxes[:, :, 3], max=height)
      
        return boxes


```

主要是为了防止出现超过范围的，所以需要“夹”一下。

看下面的例子

```
>>> a = torch.rand((10,3))
>>> a
tensor([[0.6708, 0.4612, 0.9626],
        [0.7909, 0.4636, 0.1710],
        [0.6627, 0.1952, 0.3010],
        [0.8106, 0.4771, 0.0902],
        [0.4339, 0.7132, 0.9819],
        [0.8299, 0.6124, 0.2905],
        [0.9245, 0.9359, 0.8453],
        [0.6994, 0.7530, 0.7778],
        [0.0879, 0.6195, 0.3117],
        [0.9031, 0.0375, 0.1836]])
>>> a = torch.clamp(a, min=0.2, max=0.8)
>>> a
tensor([[0.6708, 0.4612, 0.8000],
        [0.7909, 0.4636, 0.2000],
        [0.6627, 0.2000, 0.3010],
        [0.8000, 0.4771, 0.2000],
        [0.4339, 0.7132, 0.8000],
        [0.8000, 0.6124, 0.2905],
        [0.8000, 0.8000, 0.8000],
        [0.6994, 0.7530, 0.7778],
        [0.2000, 0.6195, 0.3117],
        [0.8000, 0.2000, 0.2000]])
>>>
```
即小于`min`的给弄成最小的，大于`max`的弄成最大的，这在实变函数中经常见到这种操作。


### torch.randn(2,3)  torch.randn((2,3))

这个是产生标准的正态分布的随机数，即以0为均值以1为标准差的随机数。

### torch.rand((2,3)) torch.rand((2,3))
这个是从[0,1]之间的均匀分布中抽取一组随机数

### torch.max()

```
>>> import torch
>>> a = torch.randn((2,3))
>>> a
tensor([[ 0.3010,  0.9597, -0.3248],
        [ 0.2432,  0.6206,  1.5890]])
>>> torch.max(a, dim=1)
(tensor([0.9597, 1.5890]), tensor([1, 2]))
>>> torch.max(a, dim=0)
(tensor([0.3010, 0.9597, 1.5890]), tensor([0, 0, 1]))


```

其中dim1的时候是求每一行的最大值，dim=0的时候是求每一列的最大值。

### torch.lt()

看下面的例子
```
>>> a = torch.randn((2,3))
>>> a
tensor([[-0.3616,  1.8169, -0.0667],
        [-0.9241,  0.2994, -0.8512]])
>>> a[torch.lt(a,0.4)] =1.
>>> a
tensor([[1.0000, 1.8169, 1.0000],
        [1.0000, 1.0000, 1.0000]])
>>> torch.lt(a,1.)
tensor([[0, 0, 0],
        [0, 0, 0]], dtype=torch.uint8)
>>> torch.lt(a,1.5)
tensor([[1, 0, 1],
        [1, 1, 1]], dtype=torch.uint8)


```

### torch.gt() or torch.ge()


```
>>> a = torch.randn((2,3))
>>> a
tensor([[-1.2540,  1.4163,  0.3262],
        [ 0.8598, -0.3746,  0.4843]])
>>> torch.gt(a, 0.5)
tensor([[0, 1, 0],
        [1, 0, 0]], dtype=torch.uint8)
>>> a[torch.gt(a,0.5)]=2
>>> a
tensor([[-1.2540,  2.0000,  0.3262],
        [ 2.0000, -0.3746,  0.4843]])


```
###  torch.eq()

和上面的两个的用法差不多

### torch.where()

```

>>> a = torch.randn((2,3))
>>> a
tensor([[ 0.4385, -2.6319,  0.7710],
        [ 0.6759,  1.0058,  1.2362]])
>>> a = torch.where(torch.lt(a, 1), a, 1-a)
>>> a
tensor([[ 0.4385, -2.6319,  0.7710],
        [ 0.6759, -0.0058, -0.2362]])
>>> 

```
相当于一个分段的函数一样，条件满足的地方是a,不满足的地方是1-a。


