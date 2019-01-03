---
layout: post
title: Stacked Hourglass 论文笔记
date: 2018-12-10
categories: [论文笔记]
tags: 论文笔记
---
<!--more-->

前面的两个paper里面都相继提到了这个paper,自己之前也看过这个paper，再复习一下。大致的想法是把几个hourglass给stacked到一块儿，形成级联的形式的网络结构，然后不断地进行一个bottom-up,top-down的过程，也可以有趣地理解成筛沙子，多加几个漏斗的话，筛到最后就比较纯了。pose-estimation的任务是非常重要的，也有很多的应用，比如理解一个图中的人的行为，在安防领域里可以在一群人里面根据这个人的姿态来判断他是不是有暴力倾向，在人机交互方面也有很多应用，比如如果一个机器人如果看出来主人正在做什么，或许就能提供相应的帮助。
网络结构的构造是down的时候采用卷积和max-pooling,同时会copy出一份用于后面上采样之后二者进行一个结合，不过这里提到用的上采样是最邻近办法，在最后接两个1-1的卷积调整输出的channels从而产生最终的输出。

### 层的实现的细节

作者在层的实现的时候做了很多的实验，最终采用的是两个连着的3-3的卷积，来代替一个大的卷积核，这在resnetV2中也用过，这个应该是经验吧，或者可以理解成让网络学得更透彻一些，清楚一些，而不是让它一口就吃个大胖子，并且超过3-3的核都没有用。

### stacked 
在很多的网络中都采用了类似的思想，比如DeepPose,OpenPose，这里也采用了级联的思想,我在openpose中做过类似的实验，级联的数目确实会影响效果，不同的任务中级联的个数不一样，需要做实验才能知道，过少可能精度不好，过多又会影响效率。

* 下一个stacked的输入是什么？

下一个stacked的输入并不是上一个stacked的简单的输出，也并不是所有的stacked输入都是来自于之前的一个feature，而是上一个stacked的输入加上本层的stacked的“输出”，这个“输出”加上引号是因为这个输出也是做了处理的。看代码

```

    def forward(self, x):
        out = []
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x) 

        x = self.layer1(x)
        x = self.maxpool(x)

        x = self.layer2(x)
        x = self.layer3(x)

        for i in range(self.num_stacks):
            y = self.hg[i](x)  # 即在每一个stack之后都做了一个res的操作
            #print("1", y.shape)
            y = self.res[i](y)
            #print("2", y.shape)
            y = self.fc[i](y)
            #print("3", y.shape)
            score = self.score[i](y)
            #print("4", score.shape)
            out.append(score)

            if i < self.num_stacks-1:  # 不是最后一个stack的还做了这样的处理。这样是有用的，即前面的stack的输出并不是直接暴力地相加的，这样做是要好一些的。
                fc_ = self.fc_[i](y)
                score_ = self.score_[i](score)
                x = x + fc_ + score_   # 也就是说下一个stack的输入是上一个stack的输入加上本stack的输出score_和fc_,

        return out

```

我理解这样做的原因，作者应该试过暴力相加的效果不好，还是让网络自己决定是否要相加，因为虽然看上去是相加，但是如果`fc_`和`score_`都是0的话，那就没有相加，也就是说这样的操作会让网络自己决定，而不是人为的暴力相加。

上在的`fc_`层就是一个简单的1-1卷积-bn-relu.

```
bn = nn.BatchNorm2d(inplanes)
        conv = nn.Conv2d(inplanes, outplanes, kernel_size=1, bias=True)
        return nn.Sequential(
                conv,
                bn,
                self.relu,
            )

```

而`score_`就是一个卷积

```
 score_.append(nn.Conv2d(num_classes, ch, kernel_size=1, bias=True))

```
这种操作在其他的网络中也有，不宜过大，所以都很simple.
最终的输出是`[16, 64, 64]`,那么大的，16是类别的数目，代表的是关键点的总个数。可能有一个是背景。

从上面的

```
            y = self.hg[i](x)  # 即在每一个stack之后都做了一个res的操作
            #print("1", y.shape)
            y = self.res[i](y)
            #print("2", y.shape)
            y = self.fc[i](y)
            #print("3", y.shape)
            score = self.score[i](y)
            #print("4", score.shape)
            out.append(score)

```

