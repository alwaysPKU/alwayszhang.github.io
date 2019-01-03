---
layout: post
title: openpose-代码
date: 2018-10-20 11：55 +0800
categories: [代码详解]
tags: 代码详解
---
<!--more-->
代码在这里： https://github.com/last-one/Pytorch_Realtime_Multi-Person_Pose_Estimation.git
是openpose的一个torch的实现版本。
上两周主要是看了这个代码并且跑通了，并且把里面的内容改了之后，应该可以用到其他的地方。

### 数据集
我用的数据集是MScoco 2014年的，以后再试其他的时候我打算试一下2017年的数据。
MScoco的数据集有17个关键点，openpose里加了一个关键点，具体到代码里面是把其中的第5个点和第6个点加加起来做了一个平均而得到的，即左肩和右肩的中心。
![avatar](/images/openpose-torch1.png)

coco数据集的json文件里面有许多可能在其他任务上并不需要的东西，比如图片制作的信息等等，最主要的信息估计是annotations部分。比如里面的keypoints, segmentations, filename, image_id, id等等。见下图

![avatar](/images/openpose-torch2.png)

其中id的range确实是和annotations的数量是一致的。
但是image_id却不太一致，我的理解是image_id标记的是图片中的人的id.因为一张图片上可能会有多个人。
具体到pycocotools的时候再做详细介绍。

### 准备train set 和valid set
调用 preprocessing/generate_json_maskl.py 可以产生训练的json文件和mask文件，mask是以.npy结尾的。关于Mask,是这样的
Mask is used as weight for heatmap and vectors. It's a binary mask. When the annotation is missing at an image location, it's zero, otherwise, is one.
即它的值非0即1，即对应到图像上面，如果有annotaions的话就是1，没有的话就是0.理解这一点对于自己制作数据集有好处。
接下来细看这个代码。

![avatar](/images/openpose-torch3.png)
这是一些需要指定的参数，其中ann_path，就是上面说的coco的json文件， 其他的4个都是这个代码将要生成的。这个代码并不需要图片的具体的路径。
程序直接进入processing

![avatar](/images/openpose-torch4.png)

这里的ids是图片的一个index，总共有82873条，但是并不是连续的，也就是其值并不是从0到82872。
接下来是对每张图进行处理
![avatar](/images/openpose-torch5.png)
根据这个图的img_id,得以这个图上的ann的信息，其中img_anns是存了多个人的信息的。
所以接下来就要对于这个图上的每个人的信息来看了。
![avatar](/images/openpose-torch6.png)
如果这个人的keypoints的数量比较少，或者area面积太小的话，就pass掉，
这里的area不是图片的width 乘 height，我理解应该是具体到这个人的一个region的大小，
这说明这个人被挡的太严重了，
然后获得这个人的中心，即bbox的中心，上面的area应该就是bbox的面积，并且计算scale，这大致是和368之间的一个比例。
然后bbox的中心就是pos,关键点初始化成17乘3的list了，3的意思是(x,y,visible)
原本的visible 是2， 现在是1，原本的unvisible是1，现在是0，原本的not labeld是0，现在是2.
flag那一块的意思是不希望离的太近，即比如对就前i个人弄好了之后，如果现在第i+1个的位置和前面的某个人如果离的太近的话，那么这个人的信息就要了，衡量的方式就是看中心之间的l2距离。
然后接下来是上面说的加一个关键点的部分了。

![avatar](/images/openpose-torch7.png)
这里相当于是把顺序给调了一下。可能是为了后面vector那里好用吧。我理解。然后可以看到
新加的一个点的方式，即取的是第5个和第6个的中心，
然后再看他们的第三个，如果一样，就弄成一样，如果不一样，只要其中有一个是Not labeled就弄成not labeled,否则的话就都弄成看不见。
然后下面是mask了。

![avatar](/images/openpose-torch8.png)
mask的大小就初始化为和图像的大小是一样的，（不同的实现可能不太一样，mxnet的里面就直接弄成368,368,3）的了。
并且初始化为都没有anno,即全为0，
然后对于图上的每个人的anno信息，这一点我不是太明白。
这里是我非常不清楚的地方，因为coco里面的代码我没有搞明白，
我的理解是产生mask要用到分割的信息，如果没有分割的信息的话，mask就似乎没有什么用。我在自己的数据集的时候，直接 mask全部弄成1了，但是感觉不太合理，这一点目前我还在思考。

现在觉得按照paper里面的意思是，有关键点信息的地方是1，其余地方是0，因为loss里面用不到那些不是关键点的地方好像。但是如果这样的话，最后算损失函数的时候因为要乘上mask，那么只有关键点的地方才会有用，其余的地方都没有用。那这样产生heatmap用高斯的话不是多产生了很多没有用的吗？这个地方要做实验试一下。至少感觉比全是1要合理一些。

需要注意的地方是，这里面写入masklist 和filelist的时候最好用绝对路径，我第一次弄相对路径时就出现了找不到训练图在哪里的问题。

训练集弄好了之后，验证集类似，也是调用这个代码
### 训练过程
基本上没有改什么，直接bash train.sh就可以了。

### 结果展示

![avatar](/images/result04.png)
![avatar](/images/result03.png)
![avatar](/images/result.png)


