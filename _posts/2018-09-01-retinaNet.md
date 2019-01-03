---
layout: post
title: retinaNet论文笔记
date: 2018-09-01
categories: [论文笔记]
tags: 论文笔记
---
<!--more-->


### 初步认识

这篇文章非常的有意义，是第一个意识到one-stage的检测器准确率不高的原因在于类别不平衡，即正负样本严重失衡，而在two-stage的rcnn系列其实也有这个问题，只不过比Onestage的稍微好了一点，因为RPN已经做了一次是前景还是背景的分类了。
类别不平衡会出现什么问题，举个例子吧，假设有100个样本，里面有1个次品，那么假设分类器全部都把这100个认为是好的，准确率也有99%呢，但是实际经过学习之后的分类器可能还没有这个好，这就是类别不平衡造成的问题。

### 解决办法

作者提出了用focal loss来解决这个问题，之前的loss是CE,现在在CE的基础上加了一些权重，即

![avator](/images/focalloss1.png)

另外，这个paper还有另外一个贡献，即设计了一个one-stage的精确度也比较高的retinaNet.

![avator](/images/focalloss2.png)



<<<<<<< HEAD
=======
### 下面以resnet18为例来研究一下代码

* basice blok

这个是resnet的基本单元的一种，另外一种是`bottleneck`


```

class BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, inplanes, planes, stride=1, downsample=None):
        super(BasicBlock, self).__init__()
        self.conv1 = conv3x3(inplanes, planes, stride)
        self.bn1 = nn.BatchNorm2d(planes)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = conv3x3(planes, planes)
        self.bn2 = nn.BatchNorm2d(planes)
        self.downsample = downsample
        self.stride = stride

    def forward(self, x):
        residual = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)

        out = self.conv2(out)
        out = self.bn2(out)

        if self.downsample is not None:
            residual = self.downsample(x)

        out += residual
        out = self.relu(out)

        return out



```


然后 是resnet的前面的部分

```
        x = self.conv1(img_batch)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)



```
具体细节是

```
        self.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)


```


如果输入的是`(1,3,320,480)(nchw)` 的话，那么到上面的出来之后就变成了`(1,64,80,120)`,


然后经过下面4个提特征的层


```

        x1 = self.layer1(x)   #(1,64,40,60)
        x2 = self.layer2(x1)  #(1,128,40,60)
        x3 = self.layer3(x2)  #(1,256,20,30)
        x4 = self.layer4(x3)  #(1,512,10,15)

        features = self.fpn([x2, x3, x4])


```

其中`x2,x3,x4`被送入了fpn,接下来看看fpn的细节，


### fpn

fpn的前向计算的代码是这样的

```
def forward(self, inputs):

        C3, C4, C5 = inputs

        P5_x = self.P5_1(C5)
        P5_upsampled_x = self.P5_upsampled(P5_x)
        P5_x = self.P5_2(P5_x)    ## 


        P4_x = self.P4_1(C4)
        P4_x = P5_upsampled_x + P4_x
        P4_upsampled_x = self.P4_upsampled(P4_x)
        P4_x = self.P4_2(P4_x)

        P3_x = self.P3_1(C3)
        P3_x = P3_x + P4_upsampled_x
        P3_x = self.P3_2(P3_x)

        P6_x = self.P6(C5)

        P7_x = self.P7_1(P6_x)
        P7_x = self.P7_2(P7_x)

        return [P3_x, P4_x, P5_x, P6_x, P7_x]



```

可以看出`C5`,`C4`在进行上采样之前和之后都进行了卷积操作，应该是让其在上采样之前和之后适应一下，
还要注意 `C4`在进行上采样的时候，用到的有从`C5`那里进行上采样得到的feature,二者相加之后再采样，

`C5`除了去和`C4`做某些操作之外，还去产生了`p6,p7` 这一点有点像ssd里面的那几个multiscale的feature map类似，这里上采样采用的是`最邻近`的算法。真正经过上采样的只有`C5,C4`, 输出的5个feature,其channel是一样的。

不同scale的feature提出来了之后，下面该用这feature去做predict了。



```
        regression = torch.cat([self.regressionModel(feature) for feature in features], dim=1)
        #print(regression.shape)

        classification = torch.cat([self.classificationModel(feature) for feature in features], dim=1)


```


其中回归层的详细是这样的


