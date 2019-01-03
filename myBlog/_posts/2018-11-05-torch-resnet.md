---
layout: post
title: torch中pretrained 的resnet18
date: 2018-11-06
categories: [torch]
tags: torch
---
<!--more-->

在加载torch内部的pretrained的resnet18的时候，打印出来发现和之前实现的不太一样，然后就细细的对比了一下，然后改了过来，其实主要是一些名字起得不太一样，其他的还都一样

下面是一个展示，如何加载torch的pretrained的模型，并做修改


```
# resnet18.py

import torch
import torch.nn as nn
import torch.nn.functional as F

class BasicBlock(nn.Module):
    expansion = 1 
    def __init__(self, in_planes, planes, stride=1):
        super(BasicBlock, self).__init__()
        self.conv1 = nn.Conv2d(in_planes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)

        self.downsample = nn.Sequential()
        if stride != 1 or in_planes != self.expansion*planes:
            self.downsample = nn.Sequential(
                nn.Conv2d(in_planes, self.expansion*planes, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(self.expansion*planes)

            )

    def forward(self,x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        #out += self.shortcut(x)
        out += self.downsample(x)
        out = F.relu(out)

        return out 
    

class Bottleneck(nn.Module):
    expansion = 4 

    def __init__(self, in_planes, planes, stride=1):
        super(Bottleneck, self).__init__()
        self.conv1 = nn.Conv2d(in_planes, planes, kernel_size=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)
        self.conv3 = nn.Conv2d(planes, self.expansion*planes, kernel_size=1, bias=False)
        self.bn3 = nn.BatchNorm2d(self.expansion*planes)

        self.downsample = nn.Sequential()
        if stride != 1 or in_planes != self.expansion*planes:
            self.downsample = nn.Sequential(
                nn.Conv2d(in_planes, self.expansion*planes, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(self.expansion*planes)
            )

    def forward(self, x): 
        out = F.relu(self.bn1(self.conv1(x)))
        out = F.relu(self.bn2(self.conv2(out)))
        out = self.bn3(self.conv3(out))
        #out += self.shortcut(x)

        out += self.downsample(x)
        out = F.relu(out)
        return out


class ResNet(nn.Module):
    def __init__(self, block, num_blocks, num_classes=1000):
        super(ResNet, self).__init__()
        self.in_planes = 64

        self.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.layer1 = self._make_layer(block, 64, num_blocks[0], stride=1)
        self.layer2 = self._make_layer(block, 128, num_blocks[1], stride=2)
        sel.layer3 = self._make_layer(block, 256, num_blocks[2], stride=2)
        self.layer4 = self._make_layer(block, 512, num_blocks[3], stride=2)
        self.fc = nn.Linear(512*block.expansion, num_classes)

    def _make_layer(self, block, planes, num_blocks, stride):
        strides = [stride] + [1]*(num_blocks-1)
        layers = []
        for stride in strides:
            layers.append(block(self.in_planes, planes, stride))
            self.in_planes = planes * block.expansion
        return nn.Sequential(*layers)

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.layer1(out)
        out = self.layer2(out)
        out = self.layer3(out)
        out = self.layer4(out)
        out = F.avg_pool2d(out, kernel_size=7,stride=1, padding=0)
        out = out.view(out.size(0), -1)
        out = self.fc(out)
        return out

def ResNet18():
    return ResNet(BasicBlock, [2,2,2,2])

```

然后下面是加载的过程

```
import resnet18   ## 这个是自己写的
import torch
import torchvision

model1 = resnet18.ResNet18()   # 加载自己写的

#print(model1)

model2 = torchvision.models.resnet18(pretrained=True)  # 加载库里面的
#print(model2)   # 这个打印出来可以清晰地看清里面的结构
model2_dict = model2.state_dict()  # 获得里面的参数字典
model1_dict = model1.state_dict()  # 也获得自己的参数字典

print(len(model2_dict))  # 记录现在的长度
for k, v in model2_dict.items():
    if k not in model1_dict:    # 打印出不在自己写的中的那些
        print(k)

print(model2_dict.keys())
print("*************************")
model2_dict = {k:v for k, v in model2_dict.items() if k in model1_dict}   ## 把有的抽取出来
print(len(model2_dict))
print(model2_dict.keys())
print("******************************")
print(model1_dict.keys())
model1_dict.update(model2_dict)   # 用自己的模型布上pretrained的参数
model1.load_state_dict(model1_dict)   # 加载参数
model1 = model1.cuda()

model1.eval()

example = torch.rand((1,3,112,112)).cuda()

#print(model1)
final = torch.jit.trace(model1, example)
final.save("resnet18.pt")


```


结果打印出来之后，就会发现二者就一样了，这样在用这个去做其他任务的时候就可以用了。

### 想要修改的话

比如原来resnet是做的1000分类的，现在如果是2分类的话

可以这样弄

```
>>> import torch
>>> import torchvision
>>> resnet18 = torchvision.models.resnet18(pretrained=True)
>>> resnet18.fc
Linear(in_features=512, out_features=1000, bias=True)
>>> resnet18.fc = torch.nn.Linear(512,2)
>>> resnet18.fc
Linear(in_features=512, out_features=2, bias=True)

```

这样就变成了2分类的了

本来imageNet上面resnet的输入是112*112的大小的，现在也可以改成其他的，比如是改成`320×320`的了

用上面的代码的话，会报错

```
RuntimeError: size mismatch, m1: [1 x 100352], m2: [512 x 1000] at /opt/conda/conda-bld/pytorch_1544174967633/work/aten/src/THC/generic/THCTensorMathBlas.cu:266


```

然后把最后改一下就可以了，注意这时候需要改两个地方，一个是自己的模型的fc，需要改成

```
self.fc = torch.nn.Linear(100352,2)
```

然后resnet18的pretrained模型也要改成 

```
resnet18.fc = torch.nn .Linear(100352, 2)

```

这样的话就可以根据自己的任务的图的大小来选择合适的输入shape.

类似的如果要改其他的话，也是类似的。
比如卷积层

`resnet18.conv1=nn.Conv2d(3, 64, kernel_size=5, stried=2, padding=3, bias=False)`
