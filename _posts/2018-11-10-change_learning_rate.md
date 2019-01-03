---
layout: post
title: 调整学习率的方式
date: 2018-11-10
categories: [python]
tags: python
---
<!--more-->

学习率是非常重要的一个参数，所以学习率的改变也非常地重要。
加学习率的改变通常会在每一个batch训练的时候，或者每一个epoch开始的时候，比如像这样

```
for i, (inputs, label) in enumerate(trainLoader):
    lr = adjust_lr(optimizer, iters, base_lr, policy, policy_parameter, multiple)

```

下面就是一个实例来写学习率的变化的



```
def adjust_learning_rate(optimizer, iters, base_lr, policy_parameter, policy='step', multiple=[1]):

    if policy == 'fixed':
        lr = base_lr
    elif policy == 'step':
        lr = base_lr * (policy_parameter['gamma'] ** (iters // policy_parameter['step_size']))
    elif policy == 'exp':
        lr = base_lr * (policy_parameter['gamma'] ** iters)
    elif policy == 'inv':
        lr = base_lr * ((1 + policy_parameter['gamma'] * iters) ** (-policy_parameter['power']))
    elif policy == 'multistep':
        lr = base_lr
        for stepvalue in policy_parameter['stepvalue']:
            if iters >= stepvalue:
                lr *= policy_parameter['gamma']
            else:
                break
    elif policy == 'poly':
        lr = base_lr * ((1 - iters * 1.0 / policy_parameter['max_iter']) ** policy_parameter['power'])
    elif policy == 'sigmoid':
        lr = base_lr * (1.0 / (1 + math.exp(-policy_parameter['gamma'] * (iters - policy_parameter['stepsize']))))
    elif policy == 'multistep-poly':
        lr = base_lr
        stepstart = 0 
        stepend = policy_parameter['max_iter']
        for stepvalue in policy_parameter['stepvalue']:
            if iters >= stepvalue:
                lr *= policy_parameter['gamma']
                stepstart = stepvalue
            else:
                stepend = stepvalue
                break
        lr = max(lr * policy_parameter['gamma'], lr * (1 - (iters - stepstart) * 1.0 / (stepend - stepstart)) ** policy_parameter['power'])

    for i, param_group in enumerate(optimizer.param_groups):
        param_group['lr'] = lr * multiple[i]   ### 这个的意思是保持最初的比例关系。
    return lr

```


其中`multiple是最初不同的层用的学习率的比例关系，比如[1,2,4,8]`.

基本上都是以不同的方式在下降，
其中`sigmoid`要注意，到了一定的iters之后学习率还会变大，这个也是可以理解了，可以理解成学了一段时间之后有一定的基础了，学得就快了。