```
class RegressionModel(nn.Module):
    def __init__(self, num_features_in, num_anchors=9, feature_size=256):
        super(RegressionModel, self).__init__()

        self.conv1 = nn.Conv2d(num_features_in, feature_size, kernel_size=3, padding=1)
        self.act1 = nn.ReLU()

        self.conv2 = nn.Conv2d(feature_size, feature_size, kernel_size=3, padding=1)
        self.act2 = nn.ReLU()

        self.conv3 = nn.Conv2d(feature_size, feature_size, kernel_size=3, padding=1)
        self.act3 = nn.ReLU()

        self.conv4 = nn.Conv2d(feature_size, feature_size, kernel_size=3, padding=1)
        self.act4 = nn.ReLU()

        self.output = nn.Conv2d(feature_size, num_anchors*4, kernel_size=3, padding=1)

    def forward(self, x):

        out = self.conv1(x)
        out = self.act1(out)

        out = self.conv2(out)
        out = self.act2(out)

        out = self.conv3(out)
        out = self.act3(out)

        out = self.conv4(out)
        out = self.act4(out)

        out = self.output(out)

        # out is B x C x W x H, with C = 4*num_anchors
        out = out.permute(0, 2, 3, 1)

        return out.contiguous().view(out.shape[0], -1, 4)


```

就是不停地进行`conv--relu`的操作，最后输出的channels的数目是`num_anchors*4` 是因为对于输入的feature比如说`10×10`的大小的，
那么会产生`10×10×9`个框，所以就会有`10*10*9*4`个值去pred, 而每个像素点上面是`9*4`。这里的输出是实数值。


分类层几乎一样

```
class ClassificationModel(nn.Module):
    def __init__(self, num_features_in, num_anchors=9, num_classes=80, prior=0.01, feature_size=256):
        super(ClassificationModel, self).__init__()
        self.num_classes = num_classes
        self.num_anchors = num_anchors

        self.conv1 = nn.Conv2d(num_features_in, feature_size, kernel_size=3, padding=1)
        self.act1 = nn.ReLU()

        self.conv2 = nn.Conv2d(feature_size, feature_size, kernel_size=3, padding=1)
        self.act2 = nn.ReLU()

        self.conv3 = nn.Conv2d(feature_size, feature_size, kernel_size=3, padding=1)
        self.act3 = nn.ReLU()

        self.conv4 = nn.Conv2d(feature_size, feature_size, kernel_size=3, padding=1)
        self.act4 = nn.ReLU()

        self.output = nn.Conv2d(feature_size, num_anchors*num_classes, kernel_size=3, padding=1)
        self.output_act = nn.Sigmoid()

    def forward(self, x):

        out = self.conv1(x)
        out = self.act1(out)

        out = self.conv2(out)
        out = self.act2(out)

        out = self.conv3(out)
        out = self.act3(out)

        out = self.conv4(out)
        out = self.act4(out)

        out = self.output(out)
        out = self.output_act(out)

        # out is B x C x W x H, with C = n_classes + n_anchors
        out1 = out.permute(0, 2, 3, 1)

        batch_size, width, height, channels = out1.shape

        out2 = out1.view(batch_size, width, height, self.num_anchors, self.num_classes)

        return out2.contiguous().view(x.shape[0], -1, self.num_classes)

```

也是不停地`conv--relu`,然后最后经过了一个`sigmoid`,因为输出的是probability,所以经过了这个之后就变成了`(0,1)`之间了，最后输出的channels是`num_chors*num_classes`,是因为每个anchor都要分类。


到这里anchor还没有出现呢，这应该是one-stage和two-stage的非常重要的一个区别吧，two-stage的里面好像是拿proposal里面的feature去最后做的最终的分类和回归，而one-stage的用的是整个图的不同scale的feature去做的分类和回归。

上面的部分相当于是网络的输出了，接下来看一下网絽的gt.

### anchor

anchor就是直接去产生anchor了，

```
anchors = self.anchors(img_batch)

```

这里的`img_batch`是网络的输入，那么根据这个就可以推算出刚才从fpn出来的feature的大小，所以是可以算出具体的anchor的中心位置和左上、右下角，注意这里anchor的位置已经全部转化为相对于进入网络时候的图的大小了，注意但是不是相对于最初的图。

### focal loss 部分

理解loss,要先理解gt是什么，这里的和faster-rcnn中是一致的。

也就是说网络输出的并不是预测的位置，而是相对于anchor的一个偏移，因为gt也是相对于anchor来做的，具体见

