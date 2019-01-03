---
layout: post
title: torch常用总结（不断更新）
date: 2018-12-24
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