也能看出来，每经过一个hourglass--block之后并没有直接地就是作为输出，而是先经过了一个`res`后经过一个`fc`的操作。
其中`res`的操作是几个bottleneck连接起来的。而`fc`就是和刚才的`fc_`是一样的。

其实在原paper里面好像是没有`fc_`的操作，可能是实现者在实现的时候发现这样可能更好一些吧，
在原paper里面是这样的.
![avator](/images/hourglass3.png)

原paper里面的一个小方框代表一个bottle-neck，但是在实现的时候，也可以每个接多个bottle-neck.
原paper里的是这样的。
![avator](/images/hourglass4.png)
如图所示，这时候的深度是4，即先降到最低时经过的bottleneck的数目，这个过程可以用递归来实现，上图中的每一条线都可以换上多个bottle-neck的拼接或者本来没有bottle-neck的时候加上bottle-neck，这些都可以使网络的容量变大，但是这也要看具体的任务，如果任务不是那么难，就没有必要加那么多的bottle-neck.在整个hourglass中，channels的数目一直都没有发生变化，变化的只是shape.

下面实现一下这个网络。

首先是bottle-neck的部分

```
class Bottleneck(nn.Module):
    expansion = 2  #
    def __init__(self, inplanes, planes, stride=1, downsample=None):
        super(Bottleneck, self).__init__()
        self.bn1 = nn.BatchNorm2d(inplanes)
        self.conv1 = nn.Conv2d(inplanes, planes, kernel_size=1, bias=True)
        self.bn2 = nn.BatchNorm2d(planes)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=stride,
                               padding=1, bias=True)
        self.bn3 = nn.BatchNorm2d(planes)
        self.conv3 = nn.Conv2d(planes, planes * 2, kernel_size=1, bias=True)
        self.relu = nn.ReLU(inplace=True)
        self.downsample = downsample
        self.stride = stride
    def forward(self, x): 
        residual = x 
        out = self.bn1(x)
        out = self.relu(out)
        out = self.conv1(out)
        out = self.bn2(out)
        out = self.relu(out)
        out = self.conv2(out)
        out = self.bn3(out)
        out = self.relu(out)
        out = self.conv3(out)
        if self.downsample is not None:
            residual = self.downsample(x)
        out += residual
        return out

```
即两个1-1的卷积中间夹了一个3-3的卷积，输出的chnnels是`planes*2`,输入的channels多少都是可以的。

然后是hourglass的部分了，（不包括前期的处理部分）。


```
class Hourglass(nn.Module):
    def __init__(self, block, planes, depth):
        super(Hourglass, self).__init__()
        self.depth = depth
        self.block = block
        self.upsample = nn.Upsample(scale_factor=2)
        self.hg = self._make_hour_glass(block, planes, depth)

    def _make_residual(self, block, planes):
        layer = block(planes*block.expansion, planes)
        return layer                                         # 这个就相当于paper里面的一个小方框.

    def _make_hour_glass(self, block, planes, depth):
        hg = []
        for i in range(depth):          # depth是下降时经过的block的个数，即paper里面的图的最左边的4个，res指的就是这个东西。
            hg.append(self._make_residual(block , planes))
        return nn.ModuleList(hg)

    def _hour_glass_forward(self, n, x):    # n深度。  这个过程指的是从前一个深度到后一个深度的过程，是用递归写的。
                                                                # 注意最左边的是深度3,今次是3,2,1,0,这个只是记号而已.
        up1 = self.hg[n-1](x)   
        low1 = F.max_pool2d(x, 2, stride=2)

        if n > 1:
            low2 = self._hour_glass_forward(n-1, low1)
        else:
            low2 = self.hg[n-1](low1)
            low2 = F.max_pool2d(low2, 2, stride=2) 

        # 到这网络相当于shape到最底了。
        # 然后是三个block。
        for i in range(3):
            low2 = self.hg[n-1](low2)
        up2 = self.upsample(low2)
        out = up1 + up2
        return out

    def forward(self, x):
        return self._hour_glass_forward(self.depth, x)

```