```


            # 计算gt相对于anchor的位置，这个是fast-rcnn paper里面的。
            targets_dx = (gt_ctr_x - anchor_ctr_x_pi) / anchor_widths_pi
            targets_dy = (gt_ctr_y - anchor_ctr_y_pi) / anchor_heights_pi
            targets_dw = torch.log(gt_widths / anchor_widths_pi)
            targets_dh = torch.log(gt_heights / anchor_heights_pi)
```

上面是gt，

然后做loss的话就是SmoothL1，其中一步是

```
regression_diff = torch.abs(targets - regression[positive_indices, :])

```
注意这里回归的loss只有正例的才会有，因为负例的也没啥意义，不需要回归。所以整个计算loss的过程是先根据anchor和gt-bbox来给anchor打label,指定哪些是正的，负的和无效的，无效的是-1, 然后bce的时候是

```
bce = -(targets * torch.log(classification) + (1.0 - targets) * torch.log(1.0 - classification))

```

其实我不是太理解这个式子，我甚至觉得这个式子的正确性，因为targets是0或1，它的意义是这个anchor与gt-bbox的接近程度，而classification是由这个anchor产生的最终的bbox的里面的物体的类别概率，感觉这两个其实好像关系不是太大。

这个地方感觉和论文里说的不太一样。还需要再check.

### 上在的地方后来发现是我自己理解错了，从头到尾细看的话，发现是对的

先recall一下论文上面是如何写的。

![avator](/images/focalloss4.png)

这个是最原始的ce的定义，其中p是代表的是预测的是正样本的概率。所以当gt的`y=1`的时候，贡献的loss是`-logp`,当'gt=-1'或者为'0'的时候，贡的loss是'-log(1-p)'，因为此时'1-p'代表着预测的是负本本的概率。
写在一起的话就是'pt',所以ce就是'-log(pt)'.

* balanced cross entropy

![avator](/images/focalloss5.png)

这个是在实验中发现加上一个权值之后效果会变好一些，这个'\alhpa'的设置可以设成与类别的相反的，比如类别是 '5:1', 那么就设成'0.2','\alpha_t'的定义和'p_t'是类似的，即当这个是正的时候（注意这个正代表的是是那个类别）就是'\alpha'，否的话就是'1-alpha'.是与pt pointwise对应的，

* focal loss 


![avator](/images/focalloss6.png)

这个前面已经提到了，focal-loss有两个性质:(1)如果某个样本被误分类了，即pt很小，（这里包括两种，一种是gt是1,但是p很小，好认为是1的概率很小，一种是gt是0，但是p很大，即认为是1的概率很大，注意这里的1，0应该理解成是某个类别，不是某个类别）这种情况下表达式就和'-log(pt)'很接近，所以这种不受影响。
（2）这个loss会把重点放在hard-example上面去，比如说本来这个样本的'gt是1',那么预测的是0.9的话，这时候有了前面的权值的作用就会有个系数是'0.01',而如果这时候预测的是p=0.1的话，这时候权重就会是0.981和之前的差不多（\g=2的时候）,所以这样弄了之后会更加专注于hard-examples上面去，这样学得才会有效果。

最终的focal-loss是这样定义的
![avator](/images/focalloss7.png)


关于focal-loss的完全代码见下面，是正确的。


