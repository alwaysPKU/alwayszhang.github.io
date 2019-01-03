---
layout: post
title: torch一机多卡训练
date: 2018-10-05 22:55 +0800
categories: [c++]
tags: c++
---
<!--more-->

直接看下面的代码
```
import torch
from torch.autograd import Variable
from torch.utils.data import Dataset, DataLoader

input_size = 10
output_size = 10

batch_size = 10
data_size = 100

# create dataset randomly
class RandomDataset(Dataset):   # is subclass of Dataset
    def __init__(self, size, length):
        self.len = length
        self.data = torch.randn(length, size)

    def __getitem__(self, index):
        return self.data[index]

    def __len__(self):
        return self.len



rand_loader = DataLoader(dataset=RandomDataset(input_size, data_size), batch_size=batch_size, shuffle=True)

# model
class Model(torch.nn.Module):
    # is subclass of torch.nn.Module, must realize __init__ and forward method

    def __init__(self, input_size, output_size):
        super(Model, self).__init__()
        self.fc = torch.nn.Linear(input_size, output_size)

    def forward(self, input):
        output = self.fc(input)
        print(input.size(), output.size())
        return output

# get model
model = Model(input_size, output_size)
#model = nn.DataParallel(model)   #default it can be distributed on all your gpus, but if we want it runs on gpu [3,4], we need to add the "device_ids"
model = torch.nn.DataParallel(model, device_ids=[0,1])
#model = model.cuda()  # if we here don't add any parameters, by default, gpu 0 will be our controller!
model = model.cuda()  # now gpu 3 is our controller!

# run model
for data in rand_loader:
    if torch.cuda.is_available():
        print("runs on gpu")
        input_var = Variable(data.cuda()) # By default, 
        print(input_var)
    else:
        print("runs on cpu")
        input_var = Variable(data)  # on cpu
    output = model(input_var)
    print("output's size", output.size())
```


#### 之前从来没有用过torch,今天才了解一点关于multi_gpu的操作，需要在调用函数之前使用
```
CUDA_VISIBLE_DEVICES=1,2,3,4 python3 multi_gpu.py

```
一旦指定了这个之后，那么torch里面的0就是这里的1了，而且torch里面，数据一定要放在第0号卡上，所以devices=[]这个里面的第一个一定要填0.input_var=Variable(data.cuda())中不用指定关于卡号的问题。不然会报错。


```
torch.nn.DataParallel(model)
```
如果不指定device_ids的话就会用所有的显卡，指定了之后，就会用上面CUDA_VISIBLE_DEVICES指定的了，个人理解，torch里面的训练过程大致是这样的，
#### 首先将模型加载到一个指定的设备上作为controller, 这个设备就是“0”号卡，然后会将模型copy到多个设备中，将batch_Size的数据也会分到不同的设备中，这样每个设备会得到不同的数据进和训练计算，得到的梯度再合并到“0”卡上面进行更新参数，更新完之后，再分给多个设备，进行下一次的训练，这样就保证每个卡上的参数在每次训练之前都是一样的了。（）
