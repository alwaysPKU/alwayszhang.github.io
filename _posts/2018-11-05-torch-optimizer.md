---
layout: post
title: torch-optimizer的用法
date: 2018-11-05
categories: [torch]
tags: torch
---
<!--more-->

今天仔细查了一下torch.optim的用法，发现里面其实还是有很多的细节的。

下面是一个使用时候的实例

```
optimizer = torch.optim.SGD(net.parameters(), lr=0.01, momentum=0.9, weight_decay=5e-4)

```

注意上面只是其中的一种实现方法，其实也可以为每个参数单独设置选项，不过这时候需要传入一个字典，而且这个字典分别定义了一组参数， 并且必须得有一个`key`是`param`, 这个对应的`value`是参数的列表。

比如下面的

```
optimizer = torch.optim.SGD([{'params': model.base.parameters()}, {'params':model.classifier.parameters(), 'lr':1e-3}],
    lr=1e-2,
    momentum=0.9)

```

上面的意味着`model.base`的参数将会使用`1e-2`的学习率，`model.classifier`的参数将会使用`1e-3`的学习率，并且`0.9`的momentum将会用于所有的参数。

通过优化器对于每一个batch是按下面的运行的

```

optimizer.zero_grad()  # clear the gradients
outputs = net(inputs)  # get the pred output
loss = criterion(outputs, targets)
loss.backward()
optimizer.step()


```

下面也是这个用法的实例


```
def get_parameters(model, config, isdefault=True):
    if isdefault:
        return model.parameters(), [1.]
    lr_1 = []
    lr_2 = []
    lr_4 = []
    lr_8 = []
    params_dict = dict(model.module.named_parameters())
    for key, value in params_dict.items():
        if ('model1_' not in key) and ('model0.' not in key):
            if key[-4:] == 'bias':
                lr_8.append(value)
            else:
                lr_4.append(value)
        elif key[-4:] == 'bias':
            lr_2.append(value)
        else:
            lr_1.append(value)
    params = [{'params': lr_1, 'lr': config.base_lr},
            {'params': lr_2, 'lr': config.base_lr * 2.},
            {'params': lr_4, 'lr': config.base_lr * 4.},
            {'params': lr_8, 'lr': config.base_lr * 8.}]
    
    return params, [1., 2., 4., 8.] 

```


然后是

```
params, multiple = get_parameters(model, config, False)
optimizer = torch.optim.SGD(params, config.base_lr, momentum=config.momentum,
                                weight_decay=config.weight_decay)
```

这样的话，就相当于是对于不同的层的参数学习率的设置是不一样的。这样弄估计也是有原因的，可能是层与层之间的重要性不一样。