```
class FocalLoss(nn.Module):
    #def __init__(self):

    def forward(self, classifications, regressions, anchors, annotations):
        alpha = 0.25
        gamma = 2.0 
        batch_size = classifications.shape[0]
        classification_losses = []
        regression_losses = []

        anchor = anchors[0, :, :]

        anchor_widths  = anchor[:, 2] - anchor[:, 0]
        anchor_heights = anchor[:, 3] - anchor[:, 1]
        anchor_ctr_x   = anchor[:, 0] + 0.5 * anchor_widths
        anchor_ctr_y   = anchor[:, 1] + 0.5 * anchor_heights

        for j in range(batch_size):

            classification = classifications[j, :, :]
            regression = regressions[j, :, :]

            bbox_annotation = annotations[j, :, :]
            bbox_annotation = bbox_annotation[bbox_annotation[:, 4] != -1] 

            if bbox_annotation.shape[0] == 0:
                regression_losses.append(torch.tensor(0).float().cuda())
                classification_losses.append(torch.tensor(0).float().cuda())

                continue

            classification = torch.clamp(classification, 1e-4, 1.0 - 1e-4)

            IoU = calc_iou(anchors[0, :, :], bbox_annotation[:, :4]) # num_anchors x num_annotations

            IoU_max, IoU_argmax = torch.max(IoU, dim=1) # num_anchors x 1
    
            targets = torch.ones(classification.shape) * -1
            targets = targets.cuda()

            targets[torch.lt(IoU_max, 0.4), :] = 0 

            positive_indices = torch.ge(IoU_max, 0.5)

            num_positive_anchors = positive_indices.sum()

            assigned_annotations = bbox_annotation[IoU_argmax, :]
            targets[positive_indices, :] = 0
            targets[positive_indices, assigned_annotations[positive_indices, 4].long()] = 1

            alpha_factor = torch.ones(targets.shape).cuda() * alpha

            alpha_factor = torch.where(torch.eq(targets, 1.), alpha_factor, 1. - alpha_factor)
            focal_weight = torch.where(torch.eq(targets, 1.), 1. - classification, classification)
            focal_weight = alpha_factor * torch.pow(focal_weight, gamma)

            bce = -(targets * torch.log(classification) + (1.0 - targets) * torch.log(1.0 - classification))

            # cls_loss = focal_weight * torch.pow(bce, gamma)
            cls_loss = focal_weight * bce

            cls_loss = torch.where(torch.ne(targets, -1.0), cls_loss, torch.zeros(cls_loss.shape).cuda())

            classification_losses.append(cls_loss.sum()/torch.clamp(num_positive_anchors.float(), min=1.0))

            # compute the loss for regression

            if positive_indices.sum() > 0:
                assigned_annotations = assigned_annotations[positive_indices, :]

                anchor_widths_pi = anchor_widths[positive_indices]
                anchor_heights_pi = anchor_heights[positive_indices]
                anchor_ctr_x_pi = anchor_ctr_x[positive_indices]
                anchor_ctr_y_pi = anchor_ctr_y[positive_indices]

                gt_widths  = assigned_annotations[:, 2] - assigned_annotations[:, 0]
                gt_heights = assigned_annotations[:, 3] - assigned_annotations[:, 1]
                gt_ctr_x   = assigned_annotations[:, 0] + 0.5 * gt_widths
                gt_ctr_y   = assigned_annotations[:, 1] + 0.5 * gt_heights

                # clip widths to 1
                gt_widths  = torch.clamp(gt_widths, min=1)
                gt_heights = torch.clamp(gt_heights, min=1)

                targets_dx = (gt_ctr_x - anchor_ctr_x_pi) / anchor_widths_pi
                targets_dy = (gt_ctr_y - anchor_ctr_y_pi) / anchor_heights_pi
                targets_dw = torch.log(gt_widths / anchor_widths_pi)
                targets_dh = torch.log(gt_heights / anchor_heights_pi)

                targets = torch.stack((targets_dx, targets_dy, targets_dw, targets_dh))
                targets = targets.t()

                targets = targets/torch.Tensor([[0.1, 0.1, 0.2, 0.2]]).cuda()


                negative_indices = 1 - positive_indices

                regression_diff = torch.abs(targets - regression[positive_indices, :])

                regression_loss = torch.where(
                    torch.le(regression_diff, 1.0 / 9.0),
                    0.5 * 9.0 * torch.pow(regression_diff, 2),
                    regression_diff - 0.5 / 9.0
                )
                regression_losses.append(regression_loss.mean())
            else:
                regression_losses.append(torch.tensor(0).float().cuda())

        return torch.stack(classification_losses).mean(dim=0, keepdim=True), torch.stack(regression_losses).mean(dim=0, keepdim=True)


                                                                                                                
```

上面的计算 iou的是

```
def calc_iou(a, b):
    area = (b[:, 2] - b[:, 0]) * (b[:, 3] - b[:, 1])

    iw = torch.min(torch.unsqueeze(a[:, 2], dim=1), b[:, 2]) - torch.max(torch.unsqueeze(a[:, 0], 1), b[:, 0])
    ih = torch.min(torch.unsqueeze(a[:, 3], dim=1), b[:, 3]) - torch.max(torch.unsqueeze(a[:, 1], 1), b[:, 1])

    iw = torch.clamp(iw, min=0)
    ih = torch.clamp(ih, min=0)

    ua = torch.unsqueeze((a[:, 2] - a[:, 0]) * (a[:, 3] - a[:, 1]), dim=1) + area - iw * ih

    ua = torch.clamp(ua, min=1e-8)

    intersection = iw * ih

    IoU = intersection / ua

    return IoU



```

不过这里并不有加1,从代码里面可以看出传入的时候就是'float'。因为这里的标注的时候的位置不是像素点的整数坐标，而是距离数学上的坐标，所以没有加1.我理解应该是这样的。
>>>>>>> 6d923d60bf3b199fe698abbbc29f0262d41d8345
