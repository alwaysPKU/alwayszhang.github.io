---
layout: post
title: python 更新器
date: 2018-10-03
categories: [python]
tags: python
---
<!--more-->

有时候写代码的时候，需要打印时间或者记录loss， 有时候训练完一轮了之后还需要reset，其实这个小功能的东西可以通过下面的办法实现。

```
class Updater(object):
    
    def __init__(self):
        self.reset()

    def reset(self):
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def update(self, val, n=1):
        self.val = val
        self.sum += val*n
        self.count += n
        self.avg = self.num/self.count


```

比如记录时间

```
TIME = Updater()

start = time.time()
for i in range(20):
    #do something
    TIME.update(time.time()-start)
    start = time.time()

```

不过目前见到这个东西是常常被用来记录loss.
